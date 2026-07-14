import {
  peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrlFromManifest,
  registeringWorldPlazaBlacksmithUtilitySpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads blacksmith utility world sprites from the terrain texture manifest.
 *
 * @module components/world/building/domains/loadingWorldPlazaBlacksmithUtilitySpriteTextures
 */

export function peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl(
  spriteUrl: string
): Texture | null {
  return peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrlFromManifest(
    spriteUrl
  );
}

export async function preloadingWorldPlazaBlacksmithUtilitySpriteTextures(): Promise<
  Readonly<Record<string, Texture>>
> {
  return registeringWorldPlazaBlacksmithUtilitySpriteTextureLoader.preload();
}
