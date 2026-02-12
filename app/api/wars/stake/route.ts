/**
 * Timeline Wars Staking API
 * POST /api/wars/stake
 *
 * Handles NFT staking for Timeline Wars battles
 */

import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import {
  createStakeTransaction,
  calculateNFTPower,
  getActiveEvent,
  type StakedNFT,
  type Participant,
} from '@/lib/wars';

// Mock database - in production, use real database
const stakedNFTs: StakedNFT[] = [];
const participants: Participant[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, nftMint, eventId, factionId, nftMetadata } = body;

    // Validation
    if (!wallet || !nftMint || !eventId || !factionId || !nftMetadata) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate event is active
    const event = getActiveEvent();
    if (event.id !== eventId || event.status !== 'active') {
      return NextResponse.json(
        { error: 'Event not active' },
        { status: 400 }
      );
    }

    // Check if NFT is already staked
    const alreadyStaked = stakedNFTs.find(
      (nft) => nft.mintAddress === nftMint && nft.eventId === eventId
    );

    if (alreadyStaked) {
      return NextResponse.json(
        { error: 'NFT already staked in this event' },
        { status: 400 }
      );
    }

    // Calculate NFT power
    const power = calculateNFTPower({
      entropy: nftMetadata.entropy || 0,
      mintDate: nftMetadata.mintDate || new Date().toISOString(),
      engine: nftMetadata.engine || 'rewind',
    });

    // Create staked NFT record
    const stakedNFT: StakedNFT = {
      id: `stake-${Date.now()}-${nftMint.slice(0, 8)}`,
      mintAddress: nftMint,
      owner: wallet,
      eventId,
      factionId,
      stakedAt: new Date().toISOString(),
      power,
      entropy: nftMetadata.entropy || 0,
      locked: true,
    };

    stakedNFTs.push(stakedNFT);

    // Update or create participant record
    let participant = participants.find(
      (p) => p.wallet === wallet && p.eventId === eventId
    );

    if (!participant) {
      participant = {
        wallet,
        eventId,
        factionId,
        joinedAt: new Date().toISOString(),
        stakedNFTs: [nftMint],
        totalPower: power,
        rewardsClaimed: false,
      };
      participants.push(participant);
    } else {
      // Check if switching factions
      if (participant.factionId !== factionId) {
        return NextResponse.json(
          { error: 'Cannot stake for different faction in same event' },
          { status: 400 }
        );
      }

      participant.stakedNFTs.push(nftMint);
      participant.totalPower += power;
    }

    // Create transaction (for demo)
    const userPubkey = new PublicKey(wallet);
    const nftPubkey = new PublicKey(nftMint);

    try {
      await createStakeTransaction(userPubkey, nftPubkey, eventId, factionId);
    } catch (txError) {
      console.error('Transaction creation failed:', txError);
      // Continue anyway for demo - in production, this should fail
    }

    return NextResponse.json({
      success: true,
      stakedNFT,
      participant,
      message: `Successfully staked NFT for ${factionId}! Power: ${power}`,
    });
  } catch (error) {
    console.error('Stake API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get staking status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const eventId = searchParams.get('eventId');

    if (wallet && eventId) {
      // Get participant's staked NFTs
      const participant = participants.find(
        (p) => p.wallet === wallet && p.eventId === eventId
      );

      const userStakedNFTs = stakedNFTs.filter(
        (nft) => nft.owner === wallet && nft.eventId === eventId
      );

      return NextResponse.json({
        participant: participant || null,
        stakedNFTs: userStakedNFTs,
      });
    }

    // Return all stakes for event
    if (eventId) {
      const eventStakes = stakedNFTs.filter((nft) => nft.eventId === eventId);
      const eventParticipants = participants.filter((p) => p.eventId === eventId);

      return NextResponse.json({
        stakedNFTs: eventStakes,
        participants: eventParticipants,
        totalStaked: eventStakes.length,
      });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    console.error('Get stake API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
