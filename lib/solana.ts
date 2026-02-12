/**
 * Solana Blockchain Utilities
 * Handles Solana connection, wallet operations, and transaction helpers
 */

import { Connection, PublicKey, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Get Solana network from environment
 */
export function getSolanaNetwork(): 'devnet' | 'testnet' | 'mainnet-beta' {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  if (network === 'mainnet-beta' || network === 'testnet' || network === 'devnet') {
    return network;
  }
  return 'devnet';
}

/**
 * Get RPC URL from environment or use default
 */
export function getRpcUrl(): string {
  return process.env.SOLANA_RPC_URL || clusterApiUrl(getSolanaNetwork());
}

/**
 * Create Solana connection
 */
export function createConnection(): Connection {
  const rpcUrl = getRpcUrl();
  return new Connection(rpcUrl, 'confirmed');
}

/**
 * Get SOL balance for a wallet
 */
export async function getBalance(publicKey: PublicKey): Promise<number> {
  const connection = createConnection();
  const lamports = await connection.getBalance(publicKey);
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Validate Solana public key
 */
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Shorten wallet address for display
 * Example: DYw8j...Hp3qX
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Get Solana Explorer URL
 */
export function getExplorerUrl(
  type: 'address' | 'tx' | 'block',
  value: string,
  network?: 'devnet' | 'testnet' | 'mainnet-beta'
): string {
  const net = network || getSolanaNetwork();
  const cluster = net === 'mainnet-beta' ? '' : `?cluster=${net}`;
  return `https://explorer.solana.com/${type}/${value}${cluster}`;
}

/**
 * Get backend wallet keypair (for server-side operations)
 * WARNING: Never expose private keys to frontend
 */
export function getBackendKeypair(): Keypair {
  if (typeof window !== 'undefined') {
    throw new Error('Backend keypair should never be accessed from frontend');
  }

  const privateKeyEnv = process.env.BACKEND_WALLET_PRIVATE_KEY;

  if (!privateKeyEnv) {
    // For development, generate a temporary keypair
    console.warn('BACKEND_WALLET_PRIVATE_KEY not set, using temporary keypair');
    return Keypair.generate();
  }

  try {
    const privateKeyArray = JSON.parse(privateKeyEnv);
    return Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
  } catch (error) {
    console.error('Failed to parse backend wallet private key:', error);
    throw new Error('Invalid BACKEND_WALLET_PRIVATE_KEY format');
  }
}

/**
 * Check if wallet has sufficient balance for transaction
 */
export async function hasSufficientBalance(
  publicKey: PublicKey,
  requiredLamports: number
): Promise<boolean> {
  const connection = createConnection();
  const balance = await connection.getBalance(publicKey);
  return balance >= requiredLamports;
}

/**
 * Estimate NFT minting cost (approximate)
 */
export function estimateMintCost(): number {
  // Approximate cost: rent + transaction fees
  // Rent for token account: ~0.002 SOL
  // Transaction fee: ~0.00001 SOL
  // Metadata account: ~0.01 SOL
  // Total: ~0.015 SOL (adding buffer)
  return 0.02; // 0.02 SOL ≈ $2-4 depending on SOL price
}

/**
 * Wait for transaction confirmation
 */
export async function confirmTransaction(
  signature: string,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<boolean> {
  const connection = createConnection();

  try {
    const confirmation = await connection.confirmTransaction(signature, commitment);
    return !confirmation.value.err;
  } catch (error) {
    console.error('Transaction confirmation failed:', error);
    return false;
  }
}

/**
 * Airdrop SOL (devnet only)
 */
export async function requestAirdrop(publicKey: PublicKey, amount: number): Promise<string> {
  const network = getSolanaNetwork();
  if (network !== 'devnet' && network !== 'testnet') {
    throw new Error('Airdrops only available on devnet and testnet');
  }

  const connection = createConnection();
  const signature = await connection.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(signature);
  return signature;
}

/**
 * Get network status
 */
export async function getNetworkStatus(): Promise<{
  network: string;
  blockHeight: number;
  isHealthy: boolean;
}> {
  try {
    const connection = createConnection();
    const blockHeight = await connection.getBlockHeight();

    return {
      network: getSolanaNetwork(),
      blockHeight,
      isHealthy: true
    };
  } catch (error) {
    return {
      network: getSolanaNetwork(),
      blockHeight: 0,
      isHealthy: false
    };
  }
}
