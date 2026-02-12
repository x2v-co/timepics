/**
 * Mint Success Modal
 * Shows success message and navigation options after minting
 */

'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Sparkles, Swords, Image as ImageIcon } from 'lucide-react';

interface MintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  mintAddress: string;
  explorerUrl?: string;
  ipfsImageUrl?: string;
  ipfsMetadataUrl?: string;
}

export const MintSuccessModal: FC<MintSuccessModalProps> = ({
  isOpen,
  onClose,
  mintAddress,
  explorerUrl,
  ipfsImageUrl,
  ipfsMetadataUrl,
}) => {
  const router = useRouter();

  const handleGoToGallery = () => {
    onClose();
    router.push('/gallery');
  };

  const handleGoToWars = () => {
    onClose();
    router.push('/timeline-wars');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl">🎉 NFT Minted Successfully!</DialogTitle>
              <DialogDescription>
                Your TimePics NFT is now on Solana blockchain
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Mint Address */}
          <div className="p-4 bg-card border border-card-border rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Mint Address</p>
            <code className="text-xs text-primary break-all">{mintAddress}</code>
          </div>

          {/* IPFS Links */}
          {ipfsImageUrl && (
            <div className="space-y-2">
              <Badge variant="outline" className="mb-1">
                <ImageIcon className="w-3 h-3 mr-1" />
                Decentralized Storage
              </Badge>

              {ipfsImageUrl && (
                <a
                  href={ipfsImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View on IPFS (Image) <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {ipfsMetadataUrl && (
                <a
                  href={ipfsMetadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View Metadata (JSON) <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Explorer Link */}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              View on Solana Explorer <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* What's Next */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm font-semibold mb-2">✨ What's Next?</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• View your NFT in the Gallery</li>
              <li>• Use it in Timeline Wars for battles</li>
              <li>• Watch it age through the Entropy Protocol</li>
              <li>• Share your Blink on social media</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleGoToGallery}
            className="flex-1"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            View Gallery
          </Button>
          <Button
            onClick={handleGoToWars}
            className="flex-1 bg-gradient-to-r from-primary to-accent"
          >
            <Swords className="w-4 h-4 mr-2" />
            Join Wars
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
