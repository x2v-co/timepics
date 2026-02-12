/**
 * AI Image Generation API with IPFS Upload
 * POST /api/generate-ipfs
 *
 * 1. Generate image with Gemini
 * 2. Upload to IPFS (NFT.Storage)
 * 3. Return IPFS URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { enhancePrompt, validatePrompt } from '@/lib/prompts';
import { uploadNFTToIPFS, ipfsToHttpUrl } from '@/lib/ipfs';
import type { Engine, Era } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { engine, prompt, era, aspectRatio = '1:1', quality = 'standard' } = body;

    // Validate inputs
    if (!engine || !['rewind', 'refract', 'foresee'].includes(engine)) {
      return NextResponse.json(
        { error: 'Invalid engine. Must be rewind, refract, or foresee' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate prompt
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const nftStorageKey = process.env.NFT_STORAGE_KEY;

    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error: 'Gemini API key not configured',
          instructions: 'Set GEMINI_API_KEY in .env.local',
        },
        { status: 500 }
      );
    }

    if (!nftStorageKey || nftStorageKey === 'your_nft_storage_key_here') {
      return NextResponse.json(
        {
          error: 'NFT.Storage API key not configured',
          instructions: 'Get free key from https://nft.storage and set NFT_STORAGE_KEY',
        },
        { status: 500 }
      );
    }

    // Enhance prompt based on engine
    const enhancedPrompt = enhancePrompt(prompt, engine as Engine, era as Era);

    console.log('🎨 Generating image with prompt:', enhancedPrompt);

    // Initialize Gemini
    const genAI = new GoogleGenAI({ apiKey: geminiKey });

    // MOCK: Generate image (replace with actual Gemini call)
    // For demo, create a placeholder
    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );

    console.log('📤 Uploading to IPFS...');

    // Upload to IPFS
    const ipfsResult = await uploadNFTToIPFS(mockImageBuffer, {
      name: `TimePics - ${engine} - ${Date.now()}`,
      description: prompt,
      engine: engine,
      prompt: enhancedPrompt,
      attributes: [
        { trait_type: 'Engine', value: engine },
        { trait_type: 'Era', value: era || 'modern' },
        { trait_type: 'Quality', value: quality },
      ],
    });

    console.log('✅ Upload complete!');
    console.log('  Image CID:', ipfsResult.imageCID);
    console.log('  Metadata CID:', ipfsResult.metadataCID);

    return NextResponse.json({
      success: true,
      ipfs: {
        imageCID: ipfsResult.imageCID,
        metadataCID: ipfsResult.metadataCID,
        imageUrl: ipfsResult.imageUrl,
        metadataUrl: ipfsResult.metadataUrl,
        // Also provide ipfs:// format URLs
        imageIpfs: `ipfs://${ipfsResult.imageCID}`,
        metadataIpfs: `ipfs://${ipfsResult.metadataCID}`,
      },
      metadata: {
        engine,
        prompt,
        enhancedPrompt,
        era,
        quality,
        aspectRatio,
        generatedAt: new Date().toISOString(),
      },
      note: 'IPFS content may take 10-30 seconds to propagate. Use imageUrl for immediate viewing.',
    });
  } catch (error) {
    console.error('❌ Generation/Upload error:', error);
    return NextResponse.json(
      {
        error: 'Generation or upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to this endpoint to generate and upload images to IPFS',
    requiredKeys: ['engine', 'prompt'],
    optionalKeys: ['era', 'aspectRatio', 'quality'],
    engines: ['rewind', 'refract', 'foresee'],
  });
}
