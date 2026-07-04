import { DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX } from '@/components/world/lighting/domains/definingWorldPlazaLightingEngineConstants';
import { Texture } from 'pixi.js';

/**
 * Soft white radial gradient baked once for lightmap erase holes.
 *
 * Drawn with a 2D canvas so no renderer is needed; the alpha falloff is what
 * the erase blend uses to carve darkness.
 *
 * @module components/world/lighting/domains/creatingWorldPlazaLightingRadialBakedTexture
 */

let cachedRadialTexture: Texture | null = null;

/**
 * Returns the cached soft radial light texture, baking it on first use.
 */
export function resolvingWorldPlazaLightingRadialBakedTexture(): Texture {
  if (cachedRadialTexture) {
    return cachedRadialTexture;
  }

  const size = DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');

  if (!context) {
    cachedRadialTexture = Texture.WHITE;
    return cachedRadialTexture;
  }

  const half = size / 2;
  const gradient = context.createRadialGradient(
    half,
    half,
    0,
    half,
    half,
    half,
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.32)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  cachedRadialTexture = Texture.from(canvas);

  return cachedRadialTexture;
}
