/**
 * System Events (v4)
 * Dynamic events that affect battle gameplay
 *
 * Events:
 * - Market Crash: Token voting weight halved
 * - Timeline Distortion: Certain visual elements get power boost
 * - The Purge: Lowest power NFTs get destroyed
 * - Chaos Mode: All effects amplified
 */

import { getNFT, BattleNFT } from './battleNFT';

export type SystemEventType =
  | 'MARKET_CRASH'
  | 'TIMELINE_DISTORTION'
  | 'THE_PURGE'
  | 'CHAOS_MODE'
  | 'BLESSING';

export interface SystemEvent {
  id: string;
  type: SystemEventType;
  name: string;
  description: string;
  duration: number; // seconds
  multiplier?: number;
  keywords?: string[]; // For Timeline Distortion
  affectedCount?: number; // For The Purge
  battleId: string;
  startedAt: string;
  endsAt: string;
  metadata: Record<string, any>;
}

export interface SystemEventResult {
  event: SystemEvent;
  affectedNFTs: string[];
  powerChanges: Record<string, number>;
}

// Storage for active events
const EVENTS_KEY = 'timepics_system_events';

/**
 * Trigger a system event
 */
export function triggerEvent(
  battleId: string,
  eventType: SystemEventType,
  metadata: Record<string, any> = {}
): SystemEvent {
  const event = createEvent(battleId, eventType, metadata);
  saveEvent(event);

  return event;
}

/**
 * Create a new event
 */
function createEvent(
  battleId: string,
  eventType: SystemEventType,
  metadata: Record<string, any>
): SystemEvent {
  const eventConfigs: Record<SystemEventType, {
    name: string;
    description: string;
    duration: number;
    multiplier?: number;
    keywords?: string[];
    affectedCount?: number;
  }> = {
    MARKET_CRASH: {
      name: 'Market Crash',
      description: 'All token voting weight halved for 10 minutes!',
      duration: 600,
      multiplier: 0.5
    },
    TIMELINE_DISTORTION: {
      name: 'Timeline Distortion',
      description: 'NFTs with certain visual elements get 2x power!',
      duration: 300,
      multiplier: 2,
      keywords: metadata.keywords || ['fire', 'water', 'light', 'shadow']
    },
    THE_PURGE: {
      name: 'The Purge',
      description: 'The weakest NFTs in each faction will be destroyed!',
      duration: 0, // Instant
      affectedCount: metadata.affectedCount || 3
    },
    CHAOS_MODE: {
      name: 'Chaos Mode',
      description: 'All power effects amplified!',
      duration: 300,
      multiplier: 1.5
    },
    BLESSING: {
      name: 'Divine Blessing',
      description: 'All participants receive bonus tokens!',
      duration: 0 // Instant
    }
  };

  const config = eventConfigs[eventType];
  const now = new Date();
  const endsAt = new Date(now.getTime() + config.duration * 1000);

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: eventType,
    name: config.name,
    description: config.description,
    duration: config.duration,
    multiplier: config.multiplier,
    keywords: config.keywords,
    affectedCount: config.affectedCount,
    battleId,
    startedAt: now.toISOString(),
    endsAt: config.duration > 0 ? endsAt.toISOString() : now.toISOString(),
    metadata
  };
}

/**
 * Load events from storage
 */
function loadEvents(): SystemEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }

  return [];
}

/**
 * Save events to storage
 */
