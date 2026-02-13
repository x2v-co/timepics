/**
 * Unified Battle Detail API
 * GET /api/unified-battles/[id] - Get unified battle details with v3 data
 * Returns mock data for demo battles
 */

import { NextRequest, NextResponse } from 'next/server';

// Demo v3 battle data with NFTs
const DEMO_V3_BATTLES: Record<string, any> = {
  'battle-tesla-edison': {
    id: 'battle-tesla-edison',
    topic: '⚡ Tesla vs Edison: The Current War',
    status: 'active',
    currentRound: 2,
    totalRounds: 3,
    genesisNFTs: {
      A: {
        id: 'genesis-a-tesla',
        name: 'Tesla Genesis',
        imageUrl: 'https://picsum.photos/seed/tesla-genesis/400/400',
        power: 10000,
        role: 'GENESIS',
        status: 'PENDING'
      },
      B: {
        id: 'genesis-b-edison',
        name: 'Edison Genesis',
        imageUrl: 'https://picsum.photos/seed/edison-genesis/400/400',
        power: 9500,
        role: 'GENESIS',
        status: 'PENDING'
      }
    },
    factionA: {
      name: 'AC Power Alliance',
      color: '#3b82f6',
      icon: '⚡',
      nfts: [
        { id: 'nft-a1', name: 'Wireless City Alpha', imageUrl: 'https://picsum.photos/seed/nfta1/200/200', power: 2500, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-a2', name: 'Tesla Coil Tower', imageUrl: 'https://picsum.photos/seed/nfta2/200/200', power: 1800, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-a3', name: 'Free Energy Grid', imageUrl: 'https://picsum.photos/seed/nfta3/200/200', power: 3200, role: 'ROGUE_AGENT', status: 'PENDING' }
      ],
      totalPower: 16500
    },
    factionB: {
      name: 'DC Power Coalition',
      color: '#ef4444',
      icon: '🔋',
      nfts: [
        { id: 'nft-b1', name: 'Edison Light Bulb', imageUrl: 'https://picsum.photos/seed/nftb1/200/200', power: 2200, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-b2', name: 'DC Distribution', imageUrl: 'https://picsum.photos/seed/nftb2/200/200', power: 1900, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-b3', name: 'Power Storage Unit', imageUrl: 'https://picsum.photos/seed/nftb3/200/200', power: 2800, role: 'ROGUE_AGENT', status: 'PENDING' }
      ],
      totalPower: 16200
    },
    totalPool: 12500,
    rogueAgentActive: true,
    systemEvents: [
      { id: 'evt-1', type: 'surge', name: 'Power Surge', description: 'Electricity flows faster', endsAt: new Date(Date.now() + 120000).toISOString() }
    ]
  },
  'battle-rome-carthage': {
    id: 'battle-rome-carthage',
    topic: '🏛️ What if Rome Never Fell?',
    status: 'active',
    currentRound: 1,
    totalRounds: 3,
    genesisNFTs: {
      A: {
        id: 'genesis-a-rome',
        name: 'Rome Eternal',
        imageUrl: 'https://picsum.photos/seed/rome-genesis/400/400',
        power: 12000,
        role: 'GENESIS',
        status: 'PENDING'
      },
      B: {
        id: 'genesis-b-carthage',
        name: 'Carthage Rising',
        imageUrl: 'https://picsum.photos/seed/carthage-genesis/400/400',
        power: 11500,
        role: 'GENESIS',
        status: 'PENDING'
      }
    },
    factionA: {
      name: 'Eternal Empire',
      color: '#f59e0b',
      icon: '🏛️',
      nfts: [
        { id: 'nft-ra1', name: 'Roman Forum 2150', imageUrl: 'https://picsum.photos/seed/nfra1/200/200', power: 3500, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-ra2', name: 'Legionary Mech', imageUrl: 'https://picsum.photos/seed/nfra2/200/200', power: 4200, role: 'USER_SUBMITTED', status: 'PENDING' }
      ],
      totalPower: 19700
    },
    factionB: {
      name: 'Barbarian Horde',
      color: '#7c3aed',
      icon: '🪓',
      nfts: [
        { id: 'nft-rb1', name: 'Carthage Harbor', imageUrl: 'https://picsum.photos/seed/nfrb1/200/200', power: 2800, role: 'USER_SUBMITTED', status: 'PENDING' },
        { id: 'nft-rb2', name: 'Elephant Cavalry', imageUrl: 'https://picsum.photos/seed/nfrb2/200/200', power: 3800, role: 'USER_SUBMITTED', status: 'PENDING' }
      ],
      totalPower: 18100
    },
    totalPool: 2890,
    rogueAgentActive: false,
    systemEvents: []
  },
  'battle-napoleon-waterloo': {
    id: 'battle-napoleon-waterloo',
    topic: '🦅 Napoleon Wins Waterloo',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    genesisNFTs: {
      A: {
        id: 'genesis-a-napoleon',
        name: 'Napoleon Victorious',
        imageUrl: 'https://picsum.photos/seed/napoleon-genesis/400/400',
        power: 15000,
        role: 'GENESIS',
        status: 'CANONICAL'
      },
      B: {
        id: 'genesis-b-britain',
        name: 'British Defeat',
        imageUrl: 'https://picsum.photos/seed/britain-genesis/400/400',
        power: 12000,
        role: 'GENESIS',
        status: 'PARADOX'
      }
    },
    factionA: {
      name: 'French Empire',
      color: '#2563eb',
      icon: '🦅',
      nfts: [
        { id: 'nft-na1', name: 'Paris Imperial Palace', imageUrl: 'https://picsum.photos/seed/nna1/200/200', power: 5500, role: 'USER_SUBMITTED', status: 'CANONICAL' },
        { id: 'nft-na2', name: 'Napoleon Statue', imageUrl: 'https://picsum.photos/seed/nna2/200/200', power: 4800, role: 'USER_SUBMITTED', status: 'CANONICAL' }
      ],
      totalPower: 25300
    },
    factionB: {
      name: 'British Coalition',
      color: '#dc2626',
      icon: '🇬🇧',
      nfts: [
        { id: 'nft-nb1', name: 'London Underwater', imageUrl: 'https://picsum.photos/seed/nnb1/200/200', power: 3500, role: 'USER_SUBMITTED', status: 'PARADOX' },
        { id: 'nft-nb2', name: 'Wellington Exile', imageUrl: 'https://picsum.photos/seed/nnb2/200/200', power: 4200, role: 'USER_SUBMITTED', status: 'PARADOX' }
      ],
      totalPower: 19700
    },
    totalPool: 32200,
    rogueAgentActive: false,
    systemEvents: [],
    winner: 'A'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;

    // Check if this is a demo battle
    const demoBattle = DEMO_V3_BATTLES[battleId];
    if (demoBattle) {
      return NextResponse.json({
        success: true,
        battle: demoBattle
      });
    }

    // For other battles, return 404
    return NextResponse.json(
      { success: false, error: 'Battle not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API] Get unified battle error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
