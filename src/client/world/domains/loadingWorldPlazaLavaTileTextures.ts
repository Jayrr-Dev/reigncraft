import {
  LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL,
  registeringWorldPlazaLavaStaticTileTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads the static Firelands lava floor texture.
 *
 * @module components/world/domains/loadingWorldPlazaLavaTileTextures
 */

export { LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL };

/**
 * Returns cached static lava tile texture when preload has populated the cache.
 */
export function peekingWorldPlazaLavaStaticTileTexture(): Texture | null {
  return registeringWorldPlazaLavaStaticTileTextureLoader.peek();
}

/**
 * Preloads and caches the static lava floor texture.
 */
export async function preloadingWorldPlazaLavaTileTextures(): Promise<Texture> {
  return registeringWorldPlazaLavaStaticTileTextureLoader.preload();
}
