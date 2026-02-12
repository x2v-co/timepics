/**
 * Solana Blinks API - Timeline Wars Actions
 * GET /api/blinks/wars/[eventId]/[factionId]/route.ts
 *
 * Returns action metadata for joining Timeline Wars
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateWarsBlinkMetadata, type ActionGetResponse } from '@/lib/blinks';
import { getActiveEvent } from '@/lib/wars';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; factionId: string }> }
) {
  try {
    const { eventId, factionId } = await params;

    // Get active event data
    const event = getActiveEvent();

    if (event.id !== eventId) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Find the faction
    const faction = event.factionA.id === factionId ? event.factionA :
                    event.factionB.id === factionId ? event.factionB : null;

    if (!faction) {
      return NextResponse.json(
        { message: 'Faction not found' },
        { status: 404 }
      );
    }

    const actionMetadata = generateWarsBlinkMetadata({
      eventId: event.id,
      eventTitle: event.title,
      factionId: faction.id,
      factionName: faction.name,
      factionIcon: faction.icon,
      factionColor: faction.color,
    });

    // CORS headers for Blinks
    const response = NextResponse.json<ActionGetResponse>(actionMetadata);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Blinks Wars GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
