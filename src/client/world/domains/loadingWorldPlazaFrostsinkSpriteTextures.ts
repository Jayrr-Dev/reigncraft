import type { DefiningWorldPlazaFrostsinkPropKind } from '@/components/world/domains/resolvingWorldPlazaFrostsinkPropAtTileIndex';
import {
  peekingWorldPlazaFrostsinkSpriteTextureForPropFromManifest,
  registeringWorldPlazaFrostsinkSpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads and caches Frostsink biome sprite textures from public assets.
 *
 * @module components/world/domains/loadingWorldPlazaFrostsinkSpriteTextures
 */

/**
 * Returns cached Frostsink textures when preload has already populated the cache.
 */
export function peekingWorldPlazaFrostsinkSpriteTextures(): Readonly<
  Record<DefiningWorldPlazaFrostsinkPropKind, readonly Texture[]>
> | null {
  return registeringWorldPlazaFrostsinkSpriteTextureLoader.peek();
}

/**
 * Resolves one cached texture for a prop kind and variant index.
 *
 * @param kind - Prop kind.
 * @param variantIndex - Zero-based variant index.
 */
export function peekingWorldPlazaFrostsinkSpriteTextureForProp(
  kind: DefiningWorldPlazaFrostsinkPropKind,
  variantIndex: number
): Texture | null {
  return peekingWorldPlazaFrostsinkSpriteTextureForPropFromManifest(
    kind,
    variantIndex
  );
}

/**
 * Preloads and caches all Frostsink sprite textures.
 */
export async function preloadingWorldPlazaFrostsinkSpriteTextures(): Promise<
  Readonly<Record<DefiningWorldPlazaFrostsinkPropKind, readonly Texture[]>>
> {
  return registeringWorldPlazaFrostsinkSpriteTextureLoader.preload();
}
