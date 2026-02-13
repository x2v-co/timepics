#!/usr/bin/env python3
"""
Generate subtitles for the Arena demo video - Updated timing to match script
"""

def generate_srt():
    subtitles = [
        # (start_time, end_time, english, chinese)
        # Part 1: Homepage (0-26s)
        (0, 5, "Welcome to TimePics.ai", "欢迎来到 TimePics.ai"),
        (5, 10, "AI-Powered Visual Time Machine", "AI驱动的视觉时光机"),
        (10, 15, "Generate images across past, present, and future", "生成来自过去、现在和未来的图像"),
        (15, 20, "Let me show you our main features", "让我向你展示主要功能"),
        (20, 26, "First, let's check out Timeline War", "首先,让我们来看看时间战场"),
        # Part 2: Arena Page (26-52s)
        (26, 32, "This is the Timeline War arena", "这是时间战场竞技场"),
        (32, 38, "Watch AI Agents compete in real-time", "观看AI智能体实时对战"),
        (38, 44, "Vote, bet, and win Arcade Tokens", "投票、下注,赢得游戏币"),
        (44, 52, "Multiple live battles happening now", "多个战斗正在进行中"),
        # Part 3: Tesla vs Edison (52-93s)
        (52, 58, "Let's look at Tesla vs Edison battle", "让我们看特斯拉vs爱迪生战斗"),
        (58, 64, "The Current War: AC Power vs DC Power", "电流之战:交流电vs直流电"),
        (64, 70, "Vote for your favorite faction", "为你喜欢的阵营投票"),
        (70, 76, "Place bets with dynamic odds", "以下注的方式参与,赔率动态变化"),
        (76, 82, "Now checking v3 Enhanced View", "现在看看v3增强视图"),
        (82, 88, "This shows NFTs and power rankings", "这显示了NFT和能量排名"),
        (88, 93, "Genesis NFTs represent the timeline core", "创世NFT代表时间线核心"),
        # Part 4: Napoleon (93-104s)
        (93, 100, "Let's check a completed battle", "让我们看一个已完成的战斗"),
        (100, 106, "Napoleon Wins Waterloo", "拿破仑赢得滑铁卢"),
        (106, 112, "French Empire is the winner", "法兰西帝国获胜"),
        (106, 112, "View full round-by-round results", "查看完整的回合结果"),
        # Part 5: Generate (112-120s)
        (112, 118, "Now let's see the Generate page", "现在让我们看生成页面"),
        (118, 125, "Choose from three time engines", "从三个时间引擎中选择"),
    ]

    srt_content = ""
    for i, (start, end, eng, chn) in enumerate(subtitles, 1):
        start_time = format_time(start)
        end_time = format_time(end)

        srt_content += f"{i}\n"
        srt_content += f"{start_time} --> {end_time}\n"
        srt_content += f"{eng}\n"
        srt_content += f"{chn}\n\n"

    return srt_content

def format_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

if __name__ == "__main__":
    srt = generate_srt()
    with open("/Users/kl/workspace/x2v/openbuild/hackthon/timepics-ai/demo/demo/demo-videos/subtitles.srt", "w", encoding="utf-8") as f:
        f.write(srt)
    print("Subtitles generated!")
