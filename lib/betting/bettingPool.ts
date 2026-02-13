/**
 * Betting System - Odds Calculation & Betting Pool
 * Handles Arcade Token betting on Agent battles
 */

import { spendTokens, earnTokens, hasEnoughTokens } from '../arcade/tokenManager';

/**
 * Bet on a battle
 */
export interface Bet {
  id: string;
  userId: string;
  battleId: string;
  faction: 'A' | 'B';
  amount: number;           // Arcade Tokens
  currency: 'arcade' | 'sol';
  oddsAtBet: number;        // Locked odds when bet was placed
  placedAt: Date;
  payout?: number;          // Calculated after battle ends
  settled: boolean;
}

/**
 * Betting pool for a battle
 */
export interface BettingPool {
  battleId: string;
  totalBetsOnA: number;     // Total Arcade Tokens on Agent A
  totalBetsOnB: number;     // Total Arcade Tokens on Agent B
  bets: Bet[];

  // Dynamic odds
  currentOdds: {
    agentA: number;
    agentB: number;
    lastUpdated: Date;
  };

  // Settlement
  settled: boolean;
  winner?: 'A' | 'B' | 'draw';
  totalPaidOut?: number;
}

// In-memory storage (for MVP)
const bettingPools: Map<string, BettingPool> = new Map();

/**
 * Get or create betting pool for a battle
 */
export function getBettingPool(battleId: string): BettingPool {
  if (!bettingPools.has(battleId)) {
    bettingPools.set(battleId, {
      battleId,
      totalBetsOnA: 0,
      totalBetsOnB: 0,
      bets: [],
      currentOdds: {
        agentA: 2.0,
        agentB: 2.0,
        lastUpdated: new Date()
      },
      settled: false
    });
  }

  return bettingPools.get(battleId)!;
}

/**
 * Calculate odds based on bet distribution
 */
export function calculateOdds(
  betsOnA: number,
  betsOnB: number,
  houseEdge: number = 0.05  // 5% platform fee
): { oddsA: number; oddsB: number } {
  const total = betsOnA + betsOnB;

  if (total === 0) {
    return { oddsA: 2.0, oddsB: 2.0 };
  }

  // Adjust total for house edge
  const adjustedTotal = total * (1 - houseEdge);

  // Odds = adjusted total / faction pool
  // Minimum odds = 1.01 (can't lose money by betting)
  const oddsA = betsOnA > 0 ? Math.max(1.01, adjustedTotal / betsOnA) : 10.0;
  const oddsB = betsOnB > 0 ? Math.max(1.01, adjustedTotal / betsOnB) : 10.0;

  return {
    oddsA: Math.round(oddsA * 100) / 100,  // Round to 2 decimals
    oddsB: Math.round(oddsB * 100) / 100
  };
}

/**
 * Get current odds for a battle
 */
export function getCurrentOdds(battleId: string): {
  agentA: number;
  agentB: number;
  betsOnA: number;
  betsOnB: number;
  totalPool: number;
} {
  const pool = getBettingPool(battleId);

  const odds = calculateOdds(pool.totalBetsOnA, pool.totalBetsOnB);

  return {
    agentA: odds.oddsA,
    agentB: odds.oddsB,
    betsOnA: pool.totalBetsOnA,
    betsOnB: pool.totalBetsOnB,
    totalPool: pool.totalBetsOnA + pool.totalBetsOnB
  };
}

/**
 * Place a bet
 */
export function placeBet(
  userId: string,
  battleId: string,
  faction: 'A' | 'B',
  amount: number
): {
  success: boolean;
  bet?: Bet;
  newOdds?: { agentA: number; agentB: number };
  error?: string;
} {
  // Validate amount
  if (amount < 10 || amount > 1000) {
    return {
      success: false,
      error: 'Bet amount must be between 10 and 1000 tokens'
    };
  }

  // Check user balance
  if (!hasEnoughTokens(userId, amount)) {
    return {
      success: false,
      error: 'Insufficient Arcade Tokens'
    };
  }

  // Get pool
  const pool = getBettingPool(battleId);

  // Check if battle already settled
  if (pool.settled) {
    return {
      success: false,
      error: 'Battle already ended, betting closed'
    };
  }

  // Get current odds (these will be locked for this bet)
  const currentOdds = calculateOdds(pool.totalBetsOnA, pool.totalBetsOnB);
  const lockedOdds = faction === 'A' ? currentOdds.oddsA : currentOdds.oddsB;

  // Deduct tokens from user
  const spendResult = spendTokens(userId, amount, `Bet on battle ${battleId} (${faction})`);

  if (!spendResult.success) {
    return {
      success: false,
      error: spendResult.error
    };
  }

  // Create bet record
  const bet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    battleId,
    faction,
    amount,
    currency: 'arcade',
    oddsAtBet: lockedOdds,
    placedAt: new Date(),
    settled: false
  };

  // Add to pool
  pool.bets.push(bet);

  if (faction === 'A') {
    pool.totalBetsOnA += amount;
  } else {
    pool.totalBetsOnB += amount;
  }

  // Update odds
  const newOdds = calculateOdds(pool.totalBetsOnA, pool.totalBetsOnB);
  pool.currentOdds = {
    agentA: newOdds.oddsA,
    agentB: newOdds.oddsB,
    lastUpdated: new Date()
  };

  console.log(
    `[Betting] ${userId} bet ${amount} tokens on ${faction} at ${lockedOdds}x odds`
  );

  return {
    success: true,
    bet,
    newOdds: {
      agentA: newOdds.oddsA,
      agentB: newOdds.oddsB
    }
  };
}

