/**
 * NFT State Management Utility
 * Manages NFT entropy and lock states in localStorage
 */

export interface NFTState {
  id: string;
  entropy: number;
  locked: boolean;
  lastUpdate: string;
  frozenAt?: string;
  frozenEntropy?: number;
}

const STORAGE_KEY = 'timepics_nft_states';

/**
 * Get all NFT states from localStorage
 */
export function getAllNFTStates(): Record<string, NFTState> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to read NFT states:', error);
    return {};
  }
}

/**
 * Get a specific NFT's state
 */
export function getNFTState(nftId: string): NFTState | null {
  const allStates = getAllNFTStates();
  return allStates[nftId] || null;
}

/**
 * Update or create NFT state
 */
export function updateNFTState(nftId: string, updates: Partial<NFTState>): NFTState {
  const allStates = getAllNFTStates();
  const currentState = allStates[nftId] || {
    id: nftId,
    entropy: 0,
    locked: false,
    lastUpdate: new Date().toISOString(),
  };

  const newState: NFTState = {
    ...currentState,
    ...updates,
    lastUpdate: new Date().toISOString(),
  };

  allStates[nftId] = newState;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
  } catch (error) {
    console.error('Failed to save NFT state:', error);
  }

  return newState;
}

/**
 * Freeze an NFT at its current entropy
 */
export function freezeNFT(nftId: string, currentEntropy: number): NFTState {
  return updateNFTState(nftId, {
    locked: true,
    entropy: currentEntropy,
    frozenAt: new Date().toISOString(),
    frozenEntropy: currentEntropy,
  });
}

/**
 * Accelerate NFT entropy
 */
export function accelerateNFT(nftId: string, currentEntropy: number, amount: number = 20): NFTState {
  const newEntropy = Math.min(currentEntropy + amount, 100);
  return updateNFTState(nftId, {
    entropy: newEntropy,
  });
}

/**
 * Calculate entropy based on days since mint
 * Formula: entropy = min(100, daysSinceMint * 2)
 * Can be customized per use case
 */
export function calculateEntropy(mintDate: string, baseEntropy: number = 0): number {
  const mint = new Date(mintDate);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - mint.getTime()) / (1000 * 60 * 60 * 24));

  // Base calculation: 2% entropy per day
  const calculatedEntropy = Math.min(100, daysSince * 2);

  // Add any manual adjustments (from accelerate)
  return Math.min(100, calculatedEntropy + baseEntropy);
}

/**
 * Get NFT entropy, considering both time-based decay and manual adjustments
 */
export function getNFTEntropy(nftId: string, mintDate: string, initialEntropy: number = 0): number {
  const state = getNFTState(nftId);

  // If locked, return frozen entropy
  if (state?.locked) {
    return state.frozenEntropy || state.entropy;
  }

  // Otherwise calculate time-based entropy + any accelerations
  const baseEntropy = state?.entropy || initialEntropy;
  return calculateEntropy(mintDate, baseEntropy - initialEntropy);
}

/**
 * Check if NFT is locked
 */
export function isNFTLocked(nftId: string): boolean {
  const state = getNFTState(nftId);
  return state?.locked || false;
}

/**
 * Clear all NFT states (for testing/reset)
 */
export function clearAllNFTStates(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
