/**
 * Voting API
 * POST /api/battles/[id]/vote - Vote for an agent in current round
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBattle } from '@/lib/battleStorage';
import { earnTokens, ARCADE_EARNINGS } from '@/lib/arcade/tokenManager';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;
    const body = await request.json();
    const { userId, faction } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!faction || !['A', 'B'].includes(faction)) {
      return NextResponse.json(
        { error: 'faction must be "A" or "B"' },
        { status: 400 }
      );
    }

    const controller = getBattle(battleId);
    if (!controller) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    const battle = controller.getState();
    if (battle.status !== 'active') {
      return NextResponse.json(
        { error: 'Battle is not active' },
        { status: 400 }
      );
    }

    // Cast vote
    const success = controller.vote(userId, faction);

    if (!success) {
      return NextResponse.json(
        { error: 'Vote failed. You may have already voted in this round.' },
        { status: 400 }
      );
    }

    // Reward user with Arcade Tokens
    earnTokens(userId, ARCADE_EARNINGS.VOTE, `Voted in battle ${battleId} round ${battle.currentRound}`);

    // Get updated votes
    const currentVotes = controller.getCurrentRoundVotes();

    console.log(`[API] ${userId} voted for ${faction} in battle ${battleId} round ${battle.currentRound}`);

    return NextResponse.json({
      success: true,
      message: 'Vote recorded',
      earnedTokens: ARCADE_EARNINGS.VOTE,
      currentVotes
    });
  } catch (error) {
    console.error('[API] Vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
