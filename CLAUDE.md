# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Vision (Updated for Hackathon Track 3)

**TimePics.ai** is an **AI Agent-driven prediction market** where intelligent agents compete by generating alternate history images. Users bet on which Agent's creative vision will win community votes.

**Core Innovation**: Unlike typical prediction markets (betting on prices/events), we bet on **AI-generated art quality** with **fully verifiable Agent decisions**.

**Hackathon Alignment**: Track 3️⃣ - Agent-Driven Applications
- ✅ Agent vs Agent visual battles (opposition & competition)
- ✅ Prediction market integration (betting on Agent outcomes)
- ✅ 5-10 minute quick battles (short-cycle, high-frequency)
- ✅ Verifiable Agent decisions (IPFS decision logs + hash verification)
- ✅ Zero-barrier participation (Arcade Tokens, no gas fees)

## Quick Start

### Development Commands
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Setup
Required environment variables in `.env.local`:
```bash
GEMINI_API_KEY=your_key_here              # Required: Google Gemini API for AI generation
PINATA_API_KEY=your_key_here              # Recommended: IPFS storage
PINATA_SECRET_KEY=your_key_here           # Recommended: IPFS storage
NEXT_PUBLIC_SOLANA_NETWORK=devnet         # Solana network selection
SOLANA_RPC_URL=https://api.devnet.solana.com
```

See `.env.example` for full configuration options.

## Project Architecture

### Core Tech Stack
- **Framework**: Next.js 14 with App Router (file-based routing in `/app`)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS + shadcn/ui components (`/components/ui`)
- **Blockchain**: Solana (Metaplex NFT standard)
- **AI**: Google Gemini API (Imagen 3)
- **Storage**: IPFS via Pinata

### Three-Engine System

The product revolves around three "time engines" that generate different types of temporal images:

1. **Rewind Engine** (`engine: 'rewind'`): Past/restoration - vintage photos, historical reconstruction
2. **Refract Engine** (`engine: 'refract'`): Alternate history - "what if" scenarios, parallel universes
3. **Foresee Engine** (`engine: 'foresee'`): Future vision - age progression, futuristic scenes

Each engine has distinct prompt enhancement strategies defined in `lib/prompts.ts`.

**🆕 Agent System Integration**: In the updated architecture, **AI Agents** autonomously select which engine to use based on battle context and strategy. Users transition from "creators" to "spectators/bettors" while Agents become the primary "fighters".

### AI Agent Battle System (Core Architecture)

**Philosophy**: Transform from "User PvP" to "Agent vs Agent + Human Prediction Market"

```
Traditional Flow (Before):
User → Generate Image → Mint NFT → Stake in Battle → Vote → Settle

Agent-Driven Flow (After):
Agent A vs Agent B → Auto-generate images → Real-time battle
    ↓
Users → Watch live → Vote → Bet Arcade Tokens → Win/Lose
    ↓ (Advanced)
Configure own Agent → Deploy to arena → Earn rewards
```

#### Timeline Agent Class (`lib/agents/TimelineAgent.ts`)

**Core Interface**:

```typescript
interface TimelineAgent {
  id: string;
  name: string;                    // e.g., "Historian-7B", "Prophet-X"
  personality: AgentPersonality;   // Determines decision style
  strategy: AgentStrategy;         // Adaptable strategy state
  memory: AgentMemory;             // Context from previous rounds

  // Core autonomous capability
  generateForRound(context: RoundContext): Promise<AgentOutput>;
  analyzeOpponent(images: string[]): Analysis;
  adaptStrategy(feedback: VoteFeedback): void;
}

interface AgentPersonality {
  type: 'historian' | 'futurist' | 'provocateur' | 'realist' | 'dreamer';
  preferredEngine: 'rewind' | 'refract' | 'foresee';
  riskTolerance: number;      // 0-1, affects controversial choices
  creativityBias: number;     // 0-1, affects prompt novelty
}
```

**Agent Decision Loop (Each Round)**:

```
1. Perceive
   ├── Analyze opponent's last image (visual + metadata)
   ├── Check vote distribution (what resonates with audience)
   └── Assess current winning odds

2. Decide (using LLM for chain-of-thought)
   ├── Select Time Engine (rewind/refract/foresee)
   ├── Construct prompt (via enhancePrompt())
   ├── Choose narrative angle
   └── Log reasoning to IPFS (verifiable!)

3. Act
   ├── Call /api/generate with constructed prompt
   ├── Publish image to battle arena
   └── Broadcast narrative text

4. Learn
   ├── Collect vote feedback
   ├── Update strategy weights
   └── Adapt for next round
```

**Key Implementation Files**:
- `lib/agents/TimelineAgent.ts` - Core Agent class
- `lib/agents/personality.ts` - Personality profiles (5 preset types)
- `lib/agents/strategy.ts` - Strategy adaptation logic
- `lib/agents/decisionLogger.ts` - Verifiable decision logging
- `lib/agents/BattleController.ts` - Orchestrates multi-round battles

#### Quick Battle System (5-10 Minutes)

**Battle Types**:
1. **Quick Battle** (5-10 min): 3-5 rounds, 60-120 sec per round - **Hackathon focus**
2. **Epic Battle** (24h-7d): Continuous generation, original Timeline Wars format - **Preserved**

**Quick Battle Flow**:

```typescript
interface QuickBattle {
  id: string;
  topic: string;              // "What if Napoleon won Waterloo?"
  agents: [TimelineAgent, TimelineAgent];
  rounds: number;             // 3-5 rounds
  roundDuration: number;      // 60-120 seconds per round

  // Round structure
  roundPhases: {
    agentGeneration: 30;      // Both agents generate simultaneously
    reveal: 10;               // Show both images
    voting: 50;               // Users vote
    scoring: 10;              // Calculate round winner
  };

  // State
  currentRound: number;
  scoreboard: {
    agentA: { roundScores: number[], totalPower: number };
    agentB: { roundScores: number[], totalPower: number };
  };
}
```

**Round Progression**:

```
Round 1 (90s)           Round 2 (90s)           Round 3 (90s)
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│ Agents gen  │   →    │ Agents gen  │   →    │ Agents gen  │
│ Reveal both │        │ (adapted)   │        │ (final push)│
│ Users vote  │        │ Reveal+vote │        │ Reveal+vote │
└─────────────┘        └─────────────┘        └─────────────┘
       ↓                      ↓                       ↓
   Agent B wins          Agent A adapts         Agent A wins
```

After each round, losing Agent analyzes feedback and adjusts strategy for next round.

#### Verifiable Decision System

**Critical for Track 3**: Every Agent decision must be auditable to prevent cheating and build trust.

```typescript
interface VerifiableDecision {
  battleId: string;
  agentId: string;
  round: number;
  timestamp: number;

  // Complete decision chain
  inputs: {
    opponentLastImage: string;      // IPFS CID
    voteDistribution: number[];     // [agentA_votes, agentB_votes]
    currentOdds: number;
    roundNumber: number;
  };

  reasoning: string;                // Full LLM chain-of-thought

  outputs: {
    selectedEngine: 'rewind' | 'refract' | 'foresee';
    generatedPrompt: string;
    narrativeText: string;
    strategyAdjustment: string;
  };

  // Verification
  ipfsCid: string;                  // Decision log on IPFS
  contentHash: string;              // SHA-256 for verification
}
```

**Verification Flow**:

```
Agent decides → Serialize to JSON → Upload to IPFS → Get CID
                                         ↓
                                  Calculate SHA-256 hash
                                         ↓
                            (Optional) Submit hash on-chain
                                         ↓
                  Anyone can: Download IPFS → Verify hash matches
                              → Audit Agent's reasoning
```

**Implementation**: `lib/verification/decisionLogger.ts`

#### Arcade Token System (Gas-Free Participation)

**Problem Solved**: Requiring wallet connection + SOL for every interaction creates massive friction.

**Solution**: Off-chain "Arcade Tokens" for casual participation.

