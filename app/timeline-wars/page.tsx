/**
 * Timeline Wars - Main Battle Interface
 * Community-driven prediction market for alternate histories
 */

'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/WalletButton';
import { BlinkShareButton } from '@/components/BlinkShareButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Sparkles,
  Swords,
  Users,
  Trophy,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Flame,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  factionA: Faction;
  factionB: Faction;
  status: 'active' | 'ended';
  totalStaked: number;
  totalParticipants: number;
}

interface Faction {
  id: string;
  name: string;
  theme: string;
  description: string;
  color: string;
  icon: string;
  stakedNFTs: number;
  participants: number;
  aiPromptStyle: string;
  visualExample: string;
}

// Current active event
const currentEvent: TimelineEvent = {
  id: 'event-001',
  title: '2000 Internet Bubble Collapse',
  description: 'What if the dot-com bubble burst was total and irreversible? Two possible futures emerge...',
  startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active',
  totalStaked: 156,
  totalParticipants: 89,
  factionA: {
    id: 'steampunk',
    name: 'Steam Revolution',
    theme: 'Steampunk Renaissance',
    description: 'Technology regressed to mechanical engineering. Steam power, brass gears, and Victorian aesthetics dominate.',
    color: '#CD7F32', // Bronze
    icon: '⚙️',
    stakedNFTs: 67,
    participants: 42,
    aiPromptStyle: 'steampunk, brass machinery, Victorian era, steam-powered technology, retrofuturistic, gears and cogs',
    visualExample: 'https://placehold.co/600x400/8B4513/FFFFFF?text=Steampunk+City',
  },
  factionB: {
    id: 'biopunk',
    name: 'Bio Genesis',
    description: 'Humanity turned to biological engineering. Living buildings, genetic modifications, and organic technology.',
    theme: 'Biopunk Evolution',
    color: '#10B981', // Green
    icon: '🧬',
    stakedNFTs: 89,
    participants: 47,
    aiPromptStyle: 'biopunk, organic architecture, genetic engineering, living technology, bio-integrated cities, nature fusion',
    visualExample: 'https://placehold.co/600x400/10B981/FFFFFF?text=Biopunk+City',
  },
};

