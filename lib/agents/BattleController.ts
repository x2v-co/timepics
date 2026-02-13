/**
 * Battle Controller - Orchestrates Agent vs Agent battles
 * Manages rounds, voting, and battle progression
 */

import { TimelineAgent, type AgentOutput, type RoundMemory } from './TimelineAgent';

export type BattleStatus = 'pending' | 'active' | 'ended' | 'cancelled';

/**
 * Quick Battle Configuration (5-10 minutes)
 */
export interface QuickBattle {
  id: string;
  type: 'quick';
  topic: string;
  description: string;

  // Agents
  agentA: TimelineAgent;
  agentB: TimelineAgent;
  factionA: BattleFaction;
  factionB: BattleFaction;

  // Battle settings
  rounds: number;              // 3-5 rounds
  roundDuration: number;       // 90 seconds per round

  // State
  status: BattleStatus;
  currentRound: number;
  roundResults: RoundResult[];

  // Timestamps
  startedAt?: Date;
  endedAt?: Date;

  // Scoreboard
  scoreboard: {
    agentA: {
      roundScores: number[];    // Votes per round
      totalVotes: number;
      roundsWon: number;
    };
    agentB: {
      roundScores: number[];
      totalVotes: number;
      roundsWon: number;
    };
  };

  // Odds History (P1 - Dynamic odds tracking)
  oddsHistory?: Array<{
    timestamp: number;
    oddsA: number;
    oddsB: number;
    totalBetsOnA: number;
    totalBetsOnB: number;
  }>;

  // Winner
  winner?: 'A' | 'B' | 'draw';
}

export interface BattleFaction {
  id: string;
  name: string;
  theme: string;
  description: string;
  color: string;
  icon: string;
}

export interface RoundResult {
  roundNumber: number;
  agentA: {
    output: AgentOutput;
    imageUrl: string;
    votes: number;
  };
  agentB: {
    output: AgentOutput;
    imageUrl: string;
    votes: number;
  };
  winner: 'A' | 'B' | 'draw';
  startedAt: Date;
  endedAt: Date;
}

/**
 * Votes for a round
 */
export interface RoundVotes {
  roundNumber: number;
  votes: Map<string, 'A' | 'B'>; // userId -> faction
  agentAVotes: number;
  agentBVotes: number;
}

/**
 * Battle Controller Class
 */
export class BattleController {
  private battle: QuickBattle;
  private roundVotes: Map<number, RoundVotes>; // round -> votes
  private eventListeners: Map<string, Set<(data: any) => void>>;

