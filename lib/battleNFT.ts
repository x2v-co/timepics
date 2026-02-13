/**
 * Battle NFT System v3/v4
 * Links Arcade Tokens to NFT minting for battle participation
 * Each NFT represents a "bet" on a specific Agent in a battle
 *
 * v3 Features:
 * - Genesis NFTs (5000 power, Agent-generated)
 * - AI Evaluation (relevanceScore, styleMatchScore)
 * - Audience Backing (patron system)
 * - Visual Effects (Canonical/Paradox status)
 *
 * v4 Features:
 * - Agent Skills support
 * - Paradox Engine topics
 * - Rogue Agent detection
 */

// NFT Role Types (v3)
export type NFTRole = 'GENESIS' | 'USER_SUBMITTED' | 'ROGUE_AGENT';

// NFT Status Types (v3)
export type NFTStatus = 'PENDING' | 'CANONICAL' | 'PARADOX';

// Visual Trait Types (v3)
export type FrameType = 'default' | 'gold' | 'cracked' | 'glitch' | 'holographic';
export type OverlayType = 'none' | 'shiny' | 'noise' | 'glow' | 'chaos';

export interface VisualTraits {
  frame: FrameType;
  overlay: OverlayType;
  badge: string | null;  // e.g., "VICTOR", "FALLEN", "ROGUE", "LEGENDARY"
  effectVersion: string; // Track which effect was applied
}

// AI Evaluation Result (v3)
export interface AgentEvaluation {
  relevanceScore: number;        // 0-100: Topic relevance
  styleMatchScore: number;       // 0-100: Style match with Genesis
  comment: string;               // AI critic comment
  evaluatedAt: string;           // ISO timestamp
  confidence: number;            // 0-1: AI confidence
}

// Backer/PATRON info (v3)
export interface Backer {
  userId: string;
  amount: number;                // Tokens backed
  timestamp: string;             // When they backed
}

// Extended BattleNFT for v3/v4
export interface BattleNFT {
  id: string;                    // Unique NFT ID
  mintAddress?: string;          // Solana mint address (if minted on-chain)
  owner: string;                 // User ID
  battleId: string;              // Which battle this NFT is for
  faction: 'A' | 'B';           // Which agent/faction

  // NFT Metadata
  name: string;
  description: string;
  imageUrl: string;              // Generated or selected image
  imageCID?: string;             // IPFS CID for image
  engine: 'rewind' | 'refract' | 'foresee';
  prompt: string;

  // v3: NFT Role (Genesis, User, Rogue)
  role: NFTRole;
  status: NFTStatus;              // PENDING -> CANONICAL/PARADOX after battle

  // v3: Visual Traits
  visualTraits: VisualTraits;

  // v3: AI Evaluation
  agentEvaluation?: AgentEvaluation;

  // v3: Patron System
  backedAmount: number;           // Total tokens from backers
  backers: Backer[];             // List of patrons

  // Living NFT properties
  mintDate: string;
  entropy: number;               // 0-100, increases over time
  frozen: boolean;               // If true, entropy stops increasing

  // Battle-specific properties
  power: number;                 // Battle power (v3 formula: AI scores + stake)
  staked: boolean;               // Whether staked in the battle
  stakedAt?: string;

  // Battle context (for skills and evaluation)
  battleTopic?: string;
  factionName?: string;

  // Token economics
  mintCost: number;              // Arcade Tokens spent to mint
  potentialReward: number;       // Potential payout if faction wins

  // v4: Skill Effects
  skillEffects: {
    shieldUntil?: string;        // Anti-Audit shield expiry
    temporaryBoost?: number;      // Flash Pump bonus
    boostedUntil?: string;       // Boost expiry
  };

  // Results (after battle ends)
  battleEnded: boolean;
  won?: boolean;
  reward?: number;
  finalImageUrl?: string;        // Image URL after battle effects applied
  finalImageCID?: string;        // IPFS CID for final image

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Storage key
const STORAGE_KEY = 'timepics_battle_nfts';

/**
 * Get all NFTs for a user
 */
export function getUserNFTs(userId: string): BattleNFT[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allNFTs: BattleNFT[] = JSON.parse(stored);
    return allNFTs.filter(nft => nft.owner === userId);
  } catch (error) {
    console.error('Failed to load user NFTs:', error);
    return [];
  }
}