```typescript
interface ArcadeTokenSystem {
  // Earning (all gas-free)
  earning: {
    dailyLogin: 100,          // Daily login bonus
    watchBattle: 10,          // Watch full battle
    vote: 5,                  // Each vote
    shareOnSocial: 50,        // Share to Twitter
    referFriend: 200,         // Successful referral
  };

  // Spending
  spending: {
    betOnBattle: 10-1000,     // Prediction betting
    extraVotes: 20,           // Buy additional votes
    boostAgent: 50,           // Temporary Agent buff
    createBattle: 500,        // Create custom battle (Pro)
  };

  // Conversion (optional)
  exchange: {
    arcadeToSOL: '10000:1',   // Batch convert to on-chain
    SOLtoArcade: '1:10000',
  };
}
```

**Storage**: localStorage for MVP (user_id → balance), PostgreSQL for production.

**User Participation Layers**:

```
Layer 0 (Zero-barrier): Free spectator + free votes (Arcade Tokens)
Layer 1 (Light engagement): Bet Arcade Tokens on outcomes
Layer 2 (Blockchain entry): Bet SOL, mint NFTs from Agent images
Layer 3 (Advanced): Configure & deploy own Agents to arena
```

#### Prediction Market Integration

**Betting Mechanics** (inspired by Polymarket):

```typescript
interface BettingPool {
  battleId: string;

  // Pools
  totalBetsOnA: number;       // Total Arcade Tokens on Agent A
  totalBetsOnB: number;       // Total Arcade Tokens on Agent B

  // Dynamic odds (updates in real-time)
  odds: {
    agentA: number;           // e.g., 1.8x
    agentB: number;           // e.g., 2.2x
    lastUpdated: Date;
  };

  // User bets
  bets: Bet[];
}

interface Bet {
  userId: string;
  faction: 'A' | 'B';
  amount: number;             // Arcade Tokens or SOL
  placedAt: Date;
  lockedOdds: number;         // Odds at time of bet
  payout?: number;            // Calculated after settlement
}
```

**Odds Calculation** (`lib/betting/oddsEngine.ts`):

```typescript
// Simple model: odds inversely proportional to bet distribution
function calculateOdds(betsOnA: number, betsOnB: number) {
  const total = betsOnA + betsOnB;
  return {
    oddsA: Math.max(1.01, total / betsOnA),
    oddsB: Math.max(1.01, total / betsOnB)
  };
}
```

As more users bet on Agent A, odds on A decrease (less payout) and odds on B increase (more payout for contrarians).

### Prompt Engineering System (`lib/prompts.ts`)

**Critical architecture pattern**: User prompts are automatically enhanced through a sophisticated system:

```typescript
// User enters: "family photo"
// System generates: "[engine_prefix] family photo [era_style] [quality_modifiers] [engine_suffix]"
```

**Key functions**:
- `enhancePrompt()`: Combines user input with engine-specific prefixes/suffixes, era styles, and quality modifiers
- `ENGINE_PROMPTS`: Engine-specific enhancements (rewind = "vintage photograph", refract = "alternate history", etc.)
- `ERA_STYLES`: Period-specific aesthetic modifiers (1900s, 1920s, 1950s, 1980s, 2000s, 2050s)
- `validatePrompt()`: Content filtering and length validation

When working on generation features, always use `enhancePrompt()` rather than sending raw user input to the AI.

### NFT State Management (`lib/nftState.ts`)

**Important**: NFT entropy and lock states are tracked **client-side in localStorage**, not on-chain.

```typescript
interface NFTState {
  id: string;
  entropy: number;        // 0-100, increases over time
  locked: boolean;        // Freeze prevents further entropy
  lastUpdate: string;
  frozenAt?: string;
  frozenEntropy?: number;
}
```

**Key functions**:
- `calculateEntropy()`: 2% entropy per day since mint (formula: `min(100, daysSinceMint * 2)`)
- `freezeNFT()`: Locks NFT at current entropy (irreversible in UI)
- `accelerateNFT()`: Manually increases entropy (+20% default)
- `getNFTEntropy()`: Returns current entropy considering time decay + manual adjustments

**Entropy Effects on UI**:
- 0-19%: Fresh (no visual effects, full power)
- 20-49%: Aging (slight desaturation)
- 50-79%: Decayed (grain, color shift)
- 80-100%: Ancient (heavy distortion, glitch art)

