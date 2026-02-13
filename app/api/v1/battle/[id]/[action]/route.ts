/**
 * User Agent API v1
 * Base path: /api/v1
 *
 * Endpoints:
 * - GET /api/v1/status - API status
 * - GET /api/v1/battle/:id/state - Get battle state
 * - POST /api/v1/battle/:id/mint - Mint NFT
 * - POST /api/v1/battle/:id/skill - Cast skill
 * - POST /api/v1/battle/:id/vote - Vote
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/userAgentAPI';
import { getBattleNFTs } from '@/lib/battleNFT';
import { castSkill, getAvailableSkills, getSkill } from '@/lib/agentSkills';
import { getAllBattles } from '@/lib/unifiedBattleController';

// GET /api/v1/status
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  return NextResponse.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    userId: auth.userId
  });
}

// Route segment for battle/:id
export async function handleBattleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const auth = await authenticateRequest(request);

  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { id: battleId, action } = await params;

  switch (action) {
    case 'state':
      return handleGetBattleState(battleId, auth.userId!);
    case 'mint':
      return handleMint(request, battleId, auth.userId!);
    case 'skill':
      return handleSkill(request, battleId, auth.userId!);
    case 'vote':
      return handleVote(request, battleId, auth.userId!);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

/**
 * GET /api/v1/battle/:id/state
 */
function handleGetBattleState(battleId: string, userId: string) {
  const battles = getAllBattles();
  const battle = battles.find(b => b.id === battleId);

  if (!battle) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
  }

  const nfts = getBattleNFTs(battleId);

  // Calculate faction power
  const factionA = nfts.filter(n => n.faction === 'A');
  const factionB = nfts.filter(n => n.faction === 'B');

  const powerA = factionA.reduce((sum, n) => sum + n.power, 0);
  const powerB = factionB.reduce((sum, n) => sum + n.power, 0);

  return NextResponse.json({
    battleId: battle.id,
    topic: battle.topic,
    status: battle.status,
    currentRound: battle.currentRound,
    totalRounds: battle.rounds,
    timeRemaining: battle.roundDuration,
    factions: {
      A: {
        name: battle.participantA.faction.name,
        power: powerA,
        nftCount: factionA.length,
        color: battle.participantA.faction.color
      },
      B: {
        name: battle.participantB.faction.name,
        power: powerB,
        nftCount: factionB.length,
        color: battle.participantB.faction.color
      }
    },
    scoreboard: battle.scoreboard,
    bettingPool: battle.bettingPool,
    genesisNFTs: battle.mintedNFTs,
    userNfts: nfts.filter(n => n.owner === userId).map(n => ({
      id: n.id,
      faction: n.faction,
      power: n.power
    }))
  });
}

/**
 * POST /api/v1/battle/:id/mint
 */
async function handleMint(
  request: NextRequest,
  battleId: string,
  userId: string
) {
  try {
    const body = await request.json();
    const { faction, prompt, engine, imageUrl } = body;

    // Validate required fields
    if (!faction || !prompt) {
      return NextResponse.json(
        { error: 'faction and prompt are required' },
        { status: 400 }
      );
    }

    // Validate faction
    if (faction !== 'A' && faction !== 'B') {
      return NextResponse.json(
        { error: 'faction must be A or B' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Call image generation API
    // 2. Mint NFT
    // 3. Add to battle

    // For now, return mock response
    const mockNftId = `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      nftId: mockNftId,
      faction,
      prompt,
      engine: engine || 'refract',
      message: 'NFT minted successfully (mock)',
      cost: 100 // tokens
    });
  } catch (error) {
    console.error('Mint error:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/battle/:id/skill
 */
async function handleSkill(
  request: NextRequest,
  battleId: string,
  userId: string
) {
  try {
    const body = await request.json();
    const { skillId, targetId } = body;

    if (!skillId) {
      return NextResponse.json(
        { error: 'skillId is required' },
        { status: 400 }
      );
    }

    // Validate skill exists
    const skill = getSkill(skillId);
    if (!skill) {
      return NextResponse.json(
        { error: 'Unknown skill' },
        { status: 400 }
      );
    }

    // Cast skill
    const result = await castSkill({
      userId,
      battleId,
      skillId,
      targetId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      skill: skill.name,
      effect: result.effect,
      message: `${skill.name} cast successfully`
    });
  } catch (error) {
    console.error('Skill error:', error);
    return NextResponse.json(
      { error: 'Failed to cast skill' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/battle/:id/vote
 */
function handleVote(
  request: NextRequest,
  battleId: string,
  userId: string
) {
  // This would integrate with the battle voting system
  // For now, return mock response

  return NextResponse.json({
    success: true,
    message: 'Vote recorded (mock)',
    battleId,
    userId
  });
}
