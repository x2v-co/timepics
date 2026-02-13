/**
 * Agent Skills System (v4)
 * Enables User Agents to cast tactical skills during battles
 *
 * Skills:
 * - Deep Scan: Get detailed AI evaluation report
 * - Copy-Mint: Clone and modify opponent's prompt
 * - Anti-Audit: Protect NFT from audit attacks
 * - Flash Pump: Temporary power boost
 */

import { spendTokens, earnTokens, getArcadeBalance } from './arcade/tokenManager';
import { BattleNFT, getNFT, evaluateNFT as updateNFTEvaluation } from './battleNFT';
import { evaluateNFT as aiEvaluateNFT, EvaluationResult } from './aiEvaluator';

// Storage for skill cooldowns and active effects
const SKILL_STATE_KEY = 'timepics_agent_skills';

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  cost: number;
  cooldown: number; // seconds
  effectDuration?: number; // seconds, for temporary effects
  targetType: 'nft' | 'faction' | 'self' | 'global';
}

export interface SkillCastResult {
  success: boolean;
  skillId: string;
  userId: string;
  targetId?: string;
  effect?: any;
  error?: string;
}

export interface ActiveSkillEffect {
  skillId: string;
  userId: string;
  battleId: string;
  targetId?: string;
  effect: any;
  expiresAt: string;
}

export interface SkillCooldown {
  userId: string;
  skillId: string;
  availableAt: string;
}

/**
 * Available skills registry
 */
export const AGENT_SKILLS: Record<string, AgentSkill> = {
  // Deep Scan - Get detailed AI evaluation
  SKILL_SCAN: {
    id: 'SKILL_SCAN',
    name: 'Deep Scan',
    description: 'Get detailed AI evaluation report for any NFT, including prompt keyword analysis',
    cost: 20,
    cooldown: 30,
    targetType: 'nft'
  },

  // Copy-Mint - Clone and modify opponent's prompt
  SKILL_SNIPE: {
    id: 'SKILL_SNIPE',
    name: 'Copy-Mint',
    description: 'Reference an NFT\'s prompt, modify up to 20%, and mint immediately',
    cost: 150,
    cooldown: 120,
    targetType: 'nft'
  },

  // Anti-Audit - Protect from audit attacks
  SKILL_SHIELD: {
    id: 'SKILL_SHIELD',
    name: 'Anti-Audit',
    description: 'Immune to audit attacks for 5 minutes',
    cost: 100,
    cooldown: 300,
    effectDuration: 300, // 5 minutes
    targetType: 'self'
  },

  // Flash Pump - Temporary power boost
  SKILL_BOOST: {
    id: 'SKILL_BOOST',
    name: 'Flash Pump',
    description: 'Add 500 temporary power to an NFT for 60 seconds',
    cost: 200,
    cooldown: 180,
    effectDuration: 60,
    targetType: 'nft'
  },

  // Fog Generator - Hide vote counts
  SKILL_FOG: {
    id: 'SKILL_FOG',
    name: 'Fog Generator',
    description: 'Hide faction vote counts for 10 minutes',
    cost: 200,
    cooldown: 600,
    effectDuration: 600,
    targetType: 'faction'
  },

  // Liquidity Boost - Boost all faction NFTs
  SKILL_LIQUIDITY: {
    id: 'SKILL_LIQUIDITY',
    name: 'Liquidity Boost',
    description: 'All faction NFTs get +5% power for 5 minutes',
    cost: 300,
    cooldown: 600,
    effectDuration: 300,
    targetType: 'faction'
  },

  // Audit Attack - Force re-evaluation of enemy NFT
  SKILL_AUDIT: {
    id: 'SKILL_AUDIT',
    name: 'Audit Attack',
    description: 'Force system to re-evaluate an enemy NFT (may lower score)',
    cost: 50,
    cooldown: 60,
    targetType: 'nft'
  }
};

/**
 * Get all available skills
 */
export function getAvailableSkills(): AgentSkill[] {
  return Object.values(AGENT_SKILLS);
}

/**
 * Get skill by ID
 */
export function getSkill(skillId: string): AgentSkill | undefined {
  return AGENT_SKILLS[skillId];
}

