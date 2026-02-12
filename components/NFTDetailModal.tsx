/**
 * NFT Detail Modal
 * Shows NFT details including IPFS links when clicked in gallery
 */

'use client';

import { FC } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { EnhancedNFT } from './EnhancedNFTCard';

interface NFTDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: EnhancedNFT;
  ipfsImageUrl?: string;
  ipfsMetadataUrl?: string;
  explorerUrl?: string;
}

export const NFTDetailModal: FC<NFTDetailModalProps> = ({
  isOpen,
  onClose,
  nft,
  ipfsImageUrl,
  ipfsMetadataUrl,
  explorerUrl,
}) => {
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedMetadata, setCopiedMetadata] = useState(false);

  const copyToClipboard = async (text: string, type: 'image' | 'metadata') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'image') {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      } else {
        setCopiedMetadata(true);
        setTimeout(() => setCopiedMetadata(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Convert local path to IPFS URL if available
  const getIPFSUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // For demo, show placeholder
    return null;
  };

  const imageIPFS = getIPFSUrl(ipfsImageUrl);
  const metadataIPFS = getIPFSUrl(ipfsMetadataUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{nft.name}</DialogTitle>
          <DialogDescription>{nft.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-card border border-card-border">
            <Image
              src={nft.imageUrl}
              alt={nft.name}
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, 600px"
            />
          </div>

          {/* NFT Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Engine</p>
              <Badge variant="outline" className="capitalize">
                {nft.engine}
              </Badge>
            </div>
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Entropy</p>
              <p className="text-sm font-semibold">{nft.entropy}%</p>
            </div>
          </div>

          {/* IPFS Links Section */}
          <div className="space-y-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Decentralized Storage (IPFS)
            </h3>

            {imageIPFS ? (
              <>
                {/* Image IPFS */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Image CID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-background px-3 py-2 rounded border border-card-border truncate">
                      {imageIPFS}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(imageIPFS, 'image')}
                    >
                      {copiedImage ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <a
                    href={imageIPFS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View on IPFS Gateway <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Metadata IPFS */}
                {metadataIPFS && (
                  <div className="space-y-2 pt-2 border-t border-blue-500/20">
                    <p className="text-xs text-muted-foreground">Metadata CID</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-background px-3 py-2 rounded border border-card-border truncate">
                        {metadataIPFS}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(metadataIPFS, 'metadata')}
                      >
                        {copiedMetadata ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <a
                      href={metadataIPFS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Metadata JSON <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                ℹ️ This is a demo NFT. Mint your own to get IPFS links!
              </p>
            )}
          </div>

          {/* Blockchain Explorer */}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">View on Solana Explorer</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Mint Date */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-card-border">
            Minted {new Date(nft.mintDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
