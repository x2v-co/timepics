/**
 * Stake Battle NFT API
 * POST /api/battles/[id]/stake - Stake an NFT in a battle
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBattle } from '@/lib/battleStorage';
import { getNFT, stakeNFT as stakeBattleNFT } from '@/lib/battleNFT';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;
    const body = await request.json();
    const { userId, nftId } = body;

    if (!userId || !nftId) {
      return NextResponse.json(
        { error: 'userId and nftId are required' },
        { status: 400 }
      );
    }

    // Get battle
    const controller = getBattle(battleId);
    if (!controller) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    const battle = controller.getState();

    if (battle.status !== 'active' && battle.status !== 'pending') {
      return NextResponse.json(
        { error: 'Battle has ended, staking closed' },
        { status: 400 }
      );
    }

    // Get NFT
    const nft = getNFT(nftId);
    if (!nft) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (nft.owner !== userId) {
      return NextResponse.json(
        { error: 'You do not own this NFT' },
        { status: 403 }
      );
    }

    // Verify NFT is for this battle
    if (nft.battleId !== battleId) {
      return NextResponse.json(
        { error: 'NFT is not for this battle' },
        { status: 400 }
      );
    }

    // Check if already staked
    if (nft.staked) {
      return NextResponse.json(
        { error: 'NFT already staked' },
        { status: 400 }
      );
    }

    // Calculate potential reward
    const potentialReward = Math.floor(nft.power * 1.5);

    // Stake the NFT
    const stakedNFT = stakeBattleNFT(nftId, potentialReward);

    if (!stakedNFT) {
      return NextResponse.json(
        { error: 'Failed to stake NFT' },
        { status: 500 }
      );
    }

    console.log(`[API] ${userId} staked NFT ${nftId} in battle ${battleId}`);

    return NextResponse.json({
      success: true,
      message: 'NFT staked successfully!',
      nft: {
        id: stakedNFT.id,
        power: stakedNFT.power,
        staked: stakedNFT.staked,
        potentialReward: stakedNFT.potentialReward
      }
    });
  } catch (error) {
    console.error('[API] Stake NFT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
