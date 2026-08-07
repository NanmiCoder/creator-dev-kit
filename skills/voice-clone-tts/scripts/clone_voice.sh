#!/usr/bin/env bash
# 从视频/音频素材复刻专属音色。
#
# mmx CLI 没有 voice clone 命令，所以走「CLI 上传 + HTTP 复刻」两步。
#
# 用法: ./clone_voice.sh <素材文件> <voice_id> [--denoise]
#   voice_id 规则: 8–256 字符，首字符必须是英文字母，
#                  只允许字母/数字/-/_，末位不能是 - 或 _
set -euo pipefail

SRC="${1:-}"
VOICE_ID="${2:-}"
DENOISE=false
[[ "${3:-}" == "--denoise" ]] && DENOISE=true

if [[ -z "$SRC" || -z "$VOICE_ID" ]]; then
  echo "用法: $0 <素材文件> <voice_id> [--denoise]" >&2
  exit 1
fi
[[ -f "$SRC" ]] || { echo "错误：找不到素材 $SRC" >&2; exit 1; }

if ! [[ "$VOICE_ID" =~ ^[A-Za-z][A-Za-z0-9_-]{6,254}[A-Za-z0-9]$ ]]; then
  echo "错误：voice_id 不合规（首字符须为字母，末位不能是 - 或 _，长度 8–256）" >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
SAMPLE="$WORK/voice_sample.mp3"

echo "▸ 抽取音轨（单声道 32kHz）"
ffmpeg -v error -i "$SRC" -vn -ac 1 -ar 32000 -b:a 128k "$SAMPLE" -y

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAMPLE")
SIZE=$(stat -f%z "$SAMPLE" 2>/dev/null || stat -c%s "$SAMPLE")
printf "  时长 %.1fs · 大小 %sKB\n" "$DUR" "$((SIZE / 1024))"

# 官方硬性要求：10 秒 – 5 分钟，≤20MB
awk -v d="$DUR" 'BEGIN{exit !(d>=10 && d<=300)}' \
  || { echo "错误：素材时长须在 10 秒–5 分钟之间（当前 ${DUR}s）" >&2; exit 1; }
[[ "$SIZE" -le 20971520 ]] || { echo "错误：文件超过 20MB" >&2; exit 1; }

echo "▸ 上传"
FILE_ID=$(mmx file upload --file "$SAMPLE" --purpose voice_clone \
            --output json --non-interactive 2>/dev/null \
          | python3 -c 'import json,sys;print(json.load(sys.stdin)["file_id"])')
echo "  file_id = $FILE_ID"

KEY=$(python3 -c 'import json;print(json.load(open("'"$HOME"'/.mmx/config.json"))["api_key"])')
REGION=$(python3 -c 'import json;print(json.load(open("'"$HOME"'/.mmx/config.json")).get("region","cn"))')
[[ "$REGION" == "cn" ]] && HOST="https://api.minimaxi.com" || HOST="https://api.minimax.io"

echo "▸ 复刻（$HOST）"
RESP=$(curl -s -X POST "$HOST/v1/voice_clone" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d "{\"file_id\": $FILE_ID, \"voice_id\": \"$VOICE_ID\",
       \"need_volume_normalization\": true, \"need_noise_reduction\": $DENOISE}")

CODE=$(echo "$RESP" | python3 -c 'import json,sys;print(json.load(sys.stdin)["base_resp"]["status_code"])')
if [[ "$CODE" != "0" ]]; then
  echo "✗ 复刻失败：$RESP" >&2
  echo "  常见原因：账号未完成实名认证 / voice_id 已被占用" >&2
  exit 1
fi

echo "✓ 复刻成功：$VOICE_ID"
echo "▸ 试听"
mmx speech synthesize --text "这是复刻音色的试听效果。" --voice "$VOICE_ID" \
  --out "./${VOICE_ID}_demo.mp3" --non-interactive --quiet >/dev/null
echo "✓ ./${VOICE_ID}_demo.mp3"
echo
echo "把 voice 写入 skill 配置即可默认使用："
echo "  ~/.claude/skills/voice-clone-tts/config.json → \"voice\": \"$VOICE_ID\""
echo "提醒：复刻音色 7 天内未被正式调用会被平台自动删除。"
