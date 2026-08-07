#!/usr/bin/env python3
"""逐段调用 mmx 合成 WAV，回填时长到 segments.json。

为什么强制 WAV：实测 MP3 的 duration_ms 比真实音频长 54–59ms（编码器 padding），
逐段累加会让字幕持续漂移；WAV 的 duration_ms 与实测误差 <1ms。

用法:
    python3 synth.py segments.json [--outdir wav] [--jobs 6] [--force]

已合成且文件有效的段会自动跳过，可安全中断续跑。
"""

import argparse
import concurrent.futures as cf
import hashlib
import json
import random
import shutil
import subprocess
import sys
import threading
import time
import wave
from pathlib import Path

_print_lock = threading.Lock()


class RateLimiter:
    """自适应节流：撞到 RPM 上限就自动放慢，之后慢慢恢复。

    服务端 RPM 配额未公开且随账号变化，所以不写死速率，而是从错误反馈里学。
    """

    def __init__(self, interval: float, max_interval: float = 6.0):
        self.interval = interval
        self.base = interval
        self.max_interval = max_interval
        self._next = 0.0
        self._ok = 0
        self._lock = threading.Lock()

    def acquire(self):
        with self._lock:
            now = time.monotonic()
            wait = max(0.0, self._next - now)
            self._next = max(now, self._next) + self.interval
        if wait > 0:
            time.sleep(wait)

    def penalize(self):
        """撞限流：间隔翻倍，并让所有在途请求一起退避一个窗口。"""
        with self._lock:
            self.interval = min(self.interval * 2, self.max_interval)
            self._ok = 0
            self._next = max(self._next, time.monotonic() + self.interval * 4)
            return self.interval

    def reward(self):
        """连续成功则缓慢恢复速率。"""
        with self._lock:
            self._ok += 1
            if self._ok >= 12 and self.interval > self.base:
                self.interval = max(self.base, self.interval * 0.75)
                self._ok = 0


def is_rate_limited(msg: str) -> bool:
    m = (msg or "").lower()
    return "rate limit" in m or "rpm" in m or "too many request" in m


def is_bad_voice(msg: str) -> bool:
    m = (msg or "").lower()
    return "voice id not exist" in m or "voice_id not exist" in m


def parse_mmx_json(stdout: str):
    """mmx 会在 JSON 前打印 [Model: xxx] 之类的行，取第一个完整 JSON 对象。"""
    start = stdout.find("{")
    while start != -1:
        depth, in_str, esc = 0, False, False
        for i in range(start, len(stdout)):
            ch = stdout[i]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
                continue
            if ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(stdout[start:i + 1])
                    except json.JSONDecodeError:
                        break
        start = stdout.find("{", start + 1)
    return None


def seg_filename(seg, meta) -> str:
    """文件名带上「文本+音色+模型」的指纹。

    文案改动后重跑 segment.py，同一个 id 的文本可能已经变了；只按 id 判断存在
    会复用到错的音频。把指纹写进文件名，内容一变文件名就变，天然不会误用。
    """
    key = f"{seg['text']}\x00{meta['voice']}\x00{meta['model']}\x00{meta['sample_rate']}"
    h = hashlib.sha1(key.encode("utf-8")).hexdigest()[:8]
    return f"{seg['id']:04d}_{h}.wav"


def wav_duration_ms(path: Path):
    """从 WAV 头按采样帧读真实时长，返回 None 表示文件损坏。"""
    try:
        with wave.open(str(path), "rb") as w:
            frames, rate = w.getnframes(), w.getframerate()
            if frames <= 0 or rate <= 0:
                return None
            return frames * 1000.0 / rate
    except (wave.Error, OSError, EOFError):
        return None


def synth_one(seg, meta, outdir: Path, retries: int, timeout: int, limiter: RateLimiter):
    """合成单段，返回 (id, duration_ms, wav_path, error)。"""
    dst = outdir / seg_filename(seg, meta)
    cmd = [
        "mmx", "speech", "synthesize",
        "--text", seg["text"],
        "--voice", meta["voice"],
        "--model", meta["model"],
        "--format", "wav",
        "--sample-rate", str(meta["sample_rate"]),
        "--channels", "1",
        "--out", str(dst),
        "--output", "json",
        "--non-interactive",
    ]
    last_err = ""
    for attempt in range(1, retries + 1):
        limiter.acquire()
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            last_err = f"超时 {timeout}s"
        else:
            # 错误 JSON 走 stderr，成功 JSON 走 stdout，两边都要看
            data = parse_mmx_json(r.stdout) or parse_mmx_json(r.stderr) or {}
            err = data.get("error")
            if err:
                last_err = str(err.get("message", err)) if isinstance(err, dict) else str(err)
            elif dst.exists():
                dur = wav_duration_ms(dst)
                if dur is not None:
                    limiter.reward()
                    return seg["id"], dur, str(dst), None
                last_err = "WAV 文件损坏"
                dst.unlink(missing_ok=True)
            else:
                last_err = (r.stderr or r.stdout or "").strip()[:200] or "未生成文件"

        if is_bad_voice(last_err):
            break  # 音色不存在，重试多少次都没用
        if attempt < retries:
            if is_rate_limited(last_err):
                # 撞 RPM 上限：全局降速，并等一个完整窗口再试
                iv = limiter.penalize()
                time.sleep(min(15.0 * attempt, 45.0) + random.uniform(0, 3))
                del iv
            else:
                time.sleep(min(2 ** attempt, 8) + random.uniform(0, 1))
    return seg["id"], None, None, last_err


