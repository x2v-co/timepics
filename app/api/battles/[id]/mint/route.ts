/**
 * Mint Battle NFT API
 * POST /api/battles/[id]/mint - Mint an NFT for battle participation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBattle } from '@/lib/battleStorage';
import { spendTokens } from '@/lib/arcade/tokenManager';
import { mintBattleNFT, stakeNFT, calculateNFTPower } from '@/lib/battleNFT';

// Mint cost in Arcade Tokens
const MINT_COST = 100; // 100 Arcade Tokens per NFT

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;
    const body = await request.json();
    const { userId, faction, autoStake } = body;

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
        { error: 'Battle has ended, minting closed' },
        { status: 400 }
      );
    }

    // Check and deduct Arcade Tokens
    const spendResult = spendTokens(
      userId,
      MINT_COST,
      `Mint Battle NFT for ${battleId} (${faction})`
    );

    if (!spendResult.success) {
      return NextResponse.json(
        { error: spendResult.error },
        { status: 400 }
      );
    }

    // Get faction info
    const factionInfo = faction === 'A' ? battle.factionA : battle.factionB;
    const agent = faction === 'A' ? battle.agentA : battle.agentB;

    // Generate image for this NFT
    // For MVP, we'll use the agent's latest generated image or a placeholder
    const latestRound = battle.roundResults[battle.roundResults.length - 1];
    let imageUrl = '';
    let prompt = '';
    let engine: 'rewind' | 'refract' | 'foresee' = agent.personality.preferredEngine;

    if (latestRound) {
      const agentOutput = faction === 'A' ? latestRound.agentA : latestRound.agentB;
      imageUrl = agentOutput.imageUrl;
      prompt = agentOutput.output.prompt;
      engine = agentOutput.output.engine;
    } else {
      // No rounds yet, use placeholder
      imageUrl = `https://placehold.co/600x600/${factionInfo.color.replace('#', '')}/fff?text=${faction}`;
      prompt = factionInfo.theme;
    }

    // Mint the NFT
    const nft = mintBattleNFT({
      userId,
      battleId,
      faction,
      factionName: factionInfo.name,
      battleTopic: battle.topic,
      imageUrl,
      engine,
      prompt,
      mintCost: MINT_COST
    });

    // Auto-stake if requested
    if (autoStake) {
      // Calculate potential reward (simplified: proportional to power)
      const potentialReward = Math.floor(nft.power * 1.5); // 1.5x power as reward estimate

      stakeNFT(nft.id, potentialReward);
    }

    console.log(
      `[API] ${userId} minted NFT ${nft.id} for battle ${battleId} (${faction})${autoStake ? ' and staked' : ''}`
    );

    return NextResponse.json({
      success: true,
      message: `NFT minted successfully!${autoStake ? ' and staked in battle' : ''}`,
      nft: {
        id: nft.id,
        name: nft.name,
        imageUrl: nft.imageUrl,
        power: nft.power,
        faction: nft.faction,
        staked: nft.staked,
        potentialReward: nft.potentialReward,
        mintCost: nft.mintCost
      },
      balance: spendResult.balance?.balance
    });
  } catch (error) {
    console.error('[API] Mint NFT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
