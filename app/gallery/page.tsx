/**
 * NFT Gallery Page
 * Displays user's minted TimePics NFTs
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sparkles, ArrowLeft, Wallet, Info } from 'lucide-react';
import { WalletButton } from '@/components/WalletButton';
import { NFTCard, NFTCardSkeleton } from '@/components/NFTCard';
import { EnhancedNFTCard, type EnhancedNFT } from '@/components/EnhancedNFTCard';
import { NFTDetailModal } from '@/components/NFTDetailModal';
import { EntropyInfoCard } from '@/components/EntropyInfoCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getNFTEntropy, isNFTLocked, freezeNFT, accelerateNFT } from '@/lib/nftState';

interface NFT {
  mintAddress: string;
  name: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Demo NFTs to showcase entropy system
const demoNFTs: EnhancedNFT[] = [
  {
    id: 'demo-1',
    name: 'Tokyo 2077',
    description: 'Neon-lit cyberpunk cityscape generated with Foresee Engine',
    imageUrl: '/images/tokyo-2077.jpg',
    mintDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    engine: 'foresee',
    entropy: 15,
  },
  {
    id: 'demo-2',
    name: 'Victorian London',
    description: 'Alternate history where steam power never ended - Refract Engine',
    imageUrl: '/images/victorian-london.jpg',
    mintDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    engine: 'refract',
    entropy: 45,
  },
  {
    id: 'demo-3',
    name: 'Ancient Rome Restored',
    description: 'AI restoration of the Colosseum in its prime - Rewind Engine',
    imageUrl: '/images/ancient-rome.jpg',
    mintDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    engine: 'rewind',
    entropy: 8,
    locked: true, // User froze this one
  },
];

export default function GalleryPage() {
  const { connected, publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<EnhancedNFT | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [demoNFTsWithState, setDemoNFTsWithState] = useState<EnhancedNFT[]>(demoNFTs);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update demo NFTs with stored state from localStorage
  useEffect(() => {
    const updatedDemoNFTs = demoNFTs.map((nft) => ({
      ...nft,
      entropy: getNFTEntropy(nft.id, nft.mintDate, nft.entropy),
      locked: isNFTLocked(nft.id),
    }));
    setDemoNFTsWithState(updatedDemoNFTs);
  }, []);

  const handleNFTClick = (nft: EnhancedNFT) => {
    setSelectedNFT(nft);
    setShowDetailModal(true);
  };

  // Handle Freeze action
  const handleFreeze = async (nftId: string) => {
    if (isProcessing) return;

    const nft = demoNFTsWithState.find((n) => n.id === nftId);
    if (!nft) return;

    if (nft.locked) {
      alert('This NFT is already frozen!');
      return;
    }

    const confirmed = confirm(
      `⚠️ Freeze NFT at ${nft.entropy}% entropy?\n\n` +
        `This will PERMANENTLY lock your NFT at its current state.\n` +
        `This action CANNOT be undone!\n\n` +
        `Click OK to proceed.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      // Call API
      const response = await fetch('/api/nfts/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nftId,
          walletAddress: publicKey?.toBase58() || 'demo',
          currentEntropy: nft.entropy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to freeze NFT');
      }

      const data = await response.json();
      console.log('Freeze response:', data);

      // Update local state
      freezeNFT(nftId, nft.entropy);

      // Update UI
      setDemoNFTsWithState((prev) =>
        prev.map((n) =>
          n.id === nftId
            ? { ...n, locked: true, entropy: nft.entropy }
            : n
        )
      );

      alert(`✅ NFT frozen at ${nft.entropy}% entropy!\n\nYour NFT will remain in this state forever.`);
    } catch (err) {
      console.error('Freeze error:', err);
      alert('❌ Failed to freeze NFT. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Accelerate action
  const handleAccelerate = async (nftId: string) => {
    if (isProcessing) return;

    const nft = demoNFTsWithState.find((n) => n.id === nftId);
    if (!nft) return;

    if (nft.locked) {
      alert('⚠️ Cannot accelerate a frozen NFT!');
      return;
    }

    if (nft.entropy >= 100) {
      alert('This NFT is already at maximum entropy (100%)!');
      return;
    }

    const accelerateAmount = 20;
    const newEntropy = Math.min(nft.entropy + accelerateAmount, 100);

    const confirmed = confirm(
      `⚡ Accelerate NFT aging?\n\n` +
        `Current entropy: ${nft.entropy}%\n` +
        `New entropy: ${newEntropy}%\n\n` +
        `This will fast-forward your NFT's aging process by ${accelerateAmount}%.\n\n` +
        `Click OK to proceed.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      // Call API
      const response = await fetch('/api/nfts/accelerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nftId,
          walletAddress: publicKey?.toBase58() || 'demo',
          currentEntropy: nft.entropy,
          accelerateAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accelerate NFT');
      }

      const data = await response.json();
      console.log('Accelerate response:', data);

      // Update local state
      accelerateNFT(nftId, nft.entropy, accelerateAmount);

      // Update UI
      setDemoNFTsWithState((prev) =>
        prev.map((n) =>
          n.id === nftId ? { ...n, entropy: newEntropy } : n
        )
      );

      alert(`⚡ NFT accelerated!\n\nEntropy increased from ${nft.entropy}% to ${newEntropy}%`);
    } catch (err) {
      console.error('Accelerate error:', err);
      alert('❌ Failed to accelerate NFT. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs();
    } else {
      setNfts([]);
    }
  }, [connected, publicKey]);

  const fetchNFTs = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nfts?wallet=${publicKey.toBase58()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch NFTs');
      }

      const data = await response.json();
      setNfts(data.nfts || []);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>

              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold gradient-text">TimePics.ai</span>
              </div>
            </div>

            <WalletButton />
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Gallery</h1>
            <p className="text-muted-foreground">
              Your minted TimePics NFTs on Solana
            </p>
          </div>

          {/* Entropy System Explanation */}
          <EntropyInfoCard />

          {/* Content */}
          {!connected ? (
            // Not connected state - Show demo NFTs
            <>
              <Card className="mb-8 bg-gradient-to-br from-amber-500/10 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">👋 Demo Mode - Connect Wallet to See Your NFTs</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect your Solana wallet to view your actual TimePics NFT collection.
                        Below are demo Living NFTs showcasing the Entropy Protocol.
                      </p>
                      <WalletButton />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo NFTs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoNFTsWithState.map((nft) => (
                  <EnhancedNFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={handleNFTClick}
                    onFreeze={handleFreeze}
                    onAccelerate={handleAccelerate}
                  />
                ))}
              </div>
            </>
          ) : loading ? (
            // Loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <NFTCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-red-500">Error Loading NFTs</h2>
                <p className="text-muted-foreground max-w-md">{error}</p>
              </div>
              <button
                onClick={fetchNFTs}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : nfts.length === 0 ? (
            // Demo/Empty state with Enhanced NFT preview
            <>
              <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">✨ Introducing: Living NFTs</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your TimePics NFTs are not static images. They <strong>age over time</strong> through the Entropy Protocol,
                        creating unique temporal artwork that evolves day by day.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <Badge variant="outline" className="mb-2">🔒 Freeze</Badge>
                          <p className="text-muted-foreground">Lock your NFT at its current state forever</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2">⚡ Accelerate</Badge>
                          <p className="text-muted-foreground">Fast-forward to see the future</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2">📊 Entropy</Badge>
                          <p className="text-muted-foreground">Track aging and decay over time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo NFTs */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Preview: How Your NFTs Will Evolve
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoNFTsWithState.map((nft) => (
                    <EnhancedNFTCard
                      key={nft.id}
                      nft={nft}
                      onClick={handleNFTClick}
                      onFreeze={handleFreeze}
                      onAccelerate={handleAccelerate}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-12 space-y-6 border-t border-card-border">
                <div className="w-24 h-24 rounded-full bg-card border border-card-border flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">No NFTs Yet</h2>
                  <p className="text-muted-foreground max-w-md">
                    Start creating and minting your first TimePics NFT!
                  </p>
              </div>
              <Link
                href="/generate"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Generate Your First Image
              </Link>
            </div>
            </>
          ) : (
            // NFTs grid
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {nfts.length} {nfts.length === 1 ? 'NFT' : 'NFTs'} found
                </p>
                <button
                  onClick={fetchNFTs}
                  className="text-sm text-primary hover:text-secondary transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <NFTCard key={nft.mintAddress} nft={nft} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          nft={selectedNFT}
        />
      )}
    </div>
  );
}
