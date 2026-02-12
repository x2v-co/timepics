#!/usr/bin/env python3
"""
Add bilingual (Chinese/English) subtitles to TimePics.ai demo video
"""

from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.video.VideoClip import TextClip
from moviepy.video.compositing.CompositeVideoClip import CompositeVideoClip

# 字幕数据 (时间, 中文, 英文)
subtitles = [
    (0, 3, "TimePics.ai 核心功能演示", "TimePics.ai Core Features Demo"),
    (3.5, 10, "功能一：每日时间胶囊 🎁", "Feature 1: Daily Time Capsule 🎁"),
    (10.5, 15, "每天解锁一个AI生成的隐藏图像", "Unlock a hidden AI-generated image every day"),
    (15.5, 20, "通过解谜挑战与社区互动", "Engage with the community through puzzle challenges"),
    (20.5, 25, "增强用户粘性，打造内容IP", "Enhance user engagement and build content IP"),
    (28, 33, "功能二：时间线战争 ⚔️", "Feature 2: Timeline Wars ⚔️"),
    (33.5, 38, "社区驱动的替代历史预测市场", "Community-driven alternate history prediction market"),
    (38.5, 43, "两大阵营：蒸汽朋克 vs 生物朋克", "Two factions: Steampunk vs Biopunk"),
    (43.5, 48, "质押NFT，为你的时间线而战", "Stake NFTs and fight for your timeline"),
    (48.5, 53, "500 SOL 奖池 · 游戏化对战机制", "500 SOL Prize Pool · Gamified Battle System"),
    (53.5, 58, "Blink分享功能，社交传播", "Blink sharing for social distribution"),
    (61, 66, "功能三：Solana NFT 铸造 ⛓️", "Feature 3: Solana NFT Minting ⛓️"),
    (66.5, 71, "一键将AI生成的图像铸造为NFT", "Mint AI-generated images as NFTs with one click"),
    (71.5, 76, "真正拥有你的时间维度创作", "Truly own your temporal dimension creations"),
    (76.5, 81, "NFT Gallery - 浏览所有作品", "NFT Gallery - Browse all creations"),
    (81.5, 86, "按引擎类型筛选：Rewind / Refract / Foresee", "Filter by engine: Rewind / Refract / Foresee"),
    (86.5, 91, "IPFS去中心化存储，永久保存", "IPFS decentralized storage, permanent preservation"),
    (91.5, 95, "感谢观看！", "Thank you for watching!"),
    (95.5, 100, "TimePics.ai - 渲染任何时刻", "TimePics.ai - Render Any Moment"),
]

print("🎬 开始添加中英文双语字幕...")
print(f"📝 共 {len(subtitles)} 条字幕")

# 加载视频
video = VideoFileClip("demo-videos/temp-merged.webm")
print(f"✅ 视频已加载: {video.duration:.1f}秒, {video.size}")

# 创建所有字幕片段
subtitle_clips = []

for i, (start, end, cn_text, en_text) in enumerate(subtitles, 1):
    print(f"[{i}/{len(subtitles)}] {start}s-{end}s: {cn_text[:30]}...")

    # 中文字幕 (上方)
    txt_cn = TextClip(
        txt=cn_text,
        fontsize=40,
        color='white',
        stroke_color='black',
        stroke_width=2,
        method='caption',
        size=(video.w - 100, None)
    )
    txt_cn = txt_cn.set_position(('center', video.h - 150)).set_duration(end - start).set_start(start)
    subtitle_clips.append(txt_cn)

    # 英文字幕 (下方)
    txt_en = TextClip(
        txt=en_text,
        fontsize=32,
        color='lightgray',
        stroke_color='black',
        stroke_width=2,
        method='caption',
        size=(video.w - 100, None)
    )
    txt_en = txt_en.set_position(('center', video.h - 100)).set_duration(end - start).set_start(start)
    subtitle_clips.append(txt_en)

print("\n🎨 合成视频和字幕...")
final_video = CompositeVideoClip([video] + subtitle_clips)

print("💾 导出最终视频...")
final_video.write_videofile(
    "demo-videos/timepics-core-features-with-subtitles.mp4",
    codec='libx264',
    audio_codec='aac',
    temp_audiofile='temp-audio.m4a',
    remove_temp=True,
    fps=25,
    preset='medium',
    bitrate='2000k'
)

print("\n✅ 完成！视频已保存到: demo-videos/timepics-core-features-with-subtitles.mp4")
