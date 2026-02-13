import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedBattle } from '@/lib/unifiedBattleStorage';

/**
 * Back NFT API
 * POST /api/unified-battles/[id]/back - Back an NFT with tokens
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const battleId = (await params).id;
    const body = await request.json();
    const { userId, nftId, faction, amount } = body;

    // Validate required fields
    if (!userId || !nftId || !faction || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, nftId, faction, amount' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 10000) {
      return NextResponse.json(
        { error: 'Amount must be between 1 and 10,000 tokens' },
        { status: 400 }
      );
    }

    // Get battle controller
    const controller = getUnifiedBattle(battleId);

    if (!controller) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    // Use any type to avoid TypeScript issues with the controller API
    const controllerAny = controller as any;
    const state = controllerAny.getState();

    if (state.status !== 'active') {
      return NextResponse.json(
        { error: 'Cannot back NFTs in a non-active battle' },
        { status: 400 }
      );
    }

    // Find the NFT in the faction
    const factionData = faction === 'A' ? state.factionA : state.factionB;
    const nftIndex = factionData.nfts.findIndex((n: any) => n.id === nftId);

    if (nftIndex === -1) {
      return NextResponse.json({ error: 'NFT not found in faction' }, { status: 404 });
    }

    const nft = factionData.nfts[nftIndex];

    // Get current backers
    const currentBackers: Array<{ userId: string; amount: number; timestamp: string }> = nft.backers || [];

    // Check if user already backed this NFT
    const existingBackerIndex = currentBackers.findIndex((b) => b.userId === userId);

    // Create or update backer record
    const backer = {
      userId,
      amount,
      timestamp: new Date().toISOString()
    };

    if (existingBackerIndex >= 0) {
      currentBackers[existingBackerIndex].amount += amount;
    } else {
      currentBackers.push(backer);
    }

    // Calculate new backed amount
    const backedAmount = currentBackers.reduce((sum, b) => sum + b.amount, 0);

    // Update NFT using controller's backUserNFT method
    const result = controllerAny.backUserNFT(nftId, userId, amount);

    if (result.success && result.nft) {
      // NFT was successfully backed
    }

    // Get updated state
    const updatedState = controllerAny.getState();
    const updatedFactionData = faction === 'A' ? updatedState.factionA : updatedState.factionB;
    const updatedNft = updatedFactionData.nfts.find((n: any) => n.id === nftId);

    // Recalculate dominance percentages
    const totalPower = updatedState.factionA.totalPower + updatedState.factionB.totalPower;
    const dominanceA = totalPower > 0
      ? (updatedState.factionA.totalPower / totalPower) * 100
      : 50;
    const dominanceB = totalPower > 0
      ? (updatedState.factionB.totalPower / totalPower) * 100
      : 50;

    // Get total pool from rewards
    const totalPool = updatedState.rewards
      ? updatedState.rewards.winnerPool + updatedState.rewards.loserPool + updatedState.rewards.systemFee
      : updatedState.totalPool || 0;

    return NextResponse.json({
      success: true,
      nftId,
      newPower: updatedNft?.power || nft.power + amount,
      backedAmount,
      backerCount: currentBackers.length,
      dominanceA: Math.round(dominanceA * 10) / 10,
      dominanceB: Math.round(dominanceB * 10) / 10,
      totalPool,
      message: `Successfully backed NFT with ${amount} tokens!`
    });
  } catch (error) {
    console.error('Back NFT error:', error);
    return NextResponse.json(
      { error: 'Failed to back NFT' },
      { status: 500 }
    );
  }
}

/**
 * Get back history for a battle
 * GET /api/unified-battles/[id]/back?nftId=xxx
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const battleId = (await params).id;
    const searchParams = request.nextUrl.searchParams;
    const nftId = searchParams.get('nftId');

    const controller = getUnifiedBattle(battleId);

    if (!controller) {
      return NextResponse.json({ error: 'Battle not found' }, { status: 404 });
    }

    // Use any type to avoid TypeScript issues
    const controllerAny = controller as any;
    const state = controllerAny.getState();

    if (nftId) {
      // Get back history for specific NFT
      const factionA = state.factionA.nfts.find((n: any) => n.id === nftId);
      const factionB = state.factionB.nfts.find((n: any) => n.id === nftId);
      const nft = factionA || factionB;

      if (!nft) {
        return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
      }

      return NextResponse.json({
        nftId,
        backedAmount: nft.backedAmount || 0,
        backers: nft.backers || [],
        power: nft.power
      });
    }

    // Get all back history for battle
    const allBacks: any[] = [];
    state.factionA.nfts.forEach((nft: any) => {
      if (nft.backers && nft.backers.length > 0) {
        nft.backers.forEach((backer: any) => {
          allBacks.push({
            nftId: nft.id,
            nftName: nft.name,
            faction: 'A',
            ...backer
          });
        });
      }
    });
    state.factionB.nfts.forEach((nft: any) => {
      if (nft.backers && nft.backers.length > 0) {
        nft.backers.forEach((backer: any) => {
          allBacks.push({
            nftId: nft.id,
            nftName: nft.name,
            faction: 'B',
            ...backer
          });
        });
      }
    });

    return NextResponse.json({
      totalBacks: allBacks.length,
      totalAmount: allBacks.reduce((sum, b) => sum + b.amount, 0),
      backs: allBacks
    });
  } catch (error) {
    console.error('Get back history error:', error);
    return NextResponse.json(
      { error: 'Failed to get back history' },
      { status: 500 }
    );
  }
}
