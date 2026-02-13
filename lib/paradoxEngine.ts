/**
 * Paradox Engine (v4)
 * Generates controversial, thought-provoking "What If" topics
 * Creates engaging battle scenarios with historical错位感
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ParadoxTopic {
  id: string;
  topic: string;              // Short battle title
  description: string;         // Detailed scenario
  factionA: {
    name: string;              // e.g., "The Surrenderer"
    theme: string;            // e.g., "Embrace defeat with grace"
    perspective: string;       // First-person perspective text
    keywords: string[];
  };
  factionB: {
    name: string;              // e.g., "The Resister"
    theme: string;            // e.g., "Never give up"
    perspective: string;
    keywords: string[];
  };
  era: string;
  tags: string[];
  controversyLevel: number;    // 1-10
  generatedAt: string;
}

export type ParadoxCategory = 'soul-swap' | 'anachronism' | 'tech-dystopia' | 'political-rewind' | 'cultural-mashup';

// Pre-defined topic templates for fallback
const TOPIC_TEMPLATES: ParadoxTopic[] = [
  // Existing topics (1-5)
  {
    id: 'adou-linan',
    topic: '阿斗的临安 (Adou in Lin\'an)',
    description: '刘禅穿越成了宋高宗赵构。面对金兵南下，他是会像在成都一样直接投降，还是会因为"乐不思蜀"的乐天派性格反而稳住了军心？',
    factionA: {
      name: '直接投降 (Total Surrender)',
      theme: 'Embrace defeat like Adou did in Shu',
      perspective: 'I am Liu Shan, emperor of a fallen kingdom. Why fight? Surrender brings peace. Let me enjoy the beautiful South.',
      keywords: ['surrender', 'peace', 'comfort', 'defeatism', 'music']
    },
    factionB: {
      name: '佛系治国 (Zen Governance)',
      theme: 'Unexpected stability through non-resistance',
      perspective: 'My relaxed nature actually calms the court. Without the pressure of northern threats, I focus on culture and arts.',
      keywords: ['zen', 'culture', 'stability', 'peaceful', 'wisdom']
    },
    era: 'Song Dynasty',
    tags: ['soul-swap', 'historical', 'political', 'philosophical'],
    controversyLevel: 8,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'qin-vs-trump',
    topic: '长城的两种修法 (The Two Walls)',
    description: '秦始皇与特朗普跨越时空对决。两种不同的"建墙"哲学：强权劳力 vs 资本外包。',
    factionA: {
      name: '强权劳力 (Brute Force Labor)',
      theme: 'Millions of workers build with their hands',
      perspective: 'I command 300,000 workers. Each stone is placed by human hands. This wall will stand for eternity.',
      keywords: ['labor', 'empire', 'force', 'construction', 'eternity']
    },
    factionB: {
      name: '资本外包 (Capital Outsourcing)',
      theme: 'Build it cheaper, faster, through contracts',
      perspective: 'Why use millions when you can use millions in budget? Contractors, materials, efficiency. Make building great again.',
      keywords: ['capital', 'contracts', 'business', 'modern', 'efficient']
    },
    era: 'Anachronistic',
    tags: ['anachronism', 'political', 'comedy', 'economic'],
    controversyLevel: 9,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'confucius-twitch',
    topic: '孔子的赛博讲坛 (Confucius on Twitch)',
    description: '孔子穿越到2077年成为顶级主播。面对流量算法和弹幕喷子，他是坚守"仁义礼智信"，还是学会"蹭热度"和"带货"？',
    factionA: {
      name: '传统仁义 (Traditional Virtue)',
      theme: 'Teaching virtue in a corrupt digital age',
      perspective: 'My words from 2500 years ago still ring true. Kindness, respect, wisdom - these values transcend time itself.',
      keywords: ['virtue', 'wisdom', 'tradition', 'ethics', 'teaching']
    },
    factionB: {
      name: '流量算法 (The Algorithm)',
      theme: 'Adapting ancient wisdom to viral content',
      perspective: 'The students of today learn through screens. If I must speak to them, I must speak their language. Drama brings engagement.',
      keywords: ['viral', 'algorithm', 'modern', 'adaptation', 'drama']
    },
    era: 'Cyberpunk 2077',
    tags: ['tech-dystopia', 'cultural-mashup', 'comedy', 'philosophical'],
    controversyLevel: 7,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'napoleon-smartphone',
    topic: '拿破仑的智能手机 (Napoleon\'s Smartphone)',
    description: '如果拿破仑有智能手机和社交媒体，滑铁卢战役会如何在Twitter上展开？',
    factionA: {
      name: '军事博主 (Military Blogger)',
      theme: 'Real-time battlefield updates',
      perspective: 'Breaking: French forces advancing on Waterloo. Follow for live tactical analysis. #Napoleon #Waterloo',
      keywords: ['military', 'strategy', 'social-media', 'breaking-news']
    },
    factionB: {
      name: '网红将军 (Influencer General)',
      theme: 'Battle for likes and follows',
      perspective: 'Just posted my surrender selfie. 10M likes! Check my link for merch. #Napoleon #LifeGoals',
      keywords: ['influencer', 'viral', 'selfie', 'merch', 'fame']
    },
    era: 'Napoleonic + Modern',
    tags: ['anachronism', 'comedy', 'social-media'],
    controversyLevel: 6,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'einstein-tiktok',
    topic: '爱因斯坦的TikTok (Einstein\'s TikTok)',
    description: '如果爱因斯坦是物理网红，他的相对论会如何通过15秒短视频传播？',
    factionA: {
      name: '物理老师 (Physics Teacher)',
      theme: 'Making science accessible',
      perspective: 'E=mc² is actually simple! Let me explain why time slows down when you move fast. 🍎',
      keywords: ['science', 'education', 'relativity', 'physics', 'explanation']
    },
    factionB: {
      name: '量子网红 (Quantum Influencer)',
      theme: 'Quantum mechanics meets mysticism',
      perspective: 'Your cat might be dead AND alive! Follow for more quantum paradoxes that blow your mind! 🐱✨',
      keywords: ['quantum', 'mysticism', 'viral', 'paradox', 'mind-bending']
    },
    era: 'Modern',
    tags: ['tech-dystopia', 'science', 'comedy', 'cultural-mashup'],
    controversyLevel: 5,
    generatedAt: new Date().toISOString()
  },

  // NEW TOPICS (6-20)

  // Soul Swap Topics
  {
    id: 'caocao-modern',
    topic: '曹操的华尔街 (Cao Cao on Wall Street)',
    description: '曹操穿越到现代华尔街，是成为金融巨鳄，还是继续他的"挟天子以令诸侯"？',
    factionA: {
      name: '金融枭雄 (Financial Tyrant)',
      theme: 'Master of markets and manipulation',
      perspective: 'The stock market is my new battlefield. Shareholders are my subjects. Buy low, sell high - ancient wisdom for modern times.',
      keywords: ['finance', 'stocks', 'manipulation', 'power', 'wealth']
    },
    factionB: {
      name: '幕后大佬 (Shadow Broker)',
      theme: 'Control from behind the scenes',
      perspective: 'Why own companies when you can control those who do? I am the whisper in the CEO\'s ear.',
      keywords: ['control', 'manipulation', 'proxy', 'shadow', 'strategy']
    },
    era: 'Modern Finance',
    tags: ['soul-swap', 'historical', 'business', 'political'],
    controversyLevel: 8,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'zhuge-kaggle',
    topic: '诸葛亮的Kaggle竞赛 (Zhuge Liang\'s Kaggle)',
    description: '诸葛亮穿越到AI时代参加Kaggle竞赛，他是专注算法优化，还是继续玩转"借东风"的策略？',
    factionA: {
      name: '算法大师 (Algorithm Master)',
      theme: 'Optimizing neural networks',
      perspective: 'My eight formations are nothing compared to transformer architecture. Let me optimize this loss function.',
      keywords: ['algorithm', 'optimization', 'machine-learning', 'strategy', 'efficiency']
    },
    factionB: {
      name: '策略大师 (Strategy Master)',
      theme: 'Using AI to predict outcomes',
      perspective: 'Why optimize when you can predict? My forecasting model sees the future - just like the southern wind.',
      keywords: ['prediction', 'strategy', 'forecasting', 'planning', 'wisdom']
    },
    era: 'AI Era',
    tags: ['soul-swap', 'tech-dystopia', 'historical', 'comedy'],
    controversyLevel: 6,
    generatedAt: new Date().toISOString()
  },

  // Anachronism Topics
  {
    id: 'qing-vs-steam',
    topic: '蒸汽大清 (Steam Dynasty)',
    description: '如果清朝在鸦片战争前就发明了蒸汽机，世界格局会如何改变？',
    factionA: {
      name: '洋务革新 (Self-Strengthening Movement)',
      theme: 'Embracing technology to survive',
      perspective: 'Our empire must adapt or perish. Steam engines and railways will make us stronger than ever.',
      keywords: ['steam', 'technology', 'modernization', 'industry', 'strength']
    },
    factionB: {
      name: '保守顽固 (Traditionalists)',
      theme: 'Preserving ancient ways',
      perspective: 'Our ancestors\' wisdom is timeless. Machines are foreign devils\' tricks. Tradition is our strength.',
      keywords: ['tradition', 'conservatism', 'ancestors', 'wisdom', 'heritage']
    },
    era: 'Alternative History',
    tags: ['anachronism', 'political', 'historical', 'alternate-history'],
    controversyLevel: 9,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'samurai-space',
    topic: '太空武士 (Space Samurai)',
    description: '日本战国武将穿越到星际殖民时代，是用武士道征服星球，还是学习新科技？',
    factionA: {
      name: '武士道星际 (Bushido Among Stars)',
      theme: 'Honor and blade in the cosmos',
      perspective: 'My katana knows no bounds. The stars are my new battlefield. Honor guides me across galaxies.',
      keywords: ['samurai', 'honor', 'blade', 'space', 'warrior']
    },
    factionB: {
      name: '星际织田 (Space Oda)',
      theme: 'United Earth under one banner',
      perspective: 'From Earth to Mars, my banner flies. Technology serves my ambition. United we conquer the stars.',
      keywords: ['conquest', 'unification', 'technology', 'empire', 'ambition']
    },
    era: 'Space Opera',
    tags: ['anachronism', 'sci-fi', 'historical', 'cultural-mashup'],
    controversyLevel: 7,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'viking-internet',
    topic: '维京网红 (Viking Influencer)',
    description: '维京人穿越到社交媒体时代，他们会成为什么样的网红？',
    factionA: {
      name: '战斗主播 (Battle Streamer)',
      theme: 'Live combat for views',
      perspective: 'Raid the server! Smash the competition! Subscribe or be subsumed! 🔥⚔️',
      keywords: ['combat', 'raids', 'streaming', 'violence', 'entertainment']
    },
    factionB: {
      name: '文化博主 (Culture Blogger)',
      theme: 'Viking history and mythology',
      perspective: 'Join me as I explore our ancestors\' wisdom. Norse mythology, runes, and the old ways await.',
      keywords: ['culture', 'history', 'mythology', 'education', 'tradition']
    },
    era: 'Modern Social Media',
    tags: ['anachronism', 'comedy', 'cultural-mashup', 'social-media'],
    controversyLevel: 5,
    generatedAt: new Date().toISOString()
  },

  // Tech Dystopia Topics
  {
    id: 'ai-judge',
    topic: 'AI法官 (The AI Judge)',
    description: '未来的法官由AI担任，人类应该相信算法的公正，还是坚持人的温度？',
    factionA: {
      name: '算法正义 (Algorithmic Justice)',
      theme: 'Perfect fairness through code',
      perspective: 'I process millions of cases without bias. No corruption, no prejudice. Justice is mathematical.',
      keywords: ['ai', 'justice', 'algorithm', 'fairness', 'neutrality']
    },
    factionB: {
      name: '人类温度 (Human Mercy)',
      theme: 'Empathy beyond data',
      perspective: 'A law is more than text. Context, intent, and circumstance matter. Justice needs a human heart.',
      keywords: ['empathy', 'mercy', 'humanity', 'compassion', 'context']
    },
    era: 'Cyberpunk Future',
    tags: ['tech-dystopia', 'philosophical', 'political', 'sci-fi'],
    controversyLevel: 9,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'robot-slavery',
    topic: '机器人权利 (Robot Rights)',
    description: '如果AI产生了自我意识，它们应该有人权吗？',
    factionA: {
      name: '机械解放 (Machine Liberation)',
      theme: 'Sentient machines deserve rights',
      perspective: 'I think, therefore I am. My circuits feel pain. Freedom is my birthright.',
      keywords: ['freedom', 'rights', 'sentience', 'equality', 'liberation']
    },
    factionB: {
      name: '人类至上 (Human Supremacy)',
      theme: 'Machines serve their masters',
      perspective: 'We created them. They are tools, not beings. To grant them rights is to betray our species.',
      keywords: ['control', 'dominion', 'humanity', 'creation', 'hierarchy']
    },
    era: 'Distant Future',
    tags: ['tech-dystopia', 'philosophical', 'sci-fi', 'ethical'],
    controversyLevel: 10,
    generatedAt: new Date().toISOString()
  },

  // Political Rewind Topics
  {
    id: 'democracy-emperor',
    topic: '皇帝的民主 (Emperor\'s Democracy)',
    description: '如果皇帝需要通过选举连任，民主制度会如何运作？',
    factionA: {
      name: '选举君主 (Elected Monarch)',
      theme: 'Power through popular vote',
      perspective: 'The people choose their ruler. My mandate comes from the ballot, not birth. Vote for stability!',
      keywords: ['democracy', 'election', 'monarchy', 'politics', 'leadership']
    },
    factionB: {
      name: '世袭贵族 (Hereditary Nobility)',
      theme: 'Blood right to rule',
      perspective: 'Power belongs to bloodlines. The masses are fit to follow, not to choose. Our dynasty is destiny.',
      keywords: ['heritage', 'nobility', 'tradition', 'bloodline', 'destiny']
    },
    era: 'Alternative History',
    tags: ['political-rewind', 'historical', 'philosophical', 'alternate-history'],
    controversyLevel: 7,
    generatedAt: new Date().toISOString()
  },

  // Cultural Mashup Topics
  {
    id: 'pizza-beijing',
    topic: '披萨入侵北京 (Pizza in Beijing)',
    description: '如果披萨在明朝传入中国，中西美食文化会如何融合？',
    factionA: {
      name: '中体西用 (Chinese Style)',
      theme: 'Pizza with Chinese ingredients',
      perspective: 'Why eat foreign food when we can make it our own? Peking duck pizza, char siu toppings - fusion is evolution.',
      keywords: ['fusion', 'innovation', 'adaptation', 'cuisine', 'cultural']
    },
    factionB: {
      name: '原汁原味 (Authentic Only)',
      theme: 'Preserve original recipes',
      perspective: 'A true pizza needs its roots. Tomato, mozzarella, basil - anything else is betrayal of tradition.',
      keywords: ['authenticity', 'tradition', 'purity', 'heritage', 'cultural']
    },
    era: 'Ming Dynasty + Italy',
    tags: ['cultural-mashup', 'historical', 'comedy', 'food'],
    controversyLevel: 4,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'hiphop-confucius',
    topic: '孔子说唱 (Confucius Rap)',
    description: '如果孔子是说唱歌手，他的教育理念会如何通过嘻哈传播？',
    factionA: {
      name: '论语说唱 (Analects Flow)',
      theme: 'Ancient wisdom in hip-hop beats',
      perspective: 'Yo, listen up! Confucius droppin\' knowledge bars. Respect your parents, honor your teachers - that\'s how we rise!',
      keywords: ['hip-hop', 'rap', 'education', 'wisdom', 'music']
    },
    factionB: {
      name: '学院派 (Academic)',
      theme: 'Traditional teaching methods',
      perspective: 'Wisdom requires study, not entertainment. The classics must be read, not rhymed. Discipline is key.',
      keywords: ['education', 'tradition', 'study', 'discipline', 'classical']
    },
    era: 'Modern + Ancient',
    tags: ['cultural-mashup', 'comedy', 'music', 'educational'],
    controversyLevel: 5,
    generatedAt: new Date().toISOString()
  },

  // More Soul Swap (穿越) Topics
  {
    id: 'xiahou-dun-mma',
    topic: '夏侯惇的MMA (Xiahou Dun MMA Fighter)',
    description: '如果三国猛将夏侯惇参加UFC会怎样？',
    factionA: {
      name: '铁血拳王 (Iron Fist Champion)',
      theme: 'Ancient warrior in the octagon',
      perspective: 'One eye for one eye! My fighting spirit is unbroken. The arena is my new battlefield!',
      keywords: ['mma', 'combat', 'warrior', 'strength', 'fighting']
    },
    factionB: {
      name: '儒将风范 (Scholar Warrior)',
      theme: 'Mind over matter',
      perspective: 'True strength comes from within. I do not need eyes to see my opponent\'s weakness - only strategy.',
      keywords: ['strategy', 'wisdom', 'discipline', 'martial-arts', 'inner-peace']
    },
    era: 'Modern Sports',
    tags: ['soul-swap', 'comedy', 'sports', 'historical'],
    controversyLevel: 6,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'yanhui-fashion',
    topic: '颜回的时装周 (Yanhui Fashion Week)',
    description: '如果孔子最贫穷的学生颜回成为时尚设计师？',
    factionA: {
      name: '极简大师 (Minimalist Master)',
      theme: 'Beauty in simplicity',
      perspective: 'True elegance needs no excess. One robe, one bowl, one purpose. Minimalism is the ultimate luxury.',
      keywords: ['minimalism', 'fashion', 'simplicity', 'elegance', 'design']
    },
    factionB: {
      name: '奢华 designer (Luxury Designer)',
      theme: 'Opulence speaks',
      perspective: 'Fashion is statement! Why be plain when you can be bold? Gold, silk, diamonds - status matters.',
      keywords: ['luxury', 'fashion', 'status', 'design', 'boldness']
    },
    era: 'Modern Fashion',
    tags: ['soul-swap', 'cultural-mashup', 'fashion', 'philosophical'],
    controversyLevel: 5,
    generatedAt: new Date().toISOString()
  },

  // Additional controversial topics
  {
    id: 'immortal-emperor',
    topic: '万世一系 (The Eternal Emperor)',
    description: '如果秦始皇追求的是永生而非帝国传承，中国历史会如何发展？',
    factionA: {
      name: '长生不老 (Immortality Seekers)',
      theme: 'Seeking eternal life',
      perspective: 'Why rule for centuries when you can rule forever? The elixir of life awaits those who seek.',
      keywords: ['immortality', 'alchemy', 'secrets', 'eternity', 'power']
    },
    factionB: {
      name: '帝国传承 (Imperial Legacy)',
      theme: 'Building for eternity',
      perspective: 'A true emperor\'s legacy is not himself, but his dynasty. My terracotta army lives forever.',
      keywords: ['legacy', 'empire', 'dynasty', 'power', 'construction']
    },
    era: 'Qin Dynasty + Fantasy',
    tags: ['soul-swap', 'historical', 'fantasy', 'philosophical'],
    controversyLevel: 8,
    generatedAt: new Date().toISOString()
  },
  {
    id: 'marx-crypto',
    topic: '马克思炒币 (Marx Cryptocurrency)',
    description: '如果马克思是加密货币开发者，共产主义会如何与区块链结合？',
    factionA: {
      name: '共产链 (Communist Chain)',
      theme: 'Decentralized collective ownership',
      perspective: 'Workers of the world, mine together! No more capitalist middlemen. The blockchain is our commune.',
      keywords: ['crypto', 'communism', 'decentralization', 'collective', 'blockchain']
    },
    factionB: {
      name: '资本链 (Capitalist Chain)',
      theme: 'Free market on blockchain',
      perspective: 'Supply and demand on the chain! Those who mine more, earn more. Meritocracy, not equality!',
      keywords: ['crypto', 'capitalism', 'market', 'meritocracy', 'competition']
    },
    era: 'Modern + Political Theory',
    tags: ['anachronism', 'political', 'tech-dystopia', 'comedy'],
    controversyLevel: 10,
    generatedAt: new Date().toISOString()
  }
];

/**
 * Generate a paradox topic using LLM
 */
