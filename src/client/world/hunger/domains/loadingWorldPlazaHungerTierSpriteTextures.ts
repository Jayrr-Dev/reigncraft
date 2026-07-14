/**
 * Loads and caches plaza hunger-tier drumstick textures for Pixi overlays.
 *
 * @module components/world/hunger/domains/loadingWorldPlazaHungerTierSpriteTextures
 */

import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_COLUMN_INDEX,
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerTierSpriteSheetConstants';
import { Assets, Rectangle, Texture } from 'pixi.js';

const hungerTierTextureCache = new Map<
  DefiningWorldPlazaHungerTier,
  Texture
>();
let loadPromise: Promise<void> | null = null;

function slicingWorldPlazaHungerTierSheetIntoTextures(
  sheetTexture: Texture
): void {
  const columnCount = DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_COLUMN_COUNT;
  const frameWidth = Math.floor(sheetTexture.width / columnCount);
  const frameHeight = sheetTexture.height;

  for (const [tier, columnIndex] of Object.entries(
    DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_COLUMN_INDEX
  ) as readonly [DefiningWorldPlazaHungerTier, number][]) {
    hungerTierTextureCache.set(
      tier,
      new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          columnIndex * frameWidth,
          0,
          frameWidth,
          frameHeight
        ),
      })
    );
  }
}

/**
 * Ensures hunger-tier sprite cells are decoded and cached.
 */
export function ensuringWorldPlazaHungerTierSpriteTexturesLoaded(): Promise<void> {
  if (hungerTierTextureCache.size > 0) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const loadedTexture = await Assets.load<Texture>(
      DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL
    );

    if (!(loadedTexture instanceof Texture)) {
      throw new Error(
        `Hunger tier sheet ${DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL} did not load as a Texture.`
      );
    }

    slicingWorldPlazaHungerTierSheetIntoTextures(loadedTexture);
  })().catch((error: unknown) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

/**
 * Returns a cached hunger-tier drumstick texture, or null before preload.
 */
export function peekingWorldPlazaHungerTierSpriteTexture(
  tier: DefiningWorldPlazaHungerTier
): Texture | null {
  return hungerTierTextureCache.get(tier) ?? null;
}
