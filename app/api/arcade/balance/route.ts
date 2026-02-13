/**
 * Arcade Token Balance API
 * GET /api/arcade/balance?userId=xxx - Get user's token balance
 * Uses in-memory storage for server-side access
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (in production, use database)
const DEMO_BALANCES: Map<string, { balance: number; totalEarned: number; totalSpent: number }> = new Map();

// Starting balance for new users
const STARTING_BALANCE = 1000;

function getUserBalance(userId: string): { balance: number; totalEarned: number; totalSpent: number } {
  if (!DEMO_BALANCES.has(userId)) {
    DEMO_BALANCES.set(userId, {
      balance: STARTING_BALANCE,
      totalEarned: STARTING_BALANCE,
      totalSpent: 0
    });
  }
  return DEMO_BALANCES.get(userId)!;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userBalance = getUserBalance(userId);

    return NextResponse.json({
      success: true,
      userId,
      balance: userBalance.balance,
      totalEarned: userBalance.totalEarned,
      totalSpent: userBalance.totalSpent
    });
  } catch (error) {
    console.error('[API] Get balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
