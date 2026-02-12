/**
 * Solana Blinks API - NFT Actions
 * GET /api/blinks/nft/[id]/route.ts
 *
 * Returns action metadata for sharing NFTs on social media
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateNFTBlinkMetadata, type ActionGetResponse } from '@/lib/blinks';

// Mock NFT data - in production, fetch from database
const mockNFTs: Record<string, any> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Tokyo 2077',
    description: 'A glimpse into the neon-lit future of Tokyo',
    imageUrl: 'https://placehold.co/800x800/8B5CF6/FFFFFF?text=Tokyo+2077',
    engine: 'foresee',
    mintDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    entropy: 15,
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Victorian London',
    description: 'An alternate timeline where steam power reigns supreme',
    imageUrl: 'https://placehold.co/800x800/CD7F32/FFFFFF?text=Victorian+London',
    engine: 'refract',
    mintDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    entropy: 45,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nftId = params.id;
    const nft = mockNFTs[nftId];

    if (!nft) {
      return NextResponse.json(
        { message: 'NFT not found' },
        { status: 404 }
      );
    }

    const actionMetadata = generateNFTBlinkMetadata(nft);

    // Set CORS headers for Blinks
    const response = NextResponse.json<ActionGetResponse>(actionMetadata);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Blinks NFT GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
