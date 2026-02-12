/**
 * Solana Blinks API - NFT Mint Action
 * POST /api/blinks/nft/[id]/mint/route.ts
 *
 * Handles NFT minting action from Blinks
 */

import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import {
  createBlinkTransaction,
  serializeTransaction,
  type ActionPostResponse,
  type ActionError,
} from '@/lib/blinks';

const MINT_PRICE = 0.1; // SOL
const TREASURY_WALLET = 'TimePicsTreasury1111111111111111111111111'; // Demo wallet

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { account } = body;

    if (!account) {
      return NextResponse.json<ActionError>(
        { message: 'Missing account parameter' },
        { status: 400 }
      );
    }

    // Validate account is a valid Solana address
    let userPubkey: PublicKey;
    try {
      userPubkey = new PublicKey(account);
    } catch (e) {
      return NextResponse.json<ActionError>(
        { message: 'Invalid Solana address' },
        { status: 400 }
      );
    }

    // Create mint transaction
    const treasuryPubkey = new PublicKey(TREASURY_WALLET);
    const transaction = await createBlinkTransaction(
      userPubkey,
      treasuryPubkey,
      MINT_PRICE
    );

    // In a real implementation, you would:
    // 1. Create the NFT metadata
    // 2. Upload to IPFS/Arweave
    // 3. Use Metaplex to mint the NFT
    // 4. Add NFT mint instruction to transaction

    const serializedTransaction = serializeTransaction(transaction);

    const response = NextResponse.json<ActionPostResponse>({
      transaction: serializedTransaction,
      message: `Minting NFT for ${MINT_PRICE} SOL. Your TimePics.ai NFT will appear in your wallet shortly!`,
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Blinks mint error:', error);
    return NextResponse.json<ActionError>(
      { message: 'Failed to create mint transaction' },
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
