/**
 * AI Evaluator Service
 * Evaluates user-submitted NFTs against battle topic and Genesis NFT
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface EvaluationResult {
  relevanceScore: number;       // 0-100: How well the image matches the topic
  styleMatchScore: number;      // 0-100: How well the image matches Genesis style
  comment: string;              // AI's evaluation comment
  confidence: number;           // 0-1: AI's confidence in evaluation
  evaluatedAt: string;          // ISO timestamp
}

/**
 * Evaluate user NFT against battle topic and Genesis NFT
 */
export async function evaluateNFT(params: {
  userImageUrl: string;         // URL of user's generated image
  userPrompt: string;           // Prompt used to generate user's image
  battleTopic: string;          // Battle topic/question
  genesisImageUrl: string;      // Genesis NFT image URL (reference for style)
  genesisPrompt: string;        // Genesis NFT prompt (reference for style)
  factionName: string;          // Name of the faction
}): Promise<EvaluationResult> {
  const { userImageUrl, userPrompt, battleTopic, genesisImageUrl, genesisPrompt, factionName } = params;

  try {
    // For MVP, we'll use prompt-based evaluation since we can't process images directly
    // In production, you'd use vision models to analyze the actual image

    const evaluation = await evaluateByPrompt({
      userPrompt,
      battleTopic,
      genesisPrompt,
      factionName
    });

    return {
      relevanceScore: evaluation.relevanceScore,
      styleMatchScore: evaluation.styleMatchScore,
      comment: evaluation.comment,
      confidence: 0.85, // Default confidence for prompt-based evaluation
      evaluatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI evaluation failed:', error);
    // Return neutral evaluation on error
    return {
      relevanceScore: 50,
      styleMatchScore: 50,
      comment: 'Evaluation unavailable - using default score',
      confidence: 0.5,
      evaluatedAt: new Date().toISOString()
    };
  }
}

/**
 * Prompt-based evaluation (for MVP)
 * In production, use vision-capable models
 */
async function evaluateByPrompt(params: {
  userPrompt: string;
  battleTopic: string;
  genesisPrompt: string;
  factionName: string;
}): Promise<{
  relevanceScore: number;
  styleMatchScore: number;
  comment: string;
}> {
  const { userPrompt, battleTopic, genesisPrompt, factionName } = params;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert art critic for an AI battle arena. Evaluate the quality of a user's artwork for a battle.

**Battle Topic**: "${battleTopic}"
**Faction**: "${factionName}"
**Genesis Reference Style**: "${genesisPrompt}"
**User's Prompt**: "${userPrompt}"

Evaluate the user's prompt based on:
1. RELEVANCE (0-100): How well does it address the battle topic? Does it capture the essence of the faction's perspective?
2. STYLE MATCH (0-100): How well does it align with the Genesis style reference?

Respond with a JSON object (no markdown):
{
  "relevanceScore": <number>,
  "styleMatchScore": <number>,
  "comment": "<2-3 sentence critique>"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        relevanceScore: Math.min(100, Math.max(0, parsed.relevanceScore || 50)),
        styleMatchScore: Math.min(100, Math.max(0, parsed.styleMatchScore || 50)),
        comment: parsed.comment || 'A solid attempt.'
      };
    }

    // Fallback if JSON parsing fails
    return {
      relevanceScore: 60,
      styleMatchScore: 60,
      comment: 'Your artwork shows understanding of the theme.'
    };
  } catch (error) {
    console.error('Prompt evaluation failed:', error);
    return {
      relevanceScore: 50,
      styleMatchScore: 50,
      comment: 'A balanced interpretation of the theme.'
    };
  }
}

/**
 * Evaluate battle round output (for Agent decisions)
 */
export async function evaluateBattleRound(params: {
  imageAUrl: string;
  imageBUrl: string;
  promptA: string;
  promptB: string;
  battleTopic: string;
  votesA: number;
  votesB: number;
}): Promise<{
  winner: 'A' | 'B' | 'draw';
  analysis: string;
  scoreA: number;
  scoreB: number;
}> {
  const { imageAUrl, imageBUrl, promptA, promptB, battleTopic, votesA, votesB } = params;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are judging an AI art battle between two competing visions.

**Battle Topic**: "${battleTopic}"

**Artist A's Vision**: "${promptA}"
**Artist B's Vision**: "${promptB}"

**Audience Votes**: Artist A = ${votesA}, Artist B = ${votesB}

Judge which artwork better captures the spirit of the battle topic and explain why. Consider:
1. Creative interpretation of the topic
2. Visual appeal and composition
3. How well it represents its faction's perspective

Respond with JSON (no markdown):
{
  "winner": "A" | "B" | "draw",
  "analysis": "<3-4 sentence analysis>",
  "scoreA": <number 0-100>,
  "scoreB": <number 0-100>
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        winner: parsed.winner || 'draw',
        analysis: parsed.analysis || 'A close battle.',
        scoreA: parsed.scoreA || 50,
        scoreB: parsed.scoreB || 50
      };
    }

    // Use votes as tiebreaker if parsing fails
    const winner = votesA > votesB ? 'A' : votesB > votesA ? 'B' : 'draw';
    return {
      winner,
      analysis: 'Based on audience engagement.',
      scoreA: votesA * 2,
      scoreB: votesB * 2
    };
  } catch (error) {
    console.error('Battle round evaluation failed:', error);
    const winner = votesA > votesB ? 'A' : votesB > votesA ? 'B' : 'draw';
    return {
      winner,
      analysis: 'Decision based on audience votes.',
      scoreA: votesA * 2,
      scoreB: votesB * 2
    };
  }
}

/**
 * Calculate final power score for an NFT
 */
export function calculateNFTPower(params: {
  relevanceScore: number;
  styleMatchScore: number;
  mintCost: number;           // Arcade tokens spent
  backedAmount: number;        // Tokens from backers
  isGenesis: boolean;         // Genesis NFT gets bonus
  isRogue: boolean;           // Rogue agent NFT
}): number {
  const { relevanceScore, styleMatchScore, mintCost, backedAmount, isGenesis, isRogue } = params;

  // Base power: average of AI scores
  const basePower = (relevanceScore + styleMatchScore) / 2;

  // Genesis NFTs start with 5000 power
  if (isGenesis) {
    return 5000;
  }

  // Rogue agents get high power but not as high as Genesis
  if (isRogue) {
    return 1000 + basePower;
  }

  // Regular NFT: AI score + user investment
  // Formula: Power = (relevanceScore + styleMatchScore) / 2 + mintCost + backedAmount
  const totalPower = basePower + mintCost + backedAmount;

  return Math.round(totalPower);
}

/**
 * Get score grade letter
 */
export function getScoreGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

/**
 * Format evaluation for display
 */
export function formatEvaluation(result: EvaluationResult): string {
  const grade = getScoreGrade((result.relevanceScore + result.styleMatchScore) / 2);
  return `【${grade}】 ${result.comment}`;
}
