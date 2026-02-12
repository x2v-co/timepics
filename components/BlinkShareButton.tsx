/**
 * Solana Blinks Share Button
 *
 * Allows users to share NFTs and Wars on Twitter with embedded Solana actions
 */

'use client';

import { FC, useState } from 'react';
import { Button } from './ui/button';
import { Share2, Twitter, Copy, Check } from 'lucide-react';
import {
  generateNFTBlinkUrl,
  generateWarsBlinkUrl,
  generateTwitterShareUrl,
} from '@/lib/blinks';

interface BlinkShareButtonProps {
  type: 'nft' | 'wars';
  nftId?: string;
  eventId?: string;
  factionId?: string;
  title?: string;
}

export const BlinkShareButton: FC<BlinkShareButtonProps> = ({
  type,
  nftId,
  eventId,
  factionId,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Generate Blink URL
  const blinkUrl =
    type === 'nft' && nftId
      ? generateNFTBlinkUrl(nftId)
      : type === 'wars' && eventId && factionId
      ? generateWarsBlinkUrl(eventId, factionId)
      : '';

  const shareText =
    type === 'nft'
      ? `Check out this AI-generated NFT on TimePics.ai! ${title || ''}`
      : `Join the Timeline Wars battle! Fight for ${title || 'your faction'}! ⚔️`;

  const twitterUrl = generateTwitterShareUrl(blinkUrl, shareText);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blinkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Blink
      </Button>

      {showMenu && (
        <div className="absolute right-0 top-12 z-50 bg-card border border-card-border rounded-lg shadow-lg p-2 min-w-[200px]">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 mb-1"
            onClick={handleTwitterShare}
          >
            <Twitter className="w-4 h-4 text-blue-400" />
            Share on Twitter
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Blink URL
              </>
            )}
          </Button>

          <div className="mt-2 pt-2 border-t border-card-border">
            <p className="text-xs text-muted-foreground px-2">
              Blink URLs let users mint/stake directly from Twitter!
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};
