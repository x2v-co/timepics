/**
 * Battle Details API
 * GET /api/battles/[id] - Get battle state
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;

    // Find battle in parent route's storage
    // Note: In a real app, this would be in a database
    // For now, we'll implement a workaround

    return NextResponse.json({
      error: 'Use GET /api/battles/[id]/state instead'
    }, { status: 404 });
  } catch (error) {
    const { id } = await params;
    console.error(`[API] Get battle ${id} error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