/**
 * Load skill state from storage
 */
function loadSkillState(): {
  cooldowns: SkillCooldown[];
  activeEffects: ActiveSkillEffect[];
} {
  if (typeof window === 'undefined') {
    return { cooldowns: [], activeEffects: [] };
  }

  try {
    const stored = localStorage.getItem(SKILL_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load skill state:', error);
  }

  return { cooldowns: [], activeEffects: [] };
}

/**
 * Save skill state to storage
 */
function saveSkillState(state: {
  cooldowns: SkillCooldown[];
  activeEffects: ActiveSkillEffect[];
}): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SKILL_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save skill state:', error);
  }
}

/**
 * Check if skill is on cooldown
 */
export function isSkillOnCooldown(userId: string, skillId: string): boolean {
  const state = loadSkillState();
  const now = new Date();

  const cooldown = state.cooldowns.find(
    c => c.userId === userId && c.skillId === skillId
  );

  if (!cooldown) return false;

  return new Date(cooldown.availableAt) > now;
}

/**
 * Get remaining cooldown time
 */
export function getCooldownRemaining(userId: string, skillId: string): number {
  const state = loadSkillState();
  const now = new Date();

  const cooldown = state.cooldowns.find(
    c => c.userId === userId && c.skillId === skillId
  );

  if (!cooldown) return 0;

  const remaining = new Date(cooldown.availableAt).getTime() - now.getTime();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Set skill on cooldown
 */
function setSkillCooldown(userId: string, skillId: string, cooldownSeconds: number): void {
  const state = loadSkillState();
  const now = new Date();
  const availableAt = new Date(now.getTime() + cooldownSeconds * 1000);

  // Remove existing cooldown
  state.cooldowns = state.cooldowns.filter(
    c => !(c.userId === userId && c.skillId === skillId)
  );

  // Add new cooldown
  state.cooldowns.push({
    userId,
    skillId,
    availableAt: availableAt.toISOString()
  });

  saveSkillState(state);
}

/**
 * Get user's active effects
 */
export function getActiveEffects(userId: string, battleId?: string): ActiveSkillEffect[] {
  const state = loadSkillState();
  const now = new Date();

  return state.activeEffects.filter(effect => {
    const isExpired = new Date(effect.expiresAt) <= now;
    const matchesUser = effect.userId === userId;
    const matchesBattle = !battleId || effect.battleId === battleId;

    return matchesUser && matchesBattle && !isExpired;
  });
}

/**
 * Add active effect
 */
function addActiveEffect(effect: Omit<ActiveSkillEffect, 'expiresAt'>): void {
  const state = loadSkillState();
  const skill = getSkill(effect.skillId);

  if (!skill?.effectDuration) return;

  const expiresAt = new Date(
    Date.now() + skill.effectDuration * 1000
  ).toISOString();

  state.activeEffects.push({
    ...effect,
    expiresAt
  });

  saveSkillState(state);
}

/**
 * Clean up expired effects
 */
function cleanupExpiredEffects(): void {
  const state = loadSkillState();
  const now = new Date();

  state.activeEffects = state.activeEffects.filter(
    effect => new Date(effect.expiresAt) > now
  );

  state.cooldowns = state.cooldowns.filter(
    cooldown => new Date(cooldown.availableAt) > now
  );

  saveSkillState(state);
}

/**
 * Cast a skill
 */
export async function castSkill(params: {
  userId: string;
  battleId: string;
  skillId: string;
  targetId?: string;
}): Promise<SkillCastResult> {
  const { userId, battleId, skillId, targetId } = params;

  // Get skill definition
  const skill = getSkill(skillId);
  if (!skill) {
    return { success: false, skillId, userId, error: 'Unknown skill' };
  }

  // Check cooldown
  if (isSkillOnCooldown(userId, skillId)) {
    const remaining = getCooldownRemaining(userId, skillId);
    return {
      success: false,
      skillId,
      userId,
      error: `Skill on cooldown. ${remaining}s remaining`
    };
  }

  // Check balance
  const balanceObj = getArcadeBalance(userId);
  const balance = balanceObj.balance;
  if (balance < skill.cost) {
    return {
      success: false,
      skillId,
      userId,
      error: `Insufficient tokens. Need ${skill.cost}, have ${balance}`
    };
  }

  // Deduct tokens (50% burned, 50% to battle pool)
  const burnAmount = Math.floor(skill.cost * 0.5);
  const poolAmount = skill.cost - burnAmount;

  spendTokens(userId, skill.cost, `Skill: ${skill.name}`);

  // Set cooldown
  setSkillCooldown(userId, skillId, skill.cooldown);

  // Execute skill effect
  let effect: any = null;

  try {
    effect = await executeSkillEffect({
      skill,
      userId,
      battleId,
      targetId,
      poolAmount
    });
  } catch (error) {
    console.error('Skill execution failed:', error);
    // Refund on error
    earnTokens(userId, skill.cost, `Skill refund: ${skill.name}`);
    return {
      success: false,
      skillId,
      userId,
      error: 'Skill execution failed'
    };
  }

  return {
    success: true,
    skillId,
    userId,
    targetId,
    effect
  };
}

/**
 * Execute skill-specific effect
 */
async function executeSkillEffect(params: {
  skill: AgentSkill;
  userId: string;
  battleId: string;
  targetId?: string;
  poolAmount: number;
}): Promise<any> {
  const { skill, userId, battleId, targetId } = params;

  switch (skill.id) {
    case 'SKILL_SCAN': {
      // Deep Scan - Get detailed AI evaluation
      if (!targetId) {
        throw new Error('Target NFT required');
      }

      const targetNFT = getNFT(targetId);
      if (!targetNFT) {
        throw new Error('NFT not found');
      }

      // Generate detailed evaluation
      const factionInfo = targetNFT.factionName || `Faction ${targetNFT.faction}`;
      const evaluation = await aiEvaluateNFT({
        userImageUrl: targetNFT.imageUrl,
        userPrompt: targetNFT.prompt,
        battleTopic: factionInfo,
        genesisImageUrl: '', // Not needed for scan
        genesisPrompt: '',
        factionName: factionInfo
      });

      return {
        type: 'scan_result',
        nftId: targetId,
        evaluation: {
          relevanceScore: evaluation.relevanceScore,
          styleMatchScore: evaluation.styleMatchScore,
          comment: evaluation.comment,
          keywords: extractKeywords(targetNFT.prompt),
          timestamp: new Date().toISOString()
        }
      };
    }

    case 'SKILL_SNIPE': {
      // Copy-Mint - Get prompt for copying
      if (!targetId) {
        throw new Error('Target NFT required');
      }

      const targetNFT = getNFT(targetId);
      if (!targetNFT) {
        throw new Error('NFT not found');
      }

      return {
        type: 'snipe_data',
        originalPrompt: targetNFT.prompt,
        engine: targetNFT.engine,
        modifyInstructions: 'You can modify up to 20% of the prompt'
      };
    }

    case 'SKILL_SHIELD': {
      // Anti-Audit - Add protection effect
      addActiveEffect({
        skillId: skill.id,
        userId,
        battleId,
        effect: {
          type: 'anti_audit_shield',
          protected: true
        }
      });

      return {
        type: 'shield_activated',
        duration: skill.effectDuration,
        message: 'Protected from audit attacks for 5 minutes'
      };
    }

    case 'SKILL_BOOST': {
      // Flash Pump - Add temporary power
      if (!targetId) {
        throw new Error('Target NFT required');
      }

      const targetNFT = getNFT(targetId);
      if (!targetNFT) {
        throw new Error('NFT not found');
      }

      const boostAmount = 500;

      addActiveEffect({
        skillId: skill.id,
        userId,
        battleId,
        targetId,
        effect: {
          type: 'flash_pump',
          boostAmount,
          basePower: targetNFT.power
        }
      });

      return {
        type: 'boost_activated',
        nftId: targetId,
        boostAmount,
        duration: skill.effectDuration,
        message: `+${boostAmount} power for 60 seconds`
      };
    }

    case 'SKILL_FOG': {
      // Fog Generator - Hide vote counts
      addActiveEffect({
        skillId: skill.id,
        userId,
        battleId,
        effect: {
          type: 'fog_of_war',
          hidden: true
        }
      });

      return {
        type: 'fog_activated',
        duration: skill.effectDuration,
        message: 'Vote counts hidden for 10 minutes'
      };
    }

    case 'SKILL_LIQUIDITY': {
      // Liquidity Boost - Boost all faction NFTs
      addActiveEffect({
        skillId: skill.id,
        userId,
        battleId,
        effect: {
          type: 'liquidity_boost',
          boostPercent: 5
        }
      });

      return {
        type: 'liquidity_activated',
        duration: skill.effectDuration,
        boostPercent: 5,
        message: 'All faction NFTs +5% power for 5 minutes'
      };
    }

    case 'SKILL_AUDIT': {
      // Audit Attack - Re-evaluate enemy NFT
      if (!targetId) {
        throw new Error('Target NFT required');
      }

      const targetNFT = getNFT(targetId);
      if (!targetNFT) {
        throw new Error('NFT not found');
      }

      // Check if target has shield
      const targetEffects = getActiveEffects(targetNFT.owner, battleId);
      const hasShield = targetEffects.some(
        e => e.effect.type === 'anti_audit_shield'
      );

      if (hasShield) {
        return {
          type: 'audit_blocked',
          nftId: targetId,
          message: 'Target has Anti-Audit shield active!'
        };
      }

      // Re-evaluate NFT
      const auditFactionInfo = targetNFT.factionName || `Faction ${targetNFT.faction}`;
      const newEvaluation = await aiEvaluateNFT({
        userImageUrl: targetNFT.imageUrl,
        userPrompt: targetNFT.prompt,
        battleTopic: auditFactionInfo,
        genesisImageUrl: '',
        genesisPrompt: '',
        factionName: auditFactionInfo
      });

      // Apply penalty (may lower score)
      const penalty = Math.floor(Math.random() * 20) + 10; // 10-30 point penalty
      newEvaluation.relevanceScore = Math.max(0, newEvaluation.relevanceScore - penalty);

      // Update NFT
      updateNFTEvaluation(targetId, newEvaluation);

      return {
        type: 'audit_complete',
        nftId: targetId,
        oldScore: targetNFT.agentEvaluation?.relevanceScore,
        newScore: newEvaluation.relevanceScore,
        penalty,
        message: `NFT audit complete. Score reduced by ${penalty}`
      };
    }

    default:
      throw new Error('Skill effect not implemented');
  }
}

/**
 * Extract keywords from prompt
 */
function extractKeywords(prompt: string): string[] {
  // Simple keyword extraction
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Return unique keywords
  return [...new Set(words)].slice(0, 10);
}

/**
 * Calculate effective power with active boosts
 */
export function calculateEffectivePower(
  basePower: number,
  userId: string,
  battleId: string
): number {
  const effects = getActiveEffects(userId, battleId);
  let multiplier = 1;

  for (const effect of effects) {
    if (effect.effect.type === 'flash_pump') {
      return basePower + effect.effect.boostAmount;
    }

    if (effect.effect.type === 'liquidity_boost') {
      multiplier *= 1 + (effect.effect.boostPercent / 100);
    }
  }

  return Math.floor(basePower * multiplier);
}

/**
 * Check if votes should be hidden (Fog effect)
 */
export function shouldHideVotes(userId: string, battleId: string): boolean {
  const effects = getActiveEffects(userId, battleId);
  return effects.some(e => e.effect.type === 'fog_of_war');
}

/**
 * Check if NFT is protected from audit
 */
export function isNFTAuditable(nftOwnerId: string, battleId: string): boolean {
  const effects = getActiveEffects(nftOwnerId, battleId);
  return !effects.some(e => e.effect.type === 'anti_audit_shield');
}

/**
 * Get skill cast history for a user
 */
export function getSkillHistory(userId: string, limit = 10): any[] {
  // This would ideally be stored in a database
  // For now, return from active effects
  const effects = getActiveEffects(userId);

  return effects.slice(0, limit).map(effect => ({
    skillId: effect.skillId,
    battleId: effect.battleId,
    targetId: effect.targetId,
    timestamp: effect.expiresAt
  }));
}
