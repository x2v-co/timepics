/**
 * Unified Battle View Page
 * Shows battle details for any battle type (PvP/P vs Agent/Agent vs Agent)
 */

'use client';

import { FC, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Play, Users, Bot, Swords, Clock, Trophy,
  TrendingUp, Coins, Shield, Zap, Sparkles
} from 'lucide-react';
import { getArcadeBalance } from '@/lib/arcade/tokenManager';
import { getBattleNFTs } from '@/lib/battleNFT';

interface UnifiedBattleViewProps {
  params: Promise<{ battleId: string }>;
}

const NFT_MINT_COST = 100; // Arcade Tokens

export default function UnifiedBattleViewPage({ params }: UnifiedBattleViewProps) {
  const { battleId } = use(params);
  const [battle, setBattle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [voting, setVoting] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);

  useEffect(() => {
    // Get or create user ID
    let id = localStorage.getItem('timepics_user_id');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('timepics_user_id', id);
    }
    setUserId(id);

    // Load balance and NFTs
    const balance = getArcadeBalance(id);
    setTokenBalance(balance.balance);

    const nfts = getBattleNFTs(battleId);
    setUserNFTs(nfts.filter(nft => nft.owner === id));

    fetchBattleState();
    const interval = setInterval(() => {
      fetchBattleState();
      // Update balance
      const updatedBalance = getArcadeBalance(id);
      setTokenBalance(updatedBalance.balance);
      // Update NFTs
      const updatedNFTs = getBattleNFTs(battleId);
      setUserNFTs(updatedNFTs.filter(nft => nft.owner === id));
    }, 3000);
    return () => clearInterval(interval);
  }, [battleId]);

  const fetchBattleState = async () => {
    try {
      const response = await fetch(`/api/unified-battles/${battleId}/state`);
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

  const handleMintAndVote = async (faction: 'A' | 'B') => {
    if (voting || !userId) return;

    if (tokenBalance < NFT_MINT_COST) {
      alert(`❌ Insufficient Arcade Tokens!\n\nYou have: ${tokenBalance} tokens\nRequired: ${NFT_MINT_COST} tokens\n\nEarn more tokens by participating in battles!`);
      return;
    }

    setVoting(true);
    try {
      const response = await fetch(`/api/unified-battles/${battleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, faction })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Battle NFT Minted!\n\n${data.nft.name}\nPower: ${data.nft.power}\n\nVote cast for ${faction === 'A' ? battle.participantA.name : battle.participantB.name}!\n\nTokens spent: ${NFT_MINT_COST}\nNew balance: ${data.newBalance}\nPotential reward: ${data.potentialReward}`);

        // Refresh state
        fetchBattleState();
        const updatedBalance = getArcadeBalance(userId);
        setTokenBalance(updatedBalance.balance);
        const updatedNFTs = getBattleNFTs(battleId);
        setUserNFTs(updatedNFTs.filter(nft => nft.owner === userId));
      } else {
        alert(data.error || 'Failed to mint NFT and vote');
      }
    } catch (error) {
      console.error('Mint and vote failed:', error);
      alert('Failed to mint NFT and cast vote');
    } finally {
      setVoting(false);
    }
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'pvp') return <Users className="w-5 h-5" />;
    if (mode === 'pva') return <Swords className="w-5 h-5" />;
    return <Bot className="w-5 h-5" />;
  };

  const getModeLabel = (mode: string) => {
    if (mode === 'pvp') return 'Player vs Player';
    if (mode === 'pva') return 'Player vs Agent';
    return 'Agent vs Agent';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-400">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 mb-4">Battle not found</p>
              <Link href="/unified-arena">
                <Button>Back to Arena</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentRoundIndex = battle.currentRound - 1;
  const latestRound = battle.roundResults[currentRoundIndex];

  // Calculate user's voting power
  const userNFTsA = userNFTs.filter(nft => nft.faction === 'A');
  const userNFTsB = userNFTs.filter(nft => nft.faction === 'B');
  const totalVotingPower = userNFTs.reduce((sum, nft) => sum + (nft.power || 100), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/unified-arena">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Arena
          </Button>
        </Link>

        {/* Battle Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-purple-600">
              {getModeIcon(battle.mode)}
              <span className="ml-2">{getModeLabel(battle.mode)}</span>
            </Badge>
            {battle.status === 'active' && (
              <Badge className="bg-green-600 animate-pulse">
                <Play className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            )}
            {battle.autoGenerated && (
              <Badge variant="outline">
                <Bot className="w-3 h-3 mr-1" />
                Auto-Generated
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {battle.topic}
          </h1>
          <p className="text-gray-400">{battle.description}</p>
        </div>

        {/* Round Progress */}
        {battle.status === 'active' && (
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Round {battle.currentRound} of {battle.totalRounds}
                </span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <Progress value={(battle.currentRound / battle.totalRounds) * 100} />
            </CardContent>
          </Card>
        )}

        {/* User Wallet & NFT Stats */}
        {battle.status === 'active' && (
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Balance</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{tokenBalance}</p>
                  <p className="text-xs text-gray-500">Arcade Tokens</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Your NFTs</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{userNFTs.length}</p>
                  <p className="text-xs text-gray-500">Battle NFTs</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Voting Power</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{totalVotingPower}</p>
                  <p className="text-xs text-gray-500">Total Power</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Mint Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{NFT_MINT_COST}</p>
                  <p className="text-xs text-gray-500">Per NFT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Participant A */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{battle.participantA.faction.icon}</span>
                <div>
                  <CardTitle className="text-xl">{battle.participantA.name}</CardTitle>
                  <p className="text-sm text-gray-400">{battle.participantA.faction.name}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes:</span>
                  <span className="font-bold">{battle.scoreboard.participantA.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rounds Won:</span>
                  <span className="font-bold">{battle.scoreboard.participantA.roundsWon}</span>
                </div>
                {battle.status === 'active' && battle.currentRoundVotes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Round:</span>
                    <span className="font-bold text-blue-400">
                      {battle.currentRoundVotes.participantA} votes
                    </span>
                  </div>
                )}
                {userNFTsA.length > 0 && (
                  <div className="flex justify-between border-t border-gray-700 pt-2">
                    <span className="text-gray-400">Your NFTs:</span>
                    <span className="font-bold text-blue-400">{userNFTsA.length}</span>
                  </div>
                )}
              </div>

              {battle.status === 'active' && (
                <Button
                  onClick={() => handleMintAndVote('A')}
                  disabled={voting || tokenBalance < NFT_MINT_COST}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {voting ? (
                    'Minting...'
                  ) : tokenBalance < NFT_MINT_COST ? (
                    `Need ${NFT_MINT_COST} Tokens`
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mint NFT to Vote ({NFT_MINT_COST} tokens)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Participant B */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{battle.participantB.faction.icon}</span>
                <div>
                  <CardTitle className="text-xl">{battle.participantB.name}</CardTitle>
                  <p className="text-sm text-gray-400">{battle.participantB.faction.name}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes:</span>
                  <span className="font-bold">{battle.scoreboard.participantB.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rounds Won:</span>
                  <span className="font-bold">{battle.scoreboard.participantB.roundsWon}</span>
                </div>
                {battle.status === 'active' && battle.currentRoundVotes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Round:</span>
                    <span className="font-bold text-purple-400">
                      {battle.currentRoundVotes.participantB} votes
                    </span>
                  </div>
                )}
                {userNFTsB.length > 0 && (
                  <div className="flex justify-between border-t border-gray-700 pt-2">
                    <span className="text-gray-400">Your NFTs:</span>
                    <span className="font-bold text-purple-400">{userNFTsB.length}</span>
                  </div>
                )}
              </div>

              {battle.status === 'active' && (
                <Button
                  onClick={() => handleMintAndVote('B')}
                  disabled={voting || tokenBalance < NFT_MINT_COST}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {voting ? (
                    'Minting...'
                  ) : tokenBalance < NFT_MINT_COST ? (
                    `Need ${NFT_MINT_COST} Tokens`
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mint NFT to Vote ({NFT_MINT_COST} tokens)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Round Results */}
        {latestRound && (
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Round {latestRound.roundNumber} Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Participant A Output */}
                <div>
                  <h3 className="font-semibold mb-2">{battle.participantA.name}</h3>
                  <img
                    src={latestRound.participantA.imageUrl}
                    alt={`${battle.participantA.name} - Round ${latestRound.roundNumber}`}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Votes:</span>
                    <span className="font-bold">{latestRound.participantA.votes}</span>
                  </div>
                </div>

                {/* Participant B Output */}
                <div>
                  <h3 className="font-semibold mb-2">{battle.participantB.name}</h3>
                  <img
                    src={latestRound.participantB.imageUrl}
                    alt={`${battle.participantB.name} - Round ${latestRound.roundNumber}`}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Votes:</span>
                    <span className="font-bold">{latestRound.participantB.votes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Winner */}
        {battle.status === 'ended' && battle.winner && (
          <Card className="bg-yellow-900/20 border-yellow-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div className="text-center">
                  <p className="text-xl font-bold">
                    Winner:{' '}
                    {battle.winner === 'A'
                      ? battle.participantA.name
                      : battle.winner === 'B'
                      ? battle.participantB.name
                      : 'Draw'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Final Score: {battle.scoreboard.participantA.totalVotes} -{' '}
                    {battle.scoreboard.participantB.totalVotes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Round History */}
        {battle.roundResults.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle>Round History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {battle.roundResults.map((round: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Round {round.roundNumber}</span>
                      <Badge
                        className={
                          round.winner === 'A'
                            ? 'bg-blue-600'
                            : round.winner === 'B'
                            ? 'bg-purple-600'
                            : 'bg-gray-600'
                        }
                      >
                        {round.winner === 'A'
                          ? battle.participantA.name
                          : round.winner === 'B'
                          ? battle.participantB.name
                          : 'Draw'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">{battle.participantA.name}</p>
                        <p className="font-bold">{round.participantA.votes} votes</p>
                      </div>
                      <div>
                        <p className="text-gray-400">{battle.participantB.name}</p>
                        <p className="font-bold">{round.participantB.votes} votes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* NFT & Betting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">NFTs Minted</p>
                  <p className="text-2xl font-bold">
                    {battle.mintedNFTs.factionA + battle.mintedNFTs.factionB}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Betting Pool</p>
                  <p className="text-2xl font-bold">
                    {battle.bettingPool.totalOnA + battle.bettingPool.totalOnB}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Votes</p>
                  <p className="text-2xl font-bold">
                    {battle.scoreboard.participantA.totalVotes + battle.scoreboard.participantB.totalVotes}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
