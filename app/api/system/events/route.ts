/**
 * System Events API
 * POST /api/system/events - Trigger an event
 * GET /api/system/events - Get active events
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  triggerEvent,
  getActiveEvents,
  getEventHistory,
  isEventActive,
  getEvent,
  SystemEventType
} from '@/lib/systemEvents';

// GET /api/system/events
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const battleId = searchParams.get('battleId');
  const eventId = searchParams.get('eventId');
  const action = searchParams.get('action');

  // Get event history
  if (action === 'history' && battleId) {
    const history = getEventHistory(battleId);
    return NextResponse.json({ events: history });
  }

  // Get specific event
  if (eventId) {
    const event = getEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  }

  // Get active events for battle
  if (battleId) {
    const activeEvents = getActiveEvents(battleId);
    const hasMarketCrash = isEventActive(battleId, 'MARKET_CRASH');
    const hasChaosMode = isEventActive(battleId, 'CHAOS_MODE');

    return NextResponse.json({
      events: activeEvents,
      modifiers: {
        marketCrash: hasMarketCrash,
        chaosMode: hasChaosMode
      }
    });
  }

  return NextResponse.json({ error: 'battleId required' }, { status: 400 });
}

// POST /api/system/events - Trigger an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, eventType, metadata } = body;

    if (!battleId || !eventType) {
      return NextResponse.json(
        { error: 'battleId and eventType are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validTypes: SystemEventType[] = [
      'MARKET_CRASH',
      'TIMELINE_DISTORTION',
      'THE_PURGE',
      'CHAOS_MODE',
      'BLESSING'
    ];

    if (!validTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Check if event already active
    if (isEventActive(battleId, eventType)) {
      return NextResponse.json(
        { error: 'Event already active' },
        { status: 400 }
      );
    }

    // Trigger event
    const event = triggerEvent(battleId, eventType, metadata || {});

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        type: event.type,
        name: event.name,
        description: event.description,
        duration: event.duration,
        startedAt: event.startedAt,
        endsAt: event.endsAt
      }
    });
  } catch (error) {
    console.error('Event trigger error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