export default function TimelineWarsPage() {
  const { connected, publicKey } = useWallet();
  const [event, setEvent] = useState<TimelineEvent>(currentEvent);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(event.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('War Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event.endDate]);

  // Calculate win probability
  const calculateWinProbability = (faction: Faction) => {
    const total = event.factionA.stakedNFTs + event.factionB.stakedNFTs;
    if (total === 0) return 50;
    return Math.round((faction.stakedNFTs / total) * 100);
  };

  const factionAProb = calculateWinProbability(event.factionA);
  const factionBProb = calculateWinProbability(event.factionB);

  const handleJoinFaction = (factionId: string) => {
    if (!connected) {
      alert('Please connect your wallet first!');
      return;
    }
    setSelectedFaction(factionId);
    // Redirect to generation page with faction style
    const faction = factionId === event.factionA.id ? event.factionA : event.factionB;
    const styleQuery = encodeURIComponent(faction.aiPromptStyle);
    window.location.href = `/generate?engine=refract&style=${styleQuery}&war=${event.id}&faction=${factionId}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>

              <div className="flex items-center gap-2">
                <Swords className="w-6 h-6 text-accent animate-pulse" />
                <span className="text-xl font-bold gradient-text">Timeline Wars</span>
              </div>
            </div>

            <WalletButton />
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Event Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              <Flame className="w-3 h-3 mr-1" />
              Active War
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{event.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              {event.description}
            </p>

            {/* War Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{timeLeft}</p>
                  <p className="text-xs text-muted-foreground">Time Left</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{event.totalParticipants}</p>
                  <p className="text-xs text-muted-foreground">Warriors</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{event.totalStaked}</p>
                  <p className="text-xs text-muted-foreground">NFTs Staked</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">500 SOL</p>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Battle Visualization */}
          <Card className="mb-8 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Swords className="w-5 h-5" />
                Live Battle Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Power Bar */}
              <div className="relative h-12 bg-card rounded-full overflow-hidden mb-6">
                {/* Faction A Side */}
                <div
                  className="absolute left-0 top-0 bottom-0 flex items-center justify-start px-4 font-bold transition-all duration-1000"
                  style={{
                    width: `${factionAProb}%`,
                    background: `linear-gradient(90deg, ${event.factionA.color}, ${event.factionA.color}dd)`,
                  }}
                >
                  <span className="text-white text-sm">{event.factionA.icon} {factionAProb}%</span>
                </div>

                {/* Faction B Side */}
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-end px-4 font-bold transition-all duration-1000"
                  style={{
                    width: `${factionBProb}%`,
                    background: `linear-gradient(270deg, ${event.factionB.color}, ${event.factionB.color}dd)`,
                  }}
                >
                  <span className="text-white text-sm">{factionBProb}% {event.factionB.icon}</span>
                </div>

                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -ml-px" />
              </div>

              {/* Faction Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Faction A */}
                <Card className="border-2 transition-all hover:shadow-glow-primary" style={{ borderColor: event.factionA.color + '40' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span style={{ fontSize: '2rem' }}>{event.factionA.icon}</span>
                          {event.factionA.name}
                        </CardTitle>
                        <CardDescription>{event.factionA.theme}</CardDescription>
                      </div>
                      <Badge variant="outline" style={{ borderColor: event.factionA.color, color: event.factionA.color }}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {factionAProb}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{event.factionA.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">NFTs Staked</p>
                        <p className="text-lg font-bold">{event.factionA.stakedNFTs}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Warriors</p>
                        <p className="text-lg font-bold">{event.factionA.participants}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        style={{ backgroundColor: event.factionA.color }}
                        onClick={() => handleJoinFaction(event.factionA.id)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Join {event.factionA.name}
                      </Button>

                      <BlinkShareButton
                        type="wars"
                        eventId={event.id}
                        factionId={event.factionA.id}
                        title={event.factionA.name}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Faction B */}
                <Card className="border-2 transition-all hover:shadow-glow-secondary" style={{ borderColor: event.factionB.color + '40' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span style={{ fontSize: '2rem' }}>{event.factionB.icon}</span>
                          {event.factionB.name}
                        </CardTitle>
                        <CardDescription>{event.factionB.theme}</CardDescription>
                      </div>
                      <Badge variant="outline" style={{ borderColor: event.factionB.color, color: event.factionB.color }}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {factionBProb}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{event.factionB.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">NFTs Staked</p>
                        <p className="text-lg font-bold">{event.factionB.stakedNFTs}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Warriors</p>
                        <p className="text-lg font-bold">{event.factionB.participants}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        style={{ backgroundColor: event.factionB.color }}
                        onClick={() => handleJoinFaction(event.factionB.id)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Join {event.factionB.name}
                      </Button>

                      <BlinkShareButton
                        type="wars"
                        eventId={event.id}
                        factionId={event.factionB.id}
                        title={event.factionB.name}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>⚔️ How Timeline Wars Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose Side</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick the timeline you believe in
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Create & Stake</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate NFTs matching your faction's style
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Battle</h3>
                  <p className="text-sm text-muted-foreground">
                    More NFTs + higher quality = more power
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl">4️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Win Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Victory = SOL rewards + Canonical badge
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2">🏆 If You Win</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Timeline becomes "Canonical History"</li>
                    <li>✓ NFTs get gold border badge</li>
                    <li>✓ Share of losing side's stake pool</li>
                    <li>✓ Increased rarity and value</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="font-semibold text-red-400 mb-2">💀 If You Lose</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ Timeline marked as "Paradox"</li>
                    <li>✓ NFTs get glitch art filter (unique!)</li>
                    <li>✓ Keep your NFT, no total loss</li>
                    <li>✓ Paradox NFTs can be collector's items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Warriors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentParticipants.map((participant, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ background: participant.faction.color + '20' }}
                      >
                        {participant.faction.icon}
                      </div>
                      <div>
                        <p className="font-medium">{participant.wallet.slice(0, 4)}...{participant.wallet.slice(-4)}</p>
                        <p className="text-xs text-muted-foreground">Joined {participant.faction.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{participant.nftsStaked} NFTs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Mock data
const mockRecentParticipants = [
  { wallet: '9xQe...7mNa', faction: currentEvent.factionA, nftsStaked: 3 },
  { wallet: '5TpL...2kRf', faction: currentEvent.factionB, nftsStaked: 5 },
  { wallet: '3WqM...8vDx', faction: currentEvent.factionA, nftsStaked: 2 },
  { wallet: '7YnK...4jPs', faction: currentEvent.factionB, nftsStaked: 4 },
  { wallet: '2HpF...9cTq', faction: currentEvent.factionA, nftsStaked: 1 },
];
