/**
 * Image Processing Service for Battle NFT Effects
 * Handles visual effects for Canonical/Paradox/Genesis NFTs
 */

import sharp from 'sharp';
import { uploadImageToIPFS } from './ipfs';

export type EffectType = 'canonical' | 'paradox' | 'genesis' | 'rogue';

export interface EffectResult {
  imageUrl: string;      // Final image URL (IPFS)
  imageCID: string;      // IPFS CID
  effectApplied: EffectType;
}

/**
 * Apply Canonical (Victory) Effect
 * Golden holographic border + saturation boost + sharpen
 */
export async function applyCanonicalEffect(imageBuffer: Buffer): Promise<EffectResult> {
  const width = 1024;
  const height = 1024;
  const borderWidth = 20;

  try {
    // Resize and enhance the image
    const enhancedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .sharpen({ sigma: 1.5 })
      .modulate({ saturation: 1.3 })
      .toBuffer();

    // Add golden border using extend
    const result = await sharp(enhancedImage)
      .extend({
        top: borderWidth,
        bottom: borderWidth,
        left: borderWidth,
        right: borderWidth,
        background: { r: 255, g: 215, b: 0, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Upload to IPFS
    const cid = await uploadImageToIPFS(result, `canonical_${Date.now()}.png`);

    return {
      imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      imageCID: cid,
      effectApplied: 'canonical'
    };
  } catch (error) {
    console.error('Failed to apply canonical effect:', error);
    return createEffectPlaceholder('Canonical', 'canonical');
  }
}

/**
 * Apply Paradox (Defeat) Effect
 * Grayscale + cold tone + dark cracked-style border
 */
export async function applyParadoxEffect(imageBuffer: Buffer): Promise<EffectResult> {
  const width = 1024;
  const height = 1024;

  try {
    // Apply grayscale and cold tone
    const processedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .grayscale()
      .modulate({ saturation: 0.5, brightness: 0.9 })
      .toBuffer();

    // Add dark cracked-style border
    const result = await sharp(processedImage)
      .extend({
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
        background: { r: 60, g: 60, b: 70, alpha: 1 }
      })
      .modulate({ brightness: 0.85 })
      .png()
      .toBuffer();

    // Upload to IPFS
    const cid = await uploadImageToIPFS(result, `paradox_${Date.now()}.png`);

    return {
      imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      imageCID: cid,
      effectApplied: 'paradox'
    };
  } catch (error) {
    console.error('Failed to apply paradox effect:', error);
    return createEffectPlaceholder('Paradox', 'paradox');
  }
}

/**
 * Apply Genesis (Legendary) Effect
 * Holographic shimmer + divine glow + special badge
 */
export async function applyGenesisEffect(imageBuffer: Buffer): Promise<EffectResult> {
  const width = 1024;
  const height = 1024;

  try {
    // Resize and enhance
    const baseImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .sharpen({ sigma: 2 })
      .modulate({ saturation: 1.4, brightness: 1.1 })
      .toBuffer();

    // Create premium golden border
    const borderWidth = 30;
    const result = await sharp(baseImage)
      .extend({
        top: borderWidth,
        bottom: borderWidth,
        left: borderWidth,
        right: borderWidth,
        background: { r: 218, g: 165, b: 32, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Upload to IPFS
    const cid = await uploadImageToIPFS(result, `genesis_${Date.now()}.png`);

    return {
      imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      imageCID: cid,
      effectApplied: 'genesis'
    };
  } catch (error) {
    console.error('Failed to apply genesis effect:', error);
    return createEffectPlaceholder('Genesis', 'genesis');
  }
}

/**
 * Apply Rogue Agent Effect
 * Red warning border + chaos overlay
 */
export async function applyRogueEffect(imageBuffer: Buffer): Promise<EffectResult> {
  const width = 1024;
  const height = 1024;

  try {
    // Resize
    const baseImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .modulate({ saturation: 1.2 })
      .toBuffer();

    // Add red warning border
    const borderWidth = 15;
    const result = await sharp(baseImage)
      .extend({
        top: borderWidth,
        bottom: borderWidth,
        left: borderWidth,
        right: borderWidth,
        background: { r: 220, g: 20, b: 60, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Upload to IPFS
    const cid = await uploadImageToIPFS(result, `rogue_${Date.now()}.png`);

    return {
      imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      imageCID: cid,
      effectApplied: 'rogue'
    };
  } catch (error) {
    console.error('Failed to apply rogue effect:', error);
    return createEffectPlaceholder('Rogue', 'rogue');
  }
}

/**
 * Apply battle effect based on outcome
 */
export async function applyBattleEffect(
  imageBuffer: Buffer,
  effectType: EffectType
): Promise<EffectResult> {
  switch (effectType) {
    case 'canonical':
      return applyCanonicalEffect(imageBuffer);
    case 'paradox':
      return applyParadoxEffect(imageBuffer);
    case 'genesis':
      return applyGenesisEffect(imageBuffer);
    case 'rogue':
      return applyRogueEffect(imageBuffer);
    default:
      throw new Error(`Unknown effect type: ${effectType}`);
  }
}

/**
 * Get placeholder effect image (for testing without real image generation)
 */
export async function createEffectPlaceholder(
  text: string,
  effectType: EffectType
): Promise<EffectResult> {
  const width = 600;
  const height = 600;

  // Background colors based on effect
  const bgColors: Record<EffectType, { r: number; g: number; b: number }> = {
    canonical: { r: 45, g: 35, b: 20 },
    paradox: { r: 30, g: 30, b: 40 },
    genesis: { r: 60, g: 50, b: 30 },
    rogue: { r: 60, g: 10, b: 20 }
  };

  const bg = bgColors[effectType];

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}"
            fill="none"
            stroke="${effectType === 'canonical' ? 'gold' : effectType === 'paradox' ? '#888' : effectType === 'genesis' ? '#ffd700' : 'red'}"
            stroke-width="${effectType === 'rogue' ? 5 : 3}"
            stroke-dasharray="${effectType === 'paradox' ? '10,5' : 'none'}"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="monospace" font-size="24">
        ${effectType.toUpperCase()}
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="#ccc" font-family="monospace" font-size="14">
        ${text}
      </text>
      ${effectType === 'rogue' ? '<text x="50%" y="70%" text-anchor="middle" fill="red" font-family="monospace" font-size="12">ROGUE AGENT</text>' : ''}
      ${effectType === 'genesis' ? '<text x="50%" y="70%" text-anchor="middle" fill="gold" font-family="monospace" font-size="12">LEGENDARY</text>' : ''}
    </svg>
  `;

  const imageBuffer = Buffer.from(svg);
  const result = await sharp(imageBuffer).png().toBuffer();

  // Upload to IPFS
  const cid = await uploadImageToIPFS(result, `${effectType}_${Date.now()}.png`);

  return {
    imageUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    imageCID: cid,
    effectApplied: effectType
  };
}
