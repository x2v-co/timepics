/**
 * Arcade Token Earning API
 * POST /api/arcade/earn - Earn tokens (daily login, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { earnTokens, claimDailyLogin, ARCADE_EARNINGS } from '@/lib/arcade/tokenManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'daily_login':
        result = claimDailyLogin(userId);
        break;

      case 'watch_battle':
        result = {
          success: true,
          balance: earnTokens(userId, ARCADE_EARNINGS.WATCH_BATTLE, 'Watched battle')
        };
        break;

      case 'share_social':
        result = {
          success: true,
          balance: earnTokens(userId, ARCADE_EARNINGS.SHARE_SOCIAL, 'Shared on social media')
        };
        break;

      case 'battle_participation':
        result = {
          success: true,
          balance: earnTokens(userId, ARCADE_EARNINGS.BATTLE_PARTICIPATION, 'Participated in battle')
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Earned tokens for: ${action}`,
      balance: result.balance
    });
  } catch (error) {
    console.error('[API] Earn tokens error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
