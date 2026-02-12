/**
 * Prompt Engineering Templates for TimePics.ai
 * Enhances user prompts based on selected engine and era
 */

export type Engine = 'rewind' | 'refract' | 'foresee';
export type Era = '1900s' | '1920s' | '1950s' | '1980s' | '2000s' | '2050s' | 'realistic';

interface PromptEnhancement {
  prefix: string;
  suffix: string;
  negativePrompt: string;
}

/**
 * Engine-specific prompt enhancements
 */
export const ENGINE_PROMPTS: Record<Engine, PromptEnhancement> = {
  rewind: {
    prefix: 'Vintage photograph, restored and enhanced, high-quality scan, nostalgic atmosphere,',
    suffix: 'film grain, authentic period detail, photorealistic restoration, masterful color grading, archival quality',
    negativePrompt: 'modern elements, digital artifacts, over-processed, fake looking, anachronistic, blurry, low quality'
  },
  refract: {
    prefix: 'Alternate history photograph, parallel universe, historically accurate but divergent,',
    suffix: 'photorealistic, museum quality, authentic period details, documentary style, compelling alternate timeline',
    negativePrompt: 'fantasy, cartoonish, unrealistic, anachronistic, modern elements, CGI look, fake'
  },
  foresee: {
    prefix: 'Futuristic vision, advanced technology, year 2050 aesthetic, sci-fi but plausible,',
    suffix: 'photorealistic future scene, innovative design, cutting-edge technology, believable future evolution, high-tech atmosphere',
    negativePrompt: 'retro, vintage, outdated, current technology, unrealistic sci-fi, cartoonish, low quality'
  }
};

/**
 * Era-specific style modifiers
 */
export const ERA_STYLES: Record<Era, string> = {
  '1900s': 'early 1900s photography style, sepia tone, daguerreotype quality, Victorian era aesthetics, formal poses',
  '1920s': '1920s flapper era, art deco influence, black and white photography, jazz age atmosphere, elegant styling',
  '1950s': '1950s Americana, Kodachrome color, mid-century modern, optimistic post-war aesthetic, classic family photos',
  '1980s': '1980s aesthetic, vibrant colors, synthwave undertones, retro fashion, analog photography feel',
  '2000s': 'early 2000s digital photography, Y2K aesthetic, modern but nostalgic, consumer digital camera quality',
  '2050s': 'year 2050 futuristic style, advanced holographic quality, next-generation technology, sleek minimalist design',
  'realistic': 'photorealistic, modern high-quality photography, professional camera, natural lighting, authentic detail'
};

/**
 * Quality enhancement keywords
 */
export const QUALITY_MODIFIERS = {
  standard: 'high quality, detailed, professional',
  hd: '8K resolution, ultra detailed, masterpiece, award-winning photography, professional grade, exceptional clarity'
};

/**
 * Aspect ratio descriptions for better composition
 */
export const ASPECT_RATIO_HINTS: Record<string, string> = {
  '1:1': 'square composition, centered subject, Instagram format',
  '16:9': 'widescreen landscape, cinematic framing, horizontal composition',
  '9:16': 'vertical portrait orientation, mobile-first format, story format',
  '4:3': 'classic photograph ratio, balanced composition',
  '3:4': 'portrait orientation, traditional photo format'
};

/**
 * Enhance user prompt with engine, era, and quality modifiers
 */
export function enhancePrompt(params: {
  userPrompt: string;
  engine: Engine;
  era?: Era;
  quality?: 'standard' | 'hd';
  aspectRatio?: string;
}): { prompt: string; negativePrompt: string } {
  const { userPrompt, engine, era, quality = 'standard', aspectRatio } = params;

  const engineEnhancement = ENGINE_PROMPTS[engine];
  const eraStyle = era ? ERA_STYLES[era] : '';
  const qualityMod = QUALITY_MODIFIERS[quality];
  const aspectHint = aspectRatio ? ASPECT_RATIO_HINTS[aspectRatio] || '' : '';

  // Construct enhanced prompt
  const prompt = [
    engineEnhancement.prefix,
    userPrompt,
    eraStyle,
    aspectHint,
    qualityMod,
    engineEnhancement.suffix
  ]
    .filter(Boolean)
    .join(', ')
    .replace(/,\s*,/g, ',') // Remove duplicate commas
    .trim();

  return {
    prompt,
    negativePrompt: engineEnhancement.negativePrompt
  };
}

/**
 * Generate suggestions based on engine
 */
export function getPromptSuggestions(engine: Engine): string[] {
  const suggestions: Record<Engine, string[]> = {
    rewind: [
      'My grandparents\' wedding day in 1950',
      'Family reunion at the old house',
      'Vintage car on a dusty road',
      'Children playing in the 1960s neighborhood',
      'Old family portrait from 1920s'
    ],
    refract: [
      'What if the Roman Empire never fell',
      'Steampunk Victorian London with airships',
      'World where dinosaurs never went extinct',
      'Tesla winning the electricity war',
      'Ancient Egypt with advanced technology'
    ],
    foresee: [
      'Me at age 70 in the year 2065',
      'Future city with flying vehicles',
      'Climate-adapted architecture in 2050',
      'Personal AI companion robot',
      'Holographic family gathering in 2060'
    ]
  };

  return suggestions[engine];
}

/**
 * Validate and clean user prompt
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }

  if (prompt.length > 1000) {
    return { valid: false, error: 'Prompt too long (max 1000 characters)' };
  }

  // Check for inappropriate content markers
  const inappropriateKeywords = ['nsfw', 'nude', 'explicit', 'violence', 'gore'];
  const lowerPrompt = prompt.toLowerCase();
  const hasInappropriate = inappropriateKeywords.some(keyword => lowerPrompt.includes(keyword));

  if (hasInappropriate) {
    return { valid: false, error: 'Prompt contains inappropriate content' };
  }

  return { valid: true };
}
