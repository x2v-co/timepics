/**
 * IPFS Upload Test API
 * POST /api/ipfs/test
 *
 * Tests IPFS integration by uploading a sample image
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadNFTToIPFS, isIPFSConfigured, getIPFSStatus } from '@/lib/ipfs';

export async function POST(request: NextRequest) {
  try {
    // Check if IPFS is configured
    if (!isIPFSConfigured()) {
      return NextResponse.json(
        {
          error: 'IPFS not configured',
          message: 'PINATA_API_KEY and PINATA_SECRET_KEY are not set',
          instructions: [
            '1. Visit https://pinata.cloud and create a free account',
            '2. Go to API Keys section in dashboard',
            '3. Click "New Key" with all permissions',
            '4. Copy both API Key and API Secret',
            '5. Add to .env.local:',
            '   PINATA_API_KEY=your_api_key',
            '   PINATA_SECRET_KEY=your_secret_key',
            '6. Restart the dev server: npm run dev',
          ],
          guide: 'Using Pinata for IPFS storage',
        },
        { status: 400 }
      );
    }

    // Create a test image (simple 100x100 PNG)
    const testImageBuffer = createTestImage();

    // Upload to IPFS
    console.log('🧪 Testing IPFS upload...');
    const result = await uploadNFTToIPFS(testImageBuffer, {
      name: 'TimePics Test NFT',
      description: 'Test upload to verify IPFS integration',
      engine: 'test',
      attributes: [
        { trait_type: 'Type', value: 'Test' },
        { trait_type: 'Purpose', value: 'Integration Test' },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'IPFS upload successful! ✅',
      result: {
        imageCID: result.imageCID,
        metadataCID: result.metadataCID,
        imageUrl: result.imageUrl,
        metadataUrl: result.metadataUrl,
      },
      instructions: {
        viewImage: `Open ${result.imageUrl} in browser`,
        viewMetadata: `Open ${result.metadataUrl} in browser`,
        note: 'IPFS content may take 10-30 seconds to propagate to gateways',
      },
    });
  } catch (error) {
    console.error('❌ IPFS test failed:', error);
    return NextResponse.json(
      {
        error: 'IPFS upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = await getIPFSStatus();

    return NextResponse.json({
      configured: status.configured,
      message: status.configured
        ? 'IPFS is configured and ready ✅'
        : 'IPFS is not configured - set NFT_STORAGE_KEY',
      accountInfo: status.accountInfo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Status check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Create a simple test image (100x100 purple PNG)
 */
function createTestImage(): Buffer {
  // Simple PNG header + purple pixel data
  const width = 100;
  const height = 100;

  // This is a minimal valid PNG (won't render perfectly but is valid)
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // For demo purposes, create a simple solid color image
  // In production, you'd use a proper PNG library
  const simpleImage = Buffer.concat([
    pngSignature,
    // ... (simplified for demo)
  ]);

  // For now, return a minimal buffer
  // In real usage, the image will come from Gemini API
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );
}
