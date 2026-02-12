# task
1. 将3个视频连成一个视频
2. 根据时间节点生成字幕， 并添加到视频中
3. 添加背景音乐到视频中

# input video files
## 1. ec6a17ccd583a8afeee336aa9c262848.webm
### 使用片段： 0:00 - 0:20
### 片段说明：
    a. 0:00 - 0:10 首页整体预览。介绍网站整体功能
    b. 0:10 - 0:10 选择不同引擎，进行图片生成与ntf
## 2. timepics-core-features-merged.webm
### 使用片段：0:00 - 0:38
### 片段说明：
    a. 0:00 - 0:18 daily time capsule
    b. 0:18 - 0:38 时间线战争（核心社交，使用nft发表和投注，并获取选票来支持战队。可有多个topic）
## 3. generate_nft.mov
### 使用片段： all
### 片段说明：
选择不同的时间引擎生成timepic。将timepic 铸造成nft.
## 4. 8db782728df232ad768177a6aa48074f.webm
### 使用片段： all
### 片段说明：
浏览gallary。说明freeaze、accelerate和entropy功能

# subtitle file
根据video files的编排进行生成。
命令参考:
```bash
ffmpeg -i timepics-core-features-final.mp4 -vf "subtitles=subtitles.srt" test.mp4
```

# audio file
加入bgm.mp3作为bgm.
命令参考:
```bash
ffmpeg -i timepics-core-features-final.mp4 -i bgm.mp3 -c:v copy -c:a libmp3lame -map 0:v:0 -map 1:a:0 -shortest output.mp4

```
