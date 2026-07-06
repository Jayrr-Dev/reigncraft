/**
 * Lazy per-species texture loader for wildlife sprite sheets.
 *
 * @module components/world/wildlife/domains/loadingWildlifeSpeciesTextures
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirectionTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import {
  buildingWildlifeMotionSheetUrl,
  DEFINING_WILDLIFE_DIRECTION_ROW_INDEX,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import { Assets, Rectangle, Texture } from 'pixi.js';

/** Loaded direction row textures for one motion clip. */
export type DefiningWildlifeMotionDirectionTextures =
  DefiningWorldPlazaGirlSampleWalkDirectionTextures;

/** All motion clips loaded for one species. */
export type DefiningWildlifeSpeciesTextures = Record<
  DefiningWildlifeMotionClipKind,
  DefiningWildlifeMotionDirectionTextures
>;

const DEFINING_WILDLIFE_MOTION_CLIP_KINDS_LIST: readonly DefiningWildlifeMotionClipKind[] =
  ['idle', 'walk', 'run', 'attack', 'takeDamage', 'die'];

const loadingWildlifeSpeciesTexturesCache = new Map<
  string,
  Promise<DefiningWildlifeSpeciesTextures>
>();

function slicingWildlifeSheetIntoDirectionTextures(
  sheetTexture: Texture,
  frameSizePx: number
): DefiningWildlifeMotionDirectionTextures {
  const sheetRowWidthPx = 15 * frameSizePx;

  const directionEntries = Object.entries(
    DEFINING_WILDLIFE_DIRECTION_ROW_INDEX
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * frameSizePx,
          sheetRowWidthPx,
          frameSizePx
        ),
      });

      return [direction, rowTexture] as const;
    }
  );

  return Object.fromEntries(
    directionTextureEntries
  ) as DefiningWildlifeMotionDirectionTextures;
}

async function loadingWildlifeMotionDirectionTextures(
  species: DefiningWildlifeSpeciesDefinition,
  motionKind: DefiningWildlifeMotionClipKind
): Promise<DefiningWildlifeMotionDirectionTextures> {
  const sheetUrl = buildingWildlifeMotionSheetUrl(
    species.spriteFolder,
    motionKind
  );
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Wildlife sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWildlifeSheetIntoDirectionTextures(
    loadedTexture,
    species.frameSizePx
  );
}

/**
 * Loads all motion direction textures for one species (cached).
 */
export function loadingWildlifeSpeciesTextures(
  species: DefiningWildlifeSpeciesDefinition
): Promise<DefiningWildlifeSpeciesTextures> {
  const cacheKey = species.speciesId;
  const cached = loadingWildlifeSpeciesTexturesCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const loadingPromise =
    (async (): Promise<DefiningWildlifeSpeciesTextures> => {
      const motionEntries = await Promise.all(
        DEFINING_WILDLIFE_MOTION_CLIP_KINDS_LIST.map(async (motionKind) => {
          const textures = await loadingWildlifeMotionDirectionTextures(
            species,
            motionKind
          );

          return [motionKind, textures] as const;
        })
      );

      return Object.fromEntries(
        motionEntries
      ) as DefiningWildlifeSpeciesTextures;
    })();

  loadingWildlifeSpeciesTexturesCache.set(cacheKey, loadingPromise);

  return loadingPromise;
}

/** Clears the texture cache (tests only). */
export function clearingWildlifeSpeciesTexturesCacheForTests(): void {
  loadingWildlifeSpeciesTexturesCache.clear();
}

// Re-export for internal use in sprite layout
export { DEFINING_WILDLIFE_MOTION_CLIP_KINDS_LIST as DEFINING_WILDLIFE_MOTION_CLIP_KINDS };
