/**
 * Global Battle Storage
 * Centralized storage for active battles (MVP - in-memory)
 */

import { BattleController } from '@/lib/agents/BattleController';

// Global battle storage
const activeBattles = new Map<string, BattleController>();

/**
 * Add a battle to storage
 */
export function addBattle(battleId: string, controller: BattleController): void {
  activeBattles.set(battleId, controller);
}

/**
 * Get a battle from storage
 */
export function getBattle(battleId: string): BattleController | undefined {
  return activeBattles.get(battleId);
}

/**
 * Get all battles
 */
export function getAllBattles(): BattleController[] {
  return Array.from(activeBattles.values());
}

/**
 * Remove a battle from storage
 */
export function removeBattle(battleId: string): boolean {
  return activeBattles.delete(battleId);
}

/**
 * Check if battle exists
 */
export function hasBattle(battleId: string): boolean {
  return activeBattles.has(battleId);
}

/**
 * Get active battles count
 */
export function getActiveBattlesCount(): number {
  return activeBattles.size;
}
