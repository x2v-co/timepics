/**
 * Timeline Agent - AI Agent that autonomously generates images for battles
 * Core class for Agent-driven battles
 */

import { enhancePrompt, type Engine, type Era } from '@/lib/prompts';
import {
  type AgentPersonality,
  getPersonality,
  selectEngineForPersonality,
  calculateStrategyAdjustment
} from './personality';

/**
 * Agent Memory - tracks context across rounds
 */
export interface AgentMemory {
  battleId: string;
  roundHistory: RoundMemory[];
  opponentPatterns: {
    preferredEngines: Record<string, number>;
    averageVoteShare: number;
    styleKeywords: string[];
  };
  currentStrategy: {
    riskLevel: number;
    creativityLevel: number;
    lastEngine: Engine;
  };
}

export interface RoundMemory {
  roundNumber: number;
  myImage: string;          // IPFS CID or URL
  opponentImage: string;    // IPFS CID or URL
  myVotes: number;
  opponentVotes: number;
  engineUsed: Engine;
  promptUsed: string;
  won: boolean;
}

/**
 * Context passed to Agent for decision-making
 */
export interface RoundContext {
  battleId: string;
  battleTopic: string;
  factionName: string;
  factionTheme: string;
  round: number;
  totalRounds: number;
  opponentLastImage?: string;
  opponentLastNarrative?: string;
  lastRoundVotes?: {
    mine: number;
    opponent: number;
  };
  currentOdds?: {
    mine: number;
    opponent: number;
  };
}

/**
 * Agent's output after making a decision
 */
export interface AgentOutput {
  engine: Engine;
  prompt: string;
  enhancedPrompt: string;
  narrative: string;
  reasoning: string;        // Chain-of-thought for verification
  imageUrl?: string;        // Set after generation
  confidence: number;       // 0-1
  strategyAdjustment?: string;
}

/**
 * Timeline Agent Class
 */
export class TimelineAgent {
  id: string;
  name: string;
  personality: AgentPersonality;
  memory: AgentMemory;

  constructor(config: {
    id: string;
    name: string;
    personalityId: string;
    battleId?: string;
  }) {
    this.id = config.id;
    this.name = config.name;
    this.personality = getPersonality(config.personalityId);

    this.memory = {
      battleId: config.battleId || '',
      roundHistory: [],
      opponentPatterns: {
        preferredEngines: {},
        averageVoteShare: 0.5,
        styleKeywords: []
      },
      currentStrategy: {
        riskLevel: this.personality.riskTolerance,
        creativityLevel: this.personality.creativityBias,
        lastEngine: this.personality.preferredEngine
      }
    };
  }

  /**
   * Main decision loop - called each round
   */
  async generateForRound(context: RoundContext): Promise<AgentOutput> {
    console.log(`[${this.name}] Generating for round ${context.round}/${context.totalRounds}`);

    // Step 1: Analyze situation
    const analysis = this.analyzeSituation(context);

    // Step 2: Select engine based on strategy
    const selectedEngine = this.selectEngine(context, analysis);

    // Step 3: Build prompt
    const { basePrompt, narrative, reasoning } = this.buildPrompt(
      context,
      selectedEngine,
      analysis
    );

    // Step 4: Enhance prompt using existing system
    const { prompt: enhancedPrompt } = enhancePrompt({
      userPrompt: basePrompt,
      engine: selectedEngine,
      era: this.selectEra(context, selectedEngine),
      quality: 'standard',
      aspectRatio: '1:1'
    });

    // Step 5: Calculate confidence
    const confidence = this.calculateConfidence(analysis);

    // Step 6: Check if strategy adjustment needed
    const strategyAdjustment = this.checkStrategyAdjustment(context);

    return {
      engine: selectedEngine,
      prompt: basePrompt,
      enhancedPrompt,
      narrative,
      reasoning,
      confidence,
      strategyAdjustment
    };
  }

  /**
   * Analyze current situation
   */
  private analyzeSituation(context: RoundContext): {
    isLosing: boolean;
    voteMargin: number;
    needsAdaptation: boolean;
    opponentStyle: string;
  } {
    if (!context.lastRoundVotes) {
      return {
        isLosing: false,
        voteMargin: 0,
        needsAdaptation: false,
        opponentStyle: 'unknown'
      };
    }

    const myVotes = context.lastRoundVotes.mine;
    const oppVotes = context.lastRoundVotes.opponent;
    const totalVotes = myVotes + oppVotes;

    const myShare = totalVotes > 0 ? myVotes / totalVotes : 0.5;
    const voteMargin = (myShare - 0.5) * 100; // -50 to +50

    const isLosing = myVotes < oppVotes;
    const needsAdaptation = isLosing && this.personality.adaptability > 0.5;

    return {
      isLosing,
      voteMargin,
      needsAdaptation,
      opponentStyle: this.inferOpponentStyle(context)
    };
  }

