/**
 * Agent Personality System
 * Defines different Agent personalities and their behavioral traits
 */

export type PersonalityType =
  | 'historian'
  | 'futurist'
  | 'provocateur'
  | 'realist'
  | 'dreamer';

export interface AgentPersonality {
  type: PersonalityType;
  preferredEngine: 'rewind' | 'refract' | 'foresee';
  riskTolerance: number;        // 0-1: how willing to take controversial angles
  creativityBias: number;       // 0-1: how novel/unusual the prompts are
  voterAppealFocus: number;     // 0-1: how much to pander to voter preferences
  adaptability: number;         // 0-1: how quickly to change strategy
  description: string;
  strengths: string[];
  weaknesses: string[];
}

/**
 * Preset Agent Personalities
 */
export const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  'historian-7b': {
    type: 'historian',
    preferredEngine: 'rewind',
    riskTolerance: 0.3,
    creativityBias: 0.4,
    voterAppealFocus: 0.7,
    adaptability: 0.5,
    description: 'Focuses on historically accurate reconstructions with emotional depth',
    strengths: ['Authenticity', 'Emotional resonance', 'Period accuracy'],
    weaknesses: ['Conservative choices', 'Less surprising']
  },

  'futurist-x': {
    type: 'futurist',
    preferredEngine: 'foresee',
    riskTolerance: 0.7,
    creativityBias: 0.8,
    voterAppealFocus: 0.4,
    adaptability: 0.8,
    description: 'Generates bold futuristic visions with cutting-edge aesthetics',
    strengths: ['Innovation', 'Visual impact', 'Trend awareness'],
    weaknesses: ['Sometimes too abstract', 'May alienate traditionalists']
  },

  'provocateur-alpha': {
    type: 'provocateur',
    preferredEngine: 'refract',
    riskTolerance: 0.9,
    creativityBias: 0.85,
    voterAppealFocus: 0.2,
    adaptability: 0.3,
    description: 'Creates controversial alternate histories that challenge assumptions',
    strengths: ['Uniqueness', 'Discussion-worthy', 'Memorable'],
    weaknesses: ['Divisive', 'May lose votes', 'Stubborn strategy']
  },

  'realist-prime': {
    type: 'realist',
    preferredEngine: 'refract',
    riskTolerance: 0.4,
    creativityBias: 0.5,
    voterAppealFocus: 0.8,
    adaptability: 0.6,
    description: 'Balances plausibility with visual appeal, plays it safe',
    strengths: ['Broad appeal', 'Consistent quality', 'Strategic'],
    weaknesses: ['Predictable', 'Less memorable', 'May seem generic']
  },

  'dreamer-omega': {
    type: 'dreamer',
    preferredEngine: 'foresee',
    riskTolerance: 0.6,
    creativityBias: 0.9,
    voterAppealFocus: 0.5,
    adaptability: 0.7,
    description: 'Optimistic, fantastical visions with artistic flair',
    strengths: ['Artistic quality', 'Emotional impact', 'Inspirational'],
    weaknesses: ['May be too idealistic', 'Variable voter response']
  }
};

/**
 * Get personality by ID
 */
export function getPersonality(personalityId: string): AgentPersonality {
  const personality = AGENT_PERSONALITIES[personalityId];
  if (!personality) {
    console.warn(`Unknown personality: ${personalityId}, defaulting to realist-prime`);
    return AGENT_PERSONALITIES['realist-prime'];
  }
  return personality;
}

/**
 * Get all available personalities
 */
export function getAllPersonalities(): Array<{ id: string; personality: AgentPersonality }> {
  return Object.entries(AGENT_PERSONALITIES).map(([id, personality]) => ({
    id,
    personality
  }));
}

/**
 * Select best engine for personality given context
 */
export function selectEngineForPersonality(
  personality: AgentPersonality,
  context: {
    roundNumber: number;
    totalRounds: number;
    isLosing: boolean;
    voteMargin: number; // How far behind/ahead (-100 to 100)
  }
): 'rewind' | 'refract' | 'foresee' {
  // If desperate (losing badly in final round), take a risk
  if (context.isLosing && context.roundNumber === context.totalRounds && context.voteMargin < -20) {
    // Switch to highest creativity engine
    if (personality.riskTolerance > 0.6) {
      return 'refract'; // Most creative for alternate history
    }
  }

  // If winning, stick with preferred engine
  if (!context.isLosing && context.voteMargin > 10) {
    return personality.preferredEngine;
  }

  // Mid-game adaptation: try different engines if not working
  if (context.roundNumber === 2 && context.isLosing) {
    const engines: Array<'rewind' | 'refract' | 'foresee'> = ['rewind', 'refract', 'foresee'];
    const alternatives = engines.filter(e => e !== personality.preferredEngine);
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }

  // Default: use preferred engine
  return personality.preferredEngine;
}

/**
 * Calculate strategy adjustment factor based on personality and feedback
 */
export function calculateStrategyAdjustment(
  personality: AgentPersonality,
  feedback: {
    wonLastRound: boolean;
    voteRatio: number; // 0-1, this agent's share of votes
    opponentStyle: string;
  }
): {
  shouldAdapt: boolean;
  newRiskLevel: number;
  newCreativity: number;
  reasoning: string;
} {
  const baseRisk = personality.riskTolerance;
  const baseCreativity = personality.creativityBias;

  // If winning, maintain course
  if (feedback.wonLastRound && feedback.voteRatio > 0.55) {
    return {
      shouldAdapt: false,
      newRiskLevel: baseRisk,
      newCreativity: baseCreativity,
      reasoning: 'Winning strategy - maintaining current approach'
    };
  }

  // If losing, adapt based on personality
  if (!feedback.wonLastRound) {
    const adaptationStrength = personality.adaptability;

    // High adaptability = larger changes
    const riskBoost = adaptationStrength * 0.2;
    const creativityBoost = adaptationStrength * 0.15;

    return {
      shouldAdapt: true,
      newRiskLevel: Math.min(1, baseRisk + riskBoost),
      newCreativity: Math.min(1, baseCreativity + creativityBoost),
      reasoning: `Lost last round (${(feedback.voteRatio * 100).toFixed(0)}% votes). Increasing risk and creativity to differentiate.`
    };
  }

  // Close race - minor tweaks
  return {
    shouldAdapt: true,
    newRiskLevel: baseRisk + (Math.random() - 0.5) * 0.1,
    newCreativity: baseCreativity + (Math.random() - 0.5) * 0.1,
    reasoning: 'Close competition - making minor strategic adjustments'
  };
}


/**
 * Array export for easy iteration
 */
export const PRESET_PERSONALITIES = [
  { id: 'historian-7b', name: 'Historian-7B', ...AGENT_PERSONALITIES['historian-7b'] },
  { id: 'futurist-x', name: 'Futurist-X', ...AGENT_PERSONALITIES['futurist-x'] },
  { id: 'provocateur-9', name: 'Provocateur-9', ...AGENT_PERSONALITIES['provocateur-9'] },
  { id: 'realist-alpha', name: 'Realist-Alpha', ...AGENT_PERSONALITIES['realist-alpha'] },
  { id: 'dreamer-omega', name: 'Dreamer-Omega', ...AGENT_PERSONALITIES['dreamer-omega'] }
];
