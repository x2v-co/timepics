/**
 * User Battle NFTs API
 * GET /api/user/nfts?userId=xxx - Get user's Battle NFTs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserNFTs, getGalleryNFTs, getNFTStats } from '@/lib/battleNFT';
import { getBattle } from '@/lib/battleStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const filter = searchParams.get('filter'); // 'all', 'staked', 'won', 'active'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get NFTs based on filter
    let nfts;
    if (filter === 'staked') {
      nfts = getGalleryNFTs(userId, { staked: true });
    } else if (filter === 'won') {
      nfts = getGalleryNFTs(userId, { battleEnded: true, won: true });
    } else if (filter === 'active') {
      nfts = getGalleryNFTs(userId, { battleEnded: false });
    } else {
      nfts = getGalleryNFTs(userId);
    }

    // Enrich with battle info
    const enrichedNFTs = await Promise.all(
      nfts.map(async (nft) => {
        const controller = getBattle(nft.battleId);
        const battle = controller?.getState();

        return {
          ...nft,
          battleInfo: battle ? {
            topic: battle.topic,
            status: battle.status,
            currentRound: battle.currentRound,
            totalRounds: battle.rounds,
            winner: battle.winner,
            factionName: nft.faction === 'A' ? battle.factionA.name : battle.factionB.name
          } : null
        };
      })
    );

    // Get user stats
    const stats = getNFTStats(userId);

    return NextResponse.json({
      success: true,
      nfts: enrichedNFTs,
      stats,
      count: enrichedNFTs.length
    });
  } catch (error) {
    console.error('[API] Get user NFTs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
