/**
 * Live Battle View - Real-time Agent Battle Spectator Page
 * /arena/[battleId] - Watch battle, vote, and bet
 */

'use client';

import { FC, useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Swords,
  ThumbsUp,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowLeft,
  Trophy,
  Coins,
  Zap
} from 'lucide-react';
import { V3BattleView, BackModal } from '@/components/v3BattleView';
import Link from 'next/link';

interface BattleState {
  id: string;
  topic: string;
  description: string;
  status: 'pending' | 'active' | 'ended';
  currentRound: number;
  totalRounds: number;
  factionA: {
    id: string;
    name: string;
    theme: string;
    color: string;
    icon: string;
    agent: any;
  };
  factionB: {
    id: string;
    name: string;
    theme: string;
    color: string;
    icon: string;
    agent: any;
  };
  scoreboard: {
    agentA: { roundScores: number[]; totalVotes: number; roundsWon: number };
    agentB: { roundScores: number[]; totalVotes: number; roundsWon: number };
  };
  roundResults: any[];
  currentRoundVotes: { agentA: number; agentB: number } | null;
  winner?: 'A' | 'B' | 'draw';
}

interface BettingOdds {
  odds: { agentA: number; agentB: number };
  pool: { totalBetsOnA: number; totalBetsOnB: number; totalPool: number };
  probability: { agentA: number; agentB: number };
  userBets?: any[];
}

