/**
 * User Agent API v1 Root
 * /api/v1
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/userAgentAPI';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  return NextResponse.json({
    version: '1.0.0',
    endpoints: {
      status: 'GET /api/v1',
      battle: {
        state: 'GET /api/v1/battle/:id/state',
        mint: 'POST /api/v1/battle/:id/mint',
        skill: 'POST /api/v1/battle/:id/skill',
        vote: 'POST /api/v1/battle/:id/vote'
      },
      skills: {
        list: 'GET /api/agent/skills',
        cast: 'POST /api/agent/skills/cast'
      },
      events: {
        list: 'GET /api/system/events',
        trigger: 'POST /api/system/events'
      }
    },
    documentation: 'https://docs.timepics.ai/agent-api',
    authentication: 'Bearer sk_your_api_key (use x-user-id header for user identification)'
  });
}
