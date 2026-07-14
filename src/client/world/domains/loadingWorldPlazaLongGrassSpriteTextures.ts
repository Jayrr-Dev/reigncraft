import { peekingWorldPlazaLongGrassSpriteTextureForUrlFromManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import {
  registeringWorldPlazaLongGrassSpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads and caches long-grass sprite textures from public assets.
 *
 * @module components/world/domains/loadingWorldPlazaLongGrassSpriteTextures
 */

export function peekingWorldPlazaLongGrassSpriteTextures(): Readonly<
  Record<string, Texture>
> | null {
  return registeringWorldPlazaLongGrassSpriteTextureLoader.peek();
}

export function peekingWorldPlazaLongGrassSpriteTextureForUrl(
  spriteUrl: string
): Texture | null {
  return peekingWorldPlazaLongGrassSpriteTextureForUrlFromManifest(spriteUrl);
}

export async function preloadingWorldPlazaLongGrassSpriteTextures(): Promise<
  Readonly<Record<string, Texture>>
> {
  return registeringWorldPlazaLongGrassSpriteTextureLoader.preload();
}
