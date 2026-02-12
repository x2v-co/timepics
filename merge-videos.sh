#!/bin/bash
# TimePics.ai 完整演示视频制作脚本
# 根据 merge.md 的要求制作

set -e

echo "🎬 TimePics.ai 完整演示视频制作"
echo "================================"
echo ""

cd demo-videos

# 1. 裁剪视频片段
echo "✂️  步骤 1/5: 裁剪视频片段..."

# 片段1: 首页 (0:00-0:20)
echo "  📹 裁剪片段1: 首页展示 (0-20秒)"
ffmpeg -i ec6a17ccd583a8afeee336aa9c262848.webm -ss 0 -t 20 -c copy part1.webm -y 2>&1 | grep -E "(Duration|time=)" | tail -3

# 片段2: Time Capsule + Wars (0:00-0:38)
echo "  📹 裁剪片段2: Time Capsule & Timeline Wars (0-38秒)"
ffmpeg -i timepics-core-features-merged.webm -ss 0 -t 38 -c copy part2.webm -y 2>&1 | grep -E "(Duration|time=)" | tail -3

# 片段3: 生成NFT (全部)
echo "  📹 转换片段3: 生成NFT"
ffmpeg -i generate_nft.mov -c:v libvpx -c:a libvorbis part3.webm -y 2>&1 | grep -E "(Duration|time=)" | tail -3

# 片段4: Gallery (全部)
echo "  📹 复制片段4: Gallery浏览"
cp 8db782728df232ad768177a6aa48074f.webm part4.webm

echo ""
echo "✅ 片段裁剪完成"
echo ""

# 2. 创建合并列表
echo "📋 步骤 2/5: 创建合并列表..."
cat > merge-list.txt << EOF
file 'part1.webm'
file 'part2.webm'
file 'part3.webm'
file 'part4.webm'
EOF

echo "✅ 合并列表已创建"
echo ""

# 3. 合并视频
echo "🔗 步骤 3/5: 合并所有片段..."
ffmpeg -f concat -safe 0 -i merge-list.txt -c copy merged-raw.webm -y 2>&1 | grep -E "(Duration|time=)" | tail -3

echo ""
echo "✅ 视频合并完成"
echo ""

# 4. 转换为MP4 (准备添加字幕)
echo "🎞️  步骤 4/5: 转换为MP4格式..."
ffmpeg -i merged-raw.webm -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p merged-video.mp4 -y 2>&1 | grep -E "(Duration|time=)" | tail -3

echo ""
echo "✅ 格式转换完成"
echo ""

# 5. 添加背景音乐
echo "🎵 步骤 5/5: 添加背景音乐..."
ffmpeg -i merged-video.mp4 -i bgm.mp3 \
    -filter_complex "[1:a]volume=0.25,afade=t=in:st=0:d=2,afade=t=out:st=58:d=3[music]" \
    -map 0:v -map "[music]" \
    -c:v copy -c:a aac -b:a 192k \
    -shortest \
    timepics-final-demo.mp4 -y 2>&1 | grep -E "(Duration|time=)" | tail -3

echo ""
echo "================================"
echo "✅ 完成！演示视频已生成"
echo ""
echo "📁 输出文件: demo-videos/timepics-final-demo.mp4"
echo ""

# 显示文件信息
ls -lh timepics-final-demo.mp4 | awk '{print "📦 文件大小: "$5}'
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 timepics-final-demo.mp4 | awk '{print "⏱️  视频时长: " int($1) "秒"}'

echo ""
echo "🎬 下一步: 添加字幕"
echo "   使用命令: ./add-subtitles-to-final.sh"