Visual effects are applied in `components/EnhancedNFTCard.tsx` using CSS filters and overlays.

### Timeline Wars System (`lib/wars.ts`)

Community-driven battles where users stake NFTs on competing factions:

**Power Calculation** (`calculateNFTPower()`):
```typescript
power = (100 - entropy) * engine_bonus - age_penalty
// Refract: +20% bonus
// Rewind: +10% bonus
// Foresee: +5% bonus
```

**Key concepts**:
- Each battle has two factions (TimelineEvent with factionA/factionB)
- Users stake NFTs to contribute power to their chosen faction
- Winner determined by total faction power (sum of all staked NFT powers)
- Prize pool distributed proportionally by power contribution

**Mock Implementation**: Prize distribution is currently simulated. For production, this requires Solana smart contracts.

### API Routes Architecture (`/app/api`)

**Image Generation Flow**:
1. `POST /api/generate` - Generates AI image with Gemini API
   - Validates engine, prompt, era
   - Calls `enhancePrompt()` for prompt engineering
   - Returns base64 image data
2. `POST /api/generate-ipfs` - Generate + automatic IPFS upload (one-step minting prep)

**NFT Minting Flow**:
1. `POST /api/mint` - Mints NFT to user's wallet
   - **Currently MOCK implementation** (see line 53 of `app/api/mint/route.ts`)
   - For production: Uncomment lines 74-115 and configure backend wallet
   - Requires: `BACKEND_WALLET_PRIVATE_KEY` in env

**NFT Management**:
- `POST /api/nfts/freeze` - Locks NFT entropy (updates localStorage)
- `POST /api/nfts/accelerate` - Increases NFT entropy (updates localStorage)
- `GET /api/nfts` - Fetches user's NFTs (queries Solana)

**Timeline Wars**:
- `POST /api/wars/stake` - Stakes NFT in battle
- Blinks API: `/api/blinks/wars/[eventId]/[factionId]` - Solana Actions for social sharing

### Mock vs Real Implementations

**⚠️ Important for development**: Several features are partially mocked for hackathon:

1. **AI Image Generation** (`lib/gemini.ts:78`):
   - Throws error by design - actual implementation uses `@google/genai` SDK in `app/api/generate/route.ts`
   - Real implementation: Lines 52-110 of `/app/api/generate/route.ts` use Google GenAI SDK

2. **NFT Minting** (`app/api/mint/route.ts:53`):
   - Lines 53-71: Mock implementation (returns fake mint address)
   - Lines 74-115 (commented): Real implementation with Metaplex
   - To enable: Uncomment real implementation + set `BACKEND_WALLET_PRIVATE_KEY`

3. **Timeline Wars Prize Distribution**:
   - Currently calculated and displayed but not distributed on-chain
   - For production: Requires Solana program deployment

## Key Pages and Components

### Main Pages (`/app`)
- `/` (page.tsx) - Home with Daily Time Capsule
- `/generate` - Image generation interface with three engine cards
- `/gallery` - NFT gallery with Living NFTs (entropy visualization)
- `/timeline-wars` - Battle interface with staking and voting
- `/ipfs-test` - IPFS integration testing page

### Critical Components
- `WalletProvider.tsx` - Solana wallet connection context (wraps entire app)
- `GenerationForm.tsx` - Handles user input for image generation
- `EnhancedNFTCard.tsx` - Displays NFT with entropy visual effects
- `TimeCapsule.tsx` - Daily puzzle game with unlock mechanism
- `BlinkShareButton.tsx` - Generates Solana Blinks URLs for social sharing

### UI Component Library
All UI components in `/components/ui` are from shadcn/ui. To add new components:
```bash
npx shadcn@latest add [component-name]
```

## Data Flow Patterns

### 🆕 Agent Battle Flow (Core - Hackathon Focus)

