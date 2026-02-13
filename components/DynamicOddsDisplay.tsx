/**
 * Dynamic Odds Display
 * Shows real-time odds, potential winnings, and betting trends
 */

'use client';

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowRight } from 'lucide-react';

interface OddsHistory {
  timestamp: number;
  oddsA: number;
  oddsB: number;
}

interface DynamicOddsDisplayProps {
  currentOdds: {
    agentA: number;
    agentB: number;
  };
  oddsHistory?: OddsHistory[];
  totalBetsOnA: number;
  totalBetsOnB: number;
  agentAName: string;
  agentBName: string;
  userBetAmount?: number;
  selectedFaction?: 'A' | 'B';
  compact?: boolean;
}

export const DynamicOddsDisplay: FC<DynamicOddsDisplayProps> = ({
  currentOdds,
  oddsHistory = [],
  totalBetsOnA,
  totalBetsOnB,
  agentAName,
  agentBName,
  userBetAmount = 0,
  selectedFaction,
  compact = false
}) => {
  const totalBets = totalBetsOnA + totalBetsOnB;
  const percentA = totalBets > 0 ? (totalBetsOnA / totalBets) * 100 : 50;
  const percentB = totalBets > 0 ? (totalBetsOnB / totalBets) * 100 : 50;

  // Calculate odds trend
  const getOddsTrend = (faction: 'A' | 'B'): 'up' | 'down' | 'stable' => {
    if (oddsHistory.length < 2) return 'stable';

    const recent = oddsHistory[oddsHistory.length - 1];
    const previous = oddsHistory[oddsHistory.length - 2];

    const currentOdd = faction === 'A' ? recent.oddsA : recent.oddsB;
    const previousOdd = faction === 'A' ? previous.oddsA : previous.oddsB;

    const diff = currentOdd - previousOdd;

    if (Math.abs(diff) < 0.05) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const trendA = getOddsTrend('A');
  const trendB = getOddsTrend('B');

  // Calculate potential winnings
  const calculatePotentialWinnings = (amount: number, faction: 'A' | 'B'): number => {
    const odds = faction === 'A' ? currentOdds.agentA : currentOdds.agentB;
    return Math.floor(amount * odds);
  };

  // Determine "smart money" direction (where large bets are going)
  const smartMoneyIndicator = percentA > 60 ? 'A' : percentB > 60 ? 'B' : null;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {/* Agent A Odds */}
        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{agentAName}</span>
            <TrendIcon trend={trendA} />
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {currentOdds.agentA.toFixed(2)}x
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {percentA.toFixed(0)}% of bets
          </div>
        </div>

        {/* Agent B Odds */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{agentBName}</span>
            <TrendIcon trend={trendB} />
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {currentOdds.agentB.toFixed(2)}x
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {percentB.toFixed(0)}% of bets
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Live Odds & Betting Pool
          </CardTitle>
          {smartMoneyIndicator && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
              Smart Money → Agent {smartMoneyIndicator}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Odds */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Agent A */}
          <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">{agentAName}</span>
              <TrendIcon trend={trendA} />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {currentOdds.agentA.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-500">
              {totalBetsOnA} tokens ({percentA.toFixed(0)}%)
            </div>
          </div>

          {/* Agent B */}
          <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">{agentBName}</span>
              <TrendIcon trend={trendB} />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {currentOdds.agentB.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-500">
              {totalBetsOnB} tokens ({percentB.toFixed(0)}%)
            </div>
          </div>
        </div>

        {/* Potential Winnings Calculator */}
        {userBetAmount > 0 && selectedFaction && (
          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Your Potential Winnings</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Betting {userBetAmount} tokens</p>
                <p className="text-xs text-gray-500">
                  On Agent {selectedFaction} at {selectedFaction === 'A' ? currentOdds.agentA : currentOdds.agentB}x odds
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span className="text-2xl font-bold text-green-400">
                  {calculatePotentialWinnings(userBetAmount, selectedFaction)} tokens
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bet Distribution Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Bet Distribution</span>
            <span>{totalBets} total tokens</span>
          </div>
          <div className="h-3 bg-gray-900 rounded-full overflow-hidden flex">
            <div
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${percentA}%` }}
            />
            <div
              className="bg-purple-500 transition-all duration-500"
              style={{ width: `${percentB}%` }}
            />
          </div>
        </div>

        {/* Odds History Mini Chart */}
        {oddsHistory.length > 1 && (
          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Odds Movement (Last {oddsHistory.length} updates)</p>
            <div className="flex items-end gap-1 h-12">
              {oddsHistory.slice(-10).map((history, index) => {
                const maxOdds = Math.max(...oddsHistory.map(h => Math.max(h.oddsA, h.oddsB)));
                const heightA = (history.oddsA / maxOdds) * 100;
                const heightB = (history.oddsB / maxOdds) * 100;

                return (
                  <div key={index} className="flex-1 flex gap-[1px]">
                    <div
                      className="flex-1 bg-blue-500/50 rounded-t transition-all"
                      style={{ height: `${heightA}%` }}
                      title={`Agent A: ${history.oddsA.toFixed(2)}x`}
                    />
                    <div
                      className="flex-1 bg-purple-500/50 rounded-t transition-all"
                      style={{ height: `${heightB}%` }}
                      title={`Agent B: ${history.oddsB.toFixed(2)}x`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
          <p className="text-xs text-gray-500">
            💡 <strong>How odds work:</strong> Odds update in real-time based on bet distribution.
            Higher odds = less popular bet = higher potential reward if you win.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
