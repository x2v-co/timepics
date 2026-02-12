# TimePics.ai - Browser Testing Checklist

## 🎯 Testing URL
**http://localhost:3000**

---

## ✅ Test 1: Home Page
- [ ] Dark theme loads correctly
- [ ] Logo displays "TimePics.ai 时相机"
- [ ] Hero text: "Render Any Moment"
- [ ] Three engine cards visible:
  - [ ] ⏪ Rewind Engine (blue gradient)
  - [ ] ✨ Refract Engine (purple gradient)
  - [ ] 🔭 Foresee Engine (indigo gradient)
- [ ] "How It Works" section with 4 steps
- [ ] Footer displays

---

## ✅ Test 2: Navigation
- [ ] Click "Start Creating" → Goes to /generate
- [ ] Click "View Gallery" → Goes to /gallery
- [ ] Click "Generate" in nav → Goes to /generate
- [ ] Click "Gallery" in nav → Goes to /gallery
- [ ] Click logo → Returns to home
- [ ] "Connect Wallet" button visible (top right)

---

## ✅ Test 3: Generation Page (/generate)

### Engine Selection
- [ ] Three tabs visible: Rewind | Refract | Foresee
- [ ] Tabs switch correctly
- [ ] Active tab highlighted in blue/purple

### Prompt Input
- [ ] Large text area for prompt
- [ ] Character counter shows (0/1000)
- [ ] Prompt suggestions appear (5 suggestions)
- [ ] Clicking suggestion fills prompt
- [ ] Suggestions change per engine

### Advanced Options
- [ ] "▶ Advanced Options" toggle works
- [ ] Era selection buttons (1900s, 1920s, 1950s, etc.)
- [ ] Aspect Ratio dropdown (1:1, 16:9, 9:16, 4:3)
- [ ] Quality toggle (Standard / HD)
- [ ] Options collapse/expand smoothly

### Generation Button
- [ ] "Generate Image" button visible
- [ ] Button disabled when prompt empty
- [ ] Button shows loading state during generation

---

## ✅ Test 4: Image Generation Flow

### Try These Prompts:

**Test A: Rewind Engine**
```
Prompt: "vintage family photo from 1950s, black and white"
Era: 1950s
Aspect: 1:1
Quality: Standard
```
- [ ] Time-travel animation appears
- [ ] Loading message shows: "Rewind engine activating..."
- [ ] Progress dots animate
- [ ] Generation takes ~25-30 seconds
- [ ] Image appears in right panel
- [ ] Image is vintage-styled, black & white tone

**Test B: Refract Engine**
```
Prompt: "what if the Roman Empire never fell"
Era: Realistic
Aspect: 16:9
Quality: Standard
```
- [ ] Purple/pink animation appears
- [ ] Loading message: "Refract engine activating..."
- [ ] Image shows alternate history scene
- [ ] Wide format (16:9) displays correctly

**Test C: Foresee Engine**
```
Prompt: "futuristic city with flying cars in 2050"
Era: 2050s
Aspect: 9:16
Quality: Standard
```
- [ ] Cyan/blue animation appears
- [ ] Loading message: "Foresee engine activating..."
- [ ] Image shows futuristic theme
- [ ] Vertical format (9:16) displays correctly

---

## ✅ Test 5: Generated Image Display

After image generates:
- [ ] Image displays clearly
- [ ] Metadata card shows:
  - [ ] Prompt text
  - [ ] Engine name
  - [ ] Era
  - [ ] Generation date/time
  - [ ] Generation ID

### Hover Actions
- [ ] Hover over image → Overlay appears
- [ ] Three action buttons visible:
  - [ ] 🔍 Fullscreen button
  - [ ] ⬇️ Download button
  - [ ] 📤 Share button

### Action Testing
- [ ] Click fullscreen → Opens fullscreen modal
- [ ] Click X to close fullscreen → Returns to normal
- [ ] Click download → Saves image as PNG
- [ ] Click share → Shows share dialog (or copies link)

### Mint Button
- [ ] "Mint as NFT on Solana" button visible
- [ ] Purple/pink gradient styling
- [ ] Shows "~0.02 SOL" estimate
- [ ] Click mint → Shows "DEMO MODE" notification (mock)

---

## ✅ Test 6: Gallery Page (/gallery)

### Without Wallet Connected
- [ ] Shows "Connect Your Wallet" message
- [ ] Wallet icon displayed
- [ ] "Connect Wallet" button prominent