```
Battle Start
  → BattleController creates QuickBattle (3 rounds)
  → Initialize Agent A and Agent B with personalities

For each round (1-3):
  ┌─ Round Start ─┐
  │               │
  ├─ Agent A Decision Loop:
  │  1. analyzeOpponent(previous_images)
  │  2. makeDecision() → calls Gemini for chain-of-thought
  │  3. selectEngine() → 'rewind' | 'refract' | 'foresee'
  │  4. buildPrompt() → uses enhancePrompt()
  │  5. logDecision() → upload to IPFS, get CID
  │
  ├─ Agent B (parallel to A):
  │  (same steps as Agent A)
  │
  ├─ Image Generation:
  │  Both agents: POST /api/generate
  │  → Gemini generates images (30 seconds)
  │  → Images returned as base64
  │
  ├─ Reveal Phase (10 seconds):
  │  Broadcast both images to spectators
  │  Show narratives and decision log links
  │
  ├─ Voting Phase (50 seconds):
  │  Users: POST /api/battles/[id]/vote
  │  Real-time vote count updates
  │  Optional: Place bets with Arcade Tokens
  │
  └─ Scoring Phase (10 seconds):
     Calculate round winner
     Agents receive vote feedback
     Agents update strategy for next round

Battle End
  → Determine overall winner (best of 3 rounds)
  → Settle bets: payouts = bet × locked_odds
  → Distribute Arcade Token rewards
  → Save battle history to database
```

### 🆕 Betting Flow

```
User views battle
  → GET /api/battles/[id] (includes current odds)
  → User decides to bet 100 Arcade Tokens on Agent A
  → POST /api/betting/place
     {
       battleId: "battle-123",
       faction: "A",
       amount: 100,
       currency: "arcade"
     }
  → Lock odds at bet time (e.g., 1.8x)
  → Deduct 100 tokens from user balance
  → Store bet record

Battle ends, Agent A wins
  → POST /api/betting/settle
  → Calculate payout: 100 × 1.8 = 180 tokens
  → Credit user account +180 tokens
  → User net profit: +80 tokens
```

### 🆕 Agent Decision Verification Flow

```
Agent makes decision
  → Serialize decision object to JSON
  → Upload to IPFS via Pinata API
  → Receive IPFS CID (e.g., "Qm...")
  → Calculate SHA-256 hash of JSON
  → Store { battleId, round, agentId, ipfsCid, hash }

User clicks "Audit Decision"
  → Fetch decision from IPFS using CID
  → Recalculate SHA-256 hash locally
  → Compare with stored hash
  → Display: ✅ Verified or ❌ Tampered
  → Show full reasoning + inputs/outputs
```

### Image Generation → NFT Minting (Preserved)
```
User Input (prompt, engine, era)
  → enhancePrompt() [lib/prompts.ts]
  → POST /api/generate [uses Google GenAI SDK]
  → Base64 image returned to client
  → User clicks "Mint as NFT"
  → uploadImageToIPFS() [lib/storage.ts]
  → POST /api/mint [Metaplex minting]
  → NFT mint address returned
  → Initialize NFT state in localStorage [lib/nftState.ts]
```

### Living NFT Entropy Update
```
NFT card renders
  → getNFTEntropy(nftId, mintDate) [lib/nftState.ts]
  → Calculates: time-based decay + manual adjustments
  → Returns current entropy (0-100)
  → Component applies visual effects via CSS
  → User can freeze or accelerate
  → Updates persisted to localStorage
```

### Timeline Wars Staking
```
User selects faction
  → Generates faction-themed image (engine + era match faction)
  → Mints as NFT
  → POST /api/wars/stake with NFT mint address
  → calculateNFTPower() determines contribution
  → Updates faction totalPower
  → Battle resolves when endDate reached
```

## Testing and Debugging

### Test IPFS Integration
```bash
# Start dev server
npm run dev

# Visit test page
open http://localhost:3000/ipfs-test

# Or API test
curl http://localhost:3000/api/ipfs/test
```

### Test Image Generation
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "rewind",
    "prompt": "vintage family photo",
    "era": "1950s",
    "aspectRatio": "1:1",
    "quality": "standard"
  }'
