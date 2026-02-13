/**
 * User Agent API System (v4)
 * Allows users to bring their own agents via API
 *
 * Endpoints:
 * - POST /api/v1/agent/action - Execute agent action
 * - GET /api/v1/battle/:id/state - Get battle state
 * - POST /api/v1/battle/:id/mint - Automated minting
 * - POST /api/v1/battle/:id/skill - Cast skill
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBattleNFTs } from '@/lib/battleNFT';
import { castSkill, getAvailableSkills, getSkill } from '@/lib/agentSkills';
import { getArcadeBalance, spendTokens } from '@/lib/arcade/tokenManager';

// API Key storage (in production, use a database)
const API_KEYS_KEY = 'timepics_user_api_keys';

export interface UserAPIKey {
  id: string;
  userId: string;
  key: string;
  name: string;
  permissions: string[];
  rateLimit: number; // requests per minute
  createdAt: string;
  lastUsed?: string;
}

/**
 * Generate a new API key for user
 */
export function generateAPIKey(userId: string, name: string = 'My Agent'): UserAPIKey {
  const keys = loadAPIKeys();

  const newKey: UserAPIKey = {
    id: `key-${Date.now()}`,
    userId,
    key: `sk_${generateSecureKey()}`,
    name,
    permissions: ['battle:read', 'battle:mint', 'skill:cast'],
    rateLimit: 60,
    createdAt: new Date().toISOString()
  };

  keys.push(newKey);
  saveAPIKeys(keys);

  return newKey;
}

/**
 * Generate secure random key
 */
function generateSecureKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate API key
 */
export function validateAPIKey(key: string): UserAPIKey | null {
  const keys = loadAPIKeys();
  return keys.find(k => k.key === key) || null;
}

/**
 * Update last used timestamp
 */
export function updateLastUsed(key: string): void {
  const keys = loadAPIKeys();
  const keyObj = keys.find(k => k.key === key);

  if (keyObj) {
    keyObj.lastUsed = new Date().toISOString();
    saveAPIKeys(keys);
  }
}

/**
 * Load API keys from storage
 */
function loadAPIKeys(): UserAPIKey[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(API_KEYS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load API keys:', error);
  }

  return [];
}

/**
 * Save API keys to storage
 */
function saveAPIKeys(keys: UserAPIKey[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Failed to save API keys:', error);
  }
}

/**
 * Revoke API key
 */
export function revokeAPIKey(keyId: string): boolean {
  const keys = loadAPIKeys();
  const index = keys.findIndex(k => k.id === keyId);

  if (index >= 0) {
    keys.splice(index, 1);
    saveAPIKeys(keys);
    return true;
  }

  return false;
}

/**
 * Get user's API keys
 */
export function getUserAPIKeys(userId: string): UserAPIKey[] {
  const keys = loadAPIKeys();
  return keys.filter(k => k.userId === userId);
}

/**
 * Middleware: Authenticate API request
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean;
  userId?: string;
  error?: string;
}> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Missing or invalid Authorization header' };
  }

  const apiKey = authHeader.substring(7);

  // For demo purposes, accept test keys
  if (apiKey.startsWith('sk_test_') || apiKey.startsWith('sk_user_')) {
    // Extract userId from custom header or use default
    const userId = request.headers.get('x-user-id') || 'user-default';
    return { authenticated: true, userId };
  }

  const keyObj = validateAPIKey(apiKey);

  if (!keyObj) {
    return { authenticated: false, error: 'Invalid API key' };
  }

  updateLastUsed(apiKey);

  return { authenticated: true, userId: keyObj.userId };
}
