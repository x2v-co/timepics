/**
 * v3 Enhanced Battle View Component
 * Displays Genesis NFTs, AI scores, audience backing, and visual effects
 * Following TIMEWAR_v3.md design:
 * - Top: The Standoff (Genesis NFTs)
 * - Middle: The Frontlines (Player NFTs)
 * - Skills Panel
 * - System Events
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy, Sparkles, Coins, Shield, Zap, AlertTriangle,
  Heart, Crown, Target, Bot, Star, Eye, Filter,
  ChevronUp, ChevronDown, RefreshCw, Skull, Ghost
} from 'lucide-react';

interface GenesisNFT {
  id: string;
  power: number;
  faction: 'A' | 'B';
  imageUrl?: string;
  name?: string;
}

interface Backer {
  userId: string;
  amount: number;
  timestamp: string;
}

interface NFTDisplay {
  id: string;
  name: string;
  imageUrl: string;
  power: number;
  role: 'GENESIS' | 'USER_SUBMITTED' | 'ROGUE_AGENT';
  status: 'PENDING' | 'CANONICAL' | 'PARADOX';
  relevanceScore?: number;
  styleMatchScore?: number;
  backedAmount?: number;
  backers?: Backer[];
  owner?: string;
  badge?: string;
  visualTraits?: {
    frame: string;
    overlay: string;
    badge: string | null;
  };
  faction?: 'A' | 'B';
}

interface SystemEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  endsAt: string;
}

interface v3BattleViewProps {
  battleId: string;
  topic: string;
  description: string;
  status: 'pending' | 'active' | 'ended';
  currentRound: number;
  totalRounds: number;
  genesisNFTs: {
    A?: GenesisNFT;
    B?: GenesisNFT;
  };
  factionA: {
    name: string;
    color: string;
    icon: string;
    nfts: NFTDisplay[];
    totalPower: number;
  };
  factionB: {
    name: string;
    color: string;
    icon: string;
    nfts: NFTDisplay[];
    totalPower: number;
  };
  totalPool: number;
  rewards?: {
    winnerPool: number;
    loserPool: number;
    systemFee: number;
  };
  rogueAgentActive?: boolean;
  systemEvents?: SystemEvent[];
}

type SortOption = 'most-backed' | 'high-iq' | 'newest';

function V3BattleView({
  battleId,
  topic,
  description,
  status,
  currentRound,
  totalRounds,
  genesisNFTs,
  factionA,
  factionB,
  totalPool,
  rewards,
  rogueAgentActive,
  systemEvents = []
}: v3BattleViewProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFTDisplay | null>(null);
  const [showBackModal, setShowBackModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('most-backed');
  const [showSkills, setShowSkills] = useState(false);
  const [activeEvents, setActiveEvents] = useState<SystemEvent[]>(systemEvents);

  // Calculate dominance
  const totalPower = factionA.totalPower + factionB.totalPower;
  const dominanceA = totalPower > 0 ? (factionA.totalPower / totalPower) * 100 : 50;
  const dominanceB = totalPower > 0 ? (factionB.totalPower / totalPower) * 100 : 50;

  // Sort NFTs
  const sortNFTs = (nfts: NFTDisplay[]): NFTDisplay[] => {
    switch (sortBy) {
      case 'most-backed':
        return [...nfts].sort((a, b) => (b.backedAmount || 0) - (a.backedAmount || 0));
      case 'high-iq':
        return [...nfts].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      case 'newest':
        return [...nfts].reverse();
      default:
        return nfts;
    }
  };

  const sortedNFTsA = sortNFTs(factionA.nfts);
  const sortedNFTsB = sortNFTs(factionB.nfts);

  // Handle NFT selection for backing
  const handleSelectNFT = (nft: NFTDisplay) => {
    setSelectedNFT(nft);
    setShowBackModal(true);
  };

  return (
    <div className="space-y-6">
      {/* ========================================== */}
      {/* 顶部：THE STANDOFF (对峙区) */}
      {/* ========================================== */}
      <div className="bg-gradient-to-r from-purple-900/30 via-gray-900 to-purple-900/30 rounded-xl p-4 border border-purple-500/30">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-1">⚔️ BATTLE IN PROGRESS ⚔️</h2>
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Eye className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AGENT IS WATCHING...</span>
          </div>
        </div>

        {/* Genesis Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Genesis Card A */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-900/60 to-amber-900/40 rounded-lg p-1 border-2 border-yellow-500/50">
              <div className="bg-gray-900/80 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-yellow-400 text-sm">GENESIS CARD</span>
                  </div>
                  <span className="text-xs text-gray-400">Owner: SYSTEM (Prize)</span>
                </div>
                <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                  {genesisNFTs.A?.imageUrl ? (
                    <img src={genesisNFTs.A.imageUrl} alt="Genesis A" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Star className="w-12 h-12 text-yellow-400/50" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Faction</span>
                    <span className="font-semibold" style={{ color: factionA.color }}>
                      {factionA.icon} {factionA.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Power</span>
                    <span className="font-bold text-yellow-400">{genesisNFTs.A?.power || 5000}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Genesis Card B */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-900/60 to-amber-900/40 rounded-lg p-1 border-2 border-yellow-500/50">
              <div className="bg-gray-900/80 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-yellow-400 text-sm">GENESIS CARD</span>
                  </div>
                  <span className="text-xs text-gray-400">Owner: SYSTEM (Prize)</span>
                </div>
                <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                  {genesisNFTs.B?.imageUrl ? (
                    <img src={genesisNFTs.B.imageUrl} alt="Genesis B" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Star className="w-12 h-12 text-yellow-400/50" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Faction</span>
                    <span className="font-semibold" style={{ color: factionB.color }}>
                      {factionB.icon} {factionB.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Power</span>
                    <span className="font-bold text-yellow-400">{genesisNFTs.B?.power || 5000}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Rogue Agent Warning */}
      {/* ========================================== */}
      {rogueAgentActive && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">⚠️ ROGUE AGENT DETECTED</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            System intervention activated! A rogue agent has joined the battlefield.
          </p>
        </div>
      )}

      {/* ========================================== */}
      {/* System Events Display */}
      {/* ========================================== */}
      {activeEvents.length > 0 && (
        <div className="space-y-2">
          {activeEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-lg p-3 flex items-center justify-between ${
                event.type === 'MARKET_CRASH' ? 'bg-red-900/50 border border-red-500' :
                event.type === 'TIMELINE_DISTORTION' ? 'bg-purple-900/50 border border-purple-500' :
                event.type === 'CHAOS_MODE' ? 'bg-orange-900/50 border border-orange-500' :
                'bg-blue-900/50 border border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {event.type === 'MARKET_CRASH' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {event.type === 'TIMELINE_DISTORTION' && <RefreshCw className="w-4 h-4 text-purple-400" />}
                {event.type === 'CHAOS_MODE' && <Zap className="w-4 h-4 text-orange-400" />}
                {event.type === 'THE_PURGE' && <Skull className="w-4 h-4 text-red-400" />}
                <span className="font-semibold text-sm">{event.name}</span>
              </div>
              <span className="text-xs text-gray-400">{event.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* Power Comparison */}
      {/* ========================================== */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Battle Power
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Faction A Power Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <span style={{ color: factionA.color }}>{factionA.icon}</span>
                <span>{factionA.name}</span>
              </div>
              <span className="font-bold">{factionA.totalPower.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${dominanceA}%`,
                  backgroundColor: factionA.color
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{dominanceA.toFixed(1)}%</span>
              <span>Dominance</span>
              <span>{dominanceB.toFixed(1)}%</span>
            </div>
          </div>

          {/* Faction B Power Bar */}
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <span style={{ color: factionB.color }}>{factionB.icon}</span>
                <span>{factionB.name}</span>
              </div>
              <span className="font-bold">{factionB.totalPower.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${dominanceB}%`,
                  backgroundColor: factionB.color
                }}
              />
            </div>
          </div>

          {/* Power Legend */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded" />
                <span className="text-gray-400">Genesis</span>
                <span className="font-bold">5000</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded" />
                <span className="text-gray-400">AI Score</span>
                <span className="font-bold">0-100</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded" />
                <span className="text-gray-400">Backed</span>
                <span className="font-bold">+Tokens</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* THE FRONTLINES (前线) - NFT Cards */}
      {/* ========================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            The Frontlines
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Sort by:</span>
            <div className="flex gap-1">
              <Button
                variant={sortBy === 'most-backed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('most-backed')}
              >
                🔥 Most Backed
              </Button>
              <Button
                variant={sortBy === 'high-iq' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('high-iq')}
              >
                🧠 High IQ
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Faction A NFTs */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: factionA.color }}>
              {factionA.icon} {factionA.name}
              <Badge variant="outline">{factionA.nfts.length} NFTs</Badge>
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {sortedNFTsA.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  factionColor={factionA.color}
                  onSelect={() => handleSelectNFT(nft)}
                  onBack={() => {
                    setSelectedNFT(nft);
                    setShowBackModal(true);
                  }}
                />
              ))}
              {sortedNFTsA.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No NFTs yet. Be the first to mint!
                </div>
              )}
            </div>
          </div>

          {/* Faction B NFTs */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: factionB.color }}>
              {factionB.icon} {factionB.name}
              <Badge variant="outline">{factionB.nfts.length} NFTs</Badge>
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {sortedNFTsB.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  factionColor={factionB.color}
                  onSelect={() => handleSelectNFT(nft)}
                  onBack={() => {
                    setSelectedNFT(nft);
                    setShowBackModal(true);
                  }}
                />
              ))}
              {sortedNFTsB.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No NFTs yet. Be the first to mint!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Skills Panel */}
      {/* ========================================== */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Agent Skills
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSkills(!showSkills)}
            >
              {showSkills ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showSkills && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SkillButton name="Deep Scan" cost={20} icon="🔍" description="Get AI evaluation" />
              <SkillButton name="Copy-Mint" cost={150} icon="🎯" description="Clone prompt" />
              <SkillButton name="Anti-Audit" cost={100} icon="🛡️" description="Block audit" />
              <SkillButton name="Flash Pump" cost={200} icon="⚡" description="+500 power" />
              <SkillButton name="Fog" cost={200} icon="🌫️" description="Hide votes" />
              <SkillButton name="Liquidity" cost={300} icon="💧" description="+5% faction" />
              <SkillButton name="Audit" cost={50} icon="📋" description="Re-evaluate enemy" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ========================================== */}
      {/* Reward Distribution */}
      {/* ========================================== */}
      {rewards && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              Reward Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                <p className="text-sm text-gray-400 mb-1">Winner Pool</p>
                <p className="text-2xl font-bold text-green-400">
                  {rewards.winnerPool.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">70%</p>
              </div>
              <div className="text-center p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <p className="text-sm text-gray-400 mb-1">Loser Pool</p>
                <p className="text-2xl font-bold text-blue-400">
                  {rewards.loserPool.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">25%</p>
              </div>
              <div className="text-center p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-gray-400 mb-1">Treasury</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {rewards.systemFee.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================== */}
      {/* Back Modal */}
      {/* ========================================== */}
      <BackModal
        open={showBackModal}
        onClose={() => {
          setShowBackModal(false);
          setSelectedNFT(null);
        }}
        nft={selectedNFT}
      />
    </div>
  );
}

/**
 * Skill Button Component
 */
function SkillButton({
  name,
  cost,
  icon,
  description
}: {
  name: string;
  cost: number;
  icon: string;
  description: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Skill casting logic would go here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Button
      variant="outline"
      className="h-auto py-2 flex flex-col items-center gap-1"
      onClick={handleClick}
      disabled={loading}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-semibold">{name}</span>
      <span className="text-xs text-yellow-400">{cost} Tks</span>
    </Button>
  );
}

/**
 * NFT Card Component
 */
function NFTCard({
  nft,
  factionColor,
  onSelect,
  onBack
}: {
  nft: NFTDisplay;
  factionColor: string;
  onSelect: () => void;
  onBack: () => void;
}) {
  const hasBackers = nft.backers && nft.backers.length > 0;

  // Determine card style based on status
  const getCardStyle = () => {
    switch (nft.status) {
      case 'CANONICAL':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'PARADOX':
        return 'border-red-500 bg-red-900/20';
      default:
        if (nft.role === 'GENESIS') return 'border-yellow-500 bg-yellow-900/10';
        if (nft.role === 'ROGUE_AGENT') return 'border-red-500 bg-red-900/10';
        return 'border-gray-700 bg-gray-800/50';
    }
  };

  const getBadgeContent = () => {
    switch (nft.status) {
      case 'CANONICAL':
        return { text: 'VICTOR', color: 'bg-yellow-600' };
      case 'PARADOX':
        return { text: 'PARADOX', color: 'bg-red-600' };
      default:
        if (nft.role === 'GENESIS') return { text: 'GENESIS', color: 'bg-yellow-600' };
        if (nft.role === 'ROGUE_AGENT') return { text: 'ROGUE', color: 'bg-red-600' };
        return null;
    }
  };

  const badge = getBadgeContent();

  return (
    <Card
      className={`${getCardStyle()} border cursor-pointer hover:scale-[1.02] transition`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* NFT Image */}
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* NFT Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{nft.name}</span>
                {badge && (
                  <Badge className={`${badge.color} text-xs`}>
                    {badge.text}
                  </Badge>
                )}
              </div>
              <span className="font-bold text-lg" style={{ color: factionColor }}>
                {nft.power}
              </span>
            </div>

            {/* AI Scores */}
            {nft.relevanceScore !== undefined && (
              <div className="flex gap-2 text-xs mb-1">
                <span className="text-gray-400">
                  Relevance: <span className="text-blue-400">{nft.relevanceScore}</span>
                </span>
                <span className="text-gray-400">
                  Style: <span className="text-purple-400">{nft.styleMatchScore}</span>
                </span>
              </div>
            )}

            {/* Backer Info */}
            {hasBackers && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart className="w-3 h-3 text-red-400" />
                <span>{nft.backedAmount} backed by {(nft.backers || []).length} patrons</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Target className="w-3 h-3" />
            <span>Power: AI({nft.relevanceScore || 50}) + Mint(100) + Back({nft.backedAmount || 0})</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
          >
            ⚡ Charge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Back Modal Component - For supporting NFTs in battle
 */
function BackModal({
  open,
  onClose,
  nft,
  userBalance = 1000,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  nft: NFTDisplay | null;
  userBalance?: number;
  onConfirm?: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(50);

  if (!open || !nft) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(amount);
    } else {
      console.log('Backing NFT:', nft.id, 'Amount:', amount);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Support This NFT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-medium">{nft.name}</p>
              <p className="text-sm text-gray-400">Current Power: {nft.power}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Amount to back (increases power)
            </label>
            <div className="flex gap-2">
              {[10, 50, 100, 200].map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAmount(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Your Balance</span>
            <span>{userBalance} tokens</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">New Power</span>
            <span className="font-bold text-green-400">
              {nft.power + amount}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Back NFT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { V3BattleView, BackModal };
export type { GenesisNFT, NFTDisplay, Backer };
