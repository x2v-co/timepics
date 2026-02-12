/**
 * Wallet Connect/Disconnect Button Component
 */

'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR that matches the initial client render
    return (
      <div className="flex items-center gap-3">
        <button className="bg-primary hover:bg-secondary rounded-lg px-6 py-2.5 font-medium transition-all duration-200">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-card-border">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}

      <WalletMultiButton className="!bg-primary hover:!bg-secondary !rounded-lg !px-6 !py-2.5 !font-medium !transition-all !duration-200 hover:!shadow-lg hover:glow-primary" />
    </div>
  );
}

/**
 * Compact Wallet Button for mobile
 */
export function WalletButtonCompact() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="bg-primary hover:bg-secondary rounded-lg px-4 py-2 text-sm transition-all">
        Connect
      </button>
    );
  }

  return (
    <WalletMultiButton className="!bg-primary hover:!bg-secondary !rounded-lg !px-4 !py-2 !text-sm !transition-all">
      {connected ? (
        <Wallet className="w-4 h-4" />
      ) : (
        <span>Connect</span>
      )}
    </WalletMultiButton>
  );
}
