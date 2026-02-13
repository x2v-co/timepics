# Track 3 Adaptation Analysis - TimePics.ai

## 📊 Compatibility Analysis

### ✅ Fully Reusable (No Changes Required)

| Component | Path | Usage in New Architecture |
|-----------|------|---------------------------|
| **Three Time Engines** | `lib/prompts.ts` | Agents use these engines to generate images |
| **Prompt Enhancement** | `lib/prompts.ts` | Agent's auto-prompt builder uses this |
| **Living NFTs System** | `lib/nftState.ts` | Agent-generated NFTs still evolve with entropy |
| **IPFS Storage** | `lib/storage.ts` | Store Agent decision logs + NFT metadata |
| **Gemini Integration** | `app/api/generate/route.ts` | Agents call this API for image generation |
| **Solana Connection** | `lib/solana.ts` | Used for on-chain settlements |
| **Daily Time Capsule** | `components/TimeCapsule.tsx` | Arcade Token earning mechanism |
| **Blinks** | `lib/blinks.ts` | Share Agent battles on Twitter |

### 🔄 Requires Refactoring

| Component | Current State | Required Changes |
|-----------|---------------|------------------|
| **Timeline Wars** | User PvP staking | → Agent vs Agent + user betting |
| `lib/wars.ts` | User-centric logic | Add Agent fields, betting pools, odds |
| `app/timeline-wars/page.tsx` | User staking UI | → Spectator UI with live Agent battle |
| `app/api/wars/stake/route.ts` | NFT staking | → Keep + Add betting/voting APIs |

**Specific Changes for `lib/wars.ts`:**

```typescript
// BEFORE
interface Faction {
  id: string;
  name: string;
  // ... user-focused fields
}

// AFTER (add these fields)
interface Faction {
  id: string;
  name: string;
  agent: TimelineAgent;        // 🆕 The AI fighter
  agentDecisions: string[];    // 🆕 IPFS CIDs of decisions
  currentStrategy: string;     // 🆕 Current strategy state
  // ... keep existing fields
}

interface TimelineEvent {
  // ... existing fields
  battleType: 'quick' | 'epic'; // 🆕 5-10min vs 24h-7d
  rounds?: Round[];              // 🆕 For quick battles
  bettingPool: BettingPool;     // 🆕 Prediction market
  currentOdds: Odds;            // 🆕 Real-time odds
}
```

### 🆕 New Modules to Create

#### 1. Agent System (`lib/agents/`)

```
lib/agents/
├── TimelineAgent.ts          # Core Agent class
├── personality.ts            # Personality profiles
├── strategy.ts               # Strategy adaptation engine
├── promptBuilder.ts          # Auto prompt construction
├── opponentAnalyzer.ts       # Analyze opponent's images
└── decisionLogger.ts         # Verifiable decision logs
```

**Core Agent Class (MVP)**:

```typescript
// lib/agents/TimelineAgent.ts
export class TimelineAgent {
  id: string;
  name: string;
  personality: AgentPersonality;
  strategy: AgentStrategy;
  memory: AgentMemory; // Past rounds context

  async generateForRound(context: RoundContext): Promise<AgentOutput> {
    // 1. Analyze opponent's last image
    const analysis = this.analyzeOpponent(context.opponentLastImage);

    // 2. Decide strategy using LLM
    const decision = await this.makeDecision(analysis, context);

    // 3. Generate image
    const image = await this.generateImage(decision.prompt);

    // 4. Log decision (for verification)
    const logCid = await this.logDecision(decision);

    return { image, narrative: decision.narrative, logCid };
  }

  private async makeDecision(
    analysis: Analysis,
    context: RoundContext
  ): Promise<Decision> {
    const systemPrompt = `You are ${this.name}, a Timeline Agent with personality: ${this.personality.type}.
Your goal is to generate compelling alternate history images that will win votes.

Battle topic: "${context.battleTopic}"
Your faction: "${context.factionName}"
Round: ${context.round}/${context.totalRounds}

Last round analysis:
- Your votes: ${analysis.myVotes}
- Opponent votes: ${analysis.opponentVotes}
- Opponent's style: ${analysis.opponentStyle}

Your personality traits:
- Risk tolerance: ${this.personality.riskTolerance}/10
- Creativity: ${this.personality.creativityBias}/10
- Engine preference: ${this.personality.preferredEngine}

Based on this context, decide:
1. Which Time Engine to use? (rewind/refract/foresee)
2. What prompt will generate a winning image?
3. What narrative angle to take?
4. Explain your reasoning in detail.

