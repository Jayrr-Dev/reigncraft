/**
 * Loads and caches world mushroom sprite-sheet cell textures.
 *
 * @module components/world/mushrooms/domains/loadingWorldPlazaMushroomSpriteTextures
 */

import {
  peekingWorldPlazaMushroomSpriteTextureForSpeciesIndexFromManifest,
  registeringWorldPlazaMushroomSpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

export function peekingWorldPlazaMushroomSpriteTextures(): readonly Texture[] | null {
  return registeringWorldPlazaMushroomSpriteTextureLoader.peek();
}

export function peekingWorldPlazaMushroomSpriteTextureForSpeciesIndex(
  speciesIndex: number
): Texture | null {
  return peekingWorldPlazaMushroomSpriteTextureForSpeciesIndexFromManifest(
    speciesIndex
  );
}

export async function preloadingWorldPlazaMushroomSpriteTextures(): Promise<
  readonly Texture[]
> {
  return registeringWorldPlazaMushroomSpriteTextureLoader.preload();
}