  constructor(battle: QuickBattle) {
    this.battle = battle;
    this.roundVotes = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Start the battle
   */
  async start(): Promise<void> {
    if (this.battle.status !== 'pending') {
      throw new Error('Battle already started or ended');
    }

    console.log(`[Battle ${this.battle.id}] Starting: "${this.battle.topic}"`);

    this.battle.status = 'active';
    this.battle.startedAt = new Date();
    this.battle.currentRound = 1;

    this.emit('battle:start', {
      battleId: this.battle.id,
      topic: this.battle.topic,
      rounds: this.battle.rounds
    });

    // Run all rounds
    for (let round = 1; round <= this.battle.rounds; round++) {
      await this.runRound(round);
    }

    // End battle
    await this.endBattle();
  }

  /**
   * Run a single round
   */
  private async runRound(roundNumber: number): Promise<void> {
    console.log(`[Battle ${this.battle.id}] Starting round ${roundNumber}/${this.battle.rounds}`);

    this.battle.currentRound = roundNumber;
    const roundStartTime = new Date();

    // Initialize round votes
    this.roundVotes.set(roundNumber, {
      roundNumber,
      votes: new Map(),
      agentAVotes: 0,
      agentBVotes: 0
    });

    this.emit('round:start', {
      battleId: this.battle.id,
      round: roundNumber,
      totalRounds: this.battle.rounds,
      duration: this.battle.roundDuration
    });

    // Phase 1: Agent Generation (30 seconds)
    this.emit('phase:generation', { phase: 'generation', duration: 30 });

    const [outputA, outputB] = await Promise.all([
      this.generateForAgent('A', roundNumber),
      this.generateForAgent('B', roundNumber)
    ]);

    console.log(`[Battle ${this.battle.id}] Round ${roundNumber} - Both agents generated`);

    // Phase 2: Reveal (10 seconds)
    this.emit('phase:reveal', {
      phase: 'reveal',
      duration: 10,
      agentA: outputA,
      agentB: outputB
    });

    await this.sleep(10000);

    // Phase 3: Voting (50 seconds)
    this.emit('phase:voting', {
      phase: 'voting',
      duration: 50,
      round: roundNumber
    });

    await this.sleep(50000);

    // Phase 4: Scoring (10 seconds)
    const roundVotes = this.roundVotes.get(roundNumber)!;

    const roundResult: RoundResult = {
      roundNumber,
      agentA: {
        output: outputA,
        imageUrl: outputA.imageUrl!,
        votes: roundVotes.agentAVotes
      },
      agentB: {
        output: outputB,
        imageUrl: outputB.imageUrl!,
        votes: roundVotes.agentBVotes
      },
      winner:
        roundVotes.agentAVotes > roundVotes.agentBVotes
          ? 'A'
          : roundVotes.agentBVotes > roundVotes.agentAVotes
          ? 'B'
          : 'draw',
      startedAt: roundStartTime,
      endedAt: new Date()
    };

    this.battle.roundResults.push(roundResult);

    // Update scoreboard
    this.battle.scoreboard.agentA.roundScores.push(roundVotes.agentAVotes);
    this.battle.scoreboard.agentA.totalVotes += roundVotes.agentAVotes;
    if (roundResult.winner === 'A') {
      this.battle.scoreboard.agentA.roundsWon++;
    }

    this.battle.scoreboard.agentB.roundScores.push(roundVotes.agentBVotes);
    this.battle.scoreboard.agentB.totalVotes += roundVotes.agentBVotes;
    if (roundResult.winner === 'B') {
      this.battle.scoreboard.agentB.roundsWon++;
    }

    this.emit('round:end', {
      battleId: this.battle.id,
      round: roundNumber,
      result: roundResult,
      scoreboard: this.battle.scoreboard
    });

    // Update agent memories
    this.updateAgentMemories(roundNumber, roundResult);

    console.log(
      `[Battle ${this.battle.id}] Round ${roundNumber} complete - Winner: ${roundResult.winner} (A: ${roundVotes.agentAVotes}, B: ${roundVotes.agentBVotes})`
    );
  }

  /**
   * Generate output for an agent
   */
  private async generateForAgent(
    faction: 'A' | 'B',
    roundNumber: number
  ): Promise<AgentOutput> {
    const agent = faction === 'A' ? this.battle.agentA : this.battle.agentB;
    const factionInfo = faction === 'A' ? this.battle.factionA : this.battle.factionB;

    // Build context
    const lastRound = this.battle.roundResults[roundNumber - 2];
    const context = {
      battleId: this.battle.id,
      battleTopic: this.battle.topic,
      factionName: factionInfo.name,
      factionTheme: factionInfo.theme,
      round: roundNumber,
      totalRounds: this.battle.rounds,
      opponentLastImage: lastRound
        ? faction === 'A'
          ? lastRound.agentB.imageUrl
          : lastRound.agentA.imageUrl
        : undefined,
      opponentLastNarrative: lastRound
        ? faction === 'A'
          ? lastRound.agentB.output.narrative
          : lastRound.agentA.output.narrative
        : undefined,
      lastRoundVotes: lastRound
        ? {
            mine: faction === 'A' ? lastRound.agentA.votes : lastRound.agentB.votes,
            opponent: faction === 'A' ? lastRound.agentB.votes : lastRound.agentA.votes
          }
        : undefined
    };

    // Agent generates
    const output = await agent.generateForRound(context);

    // Generate image via API
    try {
      const imageUrl = await this.generateImage(output.enhancedPrompt, output.engine);
      output.imageUrl = imageUrl;
    } catch (error) {
      console.error(`Failed to generate image for ${agent.name}:`, error);
      // Use placeholder
      output.imageUrl = `https://placehold.co/600x600/333/fff?text=${faction}`;
    }

    return output;
  }

  /**
   * Generate image via API
   */
  private async generateImage(prompt: string, engine: string): Promise<string> {
    // Call existing /api/generate endpoint
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        engine,
        aspectRatio: '1:1',
        quality: 'standard'
      })
    });

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    const data = await response.json();
    return data.imageUrl || data.imageData; // Handle both URL and base64
  }

  /**
   * Update agent memories after round
   */
  private updateAgentMemories(roundNumber: number, result: RoundResult): void {
    const memoryA: RoundMemory = {
      roundNumber,
      myImage: result.agentA.imageUrl,
      opponentImage: result.agentB.imageUrl,
      myVotes: result.agentA.votes,
      opponentVotes: result.agentB.votes,
      engineUsed: result.agentA.output.engine,
      promptUsed: result.agentA.output.prompt,
      won: result.winner === 'A'
    };

    const memoryB: RoundMemory = {
      roundNumber,
      myImage: result.agentB.imageUrl,
      opponentImage: result.agentA.imageUrl,
      myVotes: result.agentB.votes,
      opponentVotes: result.agentA.votes,
      engineUsed: result.agentB.output.engine,
      promptUsed: result.agentB.output.prompt,
      won: result.winner === 'B'
    };

    this.battle.agentA.updateMemory(memoryA);
    this.battle.agentB.updateMemory(memoryB);
  }

  /**
   * End the battle and determine winner
   */
  private async endBattle(): Promise<void> {
    this.battle.status = 'ended';
    this.battle.endedAt = new Date();

    // Determine overall winner
    const { agentA, agentB } = this.battle.scoreboard;

    if (agentA.roundsWon > agentB.roundsWon) {
      this.battle.winner = 'A';
    } else if (agentB.roundsWon > agentA.roundsWon) {
      this.battle.winner = 'B';
    } else if (agentA.totalVotes > agentB.totalVotes) {
      this.battle.winner = 'A';
    } else if (agentB.totalVotes > agentA.totalVotes) {
      this.battle.winner = 'B';
    } else {
      this.battle.winner = 'draw';
    }

    console.log(
      `[Battle ${this.battle.id}] ENDED - Winner: ${this.battle.winner} (A: ${agentA.roundsWon}/${this.battle.rounds} rounds, ${agentA.totalVotes} votes | B: ${agentB.roundsWon}/${this.battle.rounds} rounds, ${agentB.totalVotes} votes)`
    );

    this.emit('battle:end', {
      battleId: this.battle.id,
      winner: this.battle.winner,
      scoreboard: this.battle.scoreboard,
      duration: this.battle.endedAt.getTime() - this.battle.startedAt!.getTime()
    });
  }

  /**
   * Vote for a faction in current round
   */
  vote(userId: string, faction: 'A' | 'B'): boolean {
    const currentRound = this.battle.currentRound;
    if (currentRound === 0 || currentRound > this.battle.rounds) {
      return false;
    }

    const roundVotes = this.roundVotes.get(currentRound);
    if (!roundVotes) {
      return false;
    }

    // Check if already voted
    if (roundVotes.votes.has(userId)) {
      return false; // Already voted
    }

    // Record vote
    roundVotes.votes.set(userId, faction);
    if (faction === 'A') {
      roundVotes.agentAVotes++;
    } else {
      roundVotes.agentBVotes++;
    }

    this.emit('vote:cast', {
      battleId: this.battle.id,
      round: currentRound,
      faction,
      agentAVotes: roundVotes.agentAVotes,
      agentBVotes: roundVotes.agentBVotes
    });

    return true;
  }

  /**
   * Get battle state
   */
  getState(): QuickBattle {
    return this.battle;
  }

  /**
   * Get current round votes
   */
  getCurrentRoundVotes(): { agentA: number; agentB: number } | null {
    const roundVotes = this.roundVotes.get(this.battle.currentRound);
    if (!roundVotes) {
      return null;
    }

    return {
      agentA: roundVotes.agentAVotes,
      agentB: roundVotes.agentBVotes
    };
  }

  /**
   * Update odds history (P1 - Dynamic odds tracking)
   * Called when betting pool changes
   */
  updateOddsHistory(oddsA: number, oddsB: number, totalBetsOnA: number, totalBetsOnB: number): void {
    if (!this.battle.oddsHistory) {
      this.battle.oddsHistory = [];
    }

    this.battle.oddsHistory.push({
      timestamp: Date.now(),
      oddsA,
      oddsB,
      totalBetsOnA,
      totalBetsOnB
    });

    // Keep only last 50 updates to prevent memory bloat
    if (this.battle.oddsHistory.length > 50) {
      this.battle.oddsHistory = this.battle.oddsHistory.slice(-50);
    }

    console.log(
      `[Battle ${this.battle.id}] Odds updated: A=${oddsA.toFixed(2)}x, B=${oddsB.toFixed(2)}x`
    );
  }

  /**
   * Get odds history
   */
  getOddsHistory() {
    return this.battle.oddsHistory || [];
  }

  /**
   * Event emitter - subscribe to battle events
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }

    // Also log for debugging
    console.log(`[Event] ${event}:`, data);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create a quick battle
 */
export function createQuickBattle(config: {
  topic: string;
  description: string;
  agentAId: string;
  agentBId: string;
  factionA: BattleFaction;
  factionB: BattleFaction;
  rounds?: number;
}): QuickBattle {
  const battleId = `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create agents
  const agentA = new TimelineAgent({
    id: `agent-a-${battleId}`,
    name: config.factionA.name,
    personalityId: config.agentAId,
    battleId
  });

  const agentB = new TimelineAgent({
    id: `agent-b-${battleId}`,
    name: config.factionB.name,
    personalityId: config.agentBId,
    battleId
  });

  return {
    id: battleId,
    type: 'quick',
    topic: config.topic,
    description: config.description,
    agentA,
    agentB,
    factionA: config.factionA,
    factionB: config.factionB,
    rounds: config.rounds || 3,
    roundDuration: 90,
    status: 'pending',
    currentRound: 0,
    roundResults: [],
    scoreboard: {
      agentA: { roundScores: [], totalVotes: 0, roundsWon: 0 },
      agentB: { roundScores: [], totalVotes: 0, roundsWon: 0 }
    }
  };
}