/**
 * Get NFTs for a specific battle
 */
export function getBattleNFTs(battleId: string): BattleNFT[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allNFTs: BattleNFT[] = JSON.parse(stored);
    return allNFTs.filter(nft => nft.battleId === battleId);
  } catch (error) {
    console.error('Failed to load battle NFTs:', error);
    return [];
  }
}

/**
 * Get a specific NFT by ID
 */
export function getNFT(nftId: string): BattleNFT | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const allNFTs: BattleNFT[] = JSON.parse(stored);
    return allNFTs.find(nft => nft.id === nftId) || null;
  } catch (error) {
    console.error('Failed to load NFT:', error);
    return null;
  }
}

/**
 * Calculate NFT power based on v3 formula
 * Power = AI Score (relevance + style) / 2 + mintCost + backedAmount
 * Genesis NFTs have fixed 5000 power
 */
export function calculateNFTPower(nft: {
  role?: NFTRole;
  relevanceScore?: number;
  styleMatchScore?: number;
  mintCost: number;
  backedAmount?: number;
}): number {
  // Genesis NFTs have fixed high power
  if (nft.role === 'GENESIS') {
    return 5000;
  }

  // Calculate AI score (average of relevance and style)
  const relevance = nft.relevanceScore || 0;
  const styleMatch = nft.styleMatchScore || 0;
  const aiScore = (relevance + styleMatch) / 2;

  // v3 Formula: AI Score + Mint Cost + Backer Support
  const backedAmount = nft.backedAmount || 0;
  const totalPower = aiScore + nft.mintCost + backedAmount;

  return Math.round(Math.max(10, totalPower)); // Minimum 10 power
}

/**
 * Legacy power calculation (for backward compatibility)
 */
