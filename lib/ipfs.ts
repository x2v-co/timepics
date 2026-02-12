/**
 * IPFS Storage Integration using Pinata
 *
 * Free, decentralized storage for NFT assets and metadata
 * Perfect for Hackathon and Web3-native applications
 */

import pinataSDK from '@pinata/sdk';

// Pinata credentials
const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || '';

// Check if API keys are properly configured
const isValidKey = PINATA_API_KEY &&
                   PINATA_SECRET_KEY &&
                   PINATA_API_KEY !== 'your_pinata_api_key_here' &&
                   PINATA_SECRET_KEY !== 'your_pinata_secret_key_here';

if (!isValidKey && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  Pinata not configured properly');
  console.warn('📚 Add PINATA_API_KEY and PINATA_SECRET_KEY to .env.local');
}

const pinata = isValidKey ? new pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY) : null;

/**
 * Upload image to IPFS via Pinata
 * Returns IPFS CID (Content Identifier)
 */
export async function uploadImageToIPFS(
  imageBuffer: Buffer,
  filename: string = 'image.png'
): Promise<string> {
  if (!pinata) {
    throw new Error('Pinata client not initialized - check PINATA_API_KEY and PINATA_SECRET_KEY');
  }

  try {
    console.log(`📤 Uploading ${filename} to IPFS via Pinata...`);

    // Convert buffer to readable stream
    const { Readable } = await import('stream');
    const stream = Readable.from(imageBuffer);

    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: filename,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    console.log(`✅ Image uploaded: ipfs://${result.IpfsHash}`);
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ IPFS image upload failed:', error);
    throw error;
  }
}

/**
 * Upload NFT metadata to IPFS via Pinata
 * Includes image reference and all attributes
 */
export async function uploadMetadataToIPFS(metadata: {
  name: string;
  description: string;
  image: string; // IPFS CID or URL
  attributes?: Array<{ trait_type: string; value: string | number }>;
  properties?: Record<string, any>;
}): Promise<string> {
  if (!pinata) {
    throw new Error('Pinata client not initialized');
  }

  try {
    // Ensure image uses ipfs:// protocol
    const imageUrl = metadata.image.startsWith('ipfs://')
      ? metadata.image
      : `ipfs://${metadata.image}`;

    const metadataObject = {
      ...metadata,
      image: imageUrl,
    };

    console.log('📤 Uploading metadata to IPFS via Pinata...');

    const result = await pinata.pinJSONToIPFS(metadataObject, {
      pinataMetadata: {
        name: `${metadata.name}_metadata.json`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    console.log(`✅ Metadata uploaded: ipfs://${result.IpfsHash}`);
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ IPFS metadata upload failed:', error);
    throw error;
  }
}

/**
 * Complete NFT upload flow
 * Uploads image + metadata in one call
 */
export async function uploadNFTToIPFS(
  imageBuffer: Buffer,
  metadata: {
    name: string;
    description: string;
    engine: string;
    prompt?: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
  }
): Promise<{
  imageCID: string;
  metadataCID: string;
  imageUrl: string;
  metadataUrl: string;
}> {
  // 1. Upload image
  const imageCID = await uploadImageToIPFS(imageBuffer, `${metadata.name}.png`);

  // 2. Create and upload metadata
  const metadataCID = await uploadMetadataToIPFS({
    name: metadata.name,
    description: metadata.description,
    image: imageCID,
    attributes: [
      { trait_type: 'Engine', value: metadata.engine },
      { trait_type: 'Generation Date', value: new Date().toISOString() },
      ...(metadata.attributes || []),
    ],
    properties: {
      category: 'image',
      files: [
        {
          uri: `ipfs://${imageCID}`,
          type: 'image/png',
        },
      ],
      creators: [
        {
          address: 'TimePics.ai',
          share: 100,
        },
      ],
    },
  });

  return {
    imageCID,
    metadataCID,
    imageUrl: ipfsToHttpUrl(imageCID),
    metadataUrl: ipfsToHttpUrl(metadataCID),
  };
}

/**
 * Convert ipfs:// URL to HTTP gateway URL
 * Uses Pinata's dedicated gateway
 */
export function ipfsToHttpUrl(cidOrUrl: string): string {
  // Extract CID
  const cid = cidOrUrl.replace('ipfs://', '');

  // Use Pinata dedicated gateway (fast and reliable)
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

/**
 * Convert HTTP gateway URL back to ipfs:// URL
 */
export function httpToIpfsUrl(httpUrl: string): string {
  const match = httpUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  if (match) {
    return `ipfs://${match[1]}`;
  }
  return httpUrl;
}

/**
 * Check if Pinata is configured
 */
export function isIPFSConfigured(): boolean {
  return !!(PINATA_API_KEY && PINATA_SECRET_KEY);
}

/**
 * Get Pinata status
 */
export async function getIPFSStatus(): Promise<{
  configured: boolean;
  accountInfo?: any;
}> {
  if (!pinata) {
    return { configured: false };
  }

  try {
    // Test authentication by getting account info
    const result = await pinata.testAuthentication();

    return {
      configured: true,
      accountInfo: result,
    };
  } catch (error) {
    console.error('Pinata authentication failed:', error);
    return {
      configured: false,
    };
  }
}