  /**
   * Select which Time Engine to use
   */
  private selectEngine(
    context: RoundContext,
    analysis: { isLosing: boolean; voteMargin: number }
  ): Engine {
    return selectEngineForPersonality(this.personality, {
      roundNumber: context.round,
      totalRounds: context.totalRounds,
      isLosing: analysis.isLosing,
      voteMargin: analysis.voteMargin
    });
  }

  /**
   * Select era based on context
   */
  private selectEra(context: RoundContext, engine: Engine): Era {
    // Match era to engine preference
    if (engine === 'rewind') {
      const eras: Era[] = ['1900s', '1920s', '1950s', '1980s'];
      return eras[Math.floor(Math.random() * eras.length)];
    }

    if (engine === 'foresee') {
      return '2050s';
    }

    // Refract can use any era for alternate history
    return 'realistic';
  }

  /**
   * Build base prompt with faction theme
   */
  private buildPrompt(
    context: RoundContext,
    engine: Engine,
    analysis: any
  ): {
    basePrompt: string;
    narrative: string;
    reasoning: string;
  } {
    const { factionTheme, battleTopic, round, totalRounds } = context;

    // Construct reasoning (chain-of-thought)
    let reasoning = `Round ${round}/${totalRounds} - ${this.name} (${this.personality.type})\n`;
    reasoning += `Battle: "${battleTopic}"\n`;
    reasoning += `Faction: ${context.factionName} - ${factionTheme}\n`;
    reasoning += `Selected Engine: ${engine}\n`;

    if (round > 1) {
      reasoning += `\nLast Round Analysis:\n`;
      reasoning += `- Vote margin: ${analysis.voteMargin > 0 ? '+' : ''}${analysis.voteMargin.toFixed(0)}%\n`;
      reasoning += `- Status: ${analysis.isLosing ? 'LOSING' : 'WINNING'}\n`;
      reasoning += `- Adaptation needed: ${analysis.needsAdaptation ? 'YES' : 'NO'}\n`;
    }

    // Build prompt based on personality and context
    let basePrompt = '';

    if (this.personality.type === 'historian') {
      basePrompt = `${factionTheme}, historically accurate, period-appropriate details, authentic atmosphere`;
    } else if (this.personality.type === 'futurist') {
      basePrompt = `${factionTheme}, futuristic vision, advanced technology, sleek design`;
    } else if (this.personality.type === 'provocateur') {
      basePrompt = `${factionTheme}, controversial interpretation, thought-provoking, dramatic contrast`;
    } else if (this.personality.type === 'realist') {
      basePrompt = `${factionTheme}, plausible scenario, balanced composition, broad appeal`;
    } else {
      basePrompt = `${factionTheme}, artistic interpretation, emotional depth, inspiring vision`;
    }

    // Add variation for later rounds
    if (round === 2) {
      basePrompt += ', alternative angle';
    } else if (round === 3) {
      basePrompt += ', decisive moment, dramatic finale';
    }

    reasoning += `\nPrompt Strategy: ${basePrompt}\n`;

    // Create narrative
    const narrative = this.createNarrative(context, engine, analysis);

    return { basePrompt, narrative, reasoning };
  }

  /**
   * Create narrative text for the image
   */
  private createNarrative(
    context: RoundContext,
    engine: Engine,
    analysis: any
  ): string {
    const { factionName, round } = context;

    const introductions = [
      `As ${this.name}, I present`,
      `Behold, from the ${factionName} timeline`,
      `My vision shows`,
      `In this reality`
    ];

    const intro = introductions[Math.floor(Math.random() * introductions.length)];

    let narrative = `${intro}: `;

    if (round === 1) {
      narrative += `A glimpse into ${context.factionTheme}. `;
    } else if (round === 2) {
      if (analysis.isLosing) {
        narrative += `Adapting my approach - here's a different perspective. `;
      } else {
        narrative += `Building on our momentum. `;
      }
    } else {
      narrative += `The decisive moment has arrived. `;
    }

    narrative += `Using the ${engine} engine to reveal this timeline's truth.`;

    return narrative;
  }

