#!/bin/bash
# 为最终演示视频添加字幕

cd demo-videos

echo "📝 添加中英文双语字幕到演示视频..."
echo ""

# 方式1: 尝试烧录字幕（如果 libass 可用）
echo "🎬 尝试烧录字幕到视频..."
if ffmpeg -filters 2>&1 | grep -q "subtitles\|ass"; then
    echo "✅ 支持字幕烧录"
    ffmpeg -i timepics-final-demo.mp4 \
        -vf "subtitles=final-subtitles.srt:force_style='FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,MarginV=40'" \
        -c:a copy \
        timepics-complete-demo.mp4 -y 2>&1 | grep -E "(Duration|time=)" | tail -5
else
    echo "⚠️  不支持字幕烧录，使用软字幕"
    # 方式2: 添加软字幕轨道
    ffmpeg -i timepics-final-demo.mp4 \
        -i final-subtitles.srt \
        -c:v copy -c:a copy \
        -c:s mov_text \
        -metadata:s:s:0 language=chi \
        timepics-complete-demo.mp4 -y 2>&1 | grep -E "(Duration|time=)" | tail -5
fi

echo ""
echo "================================"
echo "✅ 完整演示视频制作完成！"
echo ""
echo "📁 最终文件: demo-videos/timepics-complete-demo.mp4"
echo ""

# 显示文件信息
ls -lh timepics-complete-demo.mp4 | awk '{print "📦 文件大小: "$5}'
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 timepics-complete-demo.mp4 | awk '{print "⏱️  视频时长: " int($1) "秒"}'

echo ""
echo "🎉 视频制作完成！包含："
echo "   ✅ 4个功能片段合并"
echo "   ✅ 背景音乐"
echo "   ✅ 中英文双语字幕"
echo ""
echo "🎬 播放视频: open demo-videos/timepics-complete-demo.mp4"
