/**
 * Metaplex NFT Minting Utilities
 * Handles NFT creation and minting on Solana using Metaplex
 */

import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
import { createConnection, getBackendKeypair } from './solana';
import { PublicKey } from '@solana/web3.js';

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string; // IPFS or Arweave URL
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    category: 'image' | 'video' | 'audio';
    files?: Array<{
      uri: string;
      type: string;
    }>;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
  external_url?: string;
}

export interface MintResult {
  mintAddress: string;
  transactionSignature: string;
  metadataUri: string;
  explorerUrl: string;
}

/**
 * Initialize Metaplex instance
 */
function getMetaplex() {
  if (typeof window !== 'undefined') {
    throw new Error('Metaplex minting should only be done server-side');
  }

  const connection = createConnection();
  const keypair = getBackendKeypair();

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: connection.rpcEndpoint,
      timeout: 60000,
    }));

  return metaplex;
}

/**
 * Mint NFT with metadata
 */
export async function mintNFT(
  metadata: NFTMetadata,
  ownerPublicKey: string
): Promise<MintResult> {
  try {
    const metaplex = getMetaplex();
    const owner = new PublicKey(ownerPublicKey);

    console.log('Minting NFT for owner:', ownerPublicKey);
    console.log('Metadata:', metadata);

    // Upload metadata to Arweave via Bundlr
    const { uri: metadataUri } = await metaplex.nfts().uploadMetadata(metadata);

    console.log('Metadata uploaded to:', metadataUri);

    // Create NFT
    const { nft, response } = await metaplex.nfts().create({
      uri: metadataUri,
      name: metadata.name,
      symbol: metadata.symbol,
      sellerFeeBasisPoints: 500, // 5% royalty
      creators: [
        {
          address: metaplex.identity().publicKey,
          share: 100,
        },
      ],
      // Transfer to owner after minting
      tokenOwner: owner,
    });

    const mintAddress = nft.address.toBase58();
    const signature = response.signature;

    console.log('NFT minted successfully!');
    console.log('Mint address:', mintAddress);
    console.log('Transaction:', signature);

    return {
      mintAddress,
      transactionSignature: signature,
      metadataUri,
      explorerUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    };
  } catch (error) {
    console.error('NFT minting failed:', error);
    throw new Error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch NFTs owned by wallet
 */
export async function fetchNFTsByOwner(ownerPublicKey: string) {
  try {
    const metaplex = getMetaplex();
    const owner = new PublicKey(ownerPublicKey);

    const nfts = await metaplex.nfts().findAllByOwner({ owner });

    // Filter for TimePics NFTs (optional: check by creator or symbol)
    const timePicsNFTs = nfts.filter(
      nft => nft.symbol === 'TPIC' || nft.name.startsWith('TimePics')
    );

    return timePicsNFTs.map(nft => ({
      mintAddress: nft.address.toBase58(),
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
      image: nft.json?.image,
      attributes: nft.json?.attributes,
    }));
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    throw new Error(`Failed to fetch NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create TimePics NFT metadata from generation data
 */
export function createTimePicsMetadata(params: {
  engine: string;
  prompt: string;
  era?: string;
  imageUrl: string;
  generationId: string;
  timestamp: string;
}): NFTMetadata {
  const { engine, prompt, era, imageUrl, generationId, timestamp } = params;

  // Generate sequential number (in production, use database counter)
  const sequentialNumber = Math.floor(Math.random() * 9999) + 1;

  return {
    name: `TimePics #${sequentialNumber}`,
    symbol: 'TPIC',
    description: `AI-generated temporal image using ${engine} engine. "${prompt}"`,
    image: imageUrl,
    attributes: [
      {
        trait_type: 'Engine',
        value: engine.charAt(0).toUpperCase() + engine.slice(1),
      },
      {
        trait_type: 'Era',
        value: era || 'Modern',
      },
      {
        trait_type: 'Generation Date',
        value: new Date(timestamp).toLocaleDateString(),
      },
      {
        trait_type: 'Generation ID',
        value: generationId,
      },
    ],
    properties: {
      category: 'image',
      files: [
        {
          uri: imageUrl,
          type: 'image/png',
        },
      ],
      creators: [
        {
          address: getBackendKeypair().publicKey.toBase58(),
          share: 100,
        },
      ],
    },
    external_url: 'https://timepics.ai',
  };
}

/**
 * Estimate minting cost in SOL
 */
export function estimateMintingCost(): number {
  // Bundlr storage + transaction fees
  // Approximate: 0.02-0.05 SOL depending on metadata size
  return 0.03;
}

/**
 * Verify NFT ownership
 */
export async function verifyNFTOwnership(
  mintAddress: string,
  expectedOwner: string
): Promise<boolean> {
  try {
    const metaplex = getMetaplex();
    const mint = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

    return nft.token?.ownerAddress.toBase58() === expectedOwner;
  } catch (error) {
    console.error('Failed to verify NFT ownership:', error);
    return false;
  }
}
