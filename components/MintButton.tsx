/**
 * Mint Button Component
 * Handles NFT minting action with wallet integration
 */

'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Coins, Wallet } from 'lucide-react';

interface MintButtonProps {
  onMint: () => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const MintButton: FC<MintButtonProps> = ({
  onMint,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [minting, setMinting] = useState(false);

  const handleClick = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    try {
      setMinting(true);
      await onMint();
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setMinting(false);
    }
  };

  const isDisabled = disabled || isLoading || minting;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        flex items-center justify-center gap-2 px-6 py-3
        bg-gradient-to-r from-purple-500 to-pink-600
        text-white font-medium rounded-lg
        hover:shadow-lg hover:scale-[1.02]
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
    >
      {!connected ? (
        <>
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet to Mint</span>
        </>
      ) : minting || isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Minting NFT...</span>
        </>
      ) : (
        <>
          <Coins className="w-5 h-5" />
          <span>Mint as NFT (~0.02 SOL)</span>
        </>
      )}
    </button>
  );
};

/**
 * Compact Mint Button (for mobile/smaller spaces)
 */
export const MintButtonCompact: FC<MintButtonProps> = ({
  onMint,
  disabled = false,
  isLoading = false,
  className = '',
}) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [minting, setMinting] = useState(false);

  const handleClick = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    try {
      setMinting(true);
      await onMint();
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setMinting(false);
    }
  };

  const isDisabled = disabled || isLoading || minting;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2
        bg-primary hover:bg-secondary
        text-white text-sm font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {minting || isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Minting...</span>
        </>
      ) : (
        <>
          <Coins className="w-4 h-4" />
          <span>Mint NFT</span>
        </>
      )}
    </button>
  );
};
