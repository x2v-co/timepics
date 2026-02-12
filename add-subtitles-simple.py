#!/usr/bin/env python3
"""
Add bilingual subtitles to TimePics.ai demo video using simple text overlay
"""

from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

# 字幕数据
subtitles_data = [
    (0, 3, "TimePics.ai Core Features Demo", "TimePics.ai Core Features Demo"),
    (3.5, 10, "Feature 1: Daily Time Capsule", "Feature 1: Daily Time Capsule"),
    (10.5, 15, "Unlock hidden AI-generated images daily", "Unlock hidden AI-generated images daily"),
    (15.5, 20, "Engage through puzzle challenges", "Engage through puzzle challenges"),
    (20.5, 25, "Enhance user engagement & build content IP", "Enhance user engagement & build content IP"),
    (28, 33, "Feature 2: Timeline Wars", "Feature 2: Timeline Wars"),
    (33.5, 38, "Community-driven alternate history market", "Community-driven alternate history market"),
    (38.5, 43, "Two factions: Steampunk vs Biopunk", "Two factions: Steampunk vs Biopunk"),
    (43.5, 48, "Stake NFTs, fight for your timeline", "Stake NFTs, fight for your timeline"),
    (48.5, 53, "500 SOL Prize Pool · Gamified Battle", "500 SOL Prize Pool · Gamified Battle"),
    (53.5, 58, "Blink sharing for social distribution", "Blink sharing for social distribution"),
    (61, 66, "Feature 3: Solana NFT Minting", "Feature 3: Solana NFT Minting"),
    (66.5, 71, "Mint AI-generated images as NFTs", "Mint AI-generated images as NFTs"),
    (71.5, 76, "Truly own your temporal creations", "Truly own your temporal creations"),
    (76.5, 81, "NFT Gallery - Browse all creations", "NFT Gallery - Browse all creations"),
    (81.5, 86, "Filter by engine: Rewind/Refract/Foresee", "Filter by engine: Rewind/Refract/Foresee"),
    (86.5, 91, "IPFS decentralized storage", "IPFS decentralized storage"),
    (91.5, 95, "Thank you for watching!", "Thank you for watching!"),
    (95.5, 100, "TimePics.ai - Render Any Moment", "TimePics.ai - Render Any Moment"),
]

print("🎬 Loading video...")
video = VideoFileClip("demo-videos/temp-merged.webm")
print(f"✅ Video loaded: {video.duration:.1f}s, {video.size}")

print(f"\n📝 Creating {len(subtitles_data)} subtitle clips...")

subtitle_clips = []

for i, (start, end, text, _) in enumerate(subtitles_data, 1):
    if start >= video.duration:
        continue

    print(f"[{i}/{len(subtitles_data)}] {start}s-{end}s: {text[:40]}...")

    try:
        # Create text clip
        txt_clip = (TextClip(text, fontsize=36, color='white', bg_color='black',
                            method='label')
                   .set_position(('center', 'bottom'))
                   .set_duration(min(end - start, video.duration - start))
                   .set_start(start)
                   .margin(bottom=40, opacity=0))

        subtitle_clips.append(txt_clip)
    except Exception as e:
        print(f"  ⚠️  Error creating subtitle: {e}")
        continue

print(f"\n✅ Created {len(subtitle_clips)} subtitle clips")
print("\n🎨 Compositing video with subtitles...")

# Composite video with subtitles
final_video = CompositeVideoClip([video] + subtitle_clips)

print("💾 Exporting final video...")
final_video.write_videofile(
    "demo-videos/timepics-final-with-subs.mp4",
    codec='libx264',
    audio_codec='aac',
    fps=25,
    preset='medium',
    bitrate='2500k',
    threads=4
)

print("\n✅ Done! Video saved to: demo-videos/timepics-final-with-subs.mp4")
video.close()
final_video.close()
