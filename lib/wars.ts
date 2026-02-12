/**
 * Timeline Wars - Staking and Voting System
 *
 * Handles NFT staking, voting, and reward distribution
 * for community-driven timeline battles
 */

import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createConnection } from './solana';

/**
 * Timeline Event Structure
 */
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  factionA: Faction;
  factionB: Faction;
  status: 'active' | 'ended' | 'finalized';
  totalStaked: number;
  totalParticipants: number;
  prizePool: number; // in SOL
  winner?: 'factionA' | 'factionB' | null;
}

/**
 * Faction Structure
 */
export interface Faction {
  id: string;
  name: string;
  theme: string;
  description: string;
  color: string;
  icon: string;
  stakedNFTs: number;
  participants: number;
  totalPower: number; // Calculated from NFT quality + quantity
  aiPromptStyle: string;
  visualExample: string;
}

/**
 * Staked NFT Record
 */
export interface StakedNFT {
  id: string;
  mintAddress: string;
  owner: string;
  eventId: string;
  factionId: string;
  stakedAt: string;
  power: number; // Quality score (0-100)
  entropy: number; // Age affects power
  locked: boolean;
}

/**
 * Participant Record
 */
export interface Participant {
  wallet: string;
  eventId: string;
  factionId: string;
  joinedAt: string;
  stakedNFTs: string[]; // Array of NFT mint addresses
  totalPower: number;
  rewardsClaimed: boolean;
}

/**
 * Calculate NFT power based on quality and entropy
 */
export function calculateNFTPower(nft: {
  entropy: number;
  mintDate: string;
  engine: string;
}): number {
  // Base power from freshness (inverse of entropy)
  const freshnessPower = Math.max(0, 100 - nft.entropy);

  // Engine bonus
  const engineBonus = {
    rewind: 1.0,
    refract: 1.2, // Historical accuracy bonus
    foresee: 1.1,
  }[nft.engine] || 1.0;

  // Days since mint affects power (newer = more power)
  const daysSinceMint = Math.floor(
    (Date.now() - new Date(nft.mintDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const agePenalty = Math.min(daysSinceMint * 0.5, 20); // Max 20 point penalty

  const totalPower = Math.max(1, (freshnessPower - agePenalty) * engineBonus);

  return Math.round(totalPower);
}

/**
 * Calculate faction win probability
 */
export function calculateWinProbability(
  factionPower: number,
  totalPower: number
): number {
  if (totalPower === 0) return 50;
  return Math.round((factionPower / totalPower) * 100);
}

/**
 * Determine battle winner
 */
export function determineWinner(event: TimelineEvent): 'factionA' | 'factionB' | null {
  if (event.status !== 'ended') return null;

  const powerA = event.factionA.totalPower;
  const powerB = event.factionB.totalPower;

  if (powerA > powerB) return 'factionA';
  if (powerB > powerA) return 'factionB';
  return null; // Draw - split rewards
}

/**
 * Calculate rewards for participant
 */
export function calculateRewards(
  participant: Participant,
  event: TimelineEvent
): {
  solReward: number;
  nftStatus: 'canonical' | 'paradox';
  badge: string;
} {
  const winner = determineWinner(event);

  if (!winner || winner !== (participant.factionId === event.factionA.id ? 'factionA' : 'factionB')) {
    // Losing side
    return {
      solReward: 0,
      nftStatus: 'paradox',
      badge: '💀 Paradox Timeline',
    };
  }

  // Winning side - calculate proportional reward
  const winningFaction = winner === 'factionA' ? event.factionA : event.factionB;
  const participantShare = participant.totalPower / winningFaction.totalPower;
  const solReward = event.prizePool * participantShare;

  return {
    solReward,
    nftStatus: 'canonical',
    badge: '🏆 Canonical History',
  };
}

/**
 * Create stake transaction
 */
export async function createStakeTransaction(
  wallet: PublicKey,
  nftMint: PublicKey,
  eventId: string,
  factionId: string
): Promise<Transaction> {
  const connection = createConnection();
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: wallet,
    blockhash,
    lastValidBlockHeight,
  });

  // In a real implementation, this would:
  // 1. Transfer NFT to escrow PDA
  // 2. Record stake in program state
  // 3. Update faction power
  //
  // For demo, we'll use a simple SOL transfer to simulate

  const STAKE_FEE = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL staking fee

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet,
      toPubkey: new PublicKey('TimePicsWarsVault11111111111111111111111'), // Demo vault
      lamports: STAKE_FEE,
    })
  );

  return transaction;
}

/**
 * Create unstake transaction (after event ends)
 */
export async function createUnstakeTransaction(
  wallet: PublicKey,
  nftMint: PublicKey,
  eventId: string
): Promise<Transaction> {
  const connection = createConnection();
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: wallet,
    blockhash,
    lastValidBlockHeight,
  });

  // In real implementation:
  // 1. Transfer NFT back from escrow
  // 2. Apply canonical/paradox badge
  // 3. Transfer rewards if winner

  return transaction;
}

/**
 * Apply NFT badge based on battle outcome
 */
export function applyNFTBadge(
  nft: any,
  status: 'canonical' | 'paradox'
): {
  updatedMetadata: any;
  visualEffect: string;
} {
  if (status === 'canonical') {
    return {
      updatedMetadata: {
        ...nft,
        attributes: [
          ...nft.attributes,
          { trait_type: 'Timeline Status', value: 'Canonical History' },
          { trait_type: 'Wars Badge', value: '🏆 Victor' },
        ],
      },
      visualEffect: 'border-4 border-yellow-400 shadow-glow-cta',
    };
  }

  // Paradox timeline - glitch art effect
  return {
    updatedMetadata: {
      ...nft,
      attributes: [
        ...nft.attributes,
        { trait_type: 'Timeline Status', value: 'Paradox Timeline' },
        { trait_type: 'Wars Badge', value: '💀 Paradox' },
      ],
    },
    visualEffect: 'filter saturate-150 hue-rotate-15 contrast-125',
  };
}

/**
 * Mock data for active event
 */
export function getActiveEvent(): TimelineEvent {
  return {
    id: 'event-001',
    title: '2000 Internet Bubble Collapse',
    description: 'What if the dot-com bubble burst was total and irreversible? Two possible futures emerge...',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    totalStaked: 156,
    totalParticipants: 89,
    prizePool: 500,
    factionA: {
      id: 'steampunk',
      name: 'Steam Revolution',
      theme: 'Steampunk Renaissance',
      description: 'Technology regressed to mechanical engineering. Steam power, brass gears, and Victorian aesthetics dominate.',
      color: '#CD7F32',
      icon: '⚙️',
      stakedNFTs: 67,
      participants: 42,
      totalPower: 6234,
      aiPromptStyle: 'steampunk, brass machinery, Victorian era, steam-powered technology, retrofuturistic, gears and cogs',
      visualExample: '',
    },
    factionB: {
      id: 'biopunk',
      name: 'Bio Genesis',
      theme: 'Biopunk Evolution',
      description: 'Humanity turned to biological engineering. Living buildings, genetic modifications, and organic technology.',
      color: '#10B981',
      icon: '🧬',
      stakedNFTs: 89,
      participants: 47,
      totalPower: 8456,
      aiPromptStyle: 'biopunk, organic architecture, genetic engineering, living technology, bio-integrated cities, nature fusion',
      visualExample: '',
    },
  };
}
