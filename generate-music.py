#!/usr/bin/env python3
"""
为 TimePics.ai 生成简单的科技感背景音乐
使用纯数学方式生成电子音效
"""

import numpy as np
from scipy.io import wavfile
import os

print("🎵 正在生成科技感背景音乐...")

# 参数设置
sample_rate = 44100  # 采样率
duration = 93  # 时长（秒）- 匹配视频长度
volume = 0.3  # 音量 (30%)

# 生成时间数组
t = np.linspace(0, duration, int(sample_rate * duration))

print(f"⏱️  时长: {duration}秒")
print(f"🔊 音量: {int(volume * 100)}%")

# 创建多层音频

# 1. 低音线 (Bass) - 使用正弦波
bass_freq = 55  # A1
bass = volume * 0.5 * np.sin(2 * np.pi * bass_freq * t)

# 2. 节奏鼓点 (Kick Drum) - 每秒2次
kick_rhythm = np.zeros_like(t)
kick_freq = 60
for beat in range(0, duration * 2):
    beat_time = beat / 2
    beat_samples = int(beat_time * sample_rate)
    kick_duration = int(0.1 * sample_rate)  # 0.1秒
    if beat_samples + kick_duration < len(kick_rhythm):
        kick_env = np.exp(-10 * np.linspace(0, 0.1, kick_duration))
        kick_sound = volume * 0.8 * np.sin(2 * np.pi * kick_freq * np.linspace(0, 0.1, kick_duration)) * kick_env
        kick_rhythm[beat_samples:beat_samples + kick_duration] += kick_sound

# 3. 高音旋律 (Melody) - 使用和弦
melody = np.zeros_like(t)
chord_freqs = [
    [440, 554.37, 659.25],  # A Major (前20秒)
    [523.25, 659.25, 783.99],  # C Major (中间段)
    [587.33, 739.99, 880],  # D Major (高潮)
]

segment_length = duration / len(chord_freqs)
for i, freqs in enumerate(chord_freqs):
    start = int(i * segment_length * sample_rate)
    end = int((i + 1) * segment_length * sample_rate)
    for freq in freqs:
        melody[start:end] += volume * 0.2 * np.sin(2 * np.pi * freq * t[start:end])

# 4. 添加白噪音效果 (科技感)
noise = volume * 0.05 * np.random.normal(0, 1, len(t))

# 5. 渐强渐弱效果
fade_in_duration = int(2 * sample_rate)  # 2秒淡入
fade_out_duration = int(3 * sample_rate)  # 3秒淡出

envelope = np.ones_like(t)
envelope[:fade_in_duration] = np.linspace(0, 1, fade_in_duration)
envelope[-fade_out_duration:] = np.linspace(1, 0, fade_out_duration)

print("🎼 合成音频层...")
print("   ✓ 低音线")
print("   ✓ 节奏鼓点")
print("   ✓ 和弦旋律")
print("   ✓ 科技噪音")

# 合成所有音轨
audio = (bass + kick_rhythm + melody + noise) * envelope

# 归一化到 [-1, 1]
audio = audio / np.max(np.abs(audio))

# 转换为 16-bit PCM
audio_int = np.int16(audio * 32767)

# 保存为 WAV 文件
output_file = "demo-videos/background-music.wav"
wavfile.write(output_file, sample_rate, audio_int)

print(f"\n✅ 音乐已生成: {output_file}")

# 获取文件大小
file_size = os.path.getsize(output_file) / (1024 * 1024)
print(f"📦 文件大小: {file_size:.1f} MB")

print("\n🎬 下一步: 将音乐添加到视频")
print("   运行: ./add-music.sh demo-videos/background-music.wav")
