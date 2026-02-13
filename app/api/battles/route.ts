/**
 * Battle Management API
 * POST /api/battles - Create/Start a new battle
 */

import { NextRequest, NextResponse } from 'next/server';
import { createQuickBattle, BattleController } from '@/lib/agents/BattleController';
import { addBattle, getAllBattles, getBattle } from '@/lib/battleStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, topic, description, agentAId, agentBId, factionA, factionB, rounds } = body;

    if (action === 'create') {
      // Create a new battle
      if (!topic || !agentAId || !agentBId || !factionA || !factionB) {
        return NextResponse.json(
          { error: 'Missing required fields: topic, agentAId, agentBId, factionA, factionB' },
          { status: 400 }
        );
      }

      const battle = createQuickBattle({
        topic,
        description: description || '',
        agentAId,
        agentBId,
        factionA,
        factionB,
        rounds: rounds || 3
      });

      const controller = new BattleController(battle);
      addBattle(battle.id, controller);

      console.log(`[API] Created battle ${battle.id}: "${topic}"`);

      return NextResponse.json({
        success: true,
        battle: {
          id: battle.id,
          topic: battle.topic,
          description: battle.description,
          status: battle.status,
          factionA: {
            id: battle.factionA.id,
            name: battle.factionA.name,
            theme: battle.factionA.theme,
            color: battle.factionA.color,
            icon: battle.factionA.icon,
            agent: battle.agentA.getSummary()
          },
          factionB: {
            id: battle.factionB.id,
            name: battle.factionB.name,
            theme: battle.factionB.theme,
            color: battle.factionB.color,
            icon: battle.factionB.icon,
            agent: battle.agentB.getSummary()
          },
          rounds: battle.rounds,
          roundDuration: battle.roundDuration
        }
      });
    }

    if (action === 'start') {
      // Start an existing battle
      const { battleId } = body;

      if (!battleId) {
        return NextResponse.json(
          { error: 'battleId is required' },
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
      if (battle.status !== 'pending') {
        return NextResponse.json(
          { error: 'Battle already started or ended' },
          { status: 400 }
        );
      }

      // Start battle in background (don't await)
      controller.start().catch(error => {
        console.error(`Battle ${battleId} error:`, error);
      });

      console.log(`[API] Started battle ${battleId}`);

      return NextResponse.json({
        success: true,
        message: 'Battle started',
        battleId
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "create" or "start"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API] Battle error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/battles - List all battles
 */
export async function GET(request: NextRequest) {
  try {
    const battles = getAllBattles().map(controller => {
      const battle = controller.getState();
      return {
        id: battle.id,
        topic: battle.topic,
        description: battle.description,
        status: battle.status,
        currentRound: battle.currentRound,
        totalRounds: battle.rounds,
        factionA: {
          name: battle.factionA.name,
          color: battle.factionA.color,
          icon: battle.factionA.icon
        },
        factionB: {
          name: battle.factionB.name,
          color: battle.factionB.color,
          icon: battle.factionB.icon
        },
        scoreboard: battle.scoreboard,
        startedAt: battle.startedAt,
        endedAt: battle.endedAt,
        winner: battle.winner
      };
    });

    return NextResponse.json({
      success: true,
      battles,
      count: battles.length
    });
  } catch (error) {
    console.error('[API] List battles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