/**
 * Calculate potential payout
 */
export function calculatePayout(betAmount: number, odds: number): number {
  return Math.floor(betAmount * odds);
}

/**
 * Get user's bets for a battle
 */
export function getUserBets(userId: string, battleId: string): Bet[] {
  const pool = getBettingPool(battleId);
  return pool.bets.filter(bet => bet.userId === userId);
}

/**
 * Get all bets for a battle
 */
export function getAllBets(battleId: string): Bet[] {
  const pool = getBettingPool(battleId);
  return pool.bets;
}

/**
 * Settle bets after battle ends
 */
export function settleBattle(
  battleId: string,
  winner: 'A' | 'B' | 'draw'
): {
  totalPaidOut: number;
  winnersCount: number;
  losersCount: number;
} {
  const pool = getBettingPool(battleId);

  if (pool.settled) {
    throw new Error('Battle already settled');
  }

  pool.winner = winner;
  pool.settled = true;

  let totalPaidOut = 0;
  let winnersCount = 0;
  let losersCount = 0;

  // Process each bet
  pool.bets.forEach(bet => {
    if (winner === 'draw') {
      // Refund in case of draw
      const payout = bet.amount;
      earnTokens(bet.userId, payout, `Bet refund - battle ${battleId} ended in draw`);
      bet.payout = payout;
      totalPaidOut += payout;
    } else if (bet.faction === winner) {
      // Winner - pay out
      const payout = calculatePayout(bet.amount, bet.oddsAtBet);
      earnTokens(bet.userId, payout, `Bet won - battle ${battleId} (${winner} victory)`);
      bet.payout = payout;
      totalPaidOut += payout;
      winnersCount++;
    } else {
      // Loser - no payout
      bet.payout = 0;
      losersCount++;
    }

    bet.settled = true;
  });

  pool.totalPaidOut = totalPaidOut;

  console.log(
    `[Betting] Battle ${battleId} settled - Winner: ${winner}, Paid out: ${totalPaidOut} tokens to ${winnersCount} winners`
  );

  return {
    totalPaidOut,
    winnersCount,
    losersCount
  };
}

/**
 * Get betting statistics for a battle
 */
export function getBattleStats(battleId: string): {
  totalPool: number;
  totalBets: number;
  betsOnA: number;
  betsOnB: number;
  oddsA: number;
  oddsB: number;
  probabilityA: number;  // Implied probability from odds
  probabilityB: number;
  settled: boolean;
  winner?: 'A' | 'B' | 'draw';
} {
  const pool = getBettingPool(battleId);
  const totalPool = pool.totalBetsOnA + pool.totalBetsOnB;

  // Calculate implied probabilities from odds
  const probA = totalPool > 0 ? (pool.totalBetsOnA / totalPool) * 100 : 50;
  const probB = totalPool > 0 ? (pool.totalBetsOnB / totalPool) * 100 : 50;

  return {
    totalPool,
    totalBets: pool.bets.length,
    betsOnA: pool.totalBetsOnA,
    betsOnB: pool.totalBetsOnB,
    oddsA: pool.currentOdds.agentA,
    oddsB: pool.currentOdds.agentB,
    probabilityA: Math.round(probA),
    probabilityB: Math.round(probB),
    settled: pool.settled,
    winner: pool.winner
  };
}

/**
 * Get user's betting history (across all battles)
 */
export function getUserBettingHistory(userId: string): Bet[] {
  const allBets: Bet[] = [];

  bettingPools.forEach(pool => {
    const userBets = pool.bets.filter(bet => bet.userId === userId);
    allBets.push(...userBets);
  });

  return allBets.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
}

/**
 * Get leaderboard (top bettors by profit)
 */
export function getBettingLeaderboard(limit: number = 10): Array<{
  userId: string;
  totalBet: number;
  totalWon: number;
  netProfit: number;
  winRate: number;
}> {
  const userStats = new Map<string, {
    totalBet: number;
    totalWon: number;
    betsCount: number;
    winsCount: number;
  }>();

  bettingPools.forEach(pool => {
    pool.bets.forEach(bet => {
      if (!bet.settled) return;

      const stats = userStats.get(bet.userId) || {
        totalBet: 0,
        totalWon: 0,
        betsCount: 0,
        winsCount: 0
      };

      stats.totalBet += bet.amount;
      stats.betsCount++;

      if (bet.payout && bet.payout > bet.amount) {
        stats.totalWon += bet.payout;
        stats.winsCount++;
      }

      userStats.set(bet.userId, stats);
    });
  });

  const leaderboard = Array.from(userStats.entries())
    .map(([userId, stats]) => ({
      userId,
      totalBet: stats.totalBet,
      totalWon: stats.totalWon,
      netProfit: stats.totalWon - stats.totalBet,
      winRate: stats.betsCount > 0 ? (stats.winsCount / stats.betsCount) * 100 : 0
    }))
    .sort((a, b) => b.netProfit - a.netProfit)
    .slice(0, limit);

  return leaderboard;
}