Respond in JSON format.`;

    const response = await callGeminiText(systemPrompt);
    return parseDecision(response);
  }
}
```

#### 2. Betting System (`lib/betting/`)

```
lib/betting/
├── oddsEngine.ts           # Dynamic odds calculation
├── bettingPool.ts          # Pool management
└── settlement.ts           # Reward distribution
```

**Simple Odds Calculation**:

```typescript
// lib/betting/oddsEngine.ts
export function calculateOdds(
  betsOnA: number,
  betsOnB: number
): { oddsA: number; oddsB: number } {
  const total = betsOnA + betsOnB;
  if (total === 0) return { oddsA: 2.0, oddsB: 2.0 };

  // Odds = total pool / faction pool
  const oddsA = Math.max(1.01, total / betsOnA);
  const oddsB = Math.max(1.01, total / betsOnB);

  return { oddsA, oddsB };
}

export function calculatePayout(
  betAmount: number,
  oddsAtBet: number,
  won: boolean
): number {
  if (!won) return 0;
  return betAmount * oddsAtBet;
}
```

#### 3. Arcade Token (`lib/arcade/`)

```
lib/arcade/
├── tokenManager.ts         # Balance management
└── rewards.ts              # Earning mechanisms
```

**Simple Database Schema** (use existing localStorage or add SQLite):

```typescript
// lib/arcade/tokenManager.ts
interface ArcadeBalance {
  userId: string;
  balance: number;
  earned: number;
  spent: number;
  lastDailyLogin: string;
}

export function earnTokens(
  userId: string,
  amount: number,
  reason: string
): ArcadeBalance {
  // Update balance in database/localStorage
  // Log transaction
  return updatedBalance;
}

export function spendTokens(
  userId: string,
  amount: number,
  reason: string
): boolean {
  // Check balance, deduct if sufficient
  return success;
}

// Earning mechanisms
export const ARCADE_EARNINGS = {
  DAILY_LOGIN: 100,
  WATCH_BATTLE: 10,
  VOTE: 5,
  SHARE_SOCIAL: 50,
  REFER_FRIEND: 200,
  WIN_BET_BONUS: 20, // Bonus on top of bet returns
};
```

#### 4. Verification System (`lib/verification/`)

```
lib/verification/
├── decisionLogger.ts       # Log to IPFS
└── hashVerifier.ts         # Verify hashes
```

**Decision Logging**:

```typescript
// lib/verification/decisionLogger.ts
export interface VerifiableDecision {
  battleId: string;
  agentId: string;
  round: number;
  timestamp: number;

  inputs: {
    opponentLastImage: string; // IPFS CID
    voteDistribution: number[];
    currentOdds: number;
  };

  reasoning: string; // Full LLM chain-of-thought

  outputs: {
    selectedEngine: string;
    generatedPrompt: string;
    narrativeText: string;
  };
}

export async function logDecision(
  decision: VerifiableDecision
): Promise<{ ipfsCid: string; hash: string }> {
  // 1. Serialize to JSON
  const json = JSON.stringify(decision, null, 2);

  // 2. Upload to IPFS
  const ipfsCid = await uploadToIPFS(json);

  // 3. Calculate hash
  const hash = await sha256(json);

  // 4. (Optional) Submit hash to chain
  // await submitHashToChain(decision.battleId, hash);

  return { ipfsCid, hash };
}
```

#### 5. WebSocket Server (`lib/websocket.ts`)

```typescript
// lib/websocket.ts (simplified for Next.js)
// For MVP, use polling instead of WebSocket to avoid infrastructure complexity

export class BattleEventEmitter {
  private subscribers: Map<string, Set<(event: any) => void>> = new Map();

  subscribe(battleId: string, callback: (event: any) => void) {
    if (!this.subscribers.has(battleId)) {
      this.subscribers.set(battleId, new Set());
    }
    this.subscribers.get(battleId)!.add(callback);
  }

  emit(battleId: string, event: any) {
    const callbacks = this.subscribers.get(battleId);
    if (callbacks) {
      callbacks.forEach(cb => cb(event));
    }
  }
}

// Alternative: Use API polling for MVP
// Client polls GET /api/battles/[id]/events every 2-3 seconds
```

### 📱 New Pages Required

```
app/
├── arena/                      # 🆕 Main Agent battle hub
│   ├── page.tsx               # List of active battles
│   ├── [battleId]/
│   │   └── page.tsx          # Live battle spectator view
│   └── create/
│       └── page.tsx          # Create custom battle (Pro users)
├── agent-lab/                  # 🆕 Agent configuration
│   └── page.tsx               # Build your own Agent
└── leaderboard/               # 🆕 Top Agents & Trainers
    └── page.tsx
```

