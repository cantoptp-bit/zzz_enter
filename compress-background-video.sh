#!/usr/bin/env bash
# Compress the background MP4 so it's small enough to use without Git LFS (~300 MB → ~20–40 MB).
# Requires: ffmpeg (install with: sudo apt install ffmpeg)

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT="$SCRIPT_DIR/background/14625362_1920_1080_24fps.mp4"
OUTPUT="$SCRIPT_DIR/background/background-720p.mp4"

if [[ ! -f "$INPUT" ]]; then
  echo "Input video not found: $INPUT"
  exit 1
fi

if ! command -v ffmpeg &>/dev/null; then
  echo "ffmpeg is not installed. Install it with: sudo apt install ffmpeg"
  exit 1
fi

echo "Compressing background video (this may take a few minutes)..."
ffmpeg -i "$INPUT" \
  -vf "scale=1280:-2" \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -movflags +faststart \
  -an \
  -y \
  "$OUTPUT"

echo "Done. Output: $OUTPUT"
echo "Original size: $(du -h "$INPUT" | cut -f1)"
echo "New size:      $(du -h "$OUTPUT" | cut -f1)"
