/**
 * Arcade Token Manager
 * Manages off-chain tokens for gas-free participation
 */

/**
 * User's Arcade Token balance
 */
export interface ArcadeBalance {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastDailyLogin?: string;
  transactions: ArcadeTransaction[];
}

export interface ArcadeTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  timestamp: Date;
  balanceAfter: number;
}

/**
 * Earning amounts
 */
export const ARCADE_EARNINGS = {
  DAILY_LOGIN: 100,
  WATCH_BATTLE: 10,
  VOTE: 5,
  SHARE_SOCIAL: 50,
  REFER_FRIEND: 200,
  WIN_BET_BONUS: 20,  // Bonus on top of bet returns
  BATTLE_PARTICIPATION: 15
};

/**
 * Spending amounts
 */
export const ARCADE_SPENDING = {
  BET_MIN: 10,
  BET_MAX: 1000,
  EXTRA_VOTES: 20,
  BOOST_AGENT: 50,
  CREATE_BATTLE: 500
};

const STORAGE_KEY = 'timepics_arcade_balances';

/**
 * Get user's balance
 */
export function getArcadeBalance(userId: string): ArcadeBalance {
  if (typeof window === 'undefined') {
    return createNewBalance(userId);
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createNewBalance(userId);
    }

    const allBalances: Record<string, ArcadeBalance> = JSON.parse(stored);
    return allBalances[userId] || createNewBalance(userId);
  } catch (error) {
    console.error('Failed to load arcade balance:', error);
    return createNewBalance(userId);
  }
}

/**
 * Create new balance for user
 */
function createNewBalance(userId: string): ArcadeBalance {
  return {
    userId,
    balance: 100,  // Starting bonus
    totalEarned: 100,
    totalSpent: 0,
    transactions: [
      {
        id: `tx-${Date.now()}`,
        type: 'earn',
        amount: 100,
        reason: 'Welcome bonus',
        timestamp: new Date(),
        balanceAfter: 100
      }
    ]
  };
}

/**
 * Save balance to storage
 */
function saveBalance(balance: ArcadeBalance): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allBalances: Record<string, ArcadeBalance> = stored ? JSON.parse(stored) : {};

    allBalances[balance.userId] = balance;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBalances));
  } catch (error) {
    console.error('Failed to save arcade balance:', error);
  }
}

/**
 * Earn tokens
 */
export function earnTokens(
  userId: string,
  amount: number,
  reason: string
): ArcadeBalance {
  const balance = getArcadeBalance(userId);

  balance.balance += amount;
  balance.totalEarned += amount;

  const transaction: ArcadeTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'earn',
    amount,
    reason,
    timestamp: new Date(),
    balanceAfter: balance.balance
  };

  balance.transactions.push(transaction);

  // Keep only last 50 transactions
  if (balance.transactions.length > 50) {
    balance.transactions = balance.transactions.slice(-50);
  }

  saveBalance(balance);

  console.log(`[Arcade] ${userId} earned ${amount} tokens: ${reason}`);

  return balance;
}

/**
 * Spend tokens
 */
export function spendTokens(
  userId: string,
  amount: number,
  reason: string
): { success: boolean; balance?: ArcadeBalance; error?: string } {
  const balance = getArcadeBalance(userId);

  if (balance.balance < amount) {
    return {
      success: false,
      error: `Insufficient balance. You have ${balance.balance} tokens, need ${amount}`
    };
  }

  balance.balance -= amount;
  balance.totalSpent += amount;

  const transaction: ArcadeTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'spend',
    amount,
    reason,
    timestamp: new Date(),
    balanceAfter: balance.balance
  };

  balance.transactions.push(transaction);

  // Keep only last 50 transactions
  if (balance.transactions.length > 50) {
    balance.transactions = balance.transactions.slice(-50);
  }

  saveBalance(balance);

  console.log(`[Arcade] ${userId} spent ${amount} tokens: ${reason}`);

  return { success: true, balance };
}

/**
 * Check if user can claim daily login bonus
 */
export function canClaimDailyLogin(userId: string): boolean {
  const balance = getArcadeBalance(userId);

  if (!balance.lastDailyLogin) {
    return true;
  }

  const lastLogin = new Date(balance.lastDailyLogin);
  const now = new Date();

  // Check if more than 24 hours have passed
  const hoursSinceLastLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastLogin >= 24;
}

/**
 * Claim daily login bonus
 */
export function claimDailyLogin(userId: string): { success: boolean; balance?: ArcadeBalance; error?: string } {
  if (!canClaimDailyLogin(userId)) {
    return {
      success: false,
      error: 'Daily login bonus already claimed today'
    };
  }

  const balance = earnTokens(userId, ARCADE_EARNINGS.DAILY_LOGIN, 'Daily login bonus');
  balance.lastDailyLogin = new Date().toISOString();
  saveBalance(balance);

  return { success: true, balance };
}

/**
 * Get leaderboard (top earners)
 */
export function getLeaderboard(limit: number = 10): Array<{
  userId: string;
  balance: number;
  totalEarned: number;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allBalances: Record<string, ArcadeBalance> = JSON.parse(stored);

    const leaderboard = Object.values(allBalances)
      .map(b => ({
        userId: b.userId,
        balance: b.balance,
        totalEarned: b.totalEarned
      }))
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit);

    return leaderboard;
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return [];
  }
}

/**
 * Get recent transactions for user
 */
export function getRecentTransactions(
  userId: string,
  limit: number = 10
): ArcadeTransaction[] {
  const balance = getArcadeBalance(userId);
  return balance.transactions.slice(-limit).reverse();
}

/**
 * Format token amount for display
 */
export function formatTokens(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculate conversion rate (Arcade → SOL)
 */
export function convertArcadeToSOL(arcadeTokens: number): number {
  const CONVERSION_RATE = 10000; // 10,000 Arcade = 1 SOL
  return arcadeTokens / CONVERSION_RATE;
}

/**
 * Calculate conversion rate (SOL → Arcade)
 */
export function convertSOLToArcade(sol: number): number {
  const CONVERSION_RATE = 10000;
  return sol * CONVERSION_RATE;
}

/**
 * Check if user has enough tokens for an action
 */
export function hasEnoughTokens(
  userId: string,
  amount: number
): boolean {
  const balance = getArcadeBalance(userId);
  return balance.balance >= amount;
}

/**
 * Get user statistics
 */
export function getUserStats(userId: string): {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  netProfit: number;
  transactionCount: number;
  rank?: number;
} {
  const balance = getArcadeBalance(userId);
  const leaderboard = getLeaderboard(100);
  const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

  return {
    balance: balance.balance,
    totalEarned: balance.totalEarned,
    totalSpent: balance.totalSpent,
    netProfit: balance.totalEarned - balance.totalSpent,
    transactionCount: balance.transactions.length,
    rank: rank > 0 ? rank : undefined
  };
}

/**
 * Clear all balances (for testing)
 */
export function clearAllBalances(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
