/**
 * Unified Battle Vote API
 * POST /api/unified-battles/[id]/vote - Cast a vote by minting NFT
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedBattle } from '@/lib/unifiedBattleStorage';
import { spendTokens, getArcadeBalance } from '@/lib/arcade/tokenManager';
import { mintBattleNFT, stakeNFT } from '@/lib/battleNFT';

const NFT_MINT_COST = 100; // Arcade Tokens per NFT
const POTENTIAL_REWARD = 150; // Potential reward if faction wins

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

    const controller = getUnifiedBattle(battleId);
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

    // Check if user has enough tokens
    const balance = getArcadeBalance(userId);
    if (balance.balance < NFT_MINT_COST) {
      return NextResponse.json(
        {
          error: `Insufficient Arcade Tokens. You have ${balance.balance}, need ${NFT_MINT_COST}`,
          currentBalance: balance.balance,
          required: NFT_MINT_COST
        },
        { status: 400 }
      );
    }

    // Spend tokens to mint NFT
    const spendResult = spendTokens(
      userId,
      NFT_MINT_COST,
      `Minted Battle NFT for ${battleId}`
    );

    if (!spendResult.success) {
      return NextResponse.json(
        { error: spendResult.error },
        { status: 400 }
      );
    }

    // Get participant info
    const participant = faction === 'A' ? battle.participantA : battle.participantB;
    const latestRound = battle.roundResults[battle.currentRound - 1];

    // Use latest round image or a default
    const imageUrl = latestRound
      ? (faction === 'A' ? latestRound.participantA.imageUrl : latestRound.participantB.imageUrl)
      : `https://placehold.co/512x512/8b5cf6/ffffff?text=${encodeURIComponent(participant.name)}`;

    // Mint Battle NFT
    const nft = mintBattleNFT({
      userId,
      battleId,
      faction,
      factionName: participant.name,
      battleTopic: battle.topic,
      imageUrl,
      engine: participant.agent?.personality.preferredEngine || 'refract',
      prompt: `Battle NFT for ${participant.name} in ${battle.topic}`,
      mintCost: NFT_MINT_COST
    });

    // Auto-stake the NFT
    stakeNFT(nft.id, POTENTIAL_REWARD);

    // Cast vote
    const voteSuccess = controller.vote(userId, faction);

    if (!voteSuccess) {
      return NextResponse.json(
        {
          error: 'Voting temporarily closed for this round',
          nftMinted: true,
          nftId: nft.id
        },
        { status: 400 }
      );
    }

    const currentVotes = controller.getCurrentRoundVotes();

    console.log(`[API] ${userId} minted NFT ${nft.id} and voted for ${faction} in battle ${battleId}`);

    return NextResponse.json({
      success: true,
      message: `NFT minted and vote cast for ${participant.name}!`,
      nft: {
        id: nft.id,
        name: nft.name,
        imageUrl: nft.imageUrl,
        power: nft.power
      },
      tokensSpent: NFT_MINT_COST,
      newBalance: spendResult.balance?.balance || 0,
      potentialReward: POTENTIAL_REWARD,
      currentVotes
    });
  } catch (error) {
    console.error('[API] Unified battle vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
