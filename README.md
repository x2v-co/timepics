# TimePics.ai

<div align="center">
  <h1>🕰️ TimePics.ai - Render Any Moment</h1>
  <p><strong>AI-Powered Visual Time Machine</strong></p>
  <p>Generate images across past, parallel universes, and future timelines. Mint them as Solana NFTs.</p>
</div>

## 🌟 Features

### Three Time Engines

- **⏪ Rewind Engine (回溯引擎)**: Restore and enhance old photos, travel to the past
  - AI Super-Resolution (144p → 4K)
  - Photo Animation
  - Era Style Transfer (1920s, 1980s, etc.)

- **✨ Refract Engine (折射引擎)**: Visualize parallel universes and alternate histories
  - Historical Reconstruction
  - Face Fusion into historical scenes
  - "What-If" Scenarios

- **🔭 Foresee Engine (预见引擎)**: Generate visions of the future
  - Future Visualization
  - Age Progression (30/50/70 years)
  - Trend-based Scene Generation

### NFT Minting on Solana

- Mint generated images as Solana NFTs
- Permanent ownership on blockchain
- View collection in gallery
- Share on Solana Explorer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Solana wallet (Phantom, Solflare, etc.)
- API Keys:
  - Gemini API key (for image generation)
  - NFT.Storage key (for IPFS uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/timepics-ai.git
   cd timepics-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   SOLANA_RPC_URL=https://api.devnet.solana.com
   NFT_STORAGE_KEY=your_nft_storage_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana, Metaplex, @solana/wallet-adapter
- **AI**: Google Gemini API (Imagen 3)
- **Storage**: IPFS/Arweave via NFT.Storage
- **UI**: Framer Motion, Lucide Icons

## 📁 Project Structure

```
timepics-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── generate/     # AI image generation endpoint
│   │   ├── mint/         # NFT minting endpoint
│   │   └── nfts/         # Fetch user NFTs endpoint
│   ├── generate/         # Generation interface page
│   ├── gallery/          # NFT gallery page
│   ├── layout.tsx        # Root layout with wallet provider
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── WalletButton.tsx
│   ├── EngineCard.tsx
│   ├── GenerationForm.tsx
│   ├── ImageDisplay.tsx
│   ├── TimeAnimation.tsx
│   ├── NFTCard.tsx
│   └── MintButton.tsx
├── lib/                  # Utility libraries
│   ├── prompts.ts       # Prompt engineering
│   ├── gemini.ts        # Gemini AI client
│   ├── solana.ts        # Solana utilities
│   ├── metaplex.ts      # NFT minting
│   └── storage.ts       # IPFS/Arweave upload
└── public/              # Static assets
```

## 🎨 Configuration for Production

### 1. Image Generation

The current implementation uses **mock image generation**. To use real AI:

**Option A: Google Gemini (when available)**
- Update `lib/gemini.ts` with Imagen API calls

**Option B: Replicate API (Recommended)**
```bash
npm install replicate
```
```typescript
import Replicate from 'replicate';
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const output = await replicate.run("stability-ai/sdxl:...", { input: { prompt } });
```

**Option C: OpenAI DALL-E 3**
```bash
npm install openai
```

### 2. NFT Minting

To enable real NFT minting:

1. **Generate backend wallet**
   ```bash
   solana-keygen new --outfile ~/.config/solana/backend-wallet.json
   ```

2. **Get devnet SOL**
   ```bash
   solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
   ```

3. **Add to .env.local**
   ```env
   BACKEND_WALLET_PRIVATE_KEY=[1,2,3,...]  # Array from wallet JSON
   ```

4. **Uncomment real minting code** in `app/api/mint/route.ts`

### 3. Deploy to Production

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel deploy
```

Add environment variables in Vercel dashboard.

## 🎯 Roadmap

- [ ] Integrate real AI image generation (Replicate/DALL-E)
- [ ] Enable actual Solana NFT minting
- [ ] Add more era styles and LoRA models
- [ ] Implement user authentication
- [ ] Add social features (like, comment, share)
- [ ] Create "Today in Timeline B" content feed
- [ ] Build API marketplace for developers
- [ ] Support for video generation (Photo-to-video)

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for OpenBuild Hackathon
- Powered by Solana blockchain
- UI inspired by futuristic time travel aesthetics
- Thanks to the Metaplex, Solana, and Next.js communities

## 📞 Contact

- Project Link: [https://github.com/yourusername/timepics-ai](https://github.com/yourusername/timepics-ai)
- Demo: [https://timepics-ai.vercel.app](https://timepics-ai.vercel.app)

---

<div align="center">
  <p><strong>Render Any Moment. Own It Forever.</strong></p>
  <p>时相机 - 用AI重现时间的每一个瞬间</p>
</div>

