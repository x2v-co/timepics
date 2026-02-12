/**
 * NFT Card Component for Gallery Display
 */

'use client';

import { FC } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface NFTCardProps {
  nft: {
    mintAddress: string;
    name: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  onClick?: () => void;
}

export const NFTCard: FC<NFTCardProps> = ({ nft, onClick }) => {
  const getAttributeValue = (traitType: string) => {
    return nft.attributes?.find((attr) => attr.trait_type === traitType)?.value;
  };

  const engine = getAttributeValue('Engine');
  const era = getAttributeValue('Era');
  const date = getAttributeValue('Generation Date');

  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    const explorerUrl = `https://explorer.solana.com/address/${nft.mintAddress}${
      network !== 'mainnet-beta' ? `?cluster=${network}` : ''
    }`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-xl border border-card-border overflow-hidden cursor-pointer card-hover"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-muted">
        {nft.image ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handleExplorerClick}
              className="flex items-center gap-2 px-3 py-2 bg-primary rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              View on Explorer
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-semibold text-lg truncate">{nft.name}</h3>

        {/* Attributes */}
        <div className="space-y-1 text-sm">
          {engine && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-medium">{engine}</span>
            </div>
          )}
          {era && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Era</span>
              <span className="font-medium">{era}</span>
            </div>
          )}
          {date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{date}</span>
            </div>
          )}
        </div>

        {/* Mint Address */}
        <div className="pt-2 border-t border-card-border">
          <p className="text-xs text-muted-foreground font-mono truncate">
            {nft.mintAddress}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * NFT Card Skeleton for loading state
 */
export const NFTCardSkeleton: FC = () => {
  return (
    <div className="bg-card rounded-xl border border-card-border overflow-hidden">
      <div className="aspect-square w-full bg-muted loading-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded loading-shimmer" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded loading-shimmer" />
          <div className="h-4 bg-muted rounded loading-shimmer w-3/4" />
        </div>
        <div className="h-3 bg-muted rounded loading-shimmer w-1/2" />
      </div>
    </div>
  );
};
