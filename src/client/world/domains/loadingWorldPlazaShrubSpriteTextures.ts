import {
  peekingWorldPlazaShrubSpriteTextureForUrlFromManifest,
  registeringWorldPlazaShrubSpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads and caches berry-shrub sprite textures from public assets.
 *
 * @module components/world/domains/loadingWorldPlazaShrubSpriteTextures
 */

export function peekingWorldPlazaShrubSpriteTextures(): Readonly<
  Record<string, Texture>
> | null {
  return registeringWorldPlazaShrubSpriteTextureLoader.peek();
}

export function peekingWorldPlazaShrubSpriteTextureForUrl(
  spriteUrl: string
): Texture | null {
  return peekingWorldPlazaShrubSpriteTextureForUrlFromManifest(spriteUrl);
}

export async function preloadingWorldPlazaShrubSpriteTextures(): Promise<
  Readonly<Record<string, Texture>>
> {
  return registeringWorldPlazaShrubSpriteTextureLoader.preload();
}
