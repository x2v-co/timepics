#!/bin/bash
# 为 TimePics.ai 演示视频添加背景音乐

echo "🎵 TimePics.ai 演示视频 - 添加配乐工具"
echo ""

VIDEO_FILE="demo-videos/timepics-core-features-FINAL.mp4"
OUTPUT_FILE="demo-videos/timepics-core-features-with-music.mp4"

# 检查视频文件是否存在
if [ ! -f "$VIDEO_FILE" ]; then
    echo "❌ 错误: 找不到视频文件 $VIDEO_FILE"
    exit 1
fi

echo "📹 输入视频: $VIDEO_FILE"
echo "🎵 输出视频: $OUTPUT_FILE"
echo ""

# 如果用户提供了音乐文件
if [ -f "$1" ]; then
    MUSIC_FILE="$1"
    echo "🎼 使用音乐: $MUSIC_FILE"
    echo ""

    # 获取视频时长
    VIDEO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_FILE")
    echo "⏱️  视频时长: ${VIDEO_DURATION}秒"

    # 添加音乐到视频（音乐音量降低到30%，保持视频原有内容）
    echo "🎬 正在合成..."
    ffmpeg -i "$VIDEO_FILE" -i "$MUSIC_FILE" \
        -filter_complex "[1:a]volume=0.3,afade=t=in:st=0:d=2,afade=t=out:st=$((${VIDEO_DURATION%.*}-3)):d=3[music];[music]aloop=loop=-1:size=2e+09[bg]" \
        -map 0:v -map "[bg]" \
        -shortest \
        -c:v copy \
        -c:a aac -b:a 192k \
        "$OUTPUT_FILE" -y

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 成功! 视频已保存到:"
        echo "   $OUTPUT_FILE"
        echo ""
        echo "📊 文件大小:"
        ls -lh "$OUTPUT_FILE" | awk '{print "   "$5}'
    else
        echo "❌ 合成失败"
        exit 1
    fi
else
    echo "📝 使用方法:"
    echo "   ./add-music.sh <音乐文件.mp3>"
    echo ""
    echo "🎵 推荐免费音乐资源:"
    echo ""
    echo "   1. Pixabay Music (免费商用)"
    echo "      https://pixabay.com/music/"
    echo "      - 搜索: epic tech futuristic"
    echo ""
    echo "   2. YouTube Audio Library (免费)"
    echo "      https://studio.youtube.com/channel/UC.../music"
    echo "      - 搜索: Electronic, Cinematic"
    echo ""
    echo "   3. Free Music Archive"
    echo "      https://freemusicarchive.org/"
    echo "      - 搜索: Electronic, Ambient, Cinematic"
    echo ""
    echo "   4. Incompetech (Kevin MacLeod)"
    echo "      https://incompetech.com/music/"
    echo "      - 推荐: Cipher, Volatile Reaction"
    echo ""
    echo "   5. Bensound (部分免费)"
    echo "      https://www.bensound.com/"
    echo "      - 推荐: Epic, Sci-Fi"
    echo ""
    echo "💡 配乐建议:"
    echo "   - 风格: 电子、科技感、未来感、史诗"
    echo "   - 节奏: 120-140 BPM"
    echo "   - 情绪: 激昂、振奋、创新"
    echo "   - 时长: 至少 1分30秒"
    echo ""
    echo "🎼 关键词:"
    echo "   epic tech, futuristic, innovation, cyberpunk,"
    echo "   electronic motivation, tech showcase, AI future"
fi
