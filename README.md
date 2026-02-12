# TimePics.ai

<div align="center">
  <h1>🕰️ TimePics.ai - Render Any Moment</h1>
  <p><strong>AI-Powered Visual Time Machine</strong></p>
  <p>Generate images across past, parallel universes, and future timelines. Mint them as Living NFTs on Solana.</p>

  <p>
    <a href="https://github.com/x2v-co/timepics"><img src="https://img.shields.io/badge/GitHub-x2v--co%2Ftimepics-blue?logo=github" alt="GitHub"></a>
    <a href="#"><img src="https://img.shields.io/badge/Status-MVP%20Complete-success" alt="Status"></a>
    <a href="#"><img src="https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana" alt="Solana"></a>
  </p>
</div>

---

## 🎯 What is TimePics.ai?

TimePics.ai is an innovative Web3 application that combines **AI image generation**, **blockchain NFTs**, and **gamification** to create a unique "visual time machine" experience. Generate temporal images, mint them as evolving NFTs, and participate in community-driven timeline battles.

**Tagline:** "Render Any Moment. Own It Forever."

---

## ✨ Core Features

### 🎨 Three Time Engines

Generate images across different temporal dimensions:

- **⏪ Rewind Engine (回溯引擎)**: Travel to the past
  - Restore vintage photos with AI super-resolution
  - Era style transfer (1920s, 1950s, 1980s, 2000s)
  - Historical reconstruction with period-accurate details

- **✨ Refract Engine (折射引擎)**: Explore parallel universes
  - Alternate history scenarios ("what if" timelines)
  - Historical face fusion into different eras
  - Photorealistic alternate reality visualization

- **🔭 Foresee Engine (预见引擎)**: Visualize the future
  - Future predictions and trends
  - Age progression (30/50/70 years ahead)
  - Sci-fi futuristic scene generation

### 🧬 Living NFTs with Entropy System

Your NFTs aren't static JPEGs - they **evolve over time**:

- **📅 Survival Days**: Track how long your NFT has existed
- **🌀 Entropy (0-100%)**: Visual aging system
  - Fresh (0-19%): Original quality, vibrant colors
  - Aging (20-49%): Color desaturation, slight grain
  - Decayed (50-79%): Visible aging, vintage filters
  - Ancient (80-100%): Heavy distortion, glitch art
- **🔒 Freeze**: Lock NFT at current state permanently
- **⚡ Accelerate**: Fast-forward to see future aging

### 🎁 Daily Time Capsule

Daily puzzle-based game to increase engagement:

- New mystery image every 24 hours
- Unlock with keyword guessing
- Locked content with noise animation
- LocalStorage persistence
- Countdown timer to next capsule

### ⚔️ Timeline Wars

Community-driven historical battles:

- **Stake NFTs** to support factions (e.g., Steam Revolution vs Bio Genesis)
- **NFT Power System**: Based on freshness, engine type, and age
- **Win Rewards**: Victorious faction shares SOL prize pool
- **NFT Badges**: Winners get "Canonical History" badge, losers get "Paradox" glitch art
- **Real-time Battle Stats**: Live power comparison and win probability

### 🔗 Solana Blinks Integration

Share interactive blockchain links on social media:

- Share NFTs directly on Twitter with mint button
- Share Timeline Wars battles with stake button
- One-click blockchain actions from social platforms
- No need to leave Twitter to interact with blockchain

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Solana wallet** (Phantom, Solflare, etc.) - for NFT minting
- **API Keys**:
  - [Google Gemini API](https://ai.google.dev/) - for AI image generation ✅ **Required**
  - [NFT.Storage Key](https://nft.storage) - for IPFS storage (free) ⚡ **Recommended**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/x2v-co/timepics.git
   cd timepics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your keys:
   ```env
   # AI Generation (Required)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Solana Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   SOLANA_RPC_URL=https://api.devnet.solana.com

   # IPFS Storage (Recommended for NFT minting)
   NFT_STORAGE_KEY=your_nft_storage_key_here

   # Backend Wallet (Optional, for real NFT minting)
   BACKEND_WALLET_PRIVATE_KEY=[1,2,3,...]
   ```

   **Get API Keys:**
   - **Gemini**: Visit https://ai.google.dev/ → "Get API Key" → Copy key
   - **NFT.Storage**: Visit https://nft.storage → Sign up → "API Keys" → "New Key"
   - See [QUICK_START_IPFS.md](./QUICK_START_IPFS.md) for detailed IPFS setup

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Verification

Test that everything works:

```bash
# Test AI generation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"engine":"rewind","prompt":"vintage photo 1950s"}'

# Test IPFS (if configured)
curl http://localhost:3000/api/ipfs/test
```

Or visit the test page: http://localhost:3000/ipfs-test

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

### AI & Generation
- **AI Provider**: Google Gemini (Imagen 3)
- **Image Format**: JPEG, Base64
- **Quality**: Standard (1K) and HD (4K)

### Blockchain
- **Network**: Solana (Devnet/Mainnet)
- **Wallet**: @solana/wallet-adapter (Phantom, Solflare, etc.)
- **NFT Standard**: Metaplex Token Metadata
- **Actions**: Solana Blinks/Actions API

### Storage
- **IPFS**: NFT.Storage (free permanent storage)
- **Gateway**: https://nftstorage.link
- **Format**: CID-based content addressing

---

## 📁 Project Structure

```
timepics-ai/
├── app/                           # Next.js App Router
│   ├── api/                      # Backend API routes
│   │   ├── generate/            # AI image generation
│   │   ├── generate-ipfs/       # Generate + IPFS upload
│   │   ├── mint/                # NFT minting
│   │   ├── nfts/                # NFT queries and operations
│   │   │   ├── freeze/          # Freeze NFT entropy
│   │   │   └── accelerate/      # Accelerate NFT aging
│   │   ├── blinks/              # Solana Blinks/Actions
│   │   │   ├── nft/[id]/        # NFT Blinks
│   │   │   └── wars/            # Timeline Wars Blinks
│   │   ├── wars/                # Timeline Wars logic
│   │   │   └── stake/           # NFT staking
│   │   └── ipfs/test/           # IPFS testing
│   ├── generate/                # Generation interface
│   ├── gallery/                 # NFT gallery with Living NFTs
│   ├── timeline-wars/           # Wars battle page
│   ├── ipfs-test/               # IPFS test page
│   ├── page.tsx                 # Home page with Time Capsule
│   ├── layout.tsx               # Root layout with WalletProvider
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── WalletButton.tsx         # Wallet connection
│   ├── WalletProvider.tsx       # Wallet context
│   ├── EngineCard.tsx           # Time engine cards
│   ├── GenerationForm.tsx       # Image generation form
│   ├── ImageDisplay.tsx         # Generated image viewer
│   ├── TimeAnimation.tsx        # Loading animations
│   ├── TimeCapsule.tsx          # Daily puzzle game
│   ├── EnhancedNFTCard.tsx      # Living NFT card with entropy
│   ├── NFTDetailModal.tsx       # NFT details popup
│   ├── MintSuccessModal.tsx     # Post-mint modal
│   ├── EntropyInfoCard.tsx      # Living NFTs explainer
│   ├── BlinkShareButton.tsx     # Social sharing
│   └── MintButton.tsx           # NFT minting button
├── lib/                         # Utility libraries
│   ├── gemini.ts               # Google Gemini AI client
│   ├── prompts.ts              # Prompt engineering for engines
│   ├── ipfs.ts                 # IPFS upload utilities
│   ├── solana.ts               # Solana connection
│   ├── metaplex.ts             # NFT minting with Metaplex
│   ├── storage.ts              # LocalStorage helpers
│   ├── nftState.ts             # Living NFT state management
│   ├── wars.ts                 # Timeline Wars logic
│   ├── blinks.ts               # Solana Blinks utilities
│   └── utils.ts                # General utilities
├── public/                      # Static assets
│   └── images/                 # Demo images
├── CLAUDE.md                    # Project instructions
├── IMPLEMENTATION_COMPLETE.md   # MVP completion report
├── GAMIFICATION_FEATURES.md     # Gamification details
├── FEATURE_UPDATES.md           # Feature changelog
├── IPFS_IMPLEMENTATION.md       # IPFS integration guide
├── QUICK_START_IPFS.md          # IPFS quick setup
├── PHASE2_PHASE4_IMPLEMENTATION.md  # Blinks & Wars details
└── DESIGN_SYSTEM.md             # UI/UX design guide
```

---

## 🎮 How to Use

### 1. Generate Images

Visit **http://localhost:3000/generate**

1. Select a time engine (Rewind, Refract, or Foresee)
2. Enter your prompt (or use AI suggestions)
3. Choose options:
   - **Era**: 1900s, 1920s, 1950s, 1980s, 2000s, or custom
   - **Aspect Ratio**: 1:1, 16:9, 9:16, 4:3, 3:4
   - **Quality**: Standard (faster) or HD (higher quality)
4. Click "Generate Image"
5. Wait 20-30 seconds for AI generation
6. Download, share, or mint as NFT

**Prompt Tips:**
- Be specific: "1950s family portrait in living room" vs "old photo"
- Add mood: "nostalgic", "dramatic", "optimistic"
- Specify style: "Kodachrome color", "black and white"

### 2. Mint Living NFTs

After generating an image:

1. Connect your Solana wallet (Phantom recommended)
2. Click "Mint as NFT"
3. Confirm transaction (0.1 SOL on devnet)
4. View success modal with:
   - Mint address
   - IPFS links (image + metadata)
   - Solana Explorer link
5. Navigate to Gallery or Timeline Wars

### 3. Manage Living NFTs

Visit **http://localhost:3000/gallery**

Your NFTs evolve over time with the Entropy System:

**Entropy Levels:**
- **Fresh (0-19%)**: 🟢 Original quality, vibrant
- **Aging (20-49%)**: 🟡 Slight fading, color shift
- **Decayed (50-79%)**: 🟠 Visible aging, grain texture
- **Ancient (80-100%)**: 🔴 Heavy distortion, glitch art

**Control Actions:**
- **🔒 Freeze**: Lock NFT at current state (irreversible!)
- **⚡ Accelerate**: Fast-forward aging (+20% entropy)
- **🔗 Share Blink**: Share on Twitter with interactive mint button

**Power Calculation:**
```
NFT Power = (100 - entropy) × engine_bonus - age_penalty
- Fresh NFTs: Higher power (80-100)
- Aged NFTs: Lower power (0-50)
- Frozen NFTs: Power locked
```

### 4. Daily Time Capsule

Visit **http://localhost:3000** (Home page)

- New mystery image every 24 hours
- Read the cryptic hint
- Guess keywords to unlock
- Locked content shows noise animation
- Countdown to next capsule

**Example Capsules:**
- 1969 Moon Landing: Hint "not Armstrong, but..."
- 2077 Cyberpunk City: Hint "floating in 2077..."
- Dinosaur Coexistence: Hint "if they never went extinct..."

### 5. Timeline Wars

Visit **http://localhost:3000/timeline-wars**

**Participate in historical battles:**

1. **Choose a faction** (e.g., Steam Revolution vs Bio Genesis)
2. **Join faction** → redirects to generate page with preset style
3. **Generate faction-themed NFT**
4. **Mint NFT** with your wallet
5. **Return to Wars page** and click "Stake NFT"
6. **Confirm staking** (0.01 SOL fee)
7. **Watch real-time battle stats**

**After battle ends:**
- **Winners**: Share SOL prize pool proportionally + "Canonical History" badge
- **Losers**: Get "Paradox Timeline" badge with glitch art effect

**Share your faction:**
- Click "Share Blink" on faction card
- Share on Twitter with stake button
- Others can stake directly from Twitter

---

## ⚙️ Configuration

### Enable Real NFT Minting

Currently in mock mode. To enable real blockchain minting:

1. **Generate backend wallet**
   ```bash
   solana-keygen new --outfile ~/.config/solana/backend-wallet.json
   ```

2. **Get devnet SOL**
   ```bash
   # Get wallet address
   solana-keygen pubkey ~/.config/solana/backend-wallet.json

   # Request airdrop
   solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
   ```

3. **Add to `.env.local`**
   ```bash
   # Get private key array from wallet JSON
   cat ~/.config/solana/backend-wallet.json

   # Add to .env.local
   BACKEND_WALLET_PRIVATE_KEY=[1,2,3,4,...array...]
   ```

4. **Uncomment minting code** in `app/api/mint/route.ts`

### IPFS Configuration

See detailed guide: [QUICK_START_IPFS.md](./QUICK_START_IPFS.md)

**Quick steps:**
1. Get free API key from https://nft.storage
2. Add to `.env.local`: `NFT_STORAGE_KEY=eyJhbGc...`
3. Test: `curl http://localhost:3000/api/ipfs/test`

### Timeline Wars Configuration

For production deployment:

```env
# Wars prize vault address
WARS_VAULT_ADDRESS=TimePicsWarsVault11111111111111111111111

# Base URL for Blinks
NEXT_PUBLIC_BASE_URL=https://timepics.ai
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel deploy --prod
   ```

3. **Add environment variables** in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `NFT_STORAGE_KEY`
   - `BACKEND_WALLET_PRIVATE_KEY` (optional)
   - `NEXT_PUBLIC_SOLANA_NETWORK=devnet` or `mainnet-beta`
   - `SOLANA_RPC_URL`
   - `NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app`

4. **Configure custom domain** (optional)

### Deploy to Other Platforms

- **Netlify**: Use Next.js plugin
- **Railway**: Docker deployment supported
- **AWS/GCP**: Use Docker or Next.js standalone build

---

## 📊 Performance & Metrics

### Image Generation
- ⏱️ **Average Time**: 25-30 seconds
- 📦 **Image Size**: 800KB - 1.5MB
- 🎨 **Quality**: High (JPEG, Base64)
- 🔄 **Success Rate**: ~100% with valid prompts

### IPFS Storage
- 🆓 **Cost**: Free (NFT.Storage)
- ⏱️ **Upload Time**: 5-15 seconds
- 🌐 **Gateway Load**: 1-3 seconds (after propagation)
- ♾️ **Retention**: Permanent

### Blockchain
- ⛓️ **Network**: Solana Devnet (for testing)
- 💰 **Mint Cost**: ~0.1 SOL (devnet), ~0.01 SOL (mainnet)
- ⚡ **Transaction Speed**: 1-3 seconds
- 🔐 **Standard**: Metaplex Token Metadata

---

## 🎯 Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Three time engines (Rewind, Refract, Foresee)
- [x] Real AI image generation (Google Gemini)
- [x] Solana wallet integration
- [x] NFT minting infrastructure
- [x] IPFS storage integration
- [x] Responsive UI with dark theme

### ✅ Phase 2: Gamification (Complete)
- [x] Living NFTs with entropy system
- [x] Freeze and Accelerate mechanics
- [x] Daily Time Capsule puzzle game
- [x] Solana Blinks for social sharing
- [x] NFT detail modals and enhanced gallery

### ✅ Phase 3: Timeline Wars (Complete)
- [x] NFT staking system
- [x] Power calculation algorithm
- [x] Prize pool distribution
- [x] Winner/loser badge system
- [x] Real-time battle statistics
- [x] Faction-themed generation

### 🔄 Phase 4: Polish & Launch (In Progress)
- [ ] Mainnet deployment
- [ ] Smart contract audits
- [ ] Enhanced mobile experience
- [ ] Social features (comments, likes)
- [ ] User profiles and stats
- [ ] Email notifications

### 🔮 Phase 5: Expansion (Planned)
- [ ] Custom LoRA training for eras
- [ ] Video generation (photo-to-video)
- [ ] VR/3D scene generation
- [ ] API marketplace for developers
- [ ] "Today in Timeline B" content series
- [ ] Enterprise integrations (museums, education)
- [ ] Multi-chain support (Ethereum, Base)

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Project overview and architecture
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - MVP completion report
- **[GAMIFICATION_FEATURES.md](./GAMIFICATION_FEATURES.md)** - Living NFTs and Time Capsule details
- **[FEATURE_UPDATES.md](./FEATURE_UPDATES.md)** - Feature changelog and updates
- **[IPFS_IMPLEMENTATION.md](./IPFS_IMPLEMENTATION.md)** - Detailed IPFS integration guide
- **[QUICK_START_IPFS.md](./QUICK_START_IPFS.md)** - 3-minute IPFS setup
- **[PHASE2_PHASE4_IMPLEMENTATION.md](./PHASE2_PHASE4_IMPLEMENTATION.md)** - Blinks and Timeline Wars
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - UI/UX design guidelines

---

## 🧪 Testing

### Manual Testing Checklist

**Image Generation:**
- [ ] All three engines generate images successfully
- [ ] Era styles apply correctly
- [ ] Different aspect ratios work
- [ ] HD quality produces higher resolution

**Living NFTs:**
- [ ] Entropy increases over time
- [ ] Freeze locks NFT state
- [ ] Accelerate increases entropy
- [ ] Visual effects match entropy level
- [ ] State persists after refresh

**Daily Time Capsule:**
- [ ] Correct keywords unlock capsule
- [ ] Wrong keywords trigger shake animation
- [ ] Unlock state persists until next day
- [ ] Countdown timer displays correctly

**Timeline Wars:**
- [ ] Stake NFT transaction creates successfully
- [ ] Power calculation is accurate
- [ ] Battle stats update in real-time
- [ ] Rewards distribute correctly

**Blinks:**
- [ ] NFT Blink URLs generate correctly
- [ ] Wars Blink URLs work on Twitter
- [ ] Copy URL function works
- [ ] Share on Twitter opens correctly

### Automated Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 🤝 Contributing

We welcome contributions! This project is built for the OpenBuild Hackathon.

### How to Contribute

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (TypeScript, ESLint)
- Write clear commit messages
- Update documentation for new features
- Test your changes thoroughly
- Respect the design system in DESIGN_SYSTEM.md

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **NFT Minting**: In mock mode by default (needs backend wallet configuration)
2. **Timeline Wars**: Prize distribution not yet on-chain
3. **Gemini API**: Rate limits on free tier may affect generation speed
4. **IPFS**: First load can be slow (10-30 seconds) due to content propagation

### Reporting Issues

Found a bug? Please open an issue on [GitHub](https://github.com/x2v-co/timepics/issues) with:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

**Open Source Notice**: This project is open source and free to use. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

- **OpenBuild Hackathon** - For the opportunity and inspiration
- **Solana Foundation** - For blockchain infrastructure
- **Google AI** - For Gemini Imagen API
- **NFT.Storage** - For free permanent IPFS storage
- **Metaplex** - For NFT standards and tools
- **shadcn/ui** - For beautiful UI components
- **Vercel** - For hosting and deployment
- **Next.js Team** - For the amazing framework

---

## 📞 Contact & Links

- **GitHub**: [github.com/x2v-co/timepics](https://github.com/x2v-co/timepics)
- **Live Demo**: Coming soon after hackathon
- **Twitter**: Share your creations with #TimePicsAI
- **Discord**: Coming soon

---

## 💡 Tips & Best Practices

### Prompt Engineering
- **Be specific**: "Victorian London street in foggy evening, gas lamps, cobblestones"
- **Add era keywords**: "vintage", "retro", "futuristic", "dystopian"
- **Include mood**: "nostalgic", "optimistic", "ominous"
- **Specify quality**: "highly detailed", "photorealistic", "cinematic"

### NFT Strategy
- **Mint during Fresh state**: Lower entropy = higher power for Wars
- **Freeze strategically**: Lock your favorite moment before decay
- **Accelerate for rarity**: Aged NFTs with Paradox badges are unique
- **Collect across eras**: Diversify your time portfolio

### Timeline Wars
- **Choose engine wisely**: Refract gives +20% power bonus
- **Time your stakes**: Fresh NFTs contribute more power
- **Join early battles**: Earlier stakers get larger rewards if faction wins
- **Don't fear losing**: Paradox badges create unique glitch art collectibles

---

<div align="center">
  <h2>✨ Render Any Moment. Own It Forever. ✨</h2>
  <p><strong>时相机 - 用AI重现时间的每一个瞬间</strong></p>
  <p>Built with ❤️ for OpenBuild Hackathon 2026</p>
</div>

