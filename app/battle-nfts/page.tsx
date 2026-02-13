/**
 * Battle NFT Gallery Page
 * Display user's minted Battle NFTs with Living NFT effects
 */

'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image as ImageIcon,
  Coins,
  Trophy,
  Zap,
  Snowflake,
  Clock,
  TrendingUp,
  ArrowRight,
  Shield,
  Target
} from 'lucide-react';

interface BattleNFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  faction: 'A' | 'B';
  engine: 'rewind' | 'refract' | 'foresee';
  mintDate: string;
  entropy: number;
  frozen: boolean;
  power: number;
  staked: boolean;
  mintCost: number;
  potentialReward: number;
  battleEnded: boolean;
  won?: boolean;
  reward?: number;
  badge?: 'canonical' | 'paradox';
  battleInfo?: {
    topic: string;
    status: string;
    currentRound: number;
    totalRounds: number;
    winner?: 'A' | 'B' | 'draw';
    factionName: string;
  };
}

interface NFTStats {
  totalNFTs: number;
  stakedNFTs: number;
  totalPower: number;
  wonBattles: number;
  totalRewards: number;
}

export default function BattleNFTGalleryPage() {
  const [nfts, setNFTs] = useState<BattleNFT[]>([]);
  const [stats, setStats] = useState<NFTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'staked' | 'won'>('all');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get or create user ID
    let id = localStorage.getItem('timepics_user_id');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('timepics_user_id', id);
    }
    setUserId(id);
    fetchNFTs(id);
  }, [filter]);

  const fetchNFTs = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/nfts?userId=${id}&filter=${filter}`);
      const data = await response.json();
      if (data.success) {
        setNFTs(data.nfts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntropyColor = (entropy: number) => {
    if (entropy < 20) return 'text-green-400';
    if (entropy < 50) return 'text-yellow-400';
    if (entropy < 80) return 'text-orange-400';
    return 'text-red-400';
  };

  const getEntropyLabel = (entropy: number) => {
    if (entropy < 20) return 'Fresh';
    if (entropy < 50) return 'Aging';
    if (entropy < 80) return 'Decayed';
    return 'Ancient';
  };

  const getEngineColor = (engine: string) => {
    if (engine === 'rewind') return 'bg-blue-600';
    if (engine === 'refract') return 'bg-purple-600';
    return 'bg-cyan-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                My Battle NFTs
              </h1>
              <p className="text-gray-400">
                Living NFTs that evolve over time. Each represents your participation in Agent battles.
              </p>
            </div>
            <Link href="/arena">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Target className="w-4 h-4 mr-2" />
                Join Battle
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalNFTs}</p>
                  <p className="text-sm text-gray-400">Total NFTs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.stakedNFTs}</p>
                  <p className="text-sm text-gray-400">Staked</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalPower}</p>
                  <p className="text-sm text-gray-400">Total Power</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.wonBattles}</p>
                  <p className="text-sm text-gray-400">Won Battles</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalRewards}</p>
                  <p className="text-sm text-gray-400">Total Rewards</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="all">All NFTs</TabsTrigger>
            <TabsTrigger value="active">Active Battles</TabsTrigger>
            <TabsTrigger value="staked">Staked</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* NFT Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading your NFTs...</p>
          </div>
        ) : nfts.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No NFTs yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Mint your first Battle NFT by joining an Agent battle!
              </p>
              <Link href="/arena">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Browse Battles
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <Card key={nft.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all group">
                <CardHeader className="pb-4">
                  {/* NFT Image */}
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full aspect-square object-cover"
                      style={{
                        filter: nft.entropy > 20
                          ? `grayscale(${nft.entropy / 2}%) opacity(${100 - nft.entropy / 4}%)`
                          : 'none'
                      }}
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      <Badge className={getEngineColor(nft.engine)}>
                        {nft.engine}
                      </Badge>
                      {nft.staked && (
                        <Badge className="bg-blue-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Staked
                        </Badge>
                      )}
                      {nft.frozen && (
                        <Badge className="bg-cyan-600">
                          <Snowflake className="w-3 h-3 mr-1" />
                          Frozen
                        </Badge>
                      )}
                    </div>

                    {/* Winner Badge */}
                    {nft.battleEnded && nft.won && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-600 border-2 border-yellow-400">
                          <Trophy className="w-3 h-3 mr-1" />
                          Won!
                        </Badge>
                      </div>
                    )}

                    {/* Paradox Badge */}
                    {nft.battleEnded && nft.won === false && nft.badge === 'paradox' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-purple-900/30 flex items-center justify-center">
                        <Badge className="bg-red-600 text-lg px-4 py-2">
                          💀 Paradox Timeline
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-lg">{nft.name}</CardTitle>
                  <CardDescription className="text-sm">{nft.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Battle Info */}
                  {nft.battleInfo && (
                    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Battle:</p>
                      <p className="text-sm font-semibold mb-1">{nft.battleInfo.topic}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Faction: {nft.battleInfo.factionName}</span>
                        <Badge variant="outline" className="text-xs">
                          {nft.battleInfo.status}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-3">
                    {/* Power */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Power:</span>
                        <span className="font-semibold text-yellow-400">{nft.power}</span>
                      </div>
                    </div>

                    {/* Entropy */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Entropy:</span>
                        <span className={`font-semibold ${getEntropyColor(nft.entropy)}`}>
                          {nft.entropy}% - {getEntropyLabel(nft.entropy)}
                        </span>
                      </div>
                      <Progress value={nft.entropy} className="h-2" />
                    </div>

                    {/* Rewards */}
                    {nft.staked && !nft.battleEnded && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Potential Reward:</span>
                        <span className="font-semibold text-green-400">
                          {nft.potentialReward} tokens
                        </span>
                      </div>
                    )}

                    {nft.battleEnded && nft.won && nft.reward && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Earned:</span>
                        <span className="font-semibold text-green-400">
                          +{nft.reward} tokens
                        </span>
                      </div>
                    )}

                    {/* Mint Cost */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mint Cost:</span>
                      <span>{nft.mintCost} tokens</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 space-y-2">
                    {nft.battleInfo && nft.battleInfo.status === 'active' && !nft.staked && (
                      <Link href={`/arena/${nft.battleInfo.topic}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Stake in Battle
                        </Button>
                      </Link>
                    )}

                    {nft.battleInfo && (nft.battleInfo.status === 'active' || nft.battleInfo.status === 'ended') && (
                      <Link href={`/arena/${nft.battleInfo.topic}`}>
                        <Button variant="ghost" className="w-full" size="sm">
                          View Battle
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