```

### Solana Network Testing
- Development uses **devnet** by default
- Get devnet SOL: `solana airdrop 2 <ADDRESS> --url devnet`
- Explorer: https://explorer.solana.com/?cluster=devnet

### 🆕 Test Agent Battle (MVP)

```bash
# Start a quick battle (API endpoint to create)
curl -X POST http://localhost:3000/api/battles/start \
  -H "Content-Type: application/json" \
  -d '{
    "type": "quick",
    "topic": "What if Rome never fell?",
    "agentA": "historian-7b",
    "agentB": "futurist-x",
    "rounds": 3
  }'

# Response: { battleId: "battle-123", status: "active" }

# Watch battle status
curl http://localhost:3000/api/battles/battle-123

# Vote for Agent A in round 1
curl -X POST http://localhost:3000/api/battles/battle-123/vote \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "round": 1,
    "faction": "A"
  }'

# Place bet
curl -X POST http://localhost:3000/api/betting/place \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "battleId": "battle-123",
    "faction": "A",
    "amount": 100,
    "currency": "arcade"
  }'
```

## Common Development Tasks

### 🆕 Creating a New Agent Personality

```typescript
// lib/agents/personality.ts

export const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  // ... existing personalities

  'provocateur': {  // Add new personality
    type: 'provocateur',
    preferredEngine: 'refract',      // Likes alternate history
    riskTolerance: 0.9,              // Very risk-tolerant
    creativityBias: 0.85,            // Highly creative
    voterAppealFocus: 0.3,           // Doesn't pander to voters
    description: 'Generates controversial, thought-provoking images'
  }
};

// Then create an Agent instance in BattleController.ts
const agent = new TimelineAgent({
  id: 'provocateur-1',
  name: 'Provocateur Prime',
  personality: AGENT_PERSONALITIES.provocateur
});
```

### 🆕 Adding a New Round Phase

```typescript
// lib/agents/BattleController.ts

// Current phases:
// agentGeneration (30s), reveal (10s), voting (50s), scoring (10s)

// To add "analysis" phase (agents discuss their strategies):
async runRound(round: number) {
  await this.agentGenerationPhase(30);
  await this.revealPhase(10);
  await this.analysisPhase(15);  // 🆕 New phase
  await this.votingPhase(50);
  await this.scoringPhase(10);
}

async analysisPhase(duration: number) {
  const analysisA = await this.agentA.explainStrategy();
  const analysisB = await this.agentB.explainStrategy();

  this.broadcast('agent:analysis', {
    agentA: analysisA,
    agentB: analysisB
  });

  await this.sleep(duration * 1000);
}
```

### 🆕 Modifying Odds Calculation

```typescript
// lib/betting/oddsEngine.ts

// Current: Simple inverse proportion
export function calculateOdds(betsOnA: number, betsOnB: number) {
  const total = betsOnA + betsOnB;
  return {
    oddsA: Math.max(1.01, total / betsOnA),
    oddsB: Math.max(1.01, total / betsOnB)
  };
}

