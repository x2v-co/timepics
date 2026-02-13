/**
 * Unified Battle Controller v3/v4
 * Handles all battle modes: PvP, P vs Agent, Agent vs Agent
 *
 * v3 Features:
 * - Genesis NFTs generation at battle start
 * - AI evaluation for user NFTs
 * - Visual effects on battle end (Canonical/Paradox)
 * - Reward distribution (70/25/5 split)
 * - Audience backing system
 *
 * v4 Features:
 * - Paradox Engine topics
 * - Rogue Agent spawning
 * - System events
 */

import {
  UnifiedBattle,
  BattleParticipant,
  BattleRoundResult,
  BattleMode,
  ParticipantType,
  CreateBattleRequest,
  DEFAULT_AUTO_GENERATION_CONFIG
} from './unifiedBattle';
import { TimelineAgent, RoundContext, AgentOutput } from './agents/TimelineAgent';
import { getPersonality, AgentPersonality } from './agents/personality';
import {
  BattleNFT,
  mintBattleNFT,
  createGenesisNFT,
  createRogueAgentNFT,
  getBattleNFTs,
  evaluateNFT,
  backNFT,
  settleBattleNFT,
  calculateNFTPower,
  NFTRole,
  AgentEvaluation,
  NFTStatus
} from './battleNFT';
import { applyBattleEffect, EffectType } from './imageProcessor';
import { evaluateNFT as aiEvaluateNFT } from './aiEvaluator';
import { spendTokens, earnTokens, getArcadeBalance } from './arcade/tokenManager';
import { uploadImageToIPFS, ipfsToHttpUrl } from './ipfs';

// Storage keys
const BATTLES_KEY = 'timepics_unified_battles';
const SYSTEM_TREASURY_KEY = 'timepics_system_treasury';

export interface SystemTreasury {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string;
}

export class UnifiedBattleController {
  private battle: UnifiedBattle;
  private roundVotes: Map<number, Map<string, 'A' | 'B'>>;
  private eventListeners: Map<string, Set<(data: any) => void>>;
  private genesisNFTs: { A?: BattleNFT; B?: BattleNFT };
  private battleNFTs: Map<string, BattleNFT>;
  private treasury: SystemTreasury;

  constructor(battle: UnifiedBattle) {
    this.battle = battle;
    this.roundVotes = new Map();
    this.eventListeners = new Map();
    this.genesisNFTs = { A: undefined, B: undefined };
    this.battleNFTs = new Map();
    this.treasury = this.loadTreasury();

    // Initialize agents if needed
    this.initializeAgents();
  }

