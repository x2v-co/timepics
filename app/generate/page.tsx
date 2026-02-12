/**
 * Image Generation Page
 * Main interface for generating AI images
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { WalletButton } from '@/components/WalletButton';
import { EngineSelector, type EngineType } from '@/components/EngineCard';
import { GenerationForm, type GenerationParams } from '@/components/GenerationForm';
import { ImageDisplay } from '@/components/ImageDisplay';
import { TimeAnimation } from '@/components/TimeAnimation';
import { MintSuccessModal } from '@/components/MintSuccessModal';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  const [engine, setEngine] = useState<EngineType>('rewind');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [showMintSuccess, setShowMintSuccess] = useState(false);
  const [mintResult, setMintResult] = useState<{
    mintAddress: string;
    explorerUrl?: string;
    ipfsImageUrl?: string;
    ipfsMetadataUrl?: string;
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{
    imageUrl: string;
    metadata: {
      engine: string;
      prompt: string;
      era?: string;
      timestamp: string;
      generationId: string;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get engine from URL
  useEffect(() => {
    const engineParam = searchParams.get('engine') as EngineType;
    if (engineParam && ['rewind', 'refract', 'foresee'].includes(engineParam)) {
      setEngine(engineParam);
    }
  }, [searchParams]);

  // Update URL when engine changes
  const handleEngineChange = (newEngine: EngineType) => {
    setEngine(newEngine);
    router.push(`/generate?engine=${newEngine}`);
  };

  // Handle image generation
  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine,
          ...params,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setGeneratedImage(data);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle NFT minting
  const handleMint = async () => {
    if (!connected || !publicKey || !generatedImage) {
      alert('Please connect wallet first');
      return;
    }

    setIsMinting(true);

    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: generatedImage.imageUrl,
          metadata: generatedImage.metadata,
          walletAddress: publicKey.toBase58(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Minting failed');
      }

      const data = await response.json();

      // Show success modal with all information
      setMintResult({
        mintAddress: data.mintAddress,
        explorerUrl: data.explorerUrl,
        ipfsImageUrl: data.ipfs?.imageUrl,
        ipfsMetadataUrl: data.ipfs?.metadataUrl,
      });
      setShowMintSuccess(true);

    } catch (err) {
      console.error('Minting error:', err);
      alert(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
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
          {/* Engine Selector */}
          <div className="mb-8">
            <EngineSelector selectedEngine={engine} onEngineChange={handleEngineChange} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Generation Form */}
            <div>
              <div className="bg-card border border-card-border rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Create Your Vision</h2>
                <GenerationForm
                  engine={engine}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            </div>

            {/* Right: Generated Image or Loading */}
            <div>
              {isGenerating ? (
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <TimeAnimation
                    engine={engine}
                    message={`${engine.charAt(0).toUpperCase() + engine.slice(1)} engine activating...`}
                  />
                </div>
              ) : generatedImage ? (
                <div className="bg-card border border-card-border rounded-xl p-6">
                  <ImageDisplay
                    imageUrl={generatedImage.imageUrl}
                    metadata={generatedImage.metadata}
                    onMintClick={handleMint}
                    isMinting={isMinting}
                  />
                </div>
              ) : (
                <div className="bg-card border border-card-border rounded-xl p-6 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Your generated image will appear here
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mint Success Modal */}
      {mintResult && (
        <MintSuccessModal
          isOpen={showMintSuccess}
          onClose={() => setShowMintSuccess(false)}
          mintAddress={mintResult.mintAddress}
          explorerUrl={mintResult.explorerUrl}
          ipfsImageUrl={mintResult.ipfsImageUrl}
          ipfsMetadataUrl={mintResult.ipfsMetadataUrl}
        />
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
