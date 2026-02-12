/**
 * Decentralized Storage Utilities
 * Handles IPFS and Arweave uploads for NFT images and metadata
 */

import { create as createIPFSClient, IPFSHTTPClient } from 'ipfs-http-client';

// IPFS client instance
let ipfsClient: IPFSHTTPClient | null = null;

/**
 * Initialize IPFS client (using NFT.Storage or Pinata)
 */
function getIPFSClient(): IPFSHTTPClient {
  if (ipfsClient) return ipfsClient;

  // Option 1: Use NFT.Storage (recommended for MVP)
  // Get API key from https://nft.storage
  const nftStorageKey = process.env.NFT_STORAGE_KEY;

  if (nftStorageKey) {
    // NFT.Storage uses HTTP gateway
    ipfsClient = createIPFSClient({
      host: 'nft.storage',
      port: 443,
      protocol: 'https',
      headers: {
        Authorization: `Bearer ${nftStorageKey}`,
      },
    });
  } else {
    // Fallback to public IPFS gateway (not recommended for production)
    console.warn('NFT_STORAGE_KEY not set, using public IPFS node');
    ipfsClient = createIPFSClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });
  }

  return ipfsClient;
}

/**
 * Upload image to IPFS
 */
export async function uploadImageToIPFS(
  imageData: Buffer | Uint8Array,
  filename: string = 'image.png'
): Promise<string> {
  try {
    const client = getIPFSClient();

    // Upload file
    const result = await client.add({
      path: filename,
      content: imageData,
    });

    const cid = result.cid.toString();
    console.log('Image uploaded to IPFS:', cid);

    // Return IPFS URL
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error(`Failed to upload image to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
  try {
    const client = getIPFSClient();

    // Convert metadata to JSON buffer
    const metadataJSON = JSON.stringify(metadata, null, 2);
    const buffer = Buffer.from(metadataJSON);

    // Upload metadata
    const result = await client.add({
      path: 'metadata.json',
      content: buffer,
    });

    const cid = result.cid.toString();
    console.log('Metadata uploaded to IPFS:', cid);

    return `ipfs://${cid}`;
  } catch (error) {
    console.error('IPFS metadata upload failed:', error);
    throw new Error(`Failed to upload metadata to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert base64 image to buffer
 */
export function base64ToBuffer(base64: string): Buffer {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Get HTTP gateway URL from IPFS URI
 */
export function ipfsToHTTP(ipfsUri: string, gateway: string = 'https://ipfs.io'): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }

  const cid = ipfsUri.replace('ipfs://', '');
  return `${gateway}/ipfs/${cid}`;
}

/**
 * Alternative: Upload to Arweave using Bundlr
 * (This is typically handled by Metaplex bundlrStorage, included for reference)
 */
export async function uploadToArweave(data: Buffer | string): Promise<string> {
  // This is typically handled by Metaplex's bundlrStorage
  // Including placeholder for reference
  throw new Error('Direct Arweave upload not implemented - use Metaplex bundlrStorage');
}

/**
 * NFT.Storage specific upload (preferred for MVP)
 * Uses their SDK instead of raw IPFS client
 */
export async function uploadToNFTStorage(params: {
  imageData: Buffer;
  name: string;
  description: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}): Promise<{ imageUrl: string; metadataUrl: string }> {
  const { imageData, name, description, attributes = [] } = params;

  // Note: For production, use @nft.storage/nft.storage SDK
  // npm install @nft.storage/nft.storage
  // import { NFTStorage, File } from '@nft.storage/nft.storage'

  // Placeholder implementation using IPFS client
  const imageUrl = await uploadImageToIPFS(imageData, `${name}.png`);

  const metadata = {
    name,
    description,
    image: imageUrl,
    attributes,
  };

  const metadataUrl = await uploadMetadataToIPFS(metadata);

  return {
    imageUrl: ipfsToHTTP(imageUrl),
    metadataUrl: ipfsToHTTP(metadataUrl),
  };
}

/**
 * Pin CID to ensure persistence (optional)
 */
export async function pinCID(cid: string): Promise<void> {
  try {
    const client = getIPFSClient();
    await client.pin.add(cid);
    console.log('CID pinned:', cid);
  } catch (error) {
    console.error('Failed to pin CID:', error);
    // Don't throw - pinning is optional
  }
}

/**
 * Check if storage is configured
 */
export function isStorageConfigured(): boolean {
  return !!process.env.NFT_STORAGE_KEY;
}

/**
 * Get storage provider info
 */
export function getStorageProvider(): string {
  if (process.env.NFT_STORAGE_KEY) {
    return 'NFT.Storage';
  }
  return 'Public IPFS (not recommended for production)';
}