  /**
   * Load system treasury
   */
  private loadTreasury(): SystemTreasury {
    if (typeof window === 'undefined') {
      return { balance: 0, totalEarned: 0, totalSpent: 0, lastUpdated: new Date().toISOString() };
    }

    try {
      const stored = localStorage.getItem(SYSTEM_TREASURY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load treasury:', error);
    }

    return { balance: 0, totalEarned: 0, totalSpent: 0, lastUpdated: new Date().toISOString() };
  }

  /**
   * Save system treasury
   */
  private saveTreasury(): void {
    if (typeof window === 'undefined') return;

    this.treasury.lastUpdated = new Date().toISOString();
    localStorage.setItem(SYSTEM_TREASURY_KEY, JSON.stringify(this.treasury));
  }

  /**
   * Initialize agent participants
   */
  private initializeAgents(): void {
    if (this.battle.participantA.type === 'agent' && !this.battle.participantA.agent) {
      this.battle.participantA.agent = new TimelineAgent({
        id: this.battle.participantA.id,
        name: this.battle.participantA.name,
        personalityId: this.battle.participantA.personality || 'historian',
        battleId: this.battle.id
      });
    }

    if (this.battle.participantB.type === 'agent' && !this.battle.participantB.agent) {
      this.battle.participantB.agent = new TimelineAgent({
        id: this.battle.participantB.id,
        name: this.battle.participantB.name,
        personalityId: this.battle.participantB.personality || 'futurist',
        battleId: this.battle.id
      });
    }
  }

  /**
   * Start the battle (v3 enhanced)
   */
  async start(): Promise<void> {
    if (this.battle.status !== 'pending') {
      throw new Error('Battle already started or ended');
    }

    console.log(`[UnifiedBattle v3 ${this.battle.id}] Starting: "${this.battle.topic}" (${this.battle.mode})`);

    this.battle.status = 'active';
    this.battle.startedAt = new Date();
    this.battle.currentRound = 1;

    // v3: Generate Genesis NFTs for both factions
    await this.generateGenesisNFTs();

    this.emit('battle:start', {
      battleId: this.battle.id,
      topic: this.battle.topic,
      mode: this.battle.mode,
      rounds: this.battle.rounds,
      genesisNFTs: {
        A: this.genesisNFTs.A ? { id: this.genesisNFTs.A.id, power: this.genesisNFTs.A.power } : null,
        B: this.genesisNFTs.B ? { id: this.genesisNFTs.B.id, power: this.genesisNFTs.B.power } : null
      }
    });

    // Run all rounds
    for (let round = 1; round <= this.battle.rounds; round++) {
      await this.runRound(round);

      // v4: Check for Rogue Agent spawning after each round
      if (this.battle.status === 'active') {
        await this.checkAndSpawnRogueAgent();
      }
    }

    // End battle with v3 settlement
    await this.settleBattle();
  }

  /**
   * v3: Generate Genesis NFTs for both factions
   */
  private async generateGenesisNFTs(): Promise<void> {
    console.log(`[UnifiedBattle v3 ${this.battle.id}] Generating Genesis NFTs...`);

    // Generate for faction A
    if (this.battle.participantA.agent) {
      const context: RoundContext = {
        battleId: this.battle.id,
        battleTopic: this.battle.topic,
        factionName: this.battle.participantA.faction.name,
        factionTheme: this.battle.participantA.faction.theme,
        round: 0,  // Genesis round
        totalRounds: this.battle.rounds
      };

      const agentOutput = await this.battle.participantA.agent.generateForRound(context);
      const imageUrl = await this.generateImage(agentOutput.enhancedPrompt);

      // Create Genesis NFT
      const genesisA = createGenesisNFT({
        battleId: this.battle.id,
        faction: 'A',
        factionName: this.battle.participantA.faction.name,
        imageUrl,
        prompt: agentOutput.enhancedPrompt,
        engine: agentOutput.engine,
        battleTopic: this.battle.topic,
        aiEvaluation: {
          relevanceScore: 95,  // Genesis NFTs get high scores
          styleMatchScore: 95,
          comment: 'Genesis NFT - The definitive interpretation of this faction',
          evaluatedAt: new Date().toISOString(),
          confidence: 1.0
        }
      });

      this.genesisNFTs.A = genesisA;
      this.battleNFTs.set(genesisA.id, genesisA);

      console.log(`[UnifiedBattle v3] Genesis NFT A created: ${genesisA.id}, Power: ${genesisA.power}`);
    }

    // Generate for faction B
    if (this.battle.participantB.agent) {
      const context: RoundContext = {
        battleId: this.battle.id,
        battleTopic: this.battle.topic,
        factionName: this.battle.participantB.faction.name,
        factionTheme: this.battle.participantB.faction.theme,
        round: 0,
        totalRounds: this.battle.rounds
      };

      const agentOutput = await this.battle.participantB.agent.generateForRound(context);
      const imageUrl = await this.generateImage(agentOutput.enhancedPrompt);

      const genesisB = createGenesisNFT({
        battleId: this.battle.id,
        faction: 'B',
        factionName: this.battle.participantB.faction.name,
        imageUrl,
        prompt: agentOutput.enhancedPrompt,
        engine: agentOutput.engine,
        battleTopic: this.battle.topic,
        aiEvaluation: {
          relevanceScore: 95,
          styleMatchScore: 95,
          comment: 'Genesis NFT - The definitive interpretation of this faction',
          evaluatedAt: new Date().toISOString(),
          confidence: 1.0
        }
      });

      this.genesisNFTs.B = genesisB;
      this.battleNFTs.set(genesisB.id, genesisB);

      console.log(`[UnifiedBattle v3] Genesis NFT B created: ${genesisB.id}, Power: ${genesisB.power}`);
    }
  }

  /**
   * v4: Check and spawn Rogue Agent if needed
   */
  private async checkAndSpawnRogueAgent(): Promise<void> {
    const nftsA = this.getNFTsForFaction('A');
    const nftsB = this.getNFTsForFaction('B');

    const totalPowerA = nftsA.reduce((sum, nft) => sum + nft.power, 0);
    const totalPowerB = nftsB.reduce((sum, nft) => sum + nft.power, 0);

    // Calculate dominance
    const total = totalPowerA + totalPowerB;
    if (total === 0) return;

    const dominanceA = totalPowerA / total;
    const dominanceB = totalPowerB / total;

    // If one side has >70% power, spawn Rogue Agent for the weaker side
    if (dominanceA > 0.7 || dominanceB > 0.7) {
      const weakerSide = dominanceA > 0.7 ? 'B' : 'A';

      console.log(`[UnifiedBattle v4 ${this.battle.id}] Rogue Agent triggered! ${weakerSide} is behind`);

      // Check treasury for funds
      if (this.treasury.balance < 100) {
        console.log('[UnifiedBattle v4] Treasury too low for Rogue Agent');
        return;
      }

      // Spend from treasury
      this.treasury.balance -= 100;
      this.treasury.totalSpent += 100;
      this.saveTreasury();

      // Generate Rogue Agent NFT for weaker side
      const weakerParticipant = weakerSide === 'A' ? this.battle.participantA : this.battle.participantB;

      if (weakerParticipant.agent) {
        const context: RoundContext = {
          battleId: this.battle.id,
          battleTopic: this.battle.topic,
          factionName: weakerParticipant.faction.name,
          factionTheme: weakerParticipant.faction.theme,
          round: this.battle.currentRound,
          totalRounds: this.battle.rounds
        };

        const agentOutput = await weakerParticipant.agent.generateForRound(context);
        const imageUrl = await this.generateImage(agentOutput.enhancedPrompt);

        const rogueNFT = createRogueAgentNFT({
          battleId: this.battle.id,
          faction: weakerSide as 'A' | 'B',
          factionName: `${weakerParticipant.faction.name} (Rogue)`,
          imageUrl,
          prompt: agentOutput.enhancedPrompt,
          engine: agentOutput.engine,
          battleTopic: this.battle.topic
        });

        this.battleNFTs.set(rogueNFT.id, rogueNFT);

        // Notify players
        this.emit('rogue:spawn', {
          battleId: this.battle.id,
          faction: weakerSide,
          nftId: rogueNFT.id,
          power: rogueNFT.power
        });

        console.log(`[UnifiedBattle v4] Rogue Agent NFT created for faction ${weakerSide}: ${rogueNFT.id}`);
      }
    }
  }

  /**
   * v3: Settle battle with visual effects and rewards
   */
  private async settleBattle(): Promise<void> {
    this.battle.status = 'ended';
    this.battle.endedAt = new Date();

    // Determine winner based on total faction power
    const nftsA = this.getNFTsForFaction('A');
    const nftsB = this.getNFTsForFaction('B');

    const totalPowerA = nftsA.reduce((sum, nft) => sum + nft.power, 0);
    const totalPowerB = nftsB.reduce((sum, nft) => sum + nft.power, 0);

    const winner = totalPowerA > totalPowerB ? 'A' : totalPowerB > totalPowerA ? 'B' : 'draw';
    this.battle.winner = winner;

    console.log(`[UnifiedBattle v3 ${this.battle.id}] Battle ended. Winner: ${winner}, Power: A=${totalPowerA}, B=${totalPowerB}`);

    // v3: Calculate total pool
    const totalPool = this.calculateTotalPool();
    console.log(`[UnifiedBattle v3 ${this.battle.id}] Total pool: ${totalPool} tokens`);

    // v3: Calculate rewards (70/25/5 split)
    const winnerPool = Math.floor(totalPool * 0.70);  // 70%
    const loserPool = Math.floor(totalPool * 0.25);   // 25%
    const systemFee = Math.floor(totalPool * 0.05);   // 5%

    // Update treasury
    this.treasury.balance += systemFee;
    this.treasury.totalEarned += systemFee;
    this.saveTreasury();

    // v3: Apply visual effects and distribute rewards
    const allNFTs = Array.from(this.battleNFTs.values());

    for (const nft of allNFTs) {
      const won = nft.faction === winner;

      // Calculate reward based on power contribution
      const winningFactionPower = winner === 'A' ? totalPowerA : totalPowerB;
      const nftPowerRatio = winningFactionPower > 0 ? nft.power / winningFactionPower : 0;

      let reward = 0;
      if (won && winningFactionPower > 0) {
        // Winners get share of winner pool based on power contribution
        reward = Math.floor(winnerPool * nftPowerRatio);
      } else if (!won) {
        // Losers get proportional share of loser pool
        const losingFactionPower = winner === 'A' ? totalPowerB : totalPowerA;
        const losingPowerRatio = losingFactionPower > 0 ? nft.power / losingFactionPower : 0;
        reward = Math.floor(loserPool * losingPowerRatio);
      }

      // v3: Apply visual effect to image
      let finalImageUrl = nft.imageUrl;
      let finalImageCID = nft.imageCID;

      try {
        const effectType: EffectType = won ? 'canonical' : 'paradox';
        console.log(`[UnifiedBattle v3] Would apply ${effectType} effect to NFT ${nft.id}`);
        // In a real implementation:
        // const result = await applyBattleEffect(imageBuffer, effectType);
        // finalImageUrl = result.imageUrl;
        // finalImageCID = result.imageCID;
      } catch (error) {
        console.error(`[UnifiedBattle v3] Failed to apply effect to NFT ${nft.id}:`, error);
      }

      // Settle NFT
      settleBattleNFT(nft.id, won, reward, finalImageUrl, finalImageCID);

      // Credit rewards to user
      if (nft.owner !== 'SYSTEM' && nft.owner !== 'ROGUE_AGENT') {
        earnTokens(nft.owner, reward, `Battle ${this.battle.id} rewards`);
      }
    }

    // v3: Award Genesis NFT to top contributor (only if there's a winner)
    if (winner !== 'draw') {
      this.awardGenesisNFT(winner);
    }

    this.emit('battle:end', {
      battleId: this.battle.id,
      winner: this.battle.winner,
      scoreboard: this.battle.scoreboard,
      totalPool,
      rewards: {
        winnerPool,
        loserPool,
        systemFee
      },
      genesisAwarded: winner === 'A'
        ? this.genesisNFTs.A?.id
        : this.genesisNFTs.B?.id
    });

    console.log(`[UnifiedBattle v3 ${this.battle.id}] Battle settlement complete`);
  }

  /**
   * v3: Award Genesis NFT to top contributor of winning faction
   */
  private awardGenesisNFT(winner: 'A' | 'B'): void {
    const winnerGenesis = winner === 'A' ? this.genesisNFTs.A : this.genesisNFTs.B;
    if (!winnerGenesis) return;

    const winnerNFTs = this.getNFTsForFaction(winner);

    // Find NFT with highest power (excluding Genesis)
    const topContributor = winnerNFTs
      .filter(nft => nft.role !== 'GENESIS')
      .sort((a, b) => b.power - a.power)[0];

    if (topContributor && topContributor.owner !== 'SYSTEM') {
      console.log(`[UnifiedBattle v3] Awarding Genesis NFT ${winnerGenesis.id} to top contributor ${topContributor.owner}`);

      // In a real implementation, you'd transfer ownership
      this.emit('genesis:awarded', {
        battleId: this.battle.id,
        genesisNftId: winnerGenesis.id,
        awardedTo: topContributor.owner,
        contributorNftId: topContributor.id
      });
    }
  }

  /**
   * v3: Calculate total battle pool
   */
  private calculateTotalPool(): number {
    const nfts = Array.from(this.battleNFTs.values());

    const mintCosts = nfts.reduce((sum, nft) => {
      if (nft.role === 'GENESIS' || nft.role === 'ROGUE_AGENT') return sum;
      return sum + nft.mintCost;
    }, 0);

    const backingAmounts = nfts.reduce((sum, nft) => sum + nft.backedAmount, 0);

    return mintCosts + backingAmounts;
  }

  /**
   * v3: Get all NFTs for a faction
   */
  private getNFTsForFaction(faction: 'A' | 'B'): BattleNFT[] {
    return Array.from(this.battleNFTs.values()).filter(nft => nft.faction === faction);
  }

  /**
   * v3: Mint a user NFT with AI evaluation
   */
  async mintUserNFT(params: {
    userId: string;
    faction: 'A' | 'B';
    imageUrl: string;
    prompt: string;
    engine: 'rewind' | 'refract' | 'foresee';
    mintCost: number;
  }): Promise<{ nft: BattleNFT; evaluation?: AgentEvaluation }> {
    const faction = params.faction === 'A' ? this.battle.participantA : this.battle.participantB;
    const genesisNFT = params.faction === 'A' ? this.genesisNFTs.A : this.genesisNFTs.B;

    // Mint NFT
    const nft = mintBattleNFT({
      userId: params.userId,
      battleId: this.battle.id,
      faction: params.faction,
      factionName: faction.faction.name,
      battleTopic: this.battle.topic,
      imageUrl: params.imageUrl,
      engine: params.engine,
      prompt: params.prompt,
      mintCost: params.mintCost,
      role: 'USER_SUBMITTED'
    });

    this.battleNFTs.set(nft.id, nft);

    // v3: Evaluate NFT against Genesis
    let evaluation: AgentEvaluation | undefined;

    if (genesisNFT) {
      try {
        evaluation = await aiEvaluateNFT({
          userImageUrl: params.imageUrl,
          userPrompt: params.prompt,
          battleTopic: this.battle.topic,
          genesisImageUrl: genesisNFT.imageUrl,
          genesisPrompt: genesisNFT.prompt,
          factionName: faction.faction.name
        });

        // Update NFT with evaluation
        evaluateNFT(nft.id, evaluation);

        console.log(`[UnifiedBattle v3] NFT ${nft.id} evaluated: relevance=${evaluation.relevanceScore}, style=${evaluation.styleMatchScore}`);
      } catch (error) {
        console.error(`[UnifiedBattle v3] Failed to evaluate NFT ${nft.id}:`, error);
      }
    }

    // Notify battle
    this.emit('nft:minted', {
      battleId: this.battle.id,
      nft: {
        id: nft.id,
        faction: nft.faction,
        power: nft.power,
        evaluation: evaluation
      }
    });

    return { nft, evaluation };
  }

  /**
   * v3: Back an NFT (patron system)
   */
  backUserNFT(
    nftId: string,
    userId: string,
    amount: number
  ): { success: boolean; nft?: BattleNFT; error?: string } {
    const nft = this.battleNFTs.get(nftId);

    if (!nft) {
      return { success: false, error: 'NFT not found in this battle' };
    }

    const result = backNFT(nftId, userId, amount);

    if (result.success && result.nft) {
      this.battleNFTs.set(nftId, result.nft);

      this.emit('nft:backed', {
        battleId: this.battle.id,
        nftId,
        userId,
        amount,
        newPower: result.nft.power
      });
    }

    return result;
  }

  /**
   * Run a single round
   */
  private async runRound(roundNumber: number): Promise<void> {
    console.log(`[UnifiedBattle ${this.battle.id}] Starting round ${roundNumber}/${this.battle.rounds}`);

    this.battle.currentRound = roundNumber;
    const startedAt = new Date();

    // Initialize round votes
    this.roundVotes.set(roundNumber, new Map());

    this.emit('round:start', {
      battleId: this.battle.id,
      roundNumber,
      totalRounds: this.battle.rounds
    });

    // Phase 1: Generation
    this.emit('round:phase', {
      battleId: this.battle.id,
      roundNumber,
      phase: 'generation',
      duration: 30000
    });

    const [outputA, outputB] = await Promise.all([
      this.generateForParticipant(this.battle.participantA, roundNumber, 'A'),
      this.generateForParticipant(this.battle.participantB, roundNumber, 'B')
    ]);

    // Phase 2: Reveal
    this.emit('round:phase', {
      battleId: this.battle.id,
      roundNumber,
      phase: 'reveal',
      duration: 10000,
      outputA,
      outputB
    });

    await this.delay(10000);

    // Phase 3: Voting
    this.emit('round:phase', {
      battleId: this.battle.id,
      roundNumber,
      phase: 'voting',
      duration: 50000
    });

    await this.delay(50000);

    // Phase 4: Scoring
    this.emit('round:phase', {
      battleId: this.battle.id,
      roundNumber,
      phase: 'scoring',
      duration: 10000
    });

    await this.delay(10000);

    const votes = this.getRoundVotes(roundNumber);
    const winner = votes.participantA > votes.participantB
      ? 'A'
      : votes.participantB > votes.participantA
      ? 'B'
      : 'draw';

    // Save round result
    const roundResult: BattleRoundResult = {
      roundNumber,
      participantA: {
        type: this.battle.participantA.type,
        output: outputA.output,
        imageUrl: outputA.imageUrl,
        userPrompt: outputA.userPrompt,
        votes: votes.participantA
      },
      participantB: {
        type: this.battle.participantB.type,
        output: outputB.output,
        imageUrl: outputB.imageUrl,
        userPrompt: outputB.userPrompt,
        votes: votes.participantB
      },
      winner,
      startedAt,
      endedAt: new Date()
    };

    this.battle.roundResults.push(roundResult);

    // Update scoreboard
    this.battle.scoreboard.participantA.roundScores.push(votes.participantA);
    this.battle.scoreboard.participantA.totalVotes += votes.participantA;
    if (winner === 'A') this.battle.scoreboard.participantA.roundsWon++;

    this.battle.scoreboard.participantB.roundScores.push(votes.participantB);
    this.battle.scoreboard.participantB.totalVotes += votes.participantB;
    if (winner === 'B') this.battle.scoreboard.participantB.roundsWon++;

    // Update agent memory
    this.updateAgentMemories(roundNumber, outputA, outputB, votes, winner);

    this.emit('round:end', {
      battleId: this.battle.id,
      roundNumber,
      roundResult
    });

    await this.delay(10000);

    console.log(
      `[UnifiedBattle ${this.battle.id}] Round ${roundNumber} ended: Winner=${winner}, Votes=${votes.participantA}:${votes.participantB}`
    );
  }

  /**
   * Update agent memory after round
   */
  private updateAgentMemories(
    roundNumber: number,
    outputA: { output?: AgentOutput; imageUrl: string },
    outputB: { output?: AgentOutput; imageUrl: string },
    votes: { participantA: number; participantB: number },
    winner: 'A' | 'B' | 'draw'
  ): void {
    if (this.battle.participantA.agent) {
      this.battle.participantA.agent.updateMemory({
        roundNumber,
        myImage: outputA.imageUrl,
        opponentImage: outputB.imageUrl,
        myVotes: votes.participantA,
        opponentVotes: votes.participantB,
        engineUsed: outputA.output?.engine || 'refract',
        promptUsed: outputA.output?.prompt || '',
        won: winner === 'A'
      });
    }

    if (this.battle.participantB.agent) {
      this.battle.participantB.agent.updateMemory({
        roundNumber,
        myImage: outputB.imageUrl,
        opponentImage: outputA.imageUrl,
        myVotes: votes.participantB,
        opponentVotes: votes.participantA,
        engineUsed: outputB.output?.engine || 'refract',
        promptUsed: outputB.output?.prompt || '',
        won: winner === 'B'
      });
    }
  }

  /**
   * Generate output for a participant
   */
  private async generateForParticipant(
    participant: BattleParticipant,
    roundNumber: number,
    side: 'A' | 'B'
  ): Promise<{
    output?: AgentOutput;
    imageUrl: string;
    userPrompt?: string;
  }> {
    if (participant.agent) {
      const context: RoundContext = {
        battleId: this.battle.id,
        battleTopic: this.battle.topic,
        factionName: participant.faction.name,
        factionTheme: participant.faction.theme,
        round: roundNumber,
        totalRounds: this.battle.rounds,
        lastRoundVotes:
          roundNumber > 1
            ? {
                mine: this.battle.scoreboard[side === 'A' ? 'participantA' : 'participantB']
                  .roundScores[roundNumber - 2],
                opponent: this.battle.scoreboard[side === 'A' ? 'participantB' : 'participantA']
                  .roundScores[roundNumber - 2]
              }
            : undefined
      };

      const output = await participant.agent.generateForRound(context);
      const imageUrl = await this.generateImage(output.enhancedPrompt);

      return { output, imageUrl };
    } else {
      const imageUrl = `https://placehold.co/600x600/${participant.faction.color.replace(
        '#',
        ''
      )}/fff?text=${participant.name}`;

      return {
        imageUrl,
        userPrompt: `${participant.faction.theme} - Round ${roundNumber}`
      };
    }
  }

  /**
   * Generate image from prompt
   */
  private async generateImage(prompt: string): Promise<string> {
    // Placeholder - in production, call image generation API
    const hash = Math.random().toString(36).substring(7);
    return `https://placehold.co/600x600/333/fff?text=${hash}`;
  }

  /**
   * Vote in current round
   */
  vote(userId: string, faction: 'A' | 'B'): boolean {
    if (this.battle.status !== 'active') return false;

    const currentRound = this.battle.currentRound;
    const roundVotes = this.roundVotes.get(currentRound);

    if (!roundVotes || roundVotes.has(userId)) return false;

    roundVotes.set(userId, faction);

    this.emit('vote:cast', {
      battleId: this.battle.id,
      roundNumber: currentRound,
      userId,
      faction,
      currentVotes: this.getRoundVotes(currentRound)
    });

    return true;
  }

  /**
   * Get round votes (private helper)
   */
  private getRoundVotes(roundNumber: number): {
    participantA: number;
    participantB: number;
  } {
    const roundVotes = this.roundVotes.get(roundNumber);
    if (!roundVotes) return { participantA: 0, participantB: 0 };

    let participantA = 0;
    let participantB = 0;

    for (const faction of roundVotes.values()) {
      if (faction === 'A') participantA++;
      else participantB++;
    }

    return { participantA, participantB };
  }

  /**
   * Get current round votes
   */
  getCurrentRoundVotes(): { participantA: number; participantB: number } | null {
    if (this.battle.status !== 'active') {
      return null;
    }

    return this.getRoundVotes(this.battle.currentRound);
  }

  /**
   * Get odds history
   */
  getOddsHistory() {
    return this.battle.oddsHistory || [];
  }

  /**
   * Get battle state
   */
  getState(): UnifiedBattle & {
    genesisNFTs: { A?: { id: string; power: number }; B?: { id: string; power: number } };
    totalPool: number;
  } {
    const nftsA = this.getNFTsForFaction('A');
    const nftsB = this.getNFTsForFaction('B');

    return {
      ...this.battle,
      genesisNFTs: {
        A: this.genesisNFTs.A ? { id: this.genesisNFTs.A.id, power: this.genesisNFTs.A.power } : undefined,
        B: this.genesisNFTs.B ? { id: this.genesisNFTs.B.id, power: this.genesisNFTs.B.power } : undefined
      },
      totalPool: this.calculateTotalPool()
    };
  }

  /**
   * Get all battle NFTs
   */
  getBattleNFTs(): BattleNFT[] {
    return Array.from(this.battleNFTs.values());
  }

  /**
   * Get NFTs for a specific faction
   */
  getFactionNFTs(faction: 'A' | 'B'): BattleNFT[] {
    return this.getNFTsForFaction(faction);
  }

  /**
   * Get system treasury
   */
  getTreasury(): SystemTreasury {
    return this.treasury;
  }

  /**
   * Event system
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any): void {
    this.eventListeners.get(event)?.forEach((callback) => callback(data));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Factory function to create a battle with v3/v4 features
 */
export function createBattle(request: CreateBattleRequest): UnifiedBattle {
  const now = new Date();

  const battle: UnifiedBattle = {
    id: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    mode: request.mode,
    topic: request.topic,
    description: request.description,

    participantA: {
      type: request.participantA.type,
      id: request.participantA.type === 'agent'
        ? `agent-${request.participantA.agentId || 'historian'}`
        : `user-${request.participantA.userId}`,
      name: request.factionA?.name || 'Faction A',
      faction: request.factionA || {
        id: 'faction-a',
        name: 'Faction A',
        theme: 'Default theme',
        description: 'Default description',
        color: '#FFD700',
        icon: '⚔️'
      },
      personality: request.participantA.agentId
    },

    participantB: {
      type: request.participantB.type,
      id: request.participantB.type === 'agent'
        ? `agent-${request.participantB.agentId || 'futurist'}`
        : `user-${request.participantB.userId}`,
      name: request.factionB?.name || 'Faction B',
      faction: request.factionB || {
        id: 'faction-b',
        name: 'Faction B',
        theme: 'Default theme',
        description: 'Default description',
        color: '#DC143C',
        icon: '🛡️'
      },
      personality: request.participantB.agentId
    },

    creator: request.creatorUserId
      ? { type: 'user', userId: request.creatorUserId }
      : { type: 'agent', agentId: 'system', trigger: 'manual' },

    createdAt: now,
    status: 'pending',
    currentRound: 0,
    rounds: request.rounds || 3,
    roundDuration: request.roundDuration || 90,
    roundResults: [],
    scoreboard: {
      participantA: { roundScores: [], totalVotes: 0, roundsWon: 0 },
      participantB: { roundScores: [], totalVotes: 0, roundsWon: 0 }
    },
    bettingPool: { totalOnA: 0, totalOnB: 0 },
    mintedNFTs: { factionA: 0, factionB: 0 },
    tags: request.tags || ['paradox'],
    autoGenerated: request.autoGenerated
  };

  // Save to storage
  saveBattle(battle);

  return battle;
}

/**
 * Save battle to storage
 */
function saveBattle(battle: UnifiedBattle): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(BATTLES_KEY);
    const battles: UnifiedBattle[] = stored ? JSON.parse(stored) : [];

    const index = battles.findIndex(b => b.id === battle.id);
    if (index >= 0) {
      battles[index] = battle;
    } else {
      battles.push(battle);
    }

    localStorage.setItem(BATTLES_KEY, JSON.stringify(battles));
  } catch (error) {
    console.error('Failed to save battle:', error);
  }
}

/**
 * Get all battles from storage
 */
export function getAllBattles(): UnifiedBattle[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(BATTLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load battles:', error);
    return [];
  }
}
