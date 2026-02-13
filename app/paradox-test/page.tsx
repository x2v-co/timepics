'use client';

import { useState, useEffect } from 'react';
import { getRandomTemplate, getAllPredefinedTopics, type ParadoxTopic } from '@/lib/paradoxEngine';
import { createBattle, UnifiedBattleController } from '@/lib/unifiedBattleController';
import { calculateNFTPower } from '@/lib/battleNFT';

export default function ParadoxTest() {
  const [topics, setTopics] = useState<ParadoxTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ParadoxTopic | null>(null);
  const [battleState, setBattleState] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    // Load predefined topics
    const allTopics = getAllPredefinedTopics();
    setTopics(allTopics);
    addLog(`Loaded ${allTopics.length} paradox topics`);
  }, []);

  const testBattleCreation = () => {
    if (!selectedTopic) {
      addLog('Please select a topic first');
      return;
    }

    addLog(`Creating battle for: ${selectedTopic.topic}`);

    const battle = createBattle({
      mode: 'ava',
      topic: selectedTopic.topic,
      description: selectedTopic.description,
      participantA: {
        type: 'agent',
        agentId: 'historian'
      },
      participantB: {
        type: 'agent',
        agentId: 'futurist'
      },
      factionA: {
        id: 'faction-a',
        name: selectedTopic.factionA.name,
        theme: selectedTopic.factionA.theme,
        description: selectedTopic.factionA.perspective,
        color: '#FFD700',
        icon: '⚔️'
      },
      factionB: {
        id: 'faction-b',
        name: selectedTopic.factionB.name,
        theme: selectedTopic.factionB.theme,
        description: selectedTopic.factionB.perspective,
        color: '#DC143C',
        icon: '🛡️'
      },
      rounds: 3
    });

    addLog(`Battle created: ${battle.id}`);
    addLog(`Genesis NFTs will be generated with 5000 power each`);

    // Test NFT power calculation
    const testGenesisNFT = {
      role: 'GENESIS' as const,
      relevanceScore: 95,
      styleMatchScore: 95,
      mintCost: 0,
      backedAmount: 0
    };

    const genesisPower = calculateNFTPower(testGenesisNFT);
    addLog(`Genesis NFT Power: ${genesisPower}`);

    const testUserNFT = {
      role: 'USER_SUBMITTED' as const,
      relevanceScore: 75,
      styleMatchScore: 70,
      mintCost: 100,
      backedAmount: 50
    };

    const userPower = calculateNFTPower(testUserNFT);
    addLog(`User NFT Power: ${userPower} (relevance: 72.5 + mint: 100 + backed: 50)`);

    setBattleState({
      battleId: battle.id,
      topic: selectedTopic.topic,
      genesisPower,
      userPower,
      totalPool: userPower * 2 + genesisPower * 2
    });
  };

  const testParadoxEngine = async () => {
    addLog('Testing Paradox Engine LLM generation...');
    try {
      const response = await fetch('/api/paradox?action=generate&category=soul-swap');
      const topic = await response.json();
      addLog(`Generated: ${topic.topic}`);
      setTopics(prev => [topic, ...prev]);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">TIMEWAR v3/v4 Test Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Paradox Topics */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🎭 Paradox Engine Topics</h2>

          <button
            onClick={testParadoxEngine}
            className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Generate New Topic (LLM)
          </button>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  selectedTopic?.id === topic.id
                    ? 'bg-purple-900 border-2 border-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <h3 className="font-bold">{topic.topic}</h3>
                <p className="text-sm text-gray-400 mt-1">{topic.description.slice(0, 60)}...</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    🔥 {topic.controversyLevel}/10
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {topic.era}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Test */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">⚔️ v3 Battle System</h2>

          <button
            onClick={testBattleCreation}
            disabled={!selectedTopic}
            className="w-full mb-4 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition font-bold"
          >
            {selectedTopic ? '🚀 Create Test Battle' : 'Select a topic first'}
          </button>

          {battleState && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-3">
              <h3 className="font-bold text-green-400">Battle Created!</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xs text-gray-400">Genesis NFT Power</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {battleState.genesisPower}
                  </div>
                  <div className="text-xs text-gray-500">Fixed 5000 (capped)</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="text-xs text-gray-400">User NFT Power</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {battleState.userPower}
                  </div>
                  <div className="text-xs text-gray-500">AI:72.5 + Mint:100 + Back:50</div>
                </div>
              </div>

              <div className="bg-gray-700 p-3 rounded">
                <div className="text-xs text-gray-400">Total Battle Pool</div>
                <div className="text-xl font-bold text-green-400">
                  {battleState.totalPool} tokens
                </div>
                <div className="text-xs text-gray-500">
                  Winner: 70% | Loser: 25% | Treasury: 5%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="mt-8 bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">📋 System Logs</h2>
        <div className="bg-black p-4 rounded-lg font-mono text-sm space-y-2">
          {logs.length === 0 ? (
            <span className="text-gray-500">No logs yet...</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-green-400">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
