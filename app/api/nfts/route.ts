/**
 * NFT Fetching API Endpoint
 * GET /api/nfts?wallet=<address>
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidPublicKey } from '@/lib/solana';
import { fetchNFTsByOwner } from '@/lib/metaplex';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!isValidPublicKey(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    console.log('Fetching NFTs for wallet:', walletAddress);

    // IMPORTANT: Actual NFT fetching needs proper setup
    // This requires:
    // 1. Metaplex SDK configured
    // 2. Backend wallet with proper permissions
    // 3. Digital Asset Standard (DAS) API access
    //
    // For production, consider using:
    // - Helius DAS API: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api
    // - Metaplex Digital Asset API
    // - Custom indexer

    // MOCK IMPLEMENTATION FOR DEMO
    const mockFetchNFTs = async () => {
      console.log('MOCK: Fetching NFTs for wallet:', walletAddress);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock NFTs for demo
      const mockNFTs = [
        {
          mintAddress: `mock_mint_${Date.now()}_1`,
          name: 'TimePics #001',
          symbol: 'TPIC',
          image: 'https://placehold.co/512x512/3B82F6/white?text=Rewind',
          attributes: [
            { trait_type: 'Engine', value: 'Rewind' },
            { trait_type: 'Era', value: '1980s' },
            { trait_type: 'Generation Date', value: new Date().toLocaleDateString() },
          ],
        },
        {
          mintAddress: `mock_mint_${Date.now()}_2`,
          name: 'TimePics #002',
          symbol: 'TPIC',
          image: 'https://placehold.co/512x512/A855F7/white?text=Refract',
          attributes: [
            { trait_type: 'Engine', value: 'Refract' },
            { trait_type: 'Era', value: '1950s' },
            { trait_type: 'Generation Date', value: new Date().toLocaleDateString() },
          ],
        },
      ];

      return mockNFTs;
    };

    // Uncomment this block when ready for actual fetching:
    /*
    const nfts = await fetchNFTsByOwner(walletAddress);

    return NextResponse.json({
      success: true,
      wallet: walletAddress,
      count: nfts.length,
      nfts,
    });
    */

    // Use mock for now
    const nfts = await mockFetchNFTs();

    return NextResponse.json({
      success: true,
      wallet: walletAddress,
      count: nfts.length,
      nfts,
      notice: 'DEMO MODE: Showing mock NFTs. Configure Metaplex to fetch real NFTs.',
    });
  } catch (error) {
    console.error('NFT fetching error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch NFTs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST method not allowed
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch NFTs.' },
    { status: 405 }
  );
}