def main():
    ap = argparse.ArgumentParser(description="并发合成分段音频")
    ap.add_argument("segments", help="segments.json")
    ap.add_argument("--outdir", default=None, help="WAV 输出目录（默认 <segments 同级>/wav）")
    ap.add_argument("--jobs", type=int, default=3,
                    help="并发数。实测 6 并发跑 51 段会撞 RPM 上限，3 是稳妥值")
    ap.add_argument("--interval", type=float, default=0.5,
                    help="同一时刻两次请求的最小间隔秒数，撞限流时会自动加大")
    ap.add_argument("--retries", type=int, default=5)
    ap.add_argument("--timeout", type=int, default=180)
    ap.add_argument("--force", action="store_true", help="忽略已有音频，全部重合成")
    ap.add_argument("--prune", action="store_true",
                    help="删除文案改动后遗留的、已无人引用的旧音频")
    args = ap.parse_args()

    if not shutil.which("mmx"):
        print("错误：未找到 mmx，请先 npm install -g mmx-cli", file=sys.stderr)
        return 1

    sp = Path(args.segments)
    doc = json.loads(sp.read_text(encoding="utf-8"))
    meta, segments = doc["meta"], doc["segments"]

    cfg_path = Path(__file__).resolve().parent.parent / "config.json"
    cfg = json.loads(cfg_path.read_text(encoding="utf-8")) if cfg_path.exists() else {}
    outdir = Path(args.outdir) if args.outdir else sp.parent / "wav"
    outdir.mkdir(parents=True, exist_ok=True)
    # 音频路径按相对 segments.json 存，目录整体搬走也不会失效
    try:
        relbase = outdir.resolve().relative_to(sp.parent.resolve())
    except ValueError:
        relbase = None

    # 续跑：指纹一致且文件有效的段直接采用真实时长
    todo, skipped = [], 0
    for seg in segments:
        dst = outdir / seg_filename(seg, meta)
        if not args.force and dst.exists():
            dur = wav_duration_ms(dst)
            if dur is not None:
                seg["duration_ms"], seg["wav"] = dur, str(dst)
                skipped += 1
                continue
        todo.append(seg)

    total = len(segments)
    if skipped:
        print(f"跳过已合成 {skipped} 段")
    if not todo:
        print("全部已合成")
    else:
        print(f"合成 {len(todo)} 段（并发 {args.jobs}，音色 {meta['voice']}）")

    by_id = {s["id"]: s for s in segments}
    failures, done = [], 0
    limiter = RateLimiter(args.interval)
    t0 = time.time()
    with cf.ThreadPoolExecutor(max_workers=args.jobs) as ex:
        futs = [
            ex.submit(synth_one, seg, meta, outdir, args.retries, args.timeout, limiter)
            for seg in todo
        ]
        for fut in cf.as_completed(futs):
            sid, dur, wav, err = fut.result()
            done += 1
            if err:
                failures.append((sid, err))
                with _print_lock:
                    print(f"  ✗ [{sid}] {err}", file=sys.stderr)
            else:
                by_id[sid]["duration_ms"] = dur
                by_id[sid]["wav"] = wav
            with _print_lock:
                pct = (skipped + done) * 100 // total
                print(f"\r  {skipped + done}/{total} ({pct}%)", end="", flush=True)
    if todo:
        print()

    sp.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")

    # 文案改过之后，旧指纹的音频就成了孤儿
    live = {seg_filename(s, meta) for s in segments}
    orphans = [p for p in outdir.glob("*.wav") if p.name not in live]
    if orphans:
        if args.prune:
            for p in orphans:
                p.unlink(missing_ok=True)
            print(f"已清理 {len(orphans)} 个失效音频")
        else:
            print(f"注意：{outdir} 下有 {len(orphans)} 个失效音频（文案改动遗留），"
                  f"加 --prune 可清理")

    ok = sum(1 for s in segments if s.get("duration_ms"))
    total_ms = sum(s["duration_ms"] for s in segments if s.get("duration_ms"))
    print(f"✓ {ok}/{total} 段就绪 · 语音净时长 {total_ms/1000:.2f}s "
          f"· 耗时 {time.time()-t0:.1f}s")
    if failures:
        rl = sum(1 for _, e in failures if is_rate_limited(e))
        bv = sum(1 for _, e in failures if is_bad_voice(e))
        print(f"✗ {len(failures)} 段失败，重跑本命令即可续传", file=sys.stderr)
        if rl:
            print(f"  其中 {rl} 段是 RPM 限流，重跑时加 --jobs 2 --interval 1.5",
                  file=sys.stderr)
        if bv:
            # 不做静默回退：换成别的音色而不吭声，用户可能到成品才发现声音不对
            fb = cfg.get("fallback_voice", "Chinese (Mandarin)_Radio_Host")
            print(f"\n  音色 “{meta['voice']}” 不存在——复刻音色连续 7 天未调用会被平台回收。",
                  file=sys.stderr)
            print(f"  重建（推荐，保住你自己的声音）：", file=sys.stderr)
            print(f"    {Path(__file__).parent}/clone_voice.sh <素材文件> <新voice_id>",
                  file=sys.stderr)
            print(f"    重建后把新 voice_id 写进 {cfg_path}", file=sys.stderr)
            print(f"  或临时改用系统音色（声音不是你本人）：", file=sys.stderr)
            print(f"    先 segment.py --voice \"{fb}\" 重新生成 segments.json",
                  file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
