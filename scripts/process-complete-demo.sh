#!/bin/bash
# Video processing script for TimePics demo
# Usage: ./process-complete-demo.sh [video-file]

VIDEO_DIR="demo/demo/demo-videos"
OUTPUT_DIR="$VIDEO_DIR"
BGM="$VIDEO_DIR/bgm.mp3"
SUBTITLES="$VIDEO_DIR/subtitles-complete.srt"

# Find the latest recorded video (webm format from Playwright)
if [ -n "$1" ]; then
    LATEST_VIDEO="$1"
else
    LATEST_VIDEO=$(ls -t "$VIDEO_DIR"/*.webm 2>/dev/null | head -1)
fi

if [ -z "$LATEST_VIDEO" ]; then
    echo "Error: No video file found in $VIDEO_DIR"
    echo "Usage: $0 [video-file]"
    exit 1
fi

echo "Found video: $LATEST_VIDEO"

# Step 1: Convert webm to mp4
MP4_VIDEO="${LATEST_VIDEO%.webm}.mp4"
if [ "$LATEST_VIDEO" = "$MP4_VIDEO" ]; then
    MP4_VIDEO="${OUTPUT_DIR}/temp-$(basename "$LATEST_VIDEO" .webm).mp4"
fi

echo "Converting to MP4: $MP4_VIDEO"
ffmpeg -i "$LATEST_VIDEO" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "$MP4_VIDEO" -y

# Step 2: Add subtitles with smaller font
VIDEO_WITH_SUBS="${OUTPUT_DIR}/timepics-demo-with-subs.mp4"
echo "Adding subtitles (smaller font): $VIDEO_WITH_SUBS"

ffmpeg -i "$MP4_VIDEO" \
    -vf "subtitles='$SUBTITLES':force_style='FontSize=16,PrimaryColour=&H00FFFFFF,BackColour=&H80000000,Outline=2,BorderStyle=3'" \
    -c:a copy \
    "$VIDEO_WITH_SUBS" -y

# Step 3: Add looping BGM
FINAL_OUTPUT="${OUTPUT_DIR}/timepics-complete-demo.mp4"
echo "Adding looping BGM: $FINAL_OUTPUT"

# Get video duration
VIDEO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$MP4_VIDEO")
VIDEO_DURATION_INT=${VIDEO_DURATION%.*}
echo "Video duration: ${VIDEO_DURATION_INT}s"

# Create looped BGM to match video duration
TEMP_BGM="${OUTPUT_DIR}/bgm-looped.mp3"
ffmpeg -stream_loop -1 -i "$BGM" -t "$VIDEO_DURATION_INT" -c copy "$TEMP_BGM" -y 2>/dev/null

# Merge video with looped BGM
ffmpeg -i "$VIDEO_WITH_SUBS" -i "$TEMP_BGM" \
    -c:v copy -c:a libmp3lame -map 0:v:0 -map 1:a:0 -shortest \
    "$FINAL_OUTPUT" -y

# Clean up temp files
rm -f "$TEMP_BGM"

echo "Complete demo video created: $FINAL_OUTPUT"
echo "Total duration: ${VIDEO_DURATION_INT}s"
