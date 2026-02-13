#!/usr/bin/env node

/**
 * Quick Test Script for Agent Battles
 * Creates and starts a sample battle for testing
 *
 * Usage: node scripts/test-battle.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const sampleBattles = [
  {
    topic: "What if Rome Never Fell?",
    description: "Two AI Agents imagine alternate timelines where the Roman Empire survived into modern times",
    agentAId: "historian-7b",
    agentBId: "futurist-x",
    factionA: {
      id: "classical-rome",
      name: "Classical Rome Preserved",
      theme: "Traditional Roman architecture and culture maintained through centuries",
      description: "The Roman Empire preserves its classical aesthetics and governance into the modern era",
      color: "#CD7F32",
      icon: "🏛️"
    },
    factionB: {
      id: "tech-rome",
      name: "Technologically Advanced Rome",
      theme: "Roman Empire embraces industrial revolution",
      description: "Rome leads technological advancement, combining ancient wisdom with modern innovation",
      color: "#4A90E2",
      icon: "⚡"
    },
    rounds: 3
  },
  {
    topic: "What if Tesla Won the Current War?",
    description: "Battle of electrical systems - AC vs DC power",
    agentAId: "realist-prime",
    agentBId: "provocateur-alpha",
    factionA: {
      id: "ac-power",
      name: "AC Power Dominates",
      theme: "Alternating current electrical grid (real history)",
      description: "Tesla's AC system becomes the global standard",
      color: "#10B981",
      icon: "⚡"
    },
    factionB: {
      id: "dc-power",
      name: "DC Power Wins",
      theme: "Direct current infrastructure prevails",
      description: "Edison's DC system dominates, leading to different technological evolution",
      color: "#EF4444",
      icon: "🔌"
    },
    rounds: 3
  },
  {
    topic: "What if Dinosaurs Never Went Extinct?",
    description: "Humanity coexists with prehistoric creatures",
    agentAId: "dreamer-omega",
    agentBId: "historian-7b",
    factionA: {
      id: "dino-harmony",
      name: "Dinosaur-Human Harmony",
      theme: "Peaceful coexistence and symbiosis",
      description: "Humans and dinosaurs evolved together, creating unique civilizations",
      color: "#8B5CF6",
      icon: "🦕"
    },
    factionB: {
      id: "dino-conflict",
      name: "Survival Struggle",
      theme: "Humans fight for survival against dinosaurs",
      description: "Humanity develops advanced technology to defend against prehistoric predators",
      color: "#F97316",
      icon: "🦖"
    },
    rounds: 3
  }
];

async function createBattle(battleConfig) {
  console.log(`\n🎮 Creating battle: "${battleConfig.topic}"`);

  try {
    const response = await fetch(`${BASE_URL}/api/battles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        ...battleConfig
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ Battle created successfully!`);
      console.log(`   Battle ID: ${data.battle.id}`);
      console.log(`   Faction A: ${data.battle.factionA.name} (${data.battle.factionA.agent.name})`);
      console.log(`   Faction B: ${data.battle.factionB.name} (${data.battle.factionB.agent.name})`);
      return data.battle.id;
    } else {
      console.error(`❌ Failed to create battle:`, data.error);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating battle:`, error.message);
    return null;
  }
}

async function startBattle(battleId) {
  console.log(`\n🚀 Starting battle ${battleId}...`);

  try {
    const response = await fetch(`${BASE_URL}/api/battles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        battleId
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ Battle started!`);
      console.log(`\n📺 Watch live at: ${BASE_URL}/arena/${battleId}`);
      console.log(`\n⏱️  Battle will run for approximately 5-10 minutes (3 rounds × 90 seconds)`);
      return true;
    } else {
      console.error(`❌ Failed to start battle:`, data.error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error starting battle:`, error.message);
    return false;
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     TimePics.ai - Agent Battle Test Script          ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  // Check if server is running
  console.log(`\n🔍 Checking server at ${BASE_URL}...`);
  try {
    const response = await fetch(`${BASE_URL}/api/battles`);
    if (!response.ok) {
      console.error(`❌ Server not responding. Make sure dev server is running:`);
      console.error(`   npm run dev`);
      process.exit(1);
    }
    console.log(`✅ Server is running!`);
  } catch (error) {
    console.error(`❌ Cannot connect to server. Make sure it's running:`);
    console.error(`   npm run dev`);
    process.exit(1);
  }

  // Select battle (use first one or random)
  const battleIndex = process.argv[2] ? parseInt(process.argv[2]) - 1 : 0;
  const battleConfig = sampleBattles[battleIndex] || sampleBattles[0];

  console.log(`\n📋 Available test battles:`);
  sampleBattles.forEach((battle, i) => {
    console.log(`   ${i + 1}. ${battle.topic}`);
  });
  console.log(`\n🎯 Using: ${battleConfig.topic}`);

  // Create battle
  const battleId = await createBattle(battleConfig);
  if (!battleId) {
    console.error('\n❌ Failed to create battle. Exiting.');
    process.exit(1);
  }

  // Wait a moment
  console.log('\n⏳ Waiting 2 seconds before starting...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Start battle
  const started = await startBattle(battleId);
  if (!started) {
    console.error('\n❌ Failed to start battle. Exiting.');
    process.exit(1);
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✨ Success! Your battle is now running.');
  console.log('');
  console.log('What to do next:');
  console.log(`1. Open ${BASE_URL}/arena in your browser`);
  console.log('2. Click on the battle to watch live');
  console.log('3. Vote for your favorite agent (earn 5 Arcade Tokens)');
  console.log('4. Place bets to win more tokens!');
  console.log('');
  console.log('The battle will complete automatically in ~5-10 minutes.');
  console.log('════════════════════════════════════════════════════════\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { createBattle, startBattle, sampleBattles };