export function calculateLegacyPower(nft: {
  entropy: number;
  mintDate: string;
  engine: string;
  frozen: boolean;
}): number {
  if (nft.frozen) {
    return Math.max(1, 100 - nft.entropy);
  }

  const freshnessPower = Math.max(0, 100 - nft.entropy);

  const engineBonus = {
    rewind: 1.1,
    refract: 1.2,
    foresee: 1.15,
  }[nft.engine] || 1.0;

  const daysSinceMint = Math.floor(
    (Date.now() - new Date(nft.mintDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const agePenalty = Math.min(daysSinceMint * 0.5, 20);

  return Math.round(Math.max(1, (freshnessPower - agePenalty) * engineBonus));
}

/**
 * Mint a new Battle NFT (v3 version)
 * Costs Arcade Tokens instead of SOL
 */
export function mintBattleNFT(config: {
  userId: string;
  battleId: string;
  faction: 'A' | 'B';
  factionName: string;
  battleTopic: string;
  imageUrl: string;
  imageCID?: string;
  engine: 'rewind' | 'refract' | 'foresee';
  prompt: string;
  mintCost: number;
  role?: NFTRole;  // v3: Genesis, User, or Rogue
}): BattleNFT {
  const now = new Date().toISOString();

  const role = config.role || 'USER_SUBMITTED';

  const nft: BattleNFT = {
    id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    owner: config.userId,
    battleId: config.battleId,
    faction: config.faction,

    name: role === 'GENESIS'
      ? `🌟 Genesis - ${config.factionName}`
      : `${config.factionName} - Battle NFT`,
    description: role === 'GENESIS'
      ? `Genesis NFT for battle: ${config.battleTopic}`
      : `${config.battleTopic} - Supporting ${config.factionName}`,
    imageUrl: config.imageUrl,
    imageCID: config.imageCID,
    engine: config.engine,
    prompt: config.prompt,

    // v3: Role and Status
    role,
    status: 'PENDING',

    // v3: Visual Traits (default)
    visualTraits: {
      frame: 'default',
      overlay: 'none',
      badge: role === 'GENESIS' ? 'GENESIS' : null,
      effectVersion: '1.0'
    },

    // v3: Patron System
    backedAmount: 0,
    backers: [],

    mintDate: now,
    entropy: 0,
    frozen: false,

    // Power will be calculated based on AI evaluation
    power: 0,
    staked: false,

    mintCost: config.mintCost,
    potentialReward: 0,

    // v4: Skill Effects
    skillEffects: {},

    battleEnded: false,

    createdAt: now,
    updatedAt: now
  };

  // Calculate initial power
  nft.power = calculateNFTPower({
    role: nft.role,
    mintCost: nft.mintCost
  });

  // Save to storage
  saveNFT(nft);

  console.log(`[BattleNFT v3] Minted ${role} NFT ${nft.id} for user ${config.userId}`);

  return nft;
}

/**
 * Create a Genesis NFT (v3)
 * Called automatically when battle starts
 */
export function createGenesisNFT(config: {
  battleId: string;
  faction: 'A' | 'B';
  factionName: string;
  imageUrl: string;
  imageCID?: string;
  prompt: string;
  engine: 'rewind' | 'refract' | 'foresee';
  battleTopic: string;
  aiEvaluation?: AgentEvaluation;  // Optional AI pre-evaluation
}): BattleNFT {
  const genesisNFT = mintBattleNFT({
    userId: 'SYSTEM',  // Genesis NFTs owned by system
    battleId: config.battleId,
    faction: config.faction,
    factionName: config.factionName,
    battleTopic: config.battleTopic,
    imageUrl: config.imageUrl,
    imageCID: config.imageCID,
    engine: config.engine,
    prompt: config.prompt,
    mintCost: 0,  // Genesis NFTs don't cost tokens
    role: 'GENESIS'
  });

  // Set AI evaluation if provided
  if (config.aiEvaluation) {
    genesisNFT.agentEvaluation = config.aiEvaluation;
    // Recalculate power with AI scores
    genesisNFT.power = calculateNFTPower({
      role: 'GENESIS',
      relevanceScore: config.aiEvaluation.relevanceScore,
      styleMatchScore: config.aiEvaluation.styleMatchScore,
      mintCost: 0
    });
    saveNFT(genesisNFT);
  }

  console.log(`[BattleNFT v3] Created Genesis NFT for faction ${config.faction}: ${genesisNFT.id}`);

  return genesisNFT;
}

/**
 * Create a Rogue Agent NFT (v3)
 * Called when System Agent intervenes to balance the battle
 */
export function createRogueAgentNFT(config: {
  battleId: string;
  faction: 'A' | 'B';
  factionName: string;
  imageUrl: string;
  imageCID?: string;
  prompt: string;
  engine: 'rewind' | 'refract' | 'foresee';
  battleTopic: string;
  aiEvaluation?: AgentEvaluation;
}): BattleNFT {
  const rogueNFT = mintBattleNFT({
    userId: 'ROGUE_AGENT',
    battleId: config.battleId,
    faction: config.faction,
    factionName: `${config.factionName} (Rogue)`,
    battleTopic: config.battleTopic,
    imageUrl: config.imageUrl,
    imageCID: config.imageCID,
    engine: config.engine,
    prompt: config.prompt,
    mintCost: 0,  // System pays for Rogue agents
    role: 'ROGUE_AGENT'
  });

  // Set visual traits for Rogue
  rogueNFT.visualTraits = {
    frame: 'cracked',
    overlay: 'chaos',
    badge: 'ROGUE',
    effectVersion: '1.0'
  };

  if (config.aiEvaluation) {
    rogueNFT.agentEvaluation = config.aiEvaluation;
  }

  saveNFT(rogueNFT);

  console.log(`[BattleNFT v3] Rogue Agent NFT created for faction ${config.faction}: ${rogueNFT.id}`);

  return rogueNFT;
}

/**
 * Stake an NFT in a battle (v3 version)
 */
export function stakeNFT(nftId: string, potentialReward: number): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft) return null;

  if (nft.staked) {
    console.warn('NFT already staked');
    return nft;
  }

  nft.staked = true;
  nft.stakedAt = new Date().toISOString();
  nft.potentialReward = potentialReward;

  // Recalculate power with AI evaluation if available
  nft.power = calculateNFTPower({
    role: nft.role,
    relevanceScore: nft.agentEvaluation?.relevanceScore,
    styleMatchScore: nft.agentEvaluation?.styleMatchScore,
    mintCost: nft.mintCost,
    backedAmount: nft.backedAmount
  });

  saveNFT(nft);

  console.log(`[BattleNFT v3] Staked NFT ${nftId} with power ${nft.power}`);

  return nft;
}

/**
 * Add AI evaluation to an NFT (v3)
 * Called after user mints their NFT
 */
export function evaluateNFT(
  nftId: string,
  evaluation: AgentEvaluation
): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft) return null;

  nft.agentEvaluation = evaluation;
  nft.updatedAt = new Date().toISOString();

  // Recalculate power with AI scores
  nft.power = calculateNFTPower({
    role: nft.role,
    relevanceScore: evaluation.relevanceScore,
    styleMatchScore: evaluation.styleMatchScore,
    mintCost: nft.mintCost,
    backedAmount: nft.backedAmount
  });

  saveNFT(nft);

  console.log(`[BattleNFT v3] NFT ${nftId} evaluated: relevance=${evaluation.relevanceScore}, style=${evaluation.styleMatchScore}, power=${nft.power}`);

  return nft;
}