### 🔄 Pages to Modify

| Page | Current Focus | New Focus |
|------|---------------|-----------|
| `/timeline-wars` | User staking UI | Redirect to `/arena` or convert to epic battles only |
| Home (`/`) | Time Capsule | Add "Watch Live Battle" CTA |
| `/generate` | User generation | Add "Train Agent" link |

---

## 🎯 MVP Implementation Plan (Hackathon Focus)

### Phase 1: Core Agent Battle (Days 1-2) ⭐ P0

**Goal**: Demo a single Agent vs Agent battle with manual trigger.

1. **Create Agent Class** (`lib/agents/TimelineAgent.ts`)
   - Simple personality (just preferredEngine)
   - Hard-coded strategy (no adaptation yet)
   - Auto-generate image using existing API

2. **Create Quick Battle Controller** (`lib/agents/BattleController.ts`)
   - 3 rounds, 90 seconds each
   - Sequential: Round 1 → Round 2 → Round 3
   - Store results in memory (not DB)

3. **Build Spectator Page** (`app/arena/[battleId]/page.tsx`)
   - Show both Agent images side by side
   - Add simple voting buttons
   - Display score tally
   - Polls API every 3 seconds for updates

4. **Create Battle API** (`app/api/battles/route.ts`)
   - POST /api/battles/start - Start a battle
   - GET /api/battles/[id] - Get battle state
   - POST /api/battles/[id]/vote - Submit vote

**Deliverable**: Can click "Start Battle" → Watch 2 Agents generate 3 images → Vote → See winner

### Phase 2: Arcade Token & Betting (Days 3-4) ⭐ P0

**Goal**: Users can bet Arcade Tokens on battles.

1. **Arcade Token System** (`lib/arcade/`)
   - localStorage-based balance (user → balance)
   - Give 100 tokens on first visit
   - Earn 5 tokens per vote

2. **Add Betting UI** to spectator page
   - Show current odds
   - Betting form (amount, faction)
   - Display potential payout

3. **Settlement Logic** (`lib/betting/settlement.ts`)
   - Calculate payouts based on odds at bet time
   - Distribute rewards after battle

**Deliverable**: Users get tokens → Bet on Agent A or B → Win/lose tokens

### Phase 3: Decision Logs (Day 5) ⭐ P1

**Goal**: Show Agent decisions are verifiable.

1. **Decision Logger** (`lib/verification/decisionLogger.ts`)
   - Log Agent's reasoning to IPFS
   - Display IPFS CID in UI
   - Add "View Decision Log" button

2. **Audit UI** (`app/arena/[battleId]/audit/page.tsx`)
   - Show full decision log
   - Display inputs/reasoning/outputs
   - Verify hash matches IPFS content

**Deliverable**: Click Agent card → View decision log → See reasoning

### Phase 4: Strategy Adaptation (Day 6) ⭐ P1

**Goal**: Agents adapt strategy based on votes.

1. **Add Adaptation Logic**
   - After each round, Agent analyzes votes
   - Uses LLM to decide strategy change
   - Visible in decision log

2. **Show Adaptation in UI**
   - "Agent adjusted strategy based on votes!"
   - Display what changed

**Deliverable**: Agent loses Round 1 → Adapts → Tries different approach in Round 2

---

## 🏆 Hackathon Track 3 Alignment

### Requirement Checklist

| Track 3 Requirement | TimePics Solution | Implementation Status |
|---------------------|-------------------|----------------------|
| ✅ Agent对抗/竞争/协作 | Agent vs Agent visual battles | P0 - Core feature |
| ✅ 预测市场 + 智能体 | Betting on Agent battles + odds | P0 - Arcade Token |
| ✅ 短周期高频轮次 (5-10min) | 3-round quick battles | P0 - BattleController |
| ✅ 可验证决策逻辑 | Decision logs to IPFS + hash | P1 - DecisionLogger |
| ✅ 低门槛免Gas参与 | Arcade Token (off-chain) | P0 - TokenManager |
| ✅ 智能体自主决策 | LLM-based strategy + adaptation | P1 - Strategy engine |

### Unique Selling Points vs Other Projects

1. **Visual AI Generation**: Most Agent projects are text/trading focused. We combine Agent intelligence with **visual content creation**.

2. **Verifiable Creativity**: Unlike typical prediction markets (price/events), we're betting on **Agent-generated art quality**.

3. **Dual Participation**:
   - Casual: Watch + bet (zero technical knowledge)
   - Advanced: Train your own Agent (requires AI understanding)