export default function BattleViewPage({ params }: { params: Promise<{ battleId: string }> }) {
  const { battleId } = use(params);
  const router = useRouter();

  const [battle, setBattle] = useState<BattleState | null>(null);
  const [odds, setOdds] = useState<BettingOdds | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [arcadeBalance, setArcadeBalance] = useState(0);
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<'A' | 'B' | null>(null);
  const [minting, setMinting] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [v3Data, setV3Data] = useState<any>(null);

  // Initialize user ID (use localStorage or generate)
  useEffect(() => {
    let id = localStorage.getItem('timepics_user_id');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('timepics_user_id', id);
    }
    setUserId(id);
    fetchArcadeBalance(id);
  }, []);

  // Fetch battle state and odds
  useEffect(() => {
    if (!battleId) return;

    fetchBattleState();
    fetchOdds();
    fetchV3Data();

    // Poll every 3 seconds for updates
    const interval = setInterval(() => {
      fetchBattleState();
      fetchOdds();
      fetchV3Data();
    }, 3000);

    return () => clearInterval(interval);
  }, [battleId]);

  const fetchBattleState = async () => {
    try {
      const response = await fetch(`/api/battles/${battleId}/state`);
      const data = await response.json();
      if (data.success) {
        setBattle(data.battle);
      }
    } catch (error) {
      console.error('Failed to fetch battle:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOdds = async () => {
    try {
      const response = await fetch(`/api/betting/place?battleId=${battleId}&userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setOdds(data);
      }
    } catch (error) {
      console.error('Failed to fetch odds:', error);
    }
  };

  const fetchV3Data = async () => {
    try {
      const response = await fetch(`/api/unified-battles/${battleId}`);
      const data = await response.json();
      if (data.success && data.battle) {
        // Check if this is a v3 battle (has genesisNFTs or nfts array)
        if (data.battle.genesisNFTs || (data.battle.factionA?.nfts?.length > 0)) {
          setV3Data(data.battle);
        } else {
          setV3Data(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch v3 data:', error);
    }
  };

  const handleBackNFT = (nft: any, faction: string) => {
    setSelectedNFT({ ...nft, faction });
    setShowBackModal(true);
  };

  const handleConfirmBack = async (amount: number) => {
    if (!selectedNFT || !userId) return;

    try {
      const response = await fetch(`/api/unified-battles/${battleId}/back`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          nftId: selectedNFT.id,
          faction: selectedNFT.faction,
          amount
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully backed NFT with ${amount} tokens! New power: ${data.newPower}`);
        fetchV3Data();
        fetchArcadeBalance(userId);
      } else {
        alert(data.error || 'Failed to back NFT');
      }
    } catch (error) {
      console.error('Back NFT failed:', error);
      alert('Failed to back NFT');
    }
  };

  const fetchArcadeBalance = async (id: string) => {
    try {
      const response = await fetch(`/api/arcade/balance?userId=${id}`);
      const data = await response.json();
      if (data.success) {
        setArcadeBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const handleVote = async (faction: 'A' | 'B') => {
    if (hasVoted || !userId) return;

    try {
      const response = await fetch(`/api/battles/${battleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, faction })
      });

      const data = await response.json();
      if (data.success) {
        setHasVoted(true);
        setArcadeBalance(prev => prev + data.earnedTokens);
        fetchBattleState();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Vote failed. Please try again.');
    }
  };

  const handleBet = async (faction: 'A' | 'B') => {
    setSelectedFaction(faction);
    setShowMintModal(true);
  };

  const handleMintNFT = async (autoStake: boolean = true) => {
    if (!userId || !selectedFaction) return;

    const MINT_COST = 100;  // Cost to mint a Battle NFT

    if (arcadeBalance < MINT_COST) {
      alert(`Insufficient balance. You need ${MINT_COST} Arcade Tokens to mint an NFT. Current balance: ${arcadeBalance}`);
      return;
    }

    try {
      setMinting(true);
      const response = await fetch(`/api/battles/${battleId}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          faction: selectedFaction,
          autoStake
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(
          `NFT Minted Successfully!\n\n` +
          `Power: ${data.nft.power}\n` +
          `${autoStake ? `Staked in battle!` : 'View in My NFTs to stake later.'}\n` +
          `Potential Reward: ${data.nft.potentialReward} tokens`
        );
        setArcadeBalance(data.balance);
        setShowMintModal(false);
        fetchBattleState();

        // Show link to NFT gallery
        if (confirm('View your new NFT in the gallery?')) {
          window.open('/battle-nfts', '_blank');
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Mint failed:', error);
      alert('Mint failed. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Battle not found</p>
          <Link href="/arena">
            <Button className="mt-4">Back to Arena</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentRoundResult = battle.roundResults[battle.currentRound - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/arena">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Arena
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{battle.topic}</h1>
              <p className="text-gray-400">{battle.description}</p>
            </div>
            <Badge
              variant={battle.status === 'active' ? 'default' : 'secondary'}
              className={
                battle.status === 'active'
                  ? 'bg-green-600 text-lg px-4 py-2'
                  : 'bg-gray-600 text-lg px-4 py-2'
              }
            >
              {battle.status === 'active' ? (
                <>
                  <span className="animate-pulse mr-2">●</span>
                  LIVE - Round {battle.currentRound}/{battle.totalRounds}
                </>
              ) : (
                'ENDED'
              )}
            </Badge>
          </div>
        </div>

        {/* User Stats Bar */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold">{arcadeBalance}</span>
                  <span className="text-gray-400">Arcade Tokens</span>
                </div>
                {odds && odds.userBets && odds.userBets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-400">
                      {odds.userBets.length} active bet(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Battle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Agent A */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="text-center">
                <div className="text-6xl mb-3">{battle.factionA.icon}</div>
                <CardTitle style={{ color: battle.factionA.color }}>
                  {battle.factionA.name}
                </CardTitle>
                <CardDescription>{battle.factionA.theme}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current Round Image */}
              {currentRoundResult && currentRoundResult.agentA && (
                <div className="mb-4">
                  <img
                    src={currentRoundResult.agentA.imageUrl}
                    alt={`${battle.factionA.name} Round ${battle.currentRound}`}
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {currentRoundResult.agentA.output.narrative}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes:</span>
                  <span className="font-semibold">{battle.scoreboard.agentA.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rounds Won:</span>
                  <span className="font-semibold">{battle.scoreboard.agentA.roundsWon}</span>
                </div>
                {odds && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Odds:</span>
                    <span className="font-semibold text-yellow-500">{odds.odds.agentA}x</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {battle.status === 'active' && !hasVoted && (
                <Button
                  className="w-full mb-2"
                  style={{ backgroundColor: battle.factionA.color }}
                  onClick={() => handleVote('A')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vote for {battle.factionA.name}
                </Button>
              )}

              {battle.status === 'active' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleBet('A')}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Mint NFT (100 tokens)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Center: Battle Info */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Swords className="w-6 h-6" />
                Battle Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Round Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Round {battle.currentRound} of {battle.totalRounds}</span>
                  {battle.status === 'active' && <span>⏱️ ~90 seconds/round</span>}
                </div>
                <Progress
                  value={(battle.currentRound / battle.totalRounds) * 100}
                  className="h-2"
                />
              </div>

              {/* Current Round Votes */}
              {battle.currentRoundVotes && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-center">Current Round Votes</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{battle.factionA.name}</span>
                        <span>{battle.currentRoundVotes.agentA}</span>
                      </div>
                      <Progress
                        value={
                          (battle.currentRoundVotes.agentA /
                            (battle.currentRoundVotes.agentA + battle.currentRoundVotes.agentB)) *
                          100
                        }
                        className="h-2"
                        style={{ backgroundColor: battle.factionA.color }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{battle.factionB.name}</span>
                        <span>{battle.currentRoundVotes.agentB}</span>
                      </div>
                      <Progress
                        value={
                          (battle.currentRoundVotes.agentB /
                            (battle.currentRoundVotes.agentA + battle.currentRoundVotes.agentB)) *
                          100
                        }
                        className="h-2"
                        style={{ backgroundColor: battle.factionB.color }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* How to Participate */}
              {battle.status === 'active' && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3">How to Participate</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>1. <strong className="text-white">Vote</strong> for your favorite agent (earn 5 tokens)</p>
                    <p>2. <strong className="text-white">Mint an NFT</strong> to stake in the battle (100 tokens)</p>
                    <p>3. NFT power affects battle outcome and your rewards!</p>
                  </div>
                  <div className="mt-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                    <p className="text-xs text-purple-300">
                      💡 <strong>Tip:</strong> Fresh NFTs have higher power. Your NFT evolves over time!
                    </p>
                  </div>
                </div>
              )}

              {/* Winner Display */}
              {battle.status === 'ended' && battle.winner && (
                <div className="text-center py-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">Winner!</h3>
                  <p className="text-xl">
                    {battle.winner === 'A' ? battle.factionA.name : battle.factionB.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Agent B */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="text-center">
                <div className="text-6xl mb-3">{battle.factionB.icon}</div>
                <CardTitle style={{ color: battle.factionB.color }}>
                  {battle.factionB.name}
                </CardTitle>
                <CardDescription>{battle.factionB.theme}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current Round Image */}
              {currentRoundResult && currentRoundResult.agentB && (
                <div className="mb-4">
                  <img
                    src={currentRoundResult.agentB.imageUrl}
                    alt={`${battle.factionB.name} Round ${battle.currentRound}`}
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {currentRoundResult.agentB.output.narrative}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes:</span>
                  <span className="font-semibold">{battle.scoreboard.agentB.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rounds Won:</span>
                  <span className="font-semibold">{battle.scoreboard.agentB.roundsWon}</span>
                </div>
                {odds && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Odds:</span>
                    <span className="font-semibold text-yellow-500">{odds.odds.agentB}x</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {battle.status === 'active' && !hasVoted && (
                <Button
                  className="w-full mb-2"
                  style={{ backgroundColor: battle.factionB.color }}
                  onClick={() => handleVote('B')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Vote for {battle.factionB.name}
                </Button>
              )}

              {battle.status === 'active' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleBet('B')}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Mint NFT (100 tokens)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Round History */}
        {battle.roundResults.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle>Round History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {battle.roundResults.map((result, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Round {result.roundNumber}</h4>
                      <Badge>
                        Winner: {result.winner === 'A' ? battle.factionA.name : battle.factionB.name}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">
                          {battle.factionA.name}: {result.agentA.votes} votes
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {battle.factionB.name}: {result.agentB.votes} votes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* v3 Enhanced Battle View */}
        {v3Data && (
          <div className="mt-6">
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard" className="flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  Standard View
                </TabsTrigger>
                <TabsTrigger value="v3" className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  v3 Enhanced View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="v3" className="mt-4">
                {(() => {
                  const genesisNFTs = v3Data.genesisNFTs || {};
                  return (
                    <V3BattleView
                      battleId={battleId}
                      topic={v3Data.topic || battle.topic}
                      description={v3Data.description || battle.description}
                      status={v3Data.status || battle.status}
                      currentRound={v3Data.currentRound || battle.currentRound}
                      totalRounds={v3Data.totalRounds || battle.totalRounds}
                      genesisNFTs={genesisNFTs}
                      factionA={{
                        name: v3Data.factionA?.name || battle.factionA.name,
                        color: v3Data.factionA?.color || battle.factionA.color,
                        icon: v3Data.factionA?.icon || battle.factionA.icon,
                        nfts: v3Data.factionA?.nfts || [],
                        totalPower: v3Data.factionA?.totalPower || 0
                      }}
                      factionB={{
                        name: v3Data.factionB?.name || battle.factionB.name,
                        color: v3Data.factionB?.color || battle.factionB.color,
                        icon: v3Data.factionB?.icon || battle.factionB.icon,
                        nfts: v3Data.factionB?.nfts || [],
                        totalPower: v3Data.factionB?.totalPower || 0
                      }}
                      totalPool={v3Data.totalPool || (odds?.pool?.totalPool || 0)}
                      rewards={v3Data.rewards}
                      rogueAgentActive={v3Data.rogueAgentActive || false}
                    />
                  );
                })()}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Mint NFT Modal */}
        {showMintModal && selectedFaction && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Mint Battle NFT
                </CardTitle>
                <CardDescription>
                  Create an NFT representing your support for{' '}
                  {selectedFaction === 'A' ? battle.factionA.name : battle.factionB.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">
                      {selectedFaction === 'A' ? battle.factionA.icon : battle.factionB.icon}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedFaction === 'A' ? battle.factionA.name : battle.factionB.name}
                      </p>
                      <p className="text-sm text-gray-400">Battle NFT</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Power:</span>
                      <span className="font-semibold text-yellow-400">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint Cost:</span>
                      <span className="font-semibold">100 Arcade Tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Balance:</span>
                      <span className={arcadeBalance >= 100 ? 'text-green-400' : 'text-red-400'}>
                        {arcadeBalance} tokens
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-sm space-y-2">
                  <p className="text-gray-300">
                    🎨 <strong>Living NFT:</strong> Your NFT evolves over time with entropy
                  </p>
                  <p className="text-gray-300">
                    ⚡ <strong>Battle Power:</strong> Higher power = bigger influence on battle outcome
                  </p>
                  <p className="text-gray-300">
                    🏆 <strong>Rewards:</strong> Win rewards based on your NFT's power contribution
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowMintModal(false)}
                    disabled={minting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleMintNFT(true)}
                    disabled={minting || arcadeBalance < 100}
                  >
                    {minting ? 'Minting...' : 'Mint & Stake'}
                  </Button>
                </div>

                {arcadeBalance < 100 && (
                  <p className="text-xs text-red-400 text-center">
                    Insufficient balance. Earn more tokens by voting!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* v3 Back NFT Modal */}
        <BackModal
          open={showBackModal}
          onClose={() => {
            setShowBackModal(false);
            setSelectedNFT(null);
          }}
          nft={selectedNFT}
          userBalance={arcadeBalance}
          onConfirm={handleConfirmBack}
        />
      </div>
    </div>
  );
}
