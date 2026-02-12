/**
 * Generated Image Display Component
 * Shows the AI-generated image with metadata
 */

'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { Download, Share2, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageDisplayProps {
  imageUrl: string;
  metadata?: {
    engine: string;
    prompt: string;
    era?: string;
    timestamp: string;
    generationId: string;
  };
  onMintClick?: () => void;
  isMinting?: boolean;
}

export const ImageDisplay: FC<ImageDisplayProps> = ({
  imageUrl,
  metadata,
  onMintClick,
  isMinting = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timepics-${metadata?.generationId || Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TimePics.ai Generation',
          text: `Check out this AI-generated image: ${metadata?.prompt}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-card border border-card-border group">
          <Image
            src={imageUrl}
            alt={metadata?.prompt || 'Generated image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-3 bg-card rounded-full hover:bg-primary transition-colors"
              title="View fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 bg-card rounded-full hover:bg-primary transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-card rounded-full hover:bg-primary transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        {metadata && (
          <div className="p-4 bg-card rounded-lg border border-card-border space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Prompt</p>
              <p className="text-foreground">{metadata.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Engine</p>
                <p className="text-foreground capitalize">{metadata.engine}</p>
              </div>
              {metadata.era && (
                <div>
                  <p className="text-muted-foreground mb-1">Era</p>
                  <p className="text-foreground">{metadata.era}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Generated</p>
                <p className="text-foreground">
                  {new Date(metadata.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">ID</p>
                <p className="text-foreground font-mono text-xs">
                  {metadata.generationId.slice(0, 12)}...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mint Button */}
        {onMintClick && (
          <button
            onClick={onMintClick}
            disabled={isMinting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isMinting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Minting NFT...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Mint as NFT on Solana</span>
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen">
            <Image
              src={imageUrl}
              alt={metadata?.prompt || 'Generated image'}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};
