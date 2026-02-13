/**
 * Battle State API
 * GET /api/battles/[id]/state - Get current battle state
 * Returns mock data for demo battles
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBattle } from '@/lib/battleStorage';

// Demo battles data
const DEMO_BATTLES_STATE: Record<string, any> = {
  'battle-tesla-edison': {
    id: 'battle-tesla-edison',
    topic: '⚡ Tesla vs Edison: The Current War',
    description: 'What if AC power never won? An alternate timeline of wireless cities and free energy',
    status: 'active',
    currentRound: 2,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'AC Power Alliance',
      theme: 'Electric Blue',
      color: '#3b82f6',
      icon: '⚡',
      agent: { id: 'agent-a', name: 'Tesla-X', personality: 'innovator' }
    },
    factionB: {
      id: 'faction-b',
      name: 'DC Power Coalition',
      theme: 'Electric Red',
      color: '#ef4444',
      icon: '🔋',
      agent: { id: 'agent-b', name: 'Edison-Prime', personality: 'traditionalist' }
    },
    scoreboard: {
      agentA: { roundScores: [45, 52], totalVotes: 1847, roundsWon: 1 },
      agentB: { roundScores: [38, 48], totalVotes: 1623, roundsWon: 1 }
    },
    roundResults: [
      {
        roundNumber: 1,
        winner: 'A',
        agentA: {
          votes: 847,
          imageUrl: 'https://picsum.photos/seed/tesla-r1/800/600',
          output: { narrative: 'Wireless energy towers illuminate the night sky, powering entire cities without a single wire. The future is bright, and it hums with alternating current.' }
        },
        agentB: {
          votes: 623,
          imageUrl: 'https://picsum.photos/seed/edison-r1/800/600',
          output: { narrative: 'Edison\'s direct current powers reliable incandescent lights in every home. Safety and simplicity wins the hearts of the masses.' }
        }
      },
      {
        roundNumber: 2,
        winner: 'pending',
        agentA: {
          votes: 1000,
          imageUrl: 'https://picsum.photos/seed/tesla-r2/800/600',
          output: { narrative: 'A massive Tesla coil reaches into the stratosphere, harvesting atmospheric electricity. The wireless power grid spans continents.' }
        },
        agentB: {
          votes: 1000,
          imageUrl: 'https://picsum.photos/seed/edison-r2/800/600',
          output: { narrative: 'Factories hum with DC-powered machinery, each worker equipped with reliable Edison tools. Industrial America runs like clockwork.' }
        }
      }
    ],
    currentRoundVotes: { agentA: 1000, agentB: 1000 },
    poolSize: 12500,
    startedAt: new Date(Date.now() - 300000).toISOString()
  },
  'battle-rome-carthage': {
    id: 'battle-rome-carthage',
    topic: '🏛️ What if Rome Never Fell?',
    description: 'The eternal empire continues into the modern day with Roman law and legionary tech',
    status: 'active',
    currentRound: 1,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'Eternal Empire',
      theme: 'Golden',
      color: '#f59e0b',
      icon: '🏛️',
      agent: { id: 'agent-a', name: 'Augustus-AI', personality: 'historian' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Barbarian Horde',
      theme: 'Purple',
      color: '#7c3aed',
      icon: '🪓',
      agent: { id: 'agent-b', name: 'Attila-Code', personality: 'provocateur' }
    },
    scoreboard: {
      agentA: { roundScores: [], totalVotes: 445, roundsWon: 0 },
      agentB: { roundScores: [], totalVotes: 312, roundsWon: 0 }
    },
    roundResults: [
      {
        roundNumber: 1,
        winner: 'pending',
        agentA: {
          votes: 445,
          imageUrl: 'https://picsum.photos/seed/rome-r1/800/600',
          output: { narrative: 'The Colosseum stands tall amidst flying cars and holographic advertisements. Roman legions in powered armor patrol the eternal city.' }
        },
        agentB: {
          votes: 312,
          imageUrl: 'https://picsum.photos/seed/carthage-r1/800/600',
          output: { narrative: 'Barbarian clans unite under digital banners, their neural implants allowing coordinated strikes across the cyber-frontier.' }
        }
      }
    ]
  },
  'battle-mars-colony': {
    id: 'battle-mars-colony',
    topic: '🚀 Mars Colony: Year 2150',
    description: 'A glimpse into the red planet terraforming project and first permanent human settlement',
    status: 'active',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'Terraform First',
      theme: 'Green',
      color: '#16a34a',
      icon: '🌳',
      agent: { id: 'agent-a', name: 'Musk-Mind', personality: 'visionary' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Dome Colonists',
      theme: 'Orange',
      color: '#ea580c',
      icon: '🔵',
      agent: { id: 'agent-b', name: 'Elon-Logic', personality: 'realist' }
    },
    scoreboard: {
      agentA: { roundScores: [35, 42, 46], totalVotes: 823, roundsWon: 2 },
      agentB: { roundScores: [28, 35, 32], totalVotes: 547, roundsWon: 1 }
    },
    roundResults: [
      {
        roundNumber: 1,
        winner: 'A',
        agentA: {
          votes: 823,
          imageUrl: 'https://picsum.photos/seed/mars-r1a/800/600',
          output: { narrative: 'Green terraforming pods sprout across the rust-red plains. The first Martian forests begin their slow climb toward the pale pink sky.' }
        },
        agentB: {
          votes: 547,
          imageUrl: 'https://picsum.photos/seed/mars-r1b/800/600',
          output: { narrative: 'Beneath the protective glass domes, neon-lit cities pulse with human life. Mars is a garden, but it blooms indoors.' }
        }
      },
      {
        roundNumber: 2,
        winner: 'A',
        agentA: {
          votes: 256,
          imageUrl: 'https://picsum.photos/seed/mars-r2a/800/600',
          output: { narrative: 'Oxygen factories hum as terraformed valleys turn green. Animals roam freely under the thin but breathable atmosphere.' }
        },
        agentB: {
          votes: 182,
          imageUrl: 'https://picsum.photos/seed/mars-r2b/800/600',
          output: { narrative: 'The great dome cities expand underground, connecting via magnetic tunnels. A million humans live comfortably in artificial habitats.' }
        }
      }
    ],
    currentRoundVotes: { agentA: 100, agentB: 100 },
    poolSize: 4890,
    winner: undefined
  },
  'battle-napoleon-waterloo': {
    id: 'battle-napoleon-waterloo',
    topic: '🦅 Napoleon Wins Waterloo',
    description: 'The French Empire reaches global dominance with Napoleonic code law across the world',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'French Empire',
      theme: 'Blue',
      color: '#2563eb',
      icon: '🦅',
      agent: { id: 'agent-a', name: 'Napoleon-Gen', personality: 'military' }
    },
    factionB: {
      id: 'faction-b',
      name: 'British Coalition',
      theme: 'Red',
      color: '#dc2626',
      icon: '🇬🇧',
      agent: { id: 'agent-b', name: 'Wellington-Bot', personality: 'diplomat' }
    },
    scoreboard: {
      agentA: { roundScores: [45, 38, 52], totalVotes: 5156, roundsWon: 2 },
      agentB: { roundScores: [35, 42, 38], totalVotes: 3432, roundsWon: 1 }
    },
    roundResults: [
      { roundNumber: 1, winner: 'A', agentA: { votes: 1800, imageUrl: 'https://picsum.photos/seed/napoleon-r1a/800/600', output: { narrative: 'Napoleon\'s Grande Armée crosses the channel on hovercrafts. London falls within days. The tricolor flies over Buckingham Palace.' } }, agentB: { votes: 1200, imageUrl: 'https://picsum.photos/seed/wellington-r1b/800/600', output: { narrative: 'Wellington\'s defensive line holds at the White Cliffs. British drones scatter the French invasion fleet. The channel remains unconquered.' } } },
      { roundNumber: 2, winner: 'B', agentA: { votes: 1500, imageUrl: 'https://picsum.photos/seed/napoleon-r2a/800/600', output: { narrative: 'The French Empire establishes control over Iberia. Madrid surrenders. Napoleon celebrates in the Palacio Real.' } }, agentB: { votes: 1800, imageUrl: 'https://picsum.photos/seed/wellington-r2b/800/600', output: { narrative: 'Coalition forces push back. Prussian allies arrive at dawn. The French retreat in disarray.' } } },
      { roundNumber: 3, winner: 'A', agentA: { votes: 1856, imageUrl: 'https://picsum.photos/seed/napoleon-r3a/800/600', output: { narrative: 'Paris celebrates as peace treaties are signed. The French Empire dominates Europe. Napoleon\'s code law becomes global standard.' } }, agentB: { votes: 432, imageUrl: 'https://picsum.photos/seed/wellington-r3b/800/600', output: { narrative: 'British exiles gather in the colonies. The Empire continues in spirit, waiting for its chance to return.' } } }
    ],
    currentRoundVotes: null,
    poolSize: 32200,
    winner: 'A'
  },
  'battle-dinosaur-ai': {
    id: 'battle-dinosaur-ai',
    topic: '🦖 What if Dinosaurs Evolved?',
    description: '65 million years of continued evolution - what would intelligent dinosaurs look like?',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'Raptor Scholars',
      theme: 'Green',
      color: '#22c55e',
      icon: '🦖',
      agent: { id: 'agent-a', name: 'Trex-Think', personality: 'scholar' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Pterodactyl Artists',
      theme: 'Purple',
      color: '#8b5cf6',
      icon: '🦅',
      agent: { id: 'agent-b', name: 'Ptero-Create', personality: 'artist' }
    },
    scoreboard: {
      agentA: { roundScores: [32, 45, 35], totalVotes: 2987, roundsWon: 1 },
      agentB: { roundScores: [38, 42, 48], totalVotes: 3234, roundsWon: 2 }
    },
    roundResults: [
      { roundNumber: 1, winner: 'B', agentA: { votes: 987, imageUrl: 'https://picsum.photos/seed/raptor-r1a/800/600', output: { narrative: 'Tyrannosaurus scholars gather in ancient libraries, their massive brains solving equations of the cosmos.' } }, agentB: { votes: 1234, imageUrl: 'https://picsum.photos/seed/ptero-r1b/800/600', output: { narrative: 'Pterodactyl artists soar above crystalline cities, their wings leaving trails of bioluminescent light.' } } },
      { roundNumber: 2, winner: 'B', agentA: { votes: 876, imageUrl: 'https://picsum.photos/seed/raptor-r2a/800/600', output: { narrative: 'The great library of the Raptors burns with knowledge. Philosophers debate the meaning of existence.' } }, agentB: { votes: 1056, imageUrl: 'https://picsum.photos/seed/ptero-r2b/800/600', output: { narrative: 'Pterodactyl musicians compose symphonies that echo through mountain valleys. Art flourishes.' } } },
      { roundNumber: 3, winner: 'B', agentA: { votes: 1124, imageUrl: 'https://picsum.photos/seed/raptor-r3a/800/600', output: { narrative: 'Raptor engineers build spacecraft to reach the stars. Their methodical approach yields slow but steady progress.' } }, agentB: { votes: 944, imageUrl: 'https://picsum.photos/seed/ptero-r3b/800/600', output: { narrative: 'The Pterodactyl civilization reaches zeniths of beauty. Their art becomes the universal language of the galaxy.' } } }
    ],
    currentRoundVotes: null,
    poolSize: 18500,
    winner: 'B'
  },
  'battle-silk-road': {
    id: 'battle-silk-road',
    topic: '🐉 Digital Silk Road 2050',
    description: 'Ancient trade routes reimagined as quantum data highways connecting civilizations',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'Eastern Wisdom',
      theme: 'Red',
      color: '#dc2626',
      icon: '🐉',
      agent: { id: 'agent-a', name: 'Confucius-AI', personality: 'philosopher' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Western Innovation',
      theme: 'Blue',
      color: '#3b82f6',
      icon: '🦅',
      agent: { id: 'agent-b', name: 'DaVinci-Bot', personality: 'inventor' }
    },
    scoreboard: {
      agentA: { roundScores: [48, 42, 52], totalVotes: 4678, roundsWon: 2 },
      agentB: { roundScores: [35, 45, 38], totalVotes: 3456, roundsWon: 1 }
    },
    roundResults: [
      { roundNumber: 1, winner: 'A', agentA: { votes: 1678, imageUrl: 'https://picsum.photos/seed/silk-r1a/800/600', output: { narrative: 'Quantum data streams flow through ancient silk routes, carrying wisdom from Shanghai to Istanbul.' } }, agentB: { votes: 1456, imageUrl: 'https://picsum.photos/seed/davinci-r1b/800/600', output: { narrative: 'Western inventors create new protocols, their innovations traveling the quantum highway westward.' } } },
      { roundNumber: 2, winner: 'A', agentA: { votes: 1876, imageUrl: 'https://picsum.photos/seed/silk-r2a/800/600', output: { narrative: 'Eastern philosophy meets Western technology. AI monks and quantum scholars exchange ancient secrets.' } }, agentB: { votes: 1056, imageUrl: 'https://picsum.photos/seed/davinci-r2b/800/600', output: { narrative: 'Renaissance-style innovation hubs spring up across Europe, exporting ideas to the quantum network.' } } },
      { roundNumber: 3, winner: 'A', agentA: { votes: 1124, imageUrl: 'https://picsum.photos/seed/silk-r3a/800/600', output: { narrative: 'The Digital Silk Road unites humanity. East and West blend in harmony, sharing culture and technology.' } }, agentB: { votes: 944, imageUrl: 'https://picsum.photos/seed/davinci-r3b/800/600', output: { narrative: 'Western innovation continues to push boundaries, but now as part of a global conversation.' } } }
    ],
    currentRoundVotes: null,
    poolSize: 24500,
    winner: 'A'
  },
  'battle-shakespeare-ai': {
    id: 'battle-shakespeare-ai',
    topic: '🎭 Shakespeare vs AI Writer',
    description: 'Can the Bard compete with an AI trained on all human literature?',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'The Bard',
      theme: 'Brown',
      color: '#8b4513',
      icon: '🎭',
      agent: { id: 'agent-a', name: 'William-Gen', personality: 'bard' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Neural Poet',
      theme: 'Cyan',
      color: '#06b6d4',
      icon: '🤖',
      agent: { id: 'agent-b', name: 'GPT-Bard', personality: 'modern' }
    },
    scoreboard: {
      agentA: { roundScores: [38, 42, 35], totalVotes: 2345, roundsWon: 1 },
      agentB: { roundScores: [42, 45, 48], totalVotes: 2890, roundsWon: 2 }
    },
    roundResults: [
      { roundNumber: 1, winner: 'B', agentA: { votes: 845, imageUrl: 'https://picsum.photos/seed/shakespeare-r1a/800/600', output: { narrative: 'The Bard pens a sonnet about digital dreams, his quill scratching on parchment in candlelit study.' } }, agentB: { votes: 890, imageUrl: 'https://picsum.photos/seed/gpt-r1b/800/600', output: { narrative: 'GPT-Bard generates verse in iambic pentameter, analyzing patterns across all human literature in milliseconds.' } } },
      { roundNumber: 2, winner: 'B', agentA: { votes: 756, imageUrl: 'https://picsum.photos/seed/shakespeare-r2a/800/600', output: { narrative: 'Shakespeare performs at the Globe, his words moving the crowd to tears and laughter in equal measure.' } }, agentB: { votes: 1024, imageUrl: 'https://picsum.photos/seed/gpt-r2b/800/600', output: { narrative: 'The AI composes plays that resonate with modern themes, blending classical form with contemporary issues.' } } },
      { roundNumber: 3, winner: 'B', agentA: { votes: 744, imageUrl: 'https://picsum.photos/seed/shakespeare-r3a/800/600', output: { narrative: 'The Bard\'s final work: a meditation on mortality, written with quill and ink, full of human frailty.' } }, agentB: { votes: 976, imageUrl: 'https://picsum.photos/seed/gpt-r3b/800/600', output: { narrative: 'AI-Bard writes the definitive epic of the digital age, capturing the human experience in silicon and code.' } } }
    ],
    currentRoundVotes: null,
    poolSize: 15800,
    winner: 'B'
  },
  'battle-cyberpunk': {
    id: 'battle-cyberpunk',
    topic: '🌃 Cyberpunk Tokyo 2088',
    description: 'Neon-lit streets where ancient shrines meet quantum AI networks',
    status: 'ended',
    currentRound: 3,
    totalRounds: 3,
    factionA: {
      id: 'faction-a',
      name: 'Neon Street',
      theme: 'Pink',
      color: '#ec4899',
      icon: '🌃',
      agent: { id: 'agent-a', name: 'Cyber-Punk', personality: 'rebel' }
    },
    factionB: {
      id: 'faction-b',
      name: 'Temple District',
      theme: 'Orange',
      color: '#f97316',
      icon: '⛩️',
      agent: { id: 'agent-b', name: 'Spirit-Tech', personality: 'mystic' }
    },
    scoreboard: {
      agentA: { roundScores: [52, 48, 55], totalVotes: 4123, roundsWon: 3 },
      agentB: { roundScores: [35, 38, 32], totalVotes: 2876, roundsWon: 0 }
    },
    roundResults: [
      { roundNumber: 1, winner: 'A', agentA: { votes: 1456, imageUrl: 'https://picsum.photos/seed/neon-r1a/800/600', output: { narrative: 'Neon signs flicker in the rain. Cyberpunk rebels hack corporate mainframes from alleyway noodle shops.' } }, agentB: { votes: 876, imageUrl: 'https://picsum.photos/seed/temple-r1b/800/600', output: { narrative: 'Monks project holograms of ancient sutras onto quantum screens. Spirituality meets technology.' } } },
      { roundNumber: 2, winner: 'A', agentA: { votes: 1324, imageUrl: 'https://picsum.photos/seed/neon-r2a/800/600', output: { narrative: 'Street vendors sell augmented reality charms. Tattoos glow with embedded LEDs telling your fortune.' } }, agentB: { votes: 1024, imageUrl: 'https://picsum.photos/seed/temple-r2b/800/600', output: { narrative: 'Temple AI monks calculate karmic debt on blockchain ledgers. enlightenment is tokenized.' } } },
      { roundNumber: 3, winner: 'A', agentA: { votes: 1343, imageUrl: 'https://picsum.photos/seed/neon-r3a/800/600', output: { narrative: 'The revolution is televised. Corporate towers fall as the people rise with bio-modded limbs.' } }, agentB: { votes: 976, imageUrl: 'https://picsum.photos/seed/temple-r3b/800/600', output: { narrative: 'The temple district becomes a sanctuary. AI spirits guide humans to peace in a chaotic world.' } } }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: battleId } = await params;

    // Check if this is a demo battle first
    const demoBattle = DEMO_BATTLES_STATE[battleId];
    if (demoBattle) {
      return NextResponse.json({
        success: true,
        battle: demoBattle
      });
    }

    // Try to get real battle from storage
    const controller = getBattle(battleId);
    if (!controller) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    const battle = controller.getState();
    const currentVotes = controller.getCurrentRoundVotes();
    const oddsHistory = controller.getOddsHistory();

    return NextResponse.json({
      success: true,
      battle: {
        id: battle.id,
        topic: battle.topic,
        description: battle.description,
        status: battle.status,
        currentRound: battle.currentRound,
        totalRounds: battle.rounds,
        roundDuration: battle.roundDuration,
        factionA: {
          id: battle.factionA.id,
          name: battle.factionA.name,
          theme: battle.factionA.theme,
          description: battle.factionA.description,
          color: battle.factionA.color,
          icon: battle.factionA.icon,
          agent: battle.agentA.getSummary()
        },
        factionB: {
          id: battle.factionB.id,
          name: battle.factionB.name,
          theme: battle.factionB.theme,
          description: battle.factionB.description,
          color: battle.factionB.color,
          icon: battle.factionB.icon,
          agent: battle.agentB.getSummary()
        },
        scoreboard: battle.scoreboard,
        roundResults: battle.roundResults,
        currentRoundVotes: currentVotes,
        oddsHistory,
        startedAt: battle.startedAt,
        endedAt: battle.endedAt,
        winner: battle.winner
      }
    });
  } catch (error) {
    console.error('[API] Get battle state error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
