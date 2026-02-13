# Demo Video Creation Guide

## Files Created

### 1. Recording Script
- `record-complete-demo.js` - Updated recording script with all required sections

### 2. Subtitle Generator
- `scripts/generate-complete-subtitles.py` - Generates bilingual subtitles

### 3. Video Processing Script  
- `scripts/process-complete-demo.sh` - Adds subtitles and BGM to recorded video

## How to Use

### Step 1: Start the dev server
```bash
npm run dev
```

### Step 2: Generate subtitles (already done)
```bash
python3 scripts/generate-complete-subtitles.py
```

### Step 3: Record the video
```bash
node record-complete-demo.js
```

### Step 4: Process the video (add subtitles + BGM)
```bash
./scripts/process-complete-demo.sh
```

Or specify a video file:
```bash
./scripts/process-complete-demo.sh demo/demo/demo-videos/[video-file].webm
```

## Video Structure

The video covers these sections in ~2:30:

1. **Homepage (30s)** - Welcome, hero, time capsule, arena preview
2. **Generate NFT (15s)** - Three time engines introduction
3. **Arena详细介绍 (60s)**
   - 3.1 Arena list浏览 (20s)
   - 3.2 Battle detail and mint NFT (20s)
   - 3.3 v3 Enhanced View (15s)
   - 3.4 View results (5s)
4. **Paradox介绍 (15s)** - Paradox engine overview
5. **Gallery介绍 (15s)** - Living NFTs, entropy, freeze mechanism
6. **结束语 (20s)** - Final call to action

## Notes

- Font size in subtitles: 16 (smaller than before)
- BGM loops throughout entire video
- Total duration: ~2:30 (150 seconds)