### With Wallet Connected
- [ ] Shows mock NFTs (2 sample cards)
- [ ] NFT cards display:
  - [ ] TimePics #001 (blue)
  - [ ] TimePics #002 (purple)
  - [ ] Engine name
  - [ ] Era
  - [ ] Generation date
  - [ ] Mint address
- [ ] Hover over card → Elevates with shadow
- [ ] Click card → Could open modal (optional)
- [ ] "View on Explorer" button appears on hover

---

## ✅ Test 7: Wallet Connection

### Click "Connect Wallet"
- [ ] Modal opens with wallet options
- [ ] Shows available wallets:
  - [ ] Phantom
  - [ ] Solflare
  - [ ] Torus
- [ ] Dark theme modal
- [ ] Close modal with X or backdrop click

### If Phantom Installed
- [ ] Select Phantom → Opens Phantom popup
- [ ] After connecting:
  - [ ] Wallet address shows (e.g., "DYw8...Hp3X")
  - [ ] Green dot indicator appears
  - [ ] Button changes to wallet address

---

## ✅ Test 8: Responsive Design

### Desktop (1920px)
- [ ] All elements properly spaced
- [ ] Two-column layout on /generate
- [ ] Gallery shows 4 columns

### Tablet (768px)
- [ ] Single column on /generate
- [ ] Gallery shows 2-3 columns
- [ ] Navigation collapses appropriately

### Mobile (375px)
- [ ] Touch-friendly buttons
- [ ] Gallery shows 1-2 columns
- [ ] Text readable without zoom
- [ ] Generate button full-width

---

## ✅ Test 9: Performance & UX

### Loading States
- [ ] Smooth transitions between pages
- [ ] Loading skeletons for NFT cards
- [ ] Shimmer effect on loading elements
- [ ] Time-travel animation smooth at 60fps

### Animations
- [ ] Engine cards hover effect (lift + glow)
- [ ] Buttons have hover states
- [ ] Gradient text animates subtly
- [ ] Modal fade in/out smooth

### Error Handling
- [ ] Empty prompt → Button stays disabled
- [ ] API error → Shows error message
- [ ] Network error → User-friendly message
- [ ] Generation timeout → Clear feedback

---

## ✅ Test 10: Dark Theme Consistency

Check across all pages:
- [ ] Background: #0D0D0D (dark black)
- [ ] Cards: #1A1A1A (slightly lighter)
- [ ] Borders: #2A2A2A (subtle)
- [ ] Text: #F5F5F5 (light gray)
- [ ] Accent: #6366F1 (indigo)
- [ ] Secondary: #3B82F6 (blue)
- [ ] No bright white anywhere
- [ ] Neon glow effects on hover

---

## 🐛 Common Issues & Fixes

### Issue: "GEMINI_API_KEY not configured"
**Fix:** Make sure `.env.local` has a valid Gemini API key

### Issue: Generation takes too long (>60s)
**Fix:** This is normal for HD quality or complex prompts

### Issue: Image doesn't display
**Check:** Browser console for errors
**Fix:** Refresh page and try again

### Issue: Wallet won't connect
**Fix:** Install Phantom wallet extension: https://phantom.app/

### Issue: NFT minting shows "DEMO MODE"
**Expected:** This is correct - minting is in mock mode until backend wallet is configured

---

## 📊 Expected Generation Times

| Quality | Aspect Ratio | Time |
|---------|--------------|------|
| Standard | 1:1 | 20-30s |
| Standard | 16:9 | 25-35s |
| HD | 1:1 | 40-60s |
| HD | 16:9 | 50-70s |

---

## 🎨 Sample Prompts for Testing

### Rewind Engine
1. "1920s flapper girl in art deco ballroom"
2. "old sepia photograph of Victorian family"
3. "1980s mall food court with neon signs"
4. "Kodachrome slide from 1960s summer vacation"

### Refract Engine
1. "steampunk Victorian London with airships"
2. "what if dinosaurs never went extinct"
3. "ancient Egypt with advanced technology"
4. "alternate history where Tesla won the electricity war"

### Foresee Engine
1. "holographic city skyline in 2060"
2. "person at age 70 with AI companion robot"
3. "underwater city with bio-dome architecture"
4. "Mars colony in the year 2050"

---

## ✅ Success Criteria

All tests should pass with:
- [ ] No JavaScript console errors
- [ ] All links working
- [ ] Images generating successfully
- [ ] Smooth animations
- [ ] Responsive on mobile
- [ ] Dark theme consistent
- [ ] Wallet connection working (if installed)

---

**Testing Status:** ⏳ In Progress
**Last Updated:** $(date)
**Tester:** _____________
