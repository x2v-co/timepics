/**
 * NFT Minting API Endpoint
 * POST /api/mint
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidPublicKey, getExplorerUrl } from '@/lib/solana';
import { createTimePicsMetadata, mintNFT } from '@/lib/metaplex';
import { uploadImageToIPFS, ipfsToHTTP, base64ToBuffer } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, metadata, walletAddress } = body;

    // Validate inputs
    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    if (!metadata || !metadata.engine || !metadata.prompt) {
      return NextResponse.json(
        { error: 'Metadata is required (engine, prompt)' },
        { status: 400 }
      );
    }

    if (!walletAddress || !isValidPublicKey(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      );
    }

    console.log('Minting NFT for wallet:', walletAddress);

    // IMPORTANT: Actual NFT minting needs proper setup
    // Requirements:
    // 1. Backend wallet with SOL balance (for devnet, use airdrop)
    // 2. Metaplex SDK configured
    // 3. IPFS/Arweave storage configured
    //
    // For MVP/hackathon, ensure:
    // - BACKEND_WALLET_PRIVATE_KEY is set in .env.local
    // - NFT_STORAGE_KEY is set for IPFS uploads
    // - Backend wallet has SOL for transaction fees

    // MOCK IMPLEMENTATION FOR DEMO
    // Replace with actual minting when backend is properly configured
    const mockMint = async () => {
      console.log('MOCK: Would mint NFT with the following data:');
      console.log('- Wallet:', walletAddress);
      console.log('- Engine:', metadata.engine);
      console.log('- Prompt:', metadata.prompt);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate mock mint address
      const mockMintAddress = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      return {
        mintAddress: mockMintAddress,
        transactionSignature: `tx_${Math.random().toString(36).substring(7)}`,
        metadataUri: 'ipfs://mock_metadata_uri',
        explorerUrl: getExplorerUrl('address', mockMintAddress),
      };
    };

    // Uncomment this block when ready for actual minting:
    /*
    // Step 1: Upload image to IPFS
    let imageBuffer: Buffer;
    if (imageData.startsWith('http')) {
      // Download image from URL
      const response = await fetch(imageData);
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else if (imageData.startsWith('data:')) {
      // Convert base64 to buffer
      imageBuffer = base64ToBuffer(imageData);
    } else {
      throw new Error('Invalid image data format');
    }

    const imageIpfsUri = await uploadImageToIPFS(imageBuffer, `timepics-${metadata.generationId}.png`);
    const imageUrl = ipfsToHTTP(imageIpfsUri);

    console.log('Image uploaded to IPFS:', imageUrl);

    // Step 2: Create NFT metadata
    const nftMetadata = createTimePicsMetadata({
      engine: metadata.engine,
      prompt: metadata.prompt,
      era: metadata.era,
      imageUrl,
      generationId: metadata.generationId,
      timestamp: metadata.timestamp,
    });

    console.log('NFT metadata created:', nftMetadata);

    // Step 3: Mint NFT on Solana
    const mintResult = await mintNFT(nftMetadata, walletAddress);

    return NextResponse.json({
      success: true,
      ...mintResult,
    });
    */

    // Use mock for now
    const result = await mockMint();

    return NextResponse.json({
      success: true,
      ...result,
      notice: 'DEMO MODE: This is a mock mint. Configure backend wallet and storage to enable real minting.',
    });
  } catch (error) {
    console.error('Minting error:', error);
    return NextResponse.json(
      {
        error: 'Failed to mint NFT',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET method not allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to mint NFTs.' },
    { status: 405 }
  );
}
