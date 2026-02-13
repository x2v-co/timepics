#!/usr/bin/env python3
"""Generate subtitles for Complete Demo video - Total ~2:30"""

def generate_srt():
    subtitles = [
        # Part 1: Homepage (0:00-0:30) = 30s
        (0, 6, "Welcome to TimePics.ai", "欢迎来到 TimePics.ai"),
        (6, 12, "AI-Powered Visual Time Machine", "AI驱动的视觉时光机"),
        (12, 18, "Generate images across past, present, and future", "生成来自过去、现在和未来的图像"),
        (18, 24, "Daily Time Capsule unlocks hidden AI visions", "每日时间胶囊解锁隐藏的AI视觉"),
        (24, 30, "Let's explore Timeline War arena", "让我们探索时间战场竞技场"),

        # Part 2: Generate NFT (0:30-0:45) = 15s
        (30, 36, "Choose from three time engines", "从三个时间引擎中选择"),
        (36, 42, "Rewind for past, Refract for parallel universes", "回溯引擎看过去,折射引擎看平行宇宙"),
        (42, 45, "Foresee to visualize the future", "预见引擎展望未来"),

        # Part 3.1: Arena List (0:45-1:05) = 20s
        (45, 50, "This is the Timeline War arena", "这是时间战场竞技场"),
        (50, 56, "Multiple live battles happening now", "多个实时战斗正在进行"),
        (56, 62, "Watch AI Agents compete in real-time", "观看AI智能体实时对战"),
        (62, 68, "Vote for your favorite faction", "为你喜欢的阵营投票"),
        (68, 75, "Place bets with dynamic odds", "以下注的方式参与,赔率动态变化"),

        # Part 3.2: Battle Detail (1:05-1:25) = 20s
        (75, 82, "Tesla vs Edison: The Current War", "特斯拉vs爱迪生:电流之战"),
        (82, 88, "AC Power vs DC Power battle", "交流电vs直流电的战斗"),
        (88, 95, "Mint NFTs to support your faction", "铸造NFT来支持你的阵营"),
        (95, 105, "Your NFT's power affects battle outcome", "你的NFT能量会影响战斗结果"),

        # Part 3.3: v3 Enhanced View (1:25-1:40) = 15s
        (105, 112, "Introducing v3 Enhanced View", "介绍v3增强视图"),
        (112, 119, "Genesis NFTs represent timeline core", "创世NFT代表时间线核心"),
        (119, 125, "Power rankings show faction strength", "能量排名显示阵营实力"),
        (125, 135, "Back NFTs with Arcade Tokens to boost power", "用游戏币支持NFT来提升能量"),

        # Part 3.4: View Results (1:40-1:45) = 5s
        (135, 140, "Check completed battles for results", "查看已完成战斗的结果"),

        # Part 4: Paradox (1:40-1:55) = 15s
        (140, 146, "Explore Paradox Engine", "探索悖论引擎"),
        (146, 152, "Generate alternate history topics", "生成替代历史话题"),
        (152, 155, "What if scenarios come to life", "假设情景变为现实"),

        # Part 5: Gallery (1:55-2:10) = 15s
        (155, 161, "Visit your NFT Gallery", "访问你的NFT画廊"),
        (161, 167, "Living NFTs evolve over time", "活体NFT随时间演化"),
        (167, 173, "Entropy Protocol shows aging effects", "熵协议显示老化效果"),
        (173, 180, "Freeze NFTs to lock their state forever", "冻结NFT以永久锁定其状态"),

        # Part 6: Ending (2:10-2:30) = 20s
        (180, 188, "TimePics.ai - Render Any Moment", "TimePics.ai - 渲染任何时刻"),
        (188, 196, "Join the Timeline Wars today", "今天就加入时间战场"),
        (196, 206, "Vote, bet, and win Arcade Tokens", "投票、下注,赢得游戏币"),
        (206, 220, "Experience the future of AI-generated art", "体验AI生成艺术的未来"),
        (220, 230, "TimePics.ai", "TimePics.ai"),
    ]

    srt_content = ""
    for i, (start, end, eng, chn) in enumerate(subtitles, 1):
        start_time = format_time(start)
        end_time = format_time(end)
        srt_content += f"{i}\n{start_time} --> {end_time}\n{eng}\n{chn}\n\n"
    return srt_content

def format_time(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

if __name__ == "__main__":
    srt = generate_srt()
    output_path = "demo/demo/demo-videos/subtitles-complete.srt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(srt)
    print(f"Subtitles generated: {output_path}")
    print(f"Total duration: ~230 seconds (3:50)")