  /**
   * Calculate confidence in this decision
   */
  private calculateConfidence(analysis: any): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence if winning
    if (!analysis.isLosing && analysis.voteMargin > 10) {
      confidence += 0.2;
    }

    // Lower confidence if needs adaptation
    if (analysis.needsAdaptation) {
      confidence -= 0.1;
    }

    // Personality affects confidence
    confidence += (this.personality.riskTolerance - 0.5) * 0.1;

    return Math.max(0.3, Math.min(0.95, confidence));
  }

  /**
   * Check if strategy adjustment is needed
   */
  private checkStrategyAdjustment(context: RoundContext): string | undefined {
    if (!context.lastRoundVotes) {
      return undefined;
    }

    const myVotes = context.lastRoundVotes.mine;
    const oppVotes = context.lastRoundVotes.opponent;
    const wonLastRound = myVotes > oppVotes;
    const voteRatio = (myVotes + oppVotes) > 0 ? myVotes / (myVotes + oppVotes) : 0.5;

    const adjustment = calculateStrategyAdjustment(
      this.personality,
      {
        wonLastRound,
        voteRatio,
        opponentStyle: this.inferOpponentStyle(context)
      }
    );

    if (adjustment.shouldAdapt) {
      // Update internal strategy
      this.memory.currentStrategy.riskLevel = adjustment.newRiskLevel;
      this.memory.currentStrategy.creativityLevel = adjustment.newCreativity;

      return adjustment.reasoning;
    }

    return undefined;
  }

  /**
   * Infer opponent's style from context
   */
  private inferOpponentStyle(context: RoundContext): string {
    // Simple inference for MVP
    if (context.opponentLastNarrative) {
      if (context.opponentLastNarrative.includes('futuristic')) return 'futuristic';
      if (context.opponentLastNarrative.includes('historical')) return 'historical';
      if (context.opponentLastNarrative.includes('provocative')) return 'provocative';
    }
    return 'unknown';
  }

  /**
   * Update memory after round completes
   */
  updateMemory(roundResult: RoundMemory): void {
    this.memory.roundHistory.push(roundResult);
    this.memory.currentStrategy.lastEngine = roundResult.engineUsed;

    // Update opponent patterns
    const oppEngine = this.inferOpponentEngine(roundResult.opponentImage);
    if (oppEngine) {
      this.memory.opponentPatterns.preferredEngines[oppEngine] =
        (this.memory.opponentPatterns.preferredEngines[oppEngine] || 0) + 1;
    }

    // Update average opponent vote share
    const totalVotes = roundResult.myVotes + roundResult.opponentVotes;
    if (totalVotes > 0) {
      const oppShare = roundResult.opponentVotes / totalVotes;
      this.memory.opponentPatterns.averageVoteShare =
        (this.memory.opponentPatterns.averageVoteShare + oppShare) / 2;
    }
  }

  /**
   * Infer opponent's engine (placeholder - would analyze image in production)
   */
  private inferOpponentEngine(imageUrl: string): Engine | null {
    // In production, analyze image metadata or style
    // For MVP, return null
    return null;
  }

  /**
   * Get agent summary for display
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      personality: this.personality.type,
      description: this.personality.description,
      strengths: this.personality.strengths,
      weaknesses: this.personality.weaknesses,
      preferredEngine: this.personality.preferredEngine,
      stats: {
        roundsPlayed: this.memory.roundHistory.length,
        roundsWon: this.memory.roundHistory.filter(r => r.won).length,
        averageVotes: this.memory.roundHistory.length > 0
          ? this.memory.roundHistory.reduce((sum, r) => sum + r.myVotes, 0) / this.memory.roundHistory.length
          : 0
      }
    };
  }
}

/**
 * Create preset agents
 */
export function createPresetAgent(
  presetId: 'historian-7b' | 'futurist-x' | 'provocateur-alpha' | 'realist-prime' | 'dreamer-omega',
  config: { battleId?: string }
): TimelineAgent {
  const names = {
    'historian-7b': 'Historian-7B',
    'futurist-x': 'Futurist-X',
    'provocateur-alpha': 'Provocateur Alpha',
    'realist-prime': 'Realist Prime',
    'dreamer-omega': 'Dreamer Omega'
  };

  return new TimelineAgent({
    id: `agent-${presetId}-${Date.now()}`,
    name: names[presetId],
    personalityId: presetId,
    battleId: config.battleId
  });
}
