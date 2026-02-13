/**
 * Betting API
 * POST /api/betting/place - Place a bet
 * GET /api/betting/odds?battleId=xxx - Get current odds
 * Returns mock data for demo battles
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  placeBet,
  getCurrentOdds,
  getUserBets,
  calculatePayout,
  getBettingPool
} from '@/lib/betting/bettingPool';
import { getBattle } from '@/lib/battleStorage';

// Demo battles odds
const DEMO_ODDS: Record<string, any> = {
  'battle-tesla-edison': {
    odds: { agentA: 1.45, agentB: 2.18 },
    pool: { totalBetsOnA: 8500, totalBetsOnB: 6200, totalPool: 14700 },
    probability: { agentA: 58, agentB: 42 }
  },
  'battle-rome-carthage': {
    odds: { agentA: 1.62, agentB: 2.35 },
    pool: { totalBetsOnA: 3200, totalBetsOnB: 2100, totalPool: 5300 },
    probability: { agentA: 60, agentB: 40 }
  },
  'battle-mars-colony': {
    odds: { agentA: 1.35, agentB: 2.85 },
    pool: { totalBetsOnA: 12500, totalBetsOnB: 5800, totalPool: 18300 },
    probability: { agentA: 68, agentB: 32 }
  },
  'battle-napoleon-waterloo': {
    odds: { agentA: 1.42, agentB: 2.65 },
    pool: { totalBetsOnA: 15200, totalBetsOnB: 8100, totalPool: 23300 },
    probability: { agentA: 65, agentB: 35 }
  },
  'battle-dinosaur-ai': {
    odds: { agentA: 1.85, agentB: 1.55 },
    pool: { totalBetsOnA: 6800, totalBetsOnB: 8200, totalPool: 15000 },
    probability: { agentA: 45, agentB: 55 }
  },
  'battle-silk-road': {
    odds: { agentA: 1.52, agentB: 2.42 },
    pool: { totalBetsOnA: 9800, totalBetsOnB: 6200, totalPool: 16000 },
    probability: { agentA: 61, agentB: 39 }
  },
  'battle-shakespeare-ai': {
    odds: { agentA: 1.95, agentB: 1.42 },
    pool: { totalBetsOnA: 5400, totalBetsOnB: 7200, totalPool: 12600 },
    probability: { agentA: 43, agentB: 57 }
  },
  'battle-cyberpunk': {
    odds: { agentA: 1.28, agentB: 3.15 },
    pool: { totalBetsOnA: 15800, totalBetsOnB: 5200, totalPool: 21000 },
    probability: { agentA: 75, agentB: 25 }
  }
};

// Demo bets storage (in-memory for demo)
const DEMO_BETS: Map<string, any[]> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, battleId, faction, amount } = body;

    if (!userId || !battleId || !faction || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, battleId, faction, amount' },
        { status: 400 }
      );
    }

    if (!['A', 'B'].includes(faction)) {
      return NextResponse.json(
        { error: 'faction must be "A" or "B"' },
        { status: 400 }
      );
    }

    // Check if this is a demo battle
    const demoOdds = DEMO_ODDS[battleId];
    if (demoOdds) {
      // Handle demo battle bet
      const demoBet = {
        id: `demo-bet-${Date.now()}`,
        faction,
        amount,
        oddsAtBet: faction === 'A' ? demoOdds.odds.agentA : demoOdds.odds.agentB,
        placedAt: new Date().toISOString()
      };

      // Store demo bet
      const userBetsKey = `${userId}-${battleId}`;
      const userBets = DEMO_BETS.get(userBetsKey) || [];
      userBets.push(demoBet);
      DEMO_BETS.set(userBetsKey, userBets);

      // Update pool
      demoOdds.pool.totalBetsOnA += faction === 'A' ? amount : 0;
      demoOdds.pool.totalBetsOnB += faction === 'B' ? amount : 0;
      demoOdds.pool.totalPool += amount;

      // Recalculate odds
      if (demoOdds.pool.totalBetsOnA > 0 && demoOdds.pool.totalBetsOnB > 0) {
        demoOdds.odds.agentA = Math.max(1.01, demoOdds.pool.totalPool / demoOdds.pool.totalBetsOnA);
        demoOdds.odds.agentB = Math.max(1.01, demoOdds.pool.totalPool / demoOdds.pool.totalBetsOnB);
        demoOdds.probability.agentA = Math.round((demoOdds.pool.totalBetsOnA / demoOdds.pool.totalPool) * 100);
        demoOdds.probability.agentB = Math.round((demoOdds.pool.totalBetsOnB / demoOdds.pool.totalPool) * 100);
      }

      console.log(`[API] Demo: ${userId} bet ${amount} tokens on ${faction} in battle ${battleId}`);

      const potentialPayout = calculatePayout(Number(amount), demoBet.oddsAtBet);

      return NextResponse.json({
        success: true,
        message: 'Bet placed successfully (Demo)',
        bet: {
          id: demoBet.id,
          faction: demoBet.faction,
          amount: demoBet.amount,
          oddsAtBet: demoBet.oddsAtBet,
          potentialPayout,
          potentialProfit: potentialPayout - Number(amount)
        },
        newOdds: demoOdds.odds,
        isDemo: true
      });
    }

    // Handle real battle bet
    const result = placeBet(userId, battleId, faction, Number(amount));

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // P1: Update odds history in battle controller
    const battleController = getBattle(battleId);
    if (battleController && result.newOdds) {
      const pool = getBettingPool(battleId);
      battleController.updateOddsHistory(
        result.newOdds.agentA,
        result.newOdds.agentB,
        pool.totalBetsOnA,
        pool.totalBetsOnB
      );
    }

    const potentialPayout = calculatePayout(Number(amount), result.bet!.oddsAtBet);

    console.log(`[API] ${userId} bet ${amount} tokens on ${faction} in battle ${battleId}`);

    return NextResponse.json({
      success: true,
      message: 'Bet placed successfully',
      bet: {
        id: result.bet!.id,
        faction: result.bet!.faction,
        amount: result.bet!.amount,
        oddsAtBet: result.bet!.oddsAtBet,
        potentialPayout,
        potentialProfit: potentialPayout - Number(amount)
      },
      newOdds: result.newOdds
    });
  } catch (error) {
    console.error('[API] Place bet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const battleId = searchParams.get('battleId');
    const userId = searchParams.get('userId');

    if (!battleId) {
      return NextResponse.json(
        { error: 'battleId is required' },
        { status: 400 }
      );
    }

    // Check if this is a demo battle
    const demoOdds = DEMO_ODDS[battleId];
    if (demoOdds) {
      const response: any = {
        success: true,
        battleId,
        odds: demoOdds.odds,
        pool: demoOdds.pool,
        probability: demoOdds.probability,
        isDemo: true
      };

      // Include user's demo bets if userId provided
      if (userId) {
        const userBets = DEMO_BETS.get(`${userId}-${battleId}`) || [];
        response.userBets = userBets.map(bet => ({
          id: bet.id,
          faction: bet.faction,
          amount: bet.amount,
          oddsAtBet: bet.oddsAtBet,
          potentialPayout: calculatePayout(bet.amount, bet.oddsAtBet),
          placedAt: bet.placedAt,
          settled: false,
          payout: undefined
        }));
      }

      return NextResponse.json(response);
    }

    // Get real battle odds
    const odds = getCurrentOdds(battleId);

    const response: any = {
      success: true,
      battleId,
      odds: {
        agentA: odds.agentA,
        agentB: odds.agentB
      },
      pool: {
        totalBetsOnA: odds.betsOnA,
        totalBetsOnB: odds.betsOnB,
        totalPool: odds.totalPool
      },
      probability: {
        agentA: odds.betsOnA + odds.betsOnB > 0
          ? Math.round((odds.betsOnA / (odds.betsOnA + odds.betsOnB)) * 100)
          : 50,
        agentB: odds.betsOnA + odds.betsOnB > 0
          ? Math.round((odds.betsOnB / (odds.betsOnA + odds.betsOnB)) * 100)
          : 50
      }
    };

    // Include user's bets if userId provided
    if (userId) {
      const userBets = getUserBets(userId, battleId);
      response.userBets = userBets.map(bet => ({
        id: bet.id,
        faction: bet.faction,
        amount: bet.amount,
        oddsAtBet: bet.oddsAtBet,
        potentialPayout: calculatePayout(bet.amount, bet.oddsAtBet),
        placedAt: bet.placedAt,
        settled: bet.settled,
        payout: bet.payout
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Get odds error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
