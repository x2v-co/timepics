/**
 * Agent Skills API
 * POST /api/agent/skills/cast - Cast a skill
 * GET /api/agent/skills - Get available skills
 * GET /api/agent/skills/[skillId] - Get skill details
 * GET /api/agent/skills/status - Get cooldown and effects status
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  castSkill,
  getAvailableSkills,
  getSkill,
  getCooldownRemaining,
  getActiveEffects,
  isSkillOnCooldown,
  calculateEffectivePower,
  shouldHideVotes
} from '@/lib/agentSkills';

// GET /api/agent/skills - Get all available skills
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skillId = searchParams.get('skillId');
  const action = searchParams.get('action');

  // Get skill status (cooldowns, effects)
  if (action === 'status') {
    const userId = searchParams.get('userId');
    const battleId = searchParams.get('battleId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const skills = getAvailableSkills();
    const skillStatuses = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      onCooldown: isSkillOnCooldown(userId, skill.id),
      cooldownRemaining: getCooldownRemaining(userId, skill.id)
    }));

    const activeEffects = getActiveEffects(userId, battleId || undefined);

    // Check if votes should be hidden
    const votesHidden = battleId ? shouldHideVotes(userId, battleId) : false;

    return NextResponse.json({
      skills: skillStatuses,
      activeEffects: activeEffects.map(e => ({
        skillId: e.skillId,
        battleId: e.battleId,
        targetId: e.targetId,
        effect: e.effect,
        expiresAt: e.expiresAt
      })),
      votesHidden
    });
  }

  // Get specific skill
  if (skillId) {
    const skill = getSkill(skillId);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  }

  // Get all skills
  const skills = getAvailableSkills();
  return NextResponse.json({ skills });
}

// POST /api/agent/skills/cast - Cast a skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, battleId, skillId, targetId } = body;

    // Validate required fields
    if (!userId || !battleId || !skillId) {
      return NextResponse.json(
        { error: 'userId, battleId, and skillId are required' },
        { status: 400 }
      );
    }

    // Cast the skill
    const result = await castSkill({
      userId,
      battleId,
      skillId,
      targetId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, skillId: result.skillId },
        { status: 400 }
      );
    }

    // Get updated cooldown
    const cooldownRemaining = getCooldownRemaining(userId, skillId);

    return NextResponse.json({
      success: true,
      skillId: result.skillId,
      targetId: result.targetId,
      effect: result.effect,
      cooldownRemaining,
      message: `${getSkill(skillId)?.name || skillId} cast successfully!`
    });
  } catch (error) {
    console.error('Skill cast error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