/**
 * Add backer support to an NFT (v3)
 * Patron system - users can back favorite NFTs
 */
export function backNFT(
  nftId: string,
  userId: string,
  amount: number
): { success: boolean; nft?: BattleNFT; error?: string } {
  const nft = getNFT(nftId);
  if (!nft) {
    return { success: false, error: 'NFT not found' };
  }

  if (nft.status !== 'PENDING') {
    return { success: false, error: 'Cannot back NFT - battle already ended' };
  }

  if (nft.owner === userId) {
    return { success: false, error: 'Cannot back your own NFT' };
  }

  // Add backer
  nft.backers.push({
    userId,
    amount,
    timestamp: new Date().toISOString()
  });

  nft.backedAmount += amount;
  nft.updatedAt = new Date().toISOString();

  // Recalculate power
  nft.power = calculateNFTPower({
    role: nft.role,
    relevanceScore: nft.agentEvaluation?.relevanceScore,
    styleMatchScore: nft.agentEvaluation?.styleMatchScore,
    mintCost: nft.mintCost,
    backedAmount: nft.backedAmount
  });

  saveNFT(nft);

  console.log(`[BattleNFT v3] User ${userId} backed NFT ${nftId} with ${amount} tokens. Total: ${nft.backedAmount}`);

  return { success: true, nft };
}

/**
 * Update NFT after battle ends (v3 version)
 * Applies visual effects and rewards
 */
export function settleBattleNFT(
  nftId: string,
  won: boolean,
  reward: number,
  finalImageUrl?: string,
  finalImageCID?: string
): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft) return null;

  nft.battleEnded = true;
  nft.won = won;
  nft.reward = reward;
  nft.finalImageUrl = finalImageUrl || nft.imageUrl;
  nft.finalImageCID = finalImageCID || nft.imageCID;

  // v3: Update status based on outcome
  if (won) {
    nft.status = 'CANONICAL';
    nft.visualTraits = {
      frame: 'gold',
      overlay: 'shiny',
      badge: 'VICTOR',
      effectVersion: 'v3-canonical'
    };
  } else {
    nft.status = 'PARADOX';
    nft.visualTraits = {
      frame: 'cracked',
      overlay: 'noise',
      badge: 'FALLEN',
      effectVersion: 'v3-paradox'
    };
  }

  nft.updatedAt = new Date().toISOString();
  saveNFT(nft);

  console.log(`[BattleNFT v3] Settled NFT ${nftId} - Won: ${won}, Reward: ${reward}, Status: ${nft.status}`);

  return nft;
}

