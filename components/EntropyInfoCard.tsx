/**
 * Entropy Info Card
 * Explains the Living NFTs system: Survival days and Entropy
 */

'use client';

import { FC, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ChevronDown, ChevronUp, Clock, TrendingUp, Flame, Zap, Lock, Play } from 'lucide-react';

export const EntropyInfoCard: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            {/* Header - Always visible */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  ⏳ Living NFTs: Time-Based Evolution System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your NFTs evolve over time through Survival and Entropy metrics
                </p>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors ml-4">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Detailed explanation - Expandable */}
            {isExpanded && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-300">
                {/* Survival Days */}
                <div className="p-4 bg-background/50 rounded-lg border border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <h4 className="font-semibold text-sm">📅 Survival Days</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    The number of days since your NFT was minted. This is a simple counter that increases by 1 each day,
                    representing your NFT's "lifespan" on the blockchain.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-green-400 border-green-400/30">Day 0-7: Newborn</Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30">Day 8-30: Young</Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400/30">Day 30+: Veteran</Badge>
                  </div>
                </div>

                {/* Entropy System */}
                <div className="p-4 bg-background/50 rounded-lg border border-card-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <h4 className="font-semibold text-sm">🌀 Entropy (0-100%)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    A measure of how much your NFT has "aged" or "decayed" over time. As entropy increases,
                    visual effects like sepia tone, grain, blur, and desaturation are applied to simulate aging.
                  </p>

                  {/* Entropy Levels */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                      <Clock className="w-3 h-3 text-green-400" />
                      <div>
                        <p className="text-xs font-medium text-green-400">0-19%: Fresh</p>
                        <p className="text-xs text-muted-foreground">Original quality</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                      <TrendingUp className="w-3 h-3 text-yellow-400" />
                      <div>
                        <p className="text-xs font-medium text-yellow-400">20-49%: Aging</p>
                        <p className="text-xs text-muted-foreground">Slight color shift</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <div>
                        <p className="text-xs font-medium text-orange-400">50-79%: Decayed</p>
                        <p className="text-xs text-muted-foreground">Visible aging effects</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                      <Zap className="w-3 h-3 text-red-400" />
                      <div>
                        <p className="text-xs font-medium text-red-400">80-100%: Ancient</p>
                        <p className="text-xs text-muted-foreground">Heavy distortion</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-cyan-400">
                    💡 <strong>Entropy increases automatically over time</strong>, but you can control it with actions below.
                  </p>
                </div>

                {/* Control Actions */}
                <div className="p-4 bg-background/50 rounded-lg border border-card-border">
                  <h4 className="font-semibold text-sm mb-3">🎮 Control Your NFT's Evolution</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-2 bg-accent/5 rounded">
                      <Lock className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium">🔒 Freeze (Lock)</p>
                        <p className="text-xs text-muted-foreground">
                          Stop entropy from increasing. Your NFT will remain at its current state forever.
                          Cannot be undone!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 bg-primary/5 rounded">
                      <Play className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium">⚡ Accelerate (Fast-Forward)</p>
                        <p className="text-xs text-muted-foreground">
                          Instantly increase entropy to see your NFT's "future" aged state.
                          Useful for collectors who want vintage aesthetics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Effects */}
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-xs text-center">
                    <strong className="text-purple-400">Visual Effects by Entropy:</strong>
                    <span className="text-muted-foreground ml-2">
                      Sepia filter • Grain texture • Desaturation • Blur (80%+) • Vintage overlay
                    </span>
                  </p>
                </div>

                {/* Example scenario */}
                <div className="p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <p className="text-xs">
                    <strong className="text-cyan-400">📖 Example:</strong>
                    <span className="text-muted-foreground ml-1">
                      You mint an NFT today (Day 0, 15% entropy). After 20 days, it reaches 45% entropy with slight aging.
                      You <strong>Freeze</strong> it to preserve this "vintage but not too old" aesthetic permanently.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