function saveEvent(event: SystemEvent): void {
  if (typeof window === 'undefined') return;

  try {
    const events = loadEvents();
    events.push(event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save event:', error);
  }
}

/**
 * Get active events for a battle
 */
export function getActiveEvents(battleId: string): SystemEvent[] {
  const events = loadEvents();
  const now = new Date();

  return events.filter(event =>
    event.battleId === battleId &&
    new Date(event.endsAt) > now
  );
}

/**
 * Get event by ID
 */
export function getEvent(eventId: string): SystemEvent | undefined {
  const events = loadEvents();
  return events.find(e => e.id === eventId);
}

/**
 * Apply event effects to an NFT
 */
export function applyEventEffects(
  nft: BattleNFT,
  battleId: string
): { effectivePower: number; effects: string[] } {
  const activeEvents = getActiveEvents(battleId);
  let effectivePower = nft.power;
  const effects: string[] = [];

  for (const event of activeEvents) {
    switch (event.type) {
      case 'MARKET_CRASH':
        // Token-backed power is halved
        if (nft.backedAmount > 0) {
          effectivePower -= Math.floor(nft.backedAmount * 0.5);
          effects.push('Market Crash: Token power halved');
        }
        break;

      case 'TIMELINE_DISTORTION':
        // Check if NFT matches keywords
        if (event.keywords) {
          const nftKeywords = extractNFTKeywords(nft);
          const hasMatch = event.keywords.some(k =>
            nftKeywords.includes(k.toLowerCase())
          );

          if (hasMatch) {
            const boost = Math.floor(nft.power * (event.multiplier! - 1));
            effectivePower += boost;
            effects.push(`Timeline Distortion: +${boost} power (keyword match)`);
          }
        }
        break;

      case 'CHAOS_MODE':
        // All effects amplified
        const chaosBoost = Math.floor(nft.power * (event.multiplier! - 1));
        effectivePower += chaosBoost;
        effects.push(`Chaos Mode: +${chaosBoost} power`);
        break;
    }
  }

  return { effectivePower: Math.max(0, effectivePower), effects };
}

/**
 * Execute The Purge event
 */
export function executePurge(battleId: string): SystemEventResult {
  const event = triggerEvent(battleId, 'THE_PURGE', { affectedCount: 3 });

  // This would be called by the battle controller
  // Returns affected NFTs for the controller to process

  return {
    event,
    affectedNFTs: [], // Will be populated by controller
    powerChanges: {}
  };
}

/**
 * Execute Blessing event (instant reward)
 */
export function executeBlessing(battleId: string, amount: number = 50): SystemEventResult {
  const event = triggerEvent(battleId, 'BLESSING', { bonusAmount: amount });

  return {
    event,
    affectedNFTs: [],
    powerChanges: {}
  };
}

/**
 * Extract keywords from NFT
 */
function extractNFTKeywords(nft: BattleNFT): string[] {
  const prompt = nft.prompt.toLowerCase();
  const keywords = prompt.split(/[\s,]+/).filter(w => w.length > 3);
  return [...new Set(keywords)];
}

/**
 * Check if any special event is active
 */
export function isEventActive(battleId: string, eventType: SystemEventType): boolean {
  const events = getActiveEvents(battleId);
  return events.some(e => e.type === eventType);
}

/**
 * Get event history for a battle
 */
export function getEventHistory(battleId: string): SystemEvent[] {
  const events = loadEvents();
  return events
    .filter(e => e.battleId === battleId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

/**
 * AI Decision Helper: Get recommended event based on battle state
 */
export function getRecommendedEvent(battleId: string): SystemEventType | null {
  const events = getActiveEvents(battleId);
  if (events.length > 0) return null;

  // Check faction power balance
  // This would ideally receive actual power values from controller

  // Random event selection for demo
  const eventTypes: SystemEventType[] = [
    'MARKET_CRASH',
    'TIMELINE_DISTORTION',
    'THE_PURGE',
    'CHAOS_MODE'
  ];

  return eventTypes[Math.floor(Math.random() * eventTypes.length)];
}

/**
 * Clear old events (cleanup)
 */
export function clearOldEvents(): void {
  if (typeof window === 'undefined') return;

  const events = loadEvents();
  const now = new Date();

  const validEvents = events.filter(e => new Date(e.endsAt) > now);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(validEvents));
}

// Auto-cleanup on load
if (typeof window !== 'undefined') {
  clearOldEvents();
}