/**
 * Freeze NFT (stop entropy increase)
 */
export function freezeNFT(nftId: string): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft) return null;

  nft.frozen = true;

  saveNFT(nft);

  console.log(`[BattleNFT] Froze NFT ${nftId} at entropy ${nft.entropy}`);

  return nft;
}

/**
 * Accelerate NFT entropy
 */
export function accelerateNFT(nftId: string, amount: number = 20): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft || nft.frozen) return null;

  nft.entropy = Math.min(100, nft.entropy + amount);
  nft.power = calculateNFTPower(nft);

  saveNFT(nft);

  console.log(`[BattleNFT] Accelerated NFT ${nftId} to entropy ${nft.entropy}`);

  return nft;
}

/**
 * Update NFT entropy based on time passed
 */
export function updateNFTEntropy(nftId: string): BattleNFT | null {
  const nft = getNFT(nftId);
  if (!nft || nft.frozen) return nft;

  const daysSinceMint = Math.floor(
    (Date.now() - new Date(nft.mintDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // 2% entropy per day
  const calculatedEntropy = Math.min(100, daysSinceMint * 2);

  if (calculatedEntropy !== nft.entropy) {
    nft.entropy = calculatedEntropy;
    nft.power = calculateNFTPower(nft);
    saveNFT(nft);
  }

  return nft;
}

/**
 * Get NFT stats
 */
export function getNFTStats(userId: string): {
  totalNFTs: number;
  stakedNFTs: number;
  totalPower: number;
  wonBattles: number;
  totalRewards: number;
} {
  const nfts = getUserNFTs(userId);

  return {
    totalNFTs: nfts.length,
    stakedNFTs: nfts.filter(nft => nft.staked).length,
    totalPower: nfts.reduce((sum, nft) => sum + nft.power, 0),
    wonBattles: nfts.filter(nft => nft.won === true).length,
    totalRewards: nfts.reduce((sum, nft) => sum + (nft.reward || 0), 0)
  };
}

/**
 * Get NFTs for gallery display (v3 enhanced)
 */
export function getGalleryNFTs(userId: string, filter?: {
  staked?: boolean;
  battleEnded?: boolean;
  won?: boolean;
  status?: NFTStatus;           // v3: Filter by Canonical/Paradox
  role?: NFTRole;              // v3: Filter by Genesis/User/Rogue
}): BattleNFT[] {
  let nfts = getUserNFTs(userId);

  if (filter) {
    if (filter.staked !== undefined) {
      nfts = nfts.filter(nft => nft.staked === filter.staked);
    }
    if (filter.battleEnded !== undefined) {
      nfts = nfts.filter(nft => nft.battleEnded === filter.battleEnded);
    }
    if (filter.won !== undefined) {
      nfts = nfts.filter(nft => nft.won === filter.won);
    }
    if (filter.status !== undefined) {
      nfts = nfts.filter(nft => nft.status === filter.status);
    }
    if (filter.role !== undefined) {
      nfts = nfts.filter(nft => nft.role === filter.role);
    }
  }

  // Update entropy for all NFTs
  nfts.forEach(nft => updateNFTEntropy(nft.id));

  // Sort by: Genesis first, then by power, then by date
  return nfts.sort((a, b) => {
    // Genesis NFTs first
    if (a.role === 'GENESIS' && b.role !== 'GENESIS') return -1;
    if (b.role === 'GENESIS' && a.role !== 'GENESIS') return 1;

    // Then by power
    if (b.power !== a.power) return b.power - a.power;

    // Then by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Save NFT to storage
 */
function saveNFT(nft: BattleNFT): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allNFTs: BattleNFT[] = stored ? JSON.parse(stored) : [];

    const index = allNFTs.findIndex(n => n.id === nft.id);
    if (index >= 0) {
      allNFTs[index] = nft;
    } else {
      allNFTs.push(nft);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allNFTs));
  } catch (error) {
    console.error('Failed to save NFT:', error);
  }
}

/**
 * Clear all NFTs (for testing)
 */
export function clearAllNFTs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