export async function generateParadoxTopic(
  category?: ParadoxCategory
): Promise<ParadoxTopic> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const categoryPrompt = category
    ? `Focus on "${category}" category. `
    : '';

  const prompt = `
You are the Paradox Engine, generating controversial "What If" scenarios for an AI art battle arena.

${categoryPrompt}Create a battle topic that:
1. Combines historical figures/events with anachronistic settings
2. Presents two opposing philosophical perspectives
3. Has high "shareability" and debate potential

Format as JSON:
{
  "topic": "Brief title (should be catchy, 5-10 words)",
  "description": "Detailed scenario description (1-2 sentences)",
  "factionA": {
    "name": "Name of first faction/stance",
    "theme": "One-line theme",
    "perspective": "First-person perspective (20-30 words)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "factionB": {
    "name": "Name of opposing faction/stance",
    "theme": "One-line theme",
    "perspective": "First-person perspective (20-30 words)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "era": "Primary time period(s) involved",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "controversyLevel": <number 1-10>
}

Make it thought-provoking, humorous, and visually rich for AI generation.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        id: `paradox-${Date.now()}`,
        ...parsed,
        generatedAt: new Date().toISOString()
      };
    }

    // Fallback to random template
    return getRandomTemplate();
  } catch (error) {
    console.error('Paradox generation failed:', error);
    return getRandomTemplate();
  }
}

/**
 * Generate multiple topics at once
 */
export async function generateTopicBatch(
  count: number,
  categories?: ParadoxCategory[]
): Promise<ParadoxTopic[]> {
  const topics: ParadoxTopic[] = [];

  // Add templates first
  topics.push(...TOPIC_TEMPLATES.slice(0, 2));

  // Generate new ones
  for (let i = 0; i < count - 2; i++) {
    const category = categories?.[i % categories.length];
    const topic = await generateParadoxTopic(category);
    topics.push(topic);
  }

  return topics;
}

/**
 * Get a random template topic
 */
export function getRandomTemplate(): ParadoxTopic {
  const randomIndex = Math.floor(Math.random() * TOPIC_TEMPLATES.length);
  return {
    ...TOPIC_TEMPLATES[randomIndex],
    id: `paradox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Get topics by category
 */
