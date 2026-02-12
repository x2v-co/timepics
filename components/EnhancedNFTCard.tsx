/**
 * Enhanced NFT Card with Time Decay Visualization
 * Shows "survival days" and entropy effects
 */

'use client';

import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlinkShareButton } from '@/components/BlinkShareButton';
import { Clock, Zap, Lock, TrendingUp, Flame } from 'lucide-react';

export interface EnhancedNFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  mintDate: string; // ISO date
  engine: 'rewind' | 'refract' | 'foresee';
  entropy: number; // 0-100, how much it has "aged"
  locked?: boolean; // If user froze it
}

interface EnhancedNFTCardProps {
  nft: EnhancedNFT;
  onFreeze?: (id: string) => void;
  onAccelerate?: (id: string) => void;
  onClick?: (nft: EnhancedNFT) => void;
}

const getEntropyLevel = (entropy: number): {
  label: string;
  color: string;
  icon: typeof Clock;
} => {
  if (entropy < 20) return { label: 'Fresh', color: 'text-green-400', icon: Clock };
  if (entropy < 50) return { label: 'Aging', color: 'text-yellow-400', icon: TrendingUp };
  if (entropy < 80) return { label: 'Decayed', color: 'text-orange-400', icon: Flame };
  return { label: 'Ancient', color: 'text-red-400', icon: Zap };
};

const getDaysSinceMint = (mintDate: string): number => {
  const mint = new Date(mintDate);
  const now = new Date();
  const diff = now.getTime() - mint.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const EnhancedNFTCard: FC<EnhancedNFTCardProps> = ({
  nft,
  onFreeze,
  onAccelerate,
  onClick,
}) => {
  const [daysSince, setDaysSince] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setDaysSince(getDaysSinceMint(nft.mintDate));

    // Update every hour
    const interval = setInterval(() => {
      setDaysSince(getDaysSinceMint(nft.mintDate));
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [nft.mintDate]);

  const entropyLevel = getEntropyLevel(nft.entropy);
  const EntropyIcon = entropyLevel.icon;

  return (
    <Card
      className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-glow-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(nft)}
    >
      {/* Entropy overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(255,255,255,${nft.entropy / 500}) 100%)`,
          opacity: isHovered ? 0.3 : 0,
        }}
      />

      <CardHeader className="p-0 relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-card">
          <Image
            src={nft.imageUrl}
            alt={nft.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${nft.entropy > 50 ? 'saturate-50' : 'saturate-100'}`}
            style={{
              filter: `sepia(${nft.entropy / 200}) blur(${nft.entropy > 80 ? '1px' : '0px'})`,
            }}
          />

          {/* Locked badge */}
          {nft.locked && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Frozen
              </Badge>
            </div>
          )}

          {/* Entropy badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className={`${entropyLevel.color} border-current flex items-center gap-1`}>
              <EntropyIcon className="w-3 h-3" />
              {entropyLevel.label}
            </Badge>
          </div>

          {/* Days counter overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-xs opacity-80">Survival</p>
                <p className="text-lg font-bold">{daysSince} days</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Entropy</p>
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      nft.entropy < 50 ? 'bg-green-400' : nft.entropy < 80 ? 'bg-yellow-400' : 'bg-red-400'
                    } transition-all duration-1000`}
                    style={{ width: `${nft.entropy}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          {/* Control buttons row */}
          {(onFreeze || onAccelerate) && (
            <div className="flex gap-2 w-full">
              {!nft.locked && onFreeze && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onFreeze(nft.id);
                  }}
                  className="flex-1"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Freeze
                </Button>
              )}

              {onAccelerate && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onAccelerate(nft.id);
                  }}
                  className="flex-1"
                  disabled={nft.locked}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Accelerate
                </Button>
              )}
            </div>
          )}

          {/* Blinks Share Button - full width */}
          <BlinkShareButton
            type="nft"
            nftId={nft.id}
            title={nft.name}
          />
        </div>
      </CardFooter>

      {/* Hover effect: show "future preview" - Only on image area */}
      {isHovered && !nft.locked && nft.entropy < 80 && (
        <div className="absolute top-0 left-0 right-0 bottom-[40%] bg-black/80 flex items-center justify-center transition-opacity duration-300 rounded-t-lg">
          <div className="text-center text-white p-4">
            <p className="text-sm opacity-80 mb-2">🔮 In {30 - daysSince} days...</p>
            <p className="text-xs opacity-60">
              {nft.entropy < 50
                ? 'Colors will fade, vintage grain will appear'
                : 'Structure will distort, reality will fracture'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
