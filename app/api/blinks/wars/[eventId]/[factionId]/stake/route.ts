/**
 * Solana Blinks API - Wars Stake Action
 * POST /api/blinks/wars/[eventId]/[factionId]/stake/route.ts
 *
 * Handles NFT staking for Timeline Wars
 */

import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import {
  serializeTransaction,
  type ActionPostResponse,
  type ActionError,
} from '@/lib/blinks';
import { createStakeTransaction, getActiveEvent } from '@/lib/wars';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; factionId: string }> }
) {
  try {
    const body = await request.json();
    const { account, nftMint } = body;

    if (!account || !nftMint) {
      return NextResponse.json<ActionError>(
        { message: 'Missing required parameters (account, nftMint)' },
        { status: 400 }
      );
    }

    // Validate addresses
    let userPubkey: PublicKey;
    let nftMintPubkey: PublicKey;

    try {
      userPubkey = new PublicKey(account);
      nftMintPubkey = new PublicKey(nftMint);
    } catch (e) {
      return NextResponse.json<ActionError>(
        { message: 'Invalid Solana address' },
        { status: 400 }
      );
    }

    const { eventId, factionId } = await params;

    // Validate event and faction
    const event = getActiveEvent();
    if (event.id !== eventId) {
      return NextResponse.json<ActionError>(
        { message: 'Event not found or ended' },
        { status: 404 }
      );
    }

    const faction = event.factionA.id === factionId ? event.factionA :
                    event.factionB.id === factionId ? event.factionB : null;

    if (!faction) {
      return NextResponse.json<ActionError>(
        { message: 'Invalid faction' },
        { status: 404 }
      );
    }

    // Create stake transaction
    const transaction = await createStakeTransaction(
      userPubkey,
      nftMintPubkey,
      eventId,
      factionId
    );

    const serializedTransaction = serializeTransaction(transaction);

    const response = NextResponse.json<ActionPostResponse>({
      transaction: serializedTransaction,
      message: `Staking NFT for ${faction.name} ${faction.icon}\n\nYou'll earn rewards if your faction wins! Battle ends in 4 days.`,
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Blinks stake error:', error);
    return NextResponse.json<ActionError>(
      { message: 'Failed to create stake transaction' },
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
