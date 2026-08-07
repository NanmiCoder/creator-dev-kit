#!/usr/bin/env python3
"""拼接分段音频，产出成品配音。

默认只出音频——字幕在剪映等剪辑软件里做更顺手。需要 SRT 时加 --srt。

时间轴不信任 API 返回的 duration_ms，而是按写入输出流的**采样帧**累加，
所以 SRT 末条结束时间与成品音频总时长在数学上必然一致（误差仅来自 MP3 编码）。

用法:
    python3 build.py segments.json [-o voiceover] [--srt] [--format mp3] [--keep-wav]
"""

import argparse
import array
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path


def trim_bounds(raw: bytes, sampwidth: int, nch: int, rate: int,
                thresh_db: float = -45.0, margin_ms: float = 15.0):
    """找出有效声音的起止帧，用于剪掉 TTS 自带的首尾静音。

    每段自带的首尾静音长度不固定（实测中位 60ms、最坏 230ms），
    不剪的话「上段尾静音 + 插入静音 + 下段头静音」会让停顿忽长忽短。
    剪掉后停顿完全由 silence_ms 决定，节奏才均匀。
    """
    if sampwidth != 2:
        return None  # 只处理 16bit，其他格式不冒险
    x = array.array("h")
    x.frombytes(raw)
    n = len(x) // nch
    if n == 0:
        return None
    mono = x[::nch] if nch > 1 else x
    peak = max((abs(v) for v in mono), default=0)
    if peak == 0:
        return None
    thr = peak * (10 ** (thresh_db / 20.0))

    win = max(1, int(rate * 0.005))  # 5ms 窗
    nwin = len(mono) // win
    if nwin == 0:
        return None
    first = last = None
    for w in range(nwin):
        seg = mono[w * win:(w + 1) * win]
        if max(seg) > thr or min(seg) < -thr:
            if first is None:
                first = w
            last = w
    if first is None:
        return None

    margin = int(rate * margin_ms / 1000.0)
    start = max(0, first * win - margin)
    end = min(n, (last + 1) * win + margin)
    return start, end


def ts(ms: float) -> str:
    """毫秒 → SRT 时间码 HH:MM:SS,mmm。"""
    if ms < 0:
        ms = 0
    total = int(round(ms))
    h, rem = divmod(total, 3600000)
    m, rem = divmod(rem, 60000)
    s, msec = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{msec:03d}"


