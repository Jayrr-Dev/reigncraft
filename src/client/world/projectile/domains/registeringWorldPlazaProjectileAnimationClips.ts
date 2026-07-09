import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { Texture } from 'pixi.js';

/**
 * Placeholder projectile animation clips (solid-color circles via generated textures).
 *
 * @module components/world/projectile/domains/registeringWorldPlazaProjectileAnimationClips
 */

const projectileClipTextureCache = new Map<number, Texture>();

function creatingWorldPlazaProjectilePlaceholderTexture(
  tint: number,
  radiusPx: number
): Texture {
  const cacheKey = tint * 1000 + radiusPx;
  const cached = projectileClipTextureCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement('canvas');
  const diameter = radiusPx * 2;
  canvas.width = diameter;
  canvas.height = diameter;
  const context = canvas.getContext('2d');
  if (context) {
    const red = (tint >> 16) & 0xff;
    const green = (tint >> 8) & 0xff;
    const blue = tint & 0xff;
    context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    context.beginPath();
    context.arc(radiusPx, radiusPx, radiusPx - 1, 0, Math.PI * 2);
    context.fill();
  }

  const texture = Texture.from(canvas);
  projectileClipTextureCache.set(cacheKey, texture);
  return texture;
}

function registeringWorldPlazaProjectilePlaceholderClip(
  clipId: string,
  tint: number,
  radiusPx: number
): void {
  registeringWorldPlazaAnimationClip({
    clipId,
    resolveFrames: () => [
      creatingWorldPlazaProjectilePlaceholderTexture(tint, radiusPx),
    ],
    fps: 1,
    playbackMode: 'hold-last',
  });
}

let hasRegisteredWorldPlazaProjectileAnimationClips = false;

/**
 * Registers placeholder projectile clips once at module load.
 */
export function registeringWorldPlazaProjectileAnimationClips(): void {
  if (hasRegisteredWorldPlazaProjectileAnimationClips) {
    return;
  }

  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-arrow',
    0xc8b496,
    6
  );
  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-magic-orb',
    0x9b6bff,
    10
  );
  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-fireball',
    0xff7a2f,
    14
  );
  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-meteor',
    0xff4d00,
    16
  );
  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-cluster',
    0x66e0ff,
    12
  );
  registeringWorldPlazaProjectilePlaceholderClip(
    'projectile-gravity-ball',
    0x3d8bff,
    16
  );
  hasRegisteredWorldPlazaProjectileAnimationClips = true;
}

registeringWorldPlazaProjectileAnimationClips();
