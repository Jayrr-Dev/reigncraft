import type { DefiningWorldPlazaFirelandsPropKind } from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import {
  peekingWorldPlazaFirelandsSpriteTextureForPropFromManifest,
  registeringWorldPlazaFirelandsSpriteTextureLoader,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Texture } from 'pixi.js';

/**
 * Loads and caches Firelands biome sprite textures from public assets.
 *
 * @module components/world/domains/loadingWorldPlazaFirelandsSpriteTextures
 */

/**
 * Returns cached Firelands textures when preload has already populated the cache.
 */
export function peekingWorldPlazaFirelandsSpriteTextures(): Readonly<
  Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>
> | null {
  return registeringWorldPlazaFirelandsSpriteTextureLoader.peek();
}

/**
 * Resolves one cached texture for a prop kind and variant index.
 *
 * @param kind - Prop kind.
 * @param variantIndex - Zero-based variant index.
 */
export function peekingWorldPlazaFirelandsSpriteTextureForProp(
  kind: DefiningWorldPlazaFirelandsPropKind,
  variantIndex: number
): Texture | null {
  return peekingWorldPlazaFirelandsSpriteTextureForPropFromManifest(
    kind,
    variantIndex
  );
}

/**
 * Preloads and caches all Firelands sprite textures.
 */
export async function preloadingWorldPlazaFirelandsSpriteTextures(): Promise<
  Readonly<Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>>
> {
  return registeringWorldPlazaFirelandsSpriteTextureLoader.preload();
}