def main():
    ap = argparse.ArgumentParser(description="拼接分段音频，产出成品配音")
    ap.add_argument("segments", help="segments.json")
    ap.add_argument("-o", "--out", default=None,
                    help="输出基名，默认 <segments 同级>/voiceover")
    ap.add_argument("--srt", action="store_true",
                    help="同时输出 SRT 字幕（默认不输出，字幕通常在剪辑软件里做）")
    ap.add_argument("--format", default="mp3", choices=["mp3", "wav"],
                    help="成品音频格式（默认 mp3）")
    ap.add_argument("--bitrate", default="128k")
    ap.add_argument("--keep-wav", action="store_true", help="保留中间无损 WAV")
    ap.add_argument("--gap-hold", type=float, default=600,
                    help="字幕停留：间隔小于此毫秒数则延续到下一条开始，避免闪烁")
    ap.add_argument("--no-trim", dest="trim", action="store_false",
                    help="不剪每段自带的首尾静音（默认剪，让停顿节奏均匀）")
    ap.add_argument("--trim-db", type=float, default=-45.0,
                    help="静音判定阈值，相对该段峰值的分贝数")
    ap.add_argument("--trim-margin", type=float, default=15.0,
                    help="修剪时保留的边距毫秒数，避免切掉气声和爆破音起始")
    args = ap.parse_args()

    sp = Path(args.segments)
    doc = json.loads(sp.read_text(encoding="utf-8"))
    meta, segments = doc["meta"], doc["segments"]
    silence_ms = meta.get("silence_ms", {})

    # segments.json 里存的是相对路径，按它自身所在目录解析，
    # 这样换个 cwd 跑、或整个目录搬走都不会失效
    def resolve(p: str) -> Path:
        q = Path(p)
        return q if q.is_absolute() or q.exists() else sp.parent / q

    for s in segments:
        if s.get("wav"):
            s["wav"] = str(resolve(s["wav"]))

    missing = [s["id"] for s in segments if not s.get("wav") or not Path(s["wav"]).exists()]
    if missing:
        print(f"错误：{len(missing)} 段缺少音频（如 id={missing[:5]}），请先运行 synth.py",
              file=sys.stderr)
        return 1

    base = Path(args.out) if args.out else sp.parent / "voiceover"
    base.parent.mkdir(parents=True, exist_ok=True)
    wav_out = base.with_suffix(".wav")

    # 以第一段的参数作为输出流规格，后续段必须一致
    with wave.open(segments[0]["wav"], "rb") as w0:
        params = (w0.getnchannels(), w0.getsampwidth(), w0.getframerate())
    nch, sw, rate = params
    frame_bytes = nch * sw

    entries = []
    cursor = 0  # 已写入的采样帧数 —— 唯一的时间基准
    with wave.open(str(wav_out), "wb") as out:
        out.setnchannels(nch)
        out.setsampwidth(sw)
        out.setframerate(rate)

        trimmed_ms = 0.0
        for i, seg in enumerate(segments):
            with wave.open(seg["wav"], "rb") as w:
                if (w.getnchannels(), w.getsampwidth(), w.getframerate()) != params:
                    print(f"错误：第 {seg['id']} 段格式不一致 "
                          f"({w.getnchannels()}ch/{w.getsampwidth()*8}bit/{w.getframerate()}Hz)，"
                          f"应为 {nch}ch/{sw*8}bit/{rate}Hz", file=sys.stderr)
                    return 1
                raw = w.readframes(w.getnframes())

            if args.trim:
                b = trim_bounds(raw, sw, nch, rate, args.trim_db, args.trim_margin)
                if b:
                    s0, s1 = b
                    orig = len(raw) // frame_bytes
                    raw = raw[s0 * frame_bytes:s1 * frame_bytes]
                    trimmed_ms += (orig - (s1 - s0)) * 1000.0 / rate

            frames = len(raw) // frame_bytes
            out.writeframes(raw)

            start_f = cursor
            cursor += frames
            entries.append({
                "text": seg["text"],
                "start_ms": start_f * 1000.0 / rate,
                "end_ms": cursor * 1000.0 / rate,
            })

            # 段后停顿：静音时长由我们指定，故时间轴依然精确
            if i < len(segments) - 1:
                gap = int(silence_ms.get(seg.get("boundary", "sentence"), 180))
                if gap > 0:
                    gap_frames = int(round(gap * rate / 1000.0))
                    out.writeframes(b"\x00" * (gap_frames * frame_bytes))
                    cursor += gap_frames

    total_ms = cursor * 1000.0 / rate

    srt_path = None
    if args.srt:
        # 字幕停留：短间隔内延续到下一条开始，避免频繁闪烁
        for i, e in enumerate(entries):
            nxt = entries[i + 1]["start_ms"] if i + 1 < len(entries) else total_ms
            if nxt - e["end_ms"] <= args.gap_hold:
                e["end_ms"] = nxt

        srt_path = base.with_suffix(".srt")
        lines = []
        for i, e in enumerate(entries, 1):
            lines.append(f"{i}\n{ts(e['start_ms'])} --> {ts(e['end_ms'])}\n{e['text']}\n")
        srt_path.write_text("\n".join(lines), encoding="utf-8")

    # 转码成品
    if args.format == "mp3":
        audio_path = base.with_suffix(".mp3")
        if not shutil.which("ffmpeg"):
            print("错误：未找到 ffmpeg，无法转 MP3（可用 --format wav）", file=sys.stderr)
            return 1
        r = subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(wav_out),
             "-codec:a", "libmp3lame", "-b:a", args.bitrate, str(audio_path), "-y"],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            print(f"错误：ffmpeg 转码失败\n{r.stderr}", file=sys.stderr)
            return 1
        if not args.keep_wav:
            wav_out.unlink(missing_ok=True)
    else:
        audio_path = wav_out

    n_ch = len({s["chapter"] for s in segments})
    print(f"✓ {audio_path}")
    if srt_path:
        print(f"✓ {srt_path}")
    print(f"  章节 {n_ch} · 分段 {len(entries)} · 总时长 {ts(total_ms)}")
    if args.trim and trimmed_ms > 0:
        print(f"  已剪去各段自带首尾静音共 {trimmed_ms/1000:.1f}s，停顿节奏改由 silence_ms 统一控制")
    if srt_path:
        print(f"  SRT 末条结束 {ts(entries[-1]['end_ms'])}（应与总时长一致）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