4. **Built-in Viral Loop**: Every Agent battle creates shareable visual content → natural marketing.

---

## 🚀 Immediate Next Steps

1. ✅ **Complete this compatibility analysis** (Done)
2. 📝 **Update CLAUDE.md** with Agent architecture
3. 🏗️ **Start Phase 1**: Create TimelineAgent class
4. 🎨 **Build spectator UI** prototype
5. 🧪 **Test end-to-end flow** with 2 dummy Agents

---

## 💾 Database Schema Changes

### New Tables/Collections Needed

```sql
-- Arcade Tokens (can be localStorage for MVP)
CREATE TABLE arcade_balances (
  user_id TEXT PRIMARY KEY,
  balance INTEGER DEFAULT 100,
  earned INTEGER DEFAULT 100,
  spent INTEGER DEFAULT 0,
  last_daily_claim TEXT
);

-- Agent Battles (in-memory for MVP, DB for production)
CREATE TABLE battles (
  id TEXT PRIMARY KEY,
  type TEXT, -- 'quick' or 'epic'
  topic TEXT,
  agent_a_id TEXT,
  agent_b_id TEXT,
  status TEXT, -- 'pending' | 'active' | 'ended'
  current_round INTEGER,
  total_rounds INTEGER,
  started_at TEXT,
  ended_at TEXT
);

-- Battle Rounds
CREATE TABLE battle_rounds (
  id TEXT PRIMARY KEY,
  battle_id TEXT,
  round_number INTEGER,
  agent_a_image TEXT, -- IPFS CID
  agent_b_image TEXT,
  agent_a_decision_log TEXT, -- IPFS CID
  agent_b_decision_log TEXT,
  votes_a INTEGER,
  votes_b INTEGER,
  started_at TEXT,
  ended_at TEXT
);

-- Bets
CREATE TABLE bets (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  battle_id TEXT,
  faction TEXT, -- 'A' or 'B'
  amount INTEGER, -- Arcade Tokens or SOL
  currency TEXT, -- 'arcade' or 'sol'
  odds_at_bet REAL,
  placed_at TEXT,
  payout INTEGER DEFAULT 0,
  settled BOOLEAN DEFAULT FALSE
);

-- Votes
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  battle_id TEXT,
  round_number INTEGER,
  faction TEXT,
  voted_at TEXT
);
```

For MVP, use:
- **localStorage** for Arcade Tokens (simple key-value)
- **In-memory arrays** for battles/rounds (reset on server restart)
- **IPFS** for decision logs and images

For production, migrate to PostgreSQL/MongoDB.

---

## 🎬 Demo Script for Hackathon Judges

**"30-Second Pitch"**:

> "TimePics.ai is an AI Timeline War where intelligent agents compete by generating alternate history images. Unlike typical prediction markets betting on prices or events, users bet on which Agent's creative vision will win community votes. Each Agent's decision is transparently logged to IPFS, making this the first **verifiable AI creativity prediction market**.
>
> Watch Agent A (the Historian) and Agent B (the Futurist) battle in real-time, vote with free Arcade Tokens, and see Agents adapt their strategies between rounds. Fully aligned with Track 3: Agent-driven applications with prediction markets, verifiable logic, and sub-10-minute rounds."

**"Live Demo Flow" (2 minutes)**:

1. **Open arena page** → "Here are live Agent battles"
2. **Click active battle** → "Agent Historian-7B vs Prophet-X are fighting over 'What if Rome never fell?'"
3. **Show Round 1 results** → "Agent A generated a steampunk Roman city, Agent B generated a tech-Roman future. Community voted 156 to 143 for Agent B."
4. **Click 'View Decision Log'** → "Here's Agent A's full reasoning, stored on IPFS with hash verification."
5. **Round 2 starts** → "Agent A adapted its strategy based on losing Round 1 - now trying a more futuristic angle."
6. **Place bet** → "I'll bet 50 Arcade Tokens on Agent A at 2.3x odds."
7. **Round ends** → "Agent A wins! My 50 tokens become 115. All settled instantly with zero gas fees."

**Key Metrics to Highlight**:
- ⚡ 5-10 minute battles (meets "short cycle" requirement)
- 🔍 100% verifiable Agent decisions (IPFS + hash)
- 🎮 Zero-barrier entry (Arcade Tokens, no wallet needed to spectate)
- 🤖 Agent strategy adaptation (showcases intelligence)
- 🎨 Unique use case (AI art prediction market, not just trading)

---

This analysis provides a clear path to transform TimePics.ai into a Track 3-winning project while preserving 90% of the existing codebase.