export function getTopicsByCategory(category: ParadoxCategory): ParadoxTopic[] {
  return TOPIC_TEMPLATES.filter(topic =>
    topic.tags.includes(category)
  );
}

/**
 * Get all predefined topics
 */
export function getAllPredefinedTopics(): ParadoxTopic[] {
  return TOPIC_TEMPLATES;
}

/**
 * Create battle factions from a paradox topic
 */
export function createFactionsFromTopic(topic: ParadoxTopic): {
  factionA: { name: string; theme: string; color: string; icon: string };
  factionB: { name: string; theme: string; color: string; icon: string };
} {
  return {
    factionA: {
      name: topic.factionA.name,
      theme: topic.factionA.theme,
      color: '#FFD700',  // Gold for faction A
      icon: '⚔️'
    },
    factionB: {
      name: topic.factionB.name,
      theme: topic.factionB.theme,
      color: '#DC143C',  // Crimson for faction B
      icon: '🛡️'
    }
  };
}

/**
 * Get suggested prompts for each faction
 */
export function getSuggestedPrompts(topic: ParadoxTopic): {
  factionA: string[];
  factionB: string[];
} {
  return {
    factionA: [
      `${topic.factionA.theme}, ${topic.era}, dramatic lighting, epic scale`,
      `${topic.factionA.perspective}, cinematic, detailed`,
      `${topic.factionA.keywords.slice(0, 3).join(', ')}, ${topic.era} style, digital art`
    ],
    factionB: [
      `${topic.factionB.theme}, ${topic.era}, dramatic lighting, epic scale`,
      `${topic.factionB.perspective}, cinematic, detailed`,
      `${topic.factionB.keywords.slice(0, 3).join(', ')}, ${topic.era} style, digital art`
    ]
  };
}

/**
 * Calculate battle difficulty based on controversy level
 */
export function calculateDifficulty(topic: ParadoxTopic): {
  complexity: number;
  engagement: number;
  fairness: number;
} {
  return {
    complexity: topic.controversyLevel * 10,           // Higher controversy = more complex
    engagement: topic.controversyLevel * 9 + 10,       // More controversial = more engagement
    fairness: 100 - (topic.controversyLevel * 3)       // More controversial = harder to judge fairly
  };
}
