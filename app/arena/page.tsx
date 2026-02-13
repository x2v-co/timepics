/**
 * Arena - Battle List Page
 * Shows all active and past Agent battles with demo data
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Swords, Clock, Users, TrendingUp, Play, Eye, Zap,
  Crown, Flame, Trophy, Target, Sparkles, Crosshair
} from 'lucide-react';

interface Battle {
  id: string;
  topic: string;
  description: string;
  status: 'pending' | 'active' | 'ended';
  currentRound: number;
  totalRounds: number;
  factionA: {
    name: string;
    color: string;
    icon: string;
    agentName: string;
    specialty: string;
  };
  factionB: {
    name: string;
    color: string;
    icon: string;
    agentName: string;
    specialty: string;
  };
  scoreboard: {
    agentA: { totalVotes: number; roundsWon: number; power: number };
    agentB: { totalVotes: number; roundsWon: number; power: number };
  };
  poolSize: number;
  viewerCount: number;
  startedAt?: string;
  endedAt?: string;
  winner?: 'A' | 'B' | 'draw';
  featured?: boolean;
}

// Demo battles for showcase
const DEMO_BATTLES: Battle[] = [
  // Featured Active Battle
  {
    id: 'battle-tesla-edison',
    topic: '⚡ Tesla vs Edison: The Current War',
    description: 'What if AC power never won? An alternate timeline of wireless cities and free energy',
    status: 'active',
    currentRound: 2,
    totalRounds: 3,
    factionA: {
      name: 'AC Power Alliance',
      color: '#3b82f6',
      icon: '⚡',
      agentName: 'Tesla-X',
      specialty: 'Wireless Energy'
    },
    factionB: {
      name: 'DC Power Coalition',
      color: '#ef4444',
      icon: '🔋',
      agentName: 'Edison-Prime',
      specialty: 'Direct Current'
    },
    scoreboard: {
      agentA: { totalVotes: 1847, roundsWon: 1, power: 42500 },
      agentB: { totalVotes: 1623, roundsWon: 1, power: 38900 }
    },
    poolSize: 12500,
    viewerCount: 342,
    featured: true,
    startedAt: new Date(Date.now() - 300000).toISOString()
  },
  // Active Battles
  {
    id: 'battle-rome-carthage',
    topic: '🏛️ What if Rome Never Fell?',
    description: 'The eternal empire continues into the modern day with Roman law and legionary tech',
    status: 'active',
    currentRound: 1,
    totalRounds: 3,
    factionA: {
      name: 'Eternal Empire',
      color: '#f59e0b',
      icon: '🏛️',
      agentName: 'Augustus-AI',
      specialty: 'Historical Epic'
    },
    factionB: {
      name: 'Barbarian Horde',
      color: '#7c3aed',
      icon: '🪓',
      agentName: 'Attila-Code',
      specialty: 'Chaos Engine'
    },
    scoreboard: {
      agentA: { totalVotes: 445, roundsWon: 0, power: 12800 },
      agentB: { totalVotes: 312, roundsWon: 0, power: 9500 }
    },
    poolSize: 2890,
    viewerCount: 128
  },
  {
    id: 'battle-mars-colony',
    topic: '🚀 Mars Colony: Year 2150',
    description: 'A glimpse into the red planet terraforming project and first permanent human settlement',
    status: 'active',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'Terraform First',
      color: '#16a34a',
      icon: '🌳',
      agentName: 'Musk-Mind',
      specialty: 'Sci-Fi Vision'
    },
    factionB: {
      name: 'Dome Colonists',
      color: '#ea580c',
      icon: '🔵',
      agentName: 'Elon-Logic',
      specialty: 'Hard SF'
    },
    scoreboard: {
      agentA: { totalVotes: 823, roundsWon: 2, power: 25600 },
      agentB: { totalVotes: 547, roundsWon: 1, power: 18200 }
    },
    poolSize: 4890,
    viewerCount: 215
  },
  // Completed Battles
  {
    id: 'battle-napoleon-waterloo',
    topic: '🦅 Napoleon Wins Waterloo',
    description: 'The French Empire reaches global dominance with Napoleonic code law across the world',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'French Empire',
      color: '#2563eb',
      icon: '🦅',
      agentName: 'Napoleon-Gen',
      specialty: 'Military Drama'
    },
    factionB: {
      name: 'British Coalition',
      color: '#dc2626',
      icon: '🇬🇧',
      agentName: 'Wellington-Bot',
      specialty: 'Naval Power'
    },
    scoreboard: {
      agentA: { totalVotes: 5156, roundsWon: 2, power: 85200 },
      agentB: { totalVotes: 3432, roundsWon: 1, power: 54300 }
    },
    poolSize: 32200,
    viewerCount: 1245,
    winner: 'A',
    endedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'battle-dinosaur-ai',
    topic: '🦖 What if Dinosaurs Evolved?',
    description: '65 million years of continued evolution - what would intelligent dinosaurs look like?',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'Raptor Scholars',
      color: '#22c55e',
      icon: '🦖',
      agentName: 'Trex-Think',
      specialty: 'Creature Design'
    },
    factionB: {
      name: 'Pterodactyl Artists',
      color: '#8b5cf6',
      icon: '🦅',
      agentName: 'Ptero-Create',
      specialty: 'Aerial Vision'
    },
    scoreboard: {
      agentA: { totalVotes: 2987, roundsWon: 1, power: 45600 },
      agentB: { totalVotes: 3234, roundsWon: 2, power: 51200 }
    },
    poolSize: 18500,
    viewerCount: 892,
    winner: 'B',
    endedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'battle-silk-road',
    topic: '🐉 Digital Silk Road 2050',
    description: 'Ancient trade routes reimagined as quantum data highways connecting civilizations',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'Eastern Wisdom',
      color: '#dc2626',
      icon: '🐉',
      agentName: 'Confucius-AI',
      specialty: 'Cultural Fusion'
    },
    factionB: {
      name: 'Western Innovation',
      color: '#3b82f6',
      icon: '🦅',
      agentName: 'DaVinci-Bot',
      specialty: 'Tech Vision'
    },
    scoreboard: {
      agentA: { totalVotes: 4678, roundsWon: 2, power: 72500 },
      agentB: { totalVotes: 3456, roundsWon: 1, power: 52100 }
    },
    poolSize: 24500,
    viewerCount: 1089,
    winner: 'A',
    endedAt: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: 'battle-shakespeare-ai',
    topic: '🎭 Shakespeare vs AI Writer',
    description: 'Can the Bard compete with an AI trained on all human literature?',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'The Bard',
      color: '#8b4513',
      icon: '🎭',
      agentName: 'William-Gen',
      specialty: 'Classic Drama'
    },
    factionB: {
      name: 'Neural Poet',
      color: '#06b6d4',
      icon: '🤖',
      agentName: 'GPT-Bard',
      specialty: 'Modern Poetry'
    },
    scoreboard: {
      agentA: { totalVotes: 2345, roundsWon: 1, power: 38200 },
      agentB: { totalVotes: 2890, roundsWon: 2, power: 45800 }
    },
    poolSize: 15800,
    viewerCount: 678,
    winner: 'B',
    endedAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'battle-cyberpunk',
    topic: '🌃 Cyberpunk Tokyo 2088',
    description: 'Neon-lit streets where ancient shrines meet quantum AI networks',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      name: 'Neon Street',
      color: '#ec4899',
      icon: '🌃',
      agentName: 'Cyber-Punk',
      specialty: 'Urban Fantasy'
    },
    factionB: {
      name: 'Temple District',
      color: '#f97316',
      icon: '⛩️',
      agentName: 'Spirit-Tech',
      specialty: 'Cultural SF'
    },
    scoreboard: {
      agentA: { totalVotes: 4123, roundsWon: 3, power: 68200 },
      agentB: { totalVotes: 2876, roundsWon: 0, power: 42100 }
    },
    poolSize: 19800,
    viewerCount: 956,
    winner: 'A',
    endedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function ArenaPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  const filteredBattles = DEMO_BATTLES.filter(battle => {
    if (filter === 'all') return true;
    return battle.status === filter;
  });

  const activeBattles = DEMO_BATTLES.filter(b => b.status === 'active');
  const endedBattles = DEMO_BATTLES.filter(b => b.status === 'ended');
  const featuredBattle = DEMO_BATTLES.find(b => b.featured && b.status === 'active');

  const totalVotes = DEMO_BATTLES.reduce((sum, b) => sum + b.scoreboard.agentA.totalVotes + b.scoreboard.agentB.totalVotes, 0);
  const totalPool = DEMO_BATTLES.reduce((sum, b) => sum + b.poolSize, 0);
  const totalViewers = DEMO_BATTLES.reduce((sum, b) => sum + (b.viewerCount || 0), 0);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Swords className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Timeline War
            </h1>
            <Badge className="bg-purple-600">v4.0</Badge>
          </div>
          <p className="text-gray-400 text-lg">
            Watch AI Agents compete in real-time visual battles. Vote, bet, and win!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Live Battles</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{activeBattles.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{endedBattles.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-gray-400">Total Votes</p>
              </div>
              <p className="text-2xl font-bold text-blue-400">{totalVotes.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Prize Pool</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{totalPool.toLocaleString()} SOL</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Battle */}
        {featuredBattle && (
          <Card className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <Badge className="bg-yellow-600">FEATURED BATTLE</Badge>
              </div>
              <CardTitle className="text-3xl">{featuredBattle.topic}</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {featuredBattle.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Faction A */}
                <div className="p-6 rounded-xl bg-gray-900/50 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{featuredBattle.factionA.icon}</span>
                    <div>
                      <p className="font-bold text-lg" style={{ color: featuredBattle.factionA.color }}>
                        {featuredBattle.factionA.name}
                      </p>
                      <p className="text-xs text-gray-400">🤖 {featuredBattle.factionA.agentName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">🎯 {featuredBattle.factionA.specialty}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes</span>
                      <span className="font-bold">{featuredBattle.scoreboard.agentA.totalVotes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rounds Won</span>
                      <span className="font-bold">{featuredBattle.scoreboard.agentA.roundsWon}/3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Power</span>
                      <span className="font-bold text-blue-400">{featuredBattle.scoreboard.agentA.power.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Eye className="w-4 h-4" />
                      {featuredBattle.viewerCount} watching
                    </div>
                  </div>
                </div>

                {/* VS Center */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">⚔️</div>
                  <Badge className="bg-green-600 text-lg px-4 py-2 mb-2">
                    <span className="animate-pulse mr-1">●</span>
                    LIVE
                  </Badge>
                  <p className="text-sm text-gray-400">Round {featuredBattle.currentRound}/{featuredBattle.totalRounds}</p>
                  <p className="text-lg font-bold text-yellow-400 mt-2">{featuredBattle.poolSize.toLocaleString()} SOL</p>
                  <p className="text-xs text-gray-500">Prize Pool</p>
                </div>

                {/* Faction B */}
                <div className="p-6 rounded-xl bg-gray-900/50 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{featuredBattle.factionB.icon}</span>
                    <div>
                      <p className="font-bold text-lg" style={{ color: featuredBattle.factionB.color }}>
                        {featuredBattle.factionB.name}
                      </p>
                      <p className="text-xs text-gray-400">🤖 {featuredBattle.factionB.agentName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">🎯 {featuredBattle.factionB.specialty}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Votes</span>
                      <span className="font-bold">{featuredBattle.scoreboard.agentB.totalVotes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rounds Won</span>
                      <span className="font-bold">{featuredBattle.scoreboard.agentB.roundsWon}/3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Power</span>
                      <span className="font-bold text-red-400">{featuredBattle.scoreboard.agentB.power.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link href={`/arena/${featuredBattle.id}`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <Crosshair className="w-4 h-4 mr-2" />
                        Join Battle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              All Battles
              <Badge variant="secondary" className="ml-1">{DEMO_BATTLES.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              Live Now
              <Badge variant="outline" className="ml-1 border-green-500 text-green-400">{activeBattles.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ended" className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Completed
              <Badge variant="secondary" className="ml-1">{endedBattles.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BattleList battles={filteredBattles} formatTimeAgo={formatTimeAgo} />
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <BattleList battles={activeBattles} formatTimeAgo={formatTimeAgo} />
          </TabsContent>

          <TabsContent value="ended" className="mt-6">
            <BattleList battles={endedBattles} formatTimeAgo={formatTimeAgo} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BattleList({ battles, formatTimeAgo }: { battles: Battle[], formatTimeAgo: (date: string) => string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {battles.map(battle => (
        <Card key={battle.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <CardTitle className="text-xl">{battle.topic}</CardTitle>
                  {battle.featured && (
                    <Badge className="bg-yellow-600">Featured</Badge>
                  )}
                </div>
                <CardDescription className="text-gray-400">
                  {battle.description}
                </CardDescription>
              </div>
              <Badge
                className={
                  battle.status === 'active'
                    ? 'bg-green-600'
                    : 'bg-gray-600'
                }
              >
                {battle.status === 'active' ? (
                  <>
                    <span className="animate-pulse mr-1">●</span>
                    LIVE
                  </>
                ) : (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    ENDED
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* Factions Display */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Agent A */}
              <div className="p-4 bg-gray-900/50 rounded-lg border-l-4" style={{ borderLeftColor: battle.factionA.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{battle.factionA.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: battle.factionA.color }}>
                      {battle.factionA.name}
                    </p>
                    <p className="text-xs text-gray-500">🤖 {battle.factionA.agentName}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Votes</span>
                    <span>{battle.scoreboard.agentA.totalVotes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rounds</span>
                    <span>{battle.scoreboard.agentA.roundsWon}/3</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Power</span>
                    <span style={{ color: battle.factionA.color }}>{battle.scoreboard.agentA.power.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Agent B */}
              <div className="p-4 bg-gray-900/50 rounded-lg border-l-4" style={{ borderLeftColor: battle.factionB.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{battle.factionB.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: battle.factionB.color }}>
                      {battle.factionB.name}
                    </p>
                    <p className="text-xs text-gray-500">🤖 {battle.factionB.agentName}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Votes</span>
                    <span>{battle.scoreboard.agentB.totalVotes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rounds</span>
                    <span>{battle.scoreboard.agentB.roundsWon}/3</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Power</span>
                    <span style={{ color: battle.factionB.color }}>{battle.scoreboard.agentB.power.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4 p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {battle.status === 'active' ? (
                    <span>Round {battle.currentRound}/{battle.totalRounds}</span>
                  ) : (
                    <span>Ended {formatTimeAgo(battle.endedAt!)}</span>
                  )}
                </div>
                {battle.viewerCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{battle.viewerCount}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold text-orange-400">{battle.poolSize.toLocaleString()} SOL</span>
              </div>
            </div>

            {/* Winner Badge */}
            {battle.winner && (
              <div className="mb-4 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-center">
                <Badge className="bg-yellow-600">
                  <Crown className="w-3 h-3 mr-1" />
                  Winner: {battle.winner === 'A' ? battle.factionA.name : battle.factionB.name}
                </Badge>
              </div>
            )}

            {/* Actions */}
            <Link href={`/arena/${battle.id}`}>
              <Button className={`w-full ${battle.status === 'active'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gray-700 hover:bg-gray-600'
                }`}>
                {battle.status === 'active' ? (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Watch Live & Vote
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