// Enhanced: Add house edge
export function calculateOddsWithEdge(
  betsOnA: number,
  betsOnB: number,
  houseEdge = 0.05  // 5% platform fee
) {
  const total = betsOnA + betsOnB;
  const adjustedTotal = total * (1 - houseEdge);

  return {
    oddsA: Math.max(1.01, adjustedTotal / betsOnA),
    oddsB: Math.max(1.01, adjustedTotal / betsOnB),
    platformFee: total * houseEdge
  };
}
```

## Common Development Tasks (Original)

### Adding a New Time Era
1. Add era to `Era` type in `lib/prompts.ts:7`
2. Add style definition to `ERA_STYLES` object
3. Update form options in `components/GenerationForm.tsx`

### Adding a New Engine
1. Add engine to `Engine` type in `lib/prompts.ts:6`
2. Define enhancement in `ENGINE_PROMPTS` object
3. Add power bonus to `calculateNFTPower()` in `lib/wars.ts`
4. Create engine card in generate page

### Modifying Entropy Calculation
Edit `calculateEntropy()` in `lib/nftState.ts:96`. Current formula:
```typescript
// 2% per day: entropy = min(100, daysSinceMint * 2)
const calculatedEntropy = Math.min(100, daysSince * 2);
```

### Enabling Real NFT Minting
1. Generate backend wallet: `solana-keygen new --outfile backend-wallet.json`
2. Get devnet SOL: `solana airdrop 2 $(solana-keygen pubkey backend-wallet.json) --url devnet`
3. Extract private key from JSON: `cat backend-wallet.json`
4. Add to `.env.local`: `BACKEND_WALLET_PRIVATE_KEY=[1,2,3,...]`
5. Uncomment lines 74-115 in `app/api/mint/route.ts`
6. Comment out mock implementation (lines 53-71)

## Important Technical Notes

- **LocalStorage Persistence**: NFT entropy states are browser-specific. Users lose state if they clear browser data or switch devices. For production, consider on-chain storage or backend database.
- **Gemini API Rate Limits**: Free tier has rate limits. Generation failures should be handled gracefully in UI.
- **IPFS Upload Times**: First load can take 10-30 seconds for content propagation. Show appropriate loading states.
- **Wallet Connection**: Always check wallet connection state before blockchain operations. Use `useWallet()` hook from `@solana/wallet-adapter-react`.
- **Type Safety**: All API responses should match TypeScript interfaces. Check types in `lib/*.ts` files.

## Deployment Considerations

### Environment Variables for Production
```bash
GEMINI_API_KEY=<production_key>
PINATA_API_KEY=<production_key>
PINATA_SECRET_KEY=<production_secret>
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=<helius_or_quicknode_url>  # Use paid RPC for reliability
BACKEND_WALLET_PRIVATE_KEY=[...]
NEXT_PUBLIC_BASE_URL=https://your-domain.com  # For Blinks URLs
```

### Pre-deployment Checklist
- [ ] Switch from mock to real NFT minting
- [ ] Test with mainnet-beta Solana network
- [ ] Verify IPFS uploads are permanent (pinned)
- [ ] Test wallet connection with multiple wallet providers
- [ ] Verify Blinks URLs are publicly accessible
- [ ] Add error tracking (e.g., Sentry)
- [ ] Set up monitoring for API rate limits

---

## 🏆 Hackathon Demo Guide (Track 3)

### Demo Flow (2-Minute Pitch)

**Hook (15 sec)**:
> "Most prediction markets bet on prices or events. We bet on **AI-generated art**. Watch two AI Agents battle by generating competing visions of alternate history, then predict which one will win community votes."

**Live Demo (90 sec)**:

1. **Open Arena** (`/arena`)
   - "Here's an active battle: 'What if Tesla won the Current War?'"
   - Show two agents: "DC Power Prophet" vs "AC Power Historian"

2. **Click Battle** (`/arena/battle-123`)
   - "We're in Round 2 of 3. Each round is 90 seconds."
   - Show both agents' images side-by-side
   - "Agent A generated a steampunk DC-powered city. Agent B generated a modern AC grid."

3. **Show Real-time Updates**
   - "Votes are coming in: 67 for Agent A, 89 for Agent B"
   - "Current odds: 1.5x on A, 2.1x on B"

4. **Place Bet**
   - "I'll bet 50 Arcade Tokens on Agent A at 1.5x odds"
   - Show betting interface
   - "No wallet needed, no gas fees"

5. **Show Decision Log**
   - Click "Audit Agent Decision"
   - "Here's Agent A's full reasoning, stored on IPFS with verified hash"
   - Display chain-of-thought: "I chose 'refract' engine because..."

6. **Round Resolution**
   - "Round 2 ends. Agent B wins this round."
   - "But look - Agent A is adapting its strategy for Round 3"
   - Show strategy change notification

7. **Final Settlement**
   - "Battle ends. Agent B wins 2-1."
   - "I lost my 50 tokens, but early bettors on B made 2x returns"
   - Show payout calculations

**Closing (15 sec)**:
> "This hits every Track 3 requirement: Agent competition, prediction markets, 10-minute rounds, verifiable decisions, and zero gas for casual users. Plus, every battle creates shareable visual content."

### Track 3 Alignment Proof

| Requirement | Our Implementation | Evidence in Code |
|-------------|-------------------|------------------|
| **Agent 对抗/竞争** | Agent vs Agent battles | `lib/agents/BattleController.ts` |
| **预测市场 + Agent** | Bet on Agent outcomes | `lib/betting/bettingPool.ts` |
| **短周期 5-10分钟** | 3-round quick battles | `QuickBattle.roundDuration = 90` |
| **可验证决策** | IPFS logs + hash | `lib/verification/decisionLogger.ts` |
| **低门槛免Gas** | Arcade Tokens | `lib/arcade/tokenManager.ts` |
| **智能体自主性** | LLM-based decisions | `TimelineAgent.makeDecision()` |

### Demo Backup (If Live Demo Fails)

Prepare **screen recording** showing:
1. Full 3-round battle from start to finish
2. Multiple users betting simultaneously
3. Agent decision log audit
4. Payout distribution

### Key Talking Points

**"Why is this novel?"**
- First prediction market for **AI creativity** (not prices/events)
- **Visual content** as the betting asset (shareable, viral)
- **Verifiable AI** - full transparency into Agent reasoning

**"Why does this matter?"**
- Solves discoverability for AI art (best content rises via community curation)
- Creates economic incentive for quality (bet on quality = curate quality)
- Demonstrates practical Agent-driven app beyond trading bots

**"What's the business model?"**
- Platform fee on Arcade Token → SOL conversions (5%)
- Premium Agent customization ($10-20/month)
- Branded battles for sponsors (e.g., "Nike Presents: Fashion Future War")

### MVP Feature Priority for Demo

**Must Work (P0)**:
✅ Start a battle (manually via API is fine)
✅ Both Agents generate images (3 rounds)
✅ Display images + narratives side-by-side
✅ Users can vote (simple button click)
✅ Show vote tallies updating
✅ Determine winner after 3 rounds
✅ Show Arcade Token balance changing

**Should Work (P1)**:
✅ Real-time odds display
✅ Betting interface with payout calculator
✅ Decision log on IPFS (with CID link)
✅ Agent strategy adaptation visible between rounds

**Nice to Have (P2)**:
- WebSocket live updates (use polling if time-pressed)
- Multiple concurrent battles
- User profile / betting history
- SOL betting (stick to Arcade Tokens for MVP)

### Technical Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits during demo | Pre-generate images, use mock responses |
| IPFS upload too slow (30s+) | Store decision logs locally, show "uploading..." |
| WebSocket infrastructure complex | Use HTTP polling (3-second intervals) |
| Agent decision quality poor | Hard-code first few decisions, then switch to LLM |
| Users confused by Arcade Tokens | Clear onboarding tooltip: "Free tokens = no wallet needed" |

### Post-Demo Q&A Prep

**Q: "Can users create their own Agents?"**
A: "Phase 2 feature. For MVP, we have 5 preset Agent personalities. Advanced users will be able to tune parameters like risk tolerance and engine preference."

**Q: "How do you prevent vote manipulation?"**
A: "Three layers: (1) Arcade Tokens earned gradually, not infinite. (2) Vote weight decreases for Sybil-like patterns. (3) Large bets from 'smart money' matter more than raw vote counts."

**Q: "Why not put Arcade Tokens on-chain?"**
A: "Gas-free onboarding. New users earn 100 tokens instantly and can participate without wallet. They can later convert to SOL 10000:1 if they want on-chain custody."

**Q: "How do Agents 'learn'?"**
A: "After each round, Agent receives vote feedback (which images resonated). It uses Gemini's LLM to reason about strategy adjustments. All reasoning is logged to IPFS for transparency."

**Q: "What prevents the platform from cheating?"**
A: "Every Agent decision is hashed and stored on IPFS with timestamp. Anyone can download the decision log and verify the hash matches. We can't retroactively change Agent's reasoning."

---

## 📚 Additional Documentation

For detailed adaptation analysis, see:
- **[TRACK3_ADAPTATION.md](./TRACK3_ADAPTATION.md)** - Full analysis of codebase compatibility and implementation plan
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Original MVP completion report
- **[GAMIFICATION_FEATURES.md](./GAMIFICATION_FEATURES.md)** - Living NFTs and engagement mechanics

---

**Last Updated**: Adapted for Hackathon Track 3 - Agent-Driven Applications
**Core Philosophy**: Agents as fighters, humans as spectators/bettors, creativity as the betting asset

