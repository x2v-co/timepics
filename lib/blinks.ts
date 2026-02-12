/**
 * Solana Blinks (Blockchain Links) Integration
 *
 * Enables sharing NFTs and Wars on social media with embedded Solana actions
 * Implements Solana Actions API specification
 */

import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createConnection } from './solana';

/**
 * Solana Actions API Response Types
 * Based on: https://solana.com/docs/advanced/actions
 */
export interface ActionGetResponse {
  /** URL to the icon image */
  icon: string;
  /** Title of the action */
  label: string;
  /** Description of the action */
  description: string;
  /** Optional links to other actions */
  links?: {
    actions: ActionLink[];
  };
}

export interface ActionLink {
  /** URL to the action endpoint */
  href: string;
  /** Label for the action button */
  label: string;
  /** Optional parameters for the action */
  parameters?: ActionParameter[];
}

export interface ActionParameter {
  /** Parameter name */
  name: string;
  /** Parameter label shown to user */
  label: string;
  /** Whether the parameter is required */
  required?: boolean;
}

export interface ActionPostResponse {
  /** Base64 encoded transaction */
  transaction: string;
  /** Optional message to display */
  message?: string;
}

export interface ActionError {
  message: string;
}

/**
 * Generate Blinks URL for an NFT
 */
export function generateNFTBlinkUrl(
  nftId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): string {
  return `${baseUrl}/api/blinks/nft/${nftId}`;
}

/**
 * Generate Blinks URL for Timeline Wars
 */
export function generateWarsBlinkUrl(
  eventId: string,
  factionId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): string {
  return `${baseUrl}/api/blinks/wars/${eventId}/${factionId}`;
}

/**
 * Generate Twitter share URL with Blink
 */
export function generateTwitterShareUrl(
  blinkUrl: string,
  text: string
): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(blinkUrl);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
}

/**
 * Create a basic transaction for Blinks
 */
export async function createBlinkTransaction(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number
): Promise<Transaction> {
  const connection = createConnection();
  const { blockhash } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: sender,
    blockhash,
    lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
  });

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipient,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  return transaction;
}

/**
 * Serialize transaction to base64 for Blinks response
 */
export function serializeTransaction(transaction: Transaction): string {
  return transaction.serialize({ requireAllSignatures: false }).toString('base64');
}

/**
 * Generate NFT share metadata for Blinks
 */
export interface NFTBlinkMetadata {
  nftId: string;
  name: string;
  description: string;
  imageUrl: string;
  engine: string;
  mintPrice: number;
}

export function generateNFTBlinkMetadata(nft: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  engine: string;
}): ActionGetResponse {
  return {
    icon: nft.imageUrl,
    label: `Mint "${nft.name}"`,
    description: `${nft.description}\n\nGenerated with ${nft.engine} engine on TimePics.ai`,
    links: {
      actions: [
        {
          href: `/api/blinks/nft/${nft.id}/mint`,
          label: 'Mint NFT (0.1 SOL)',
        },
        {
          href: `/api/blinks/nft/${nft.id}/view`,
          label: 'View Details',
        },
      ],
    },
  };
}

/**
 * Generate Timeline Wars Blink metadata
 */
export interface WarsBlinkMetadata {
  eventId: string;
  eventTitle: string;
  factionId: string;
  factionName: string;
  factionIcon: string;
  stakeAmount: number;
}

export function generateWarsBlinkMetadata(wars: {
  eventId: string;
  eventTitle: string;
  factionId: string;
  factionName: string;
  factionIcon: string;
  factionColor: string;
}): ActionGetResponse {
  return {
    icon: `https://ui-avatars.com/api/?name=${encodeURIComponent(wars.factionIcon)}&background=${wars.factionColor.slice(1)}&color=fff&size=512`,
    label: `Join ${wars.factionName}`,
    description: `Timeline Wars: ${wars.eventTitle}\n\nStake your NFT and fight for ${wars.factionName}!`,
    links: {
      actions: [
        {
          href: `/api/blinks/wars/${wars.eventId}/${wars.factionId}/stake`,
          label: 'Stake NFT & Join Battle',
          parameters: [
            {
              name: 'nftMint',
              label: 'NFT Mint Address',
              required: true,
            },
          ],
        },
        {
          href: `/api/blinks/wars/${wars.eventId}/view`,
          label: 'View Battle Status',
        },
      ],
    },
  };
}
