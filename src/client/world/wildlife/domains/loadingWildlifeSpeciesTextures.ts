/**
 * Lazy per-species texture loader for wildlife sprite sheets.
 *
 * Frame size is derived from each sheet's real dimensions (width / 15
 * columns, height / 8 direction rows) because the pack ships different
 * frame sizes per species (64, 74, 84, 96, 118, 124, 128...).
 *
 * @module components/world/wildlife/domains/loadingWildlifeSpeciesTextures
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirectionTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import {
  DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS,
  type DefiningWildlifeExtendedMotionClipKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeLoadedMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_ASSET_BASE_URL,
  DEFINING_WILDLIFE_DIRECTION_ROW_INDEX,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  DEFINING_WILDLIFE_SHEET_ROW_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import { Assets, Rectangle, Texture } from 'pixi.js';

/** Loaded direction row textures for one motion clip. */
export type DefiningWildlifeMotionDirectionTextures =
  DefiningWorldPlazaGirlSampleWalkDirectionTextures;

/** One loaded motion sheet with its derived frame size. */
export type DefiningWildlifeMotionSheet = {
  directionTextures: DefiningWildlifeMotionDirectionTextures;
  frameWidthPx: number;
  frameHeightPx: number;
};

/** All motion sheets loaded from disk for one species. */
export type DefiningWildlifeSpeciesTextures = Record<
  DefiningWildlifeLoadedMotionClipKind,
  DefiningWildlifeMotionSheet
> &
  Partial<
    Record<DefiningWildlifeExtendedMotionClipKind, DefiningWildlifeMotionSheet>
  >;

const DEFINING_WILDLIFE_MOTION_CLIP_KINDS_LIST: readonly DefiningWildlifeLoadedMotionClipKind[] =
  ['idle', 'walk', 'run', 'attack', 'takeDamage', 'die'];

const loadingWildlifeSpeciesTexturesCache = new Map<
  string,
  Promise<DefiningWildlifeSpeciesTextures>
>();

const loadingWildlifeSpeciesTexturesResolved = new Map<
  string,
  DefiningWildlifeSpeciesTextures
>();

function slicingWildlifeSheetIntoDirectionRows(
  sheetTexture: Texture
): DefiningWildlifeMotionSheet {
  const frameWidthPx = Math.floor(
    sheetTexture.source.width / DEFINING_WILDLIFE_SHEET_COLUMN_COUNT
  );
  const frameHeightPx = Math.floor(
    sheetTexture.source.height / DEFINING_WILDLIFE_SHEET_ROW_COUNT
  );

  const directionEntries = Object.entries(
    DEFINING_WILDLIFE_DIRECTION_ROW_INDEX
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * frameHeightPx,
          frameWidthPx * DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
          frameHeightPx
        ),
      });

      return [direction, rowTexture] as const;
    }
  );

  return {
    directionTextures: Object.fromEntries(
      directionTextureEntries
    ) as DefiningWildlifeMotionDirectionTextures,
    frameWidthPx,
    frameHeightPx,
  };
}

async function loadingWildlifeSheetWithFallback(
  sheetUrls: readonly string[]
): Promise<Texture> {
  let lastError: unknown = null;

  for (const sheetUrl of sheetUrls) {
    try {
      const loadedTexture = await Assets.load<Texture>(sheetUrl);

      if (loadedTexture instanceof Texture) {
        return loadedTexture;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `Wildlife sheets failed to load: ${sheetUrls.join(', ')} (${String(lastError)})`
  );
}

async function loadingWildlifeMotionSheet(
  species: DefiningWildlifeSpeciesDefinition,
  motionKind: DefiningWildlifeLoadedMotionClipKind
): Promise<DefiningWildlifeMotionSheet> {
  const sheetUrls = buildingWildlifeMotionSheetUrls(
    species.spriteFolder,
    motionKind,
    species.speciesId
  );
  const loadedTexture = await loadingWildlifeSheetWithFallback(sheetUrls);

  return slicingWildlifeSheetIntoDirectionRows(loadedTexture);
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
          const sheet = await loadingWildlifeMotionSheet(species, motionKind);

          return [motionKind, sheet] as const;
        })
      );
      const extendedClipSheets =
        DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS[
          species.speciesId
        ] ?? {};
      const extendedEntries = await Promise.all(
        (
          Object.entries(extendedClipSheets) as Array<
            [DefiningWildlifeExtendedMotionClipKind, readonly string[]]
          >
        ).map(async ([motionKind, sheetUrls]) => {
          const encodedFolder = species.spriteFolder
            .split('/')
            .map((segment) => encodeURIComponent(segment))
            .join('/');
          const loadedTexture = await loadingWildlifeSheetWithFallback(
            sheetUrls.map(
              (fileName) =>
                `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}/${fileName}`
            )
          );
          const sheet = slicingWildlifeSheetIntoDirectionRows(loadedTexture);

          return [motionKind, sheet] as const;
        })
      );

      return {
        ...Object.fromEntries(motionEntries),
        ...Object.fromEntries(extendedEntries),
      } as DefiningWildlifeSpeciesTextures;
    })();

  loadingWildlifeSpeciesTexturesCache.set(cacheKey, loadingPromise);

  // Evict rejected loads so a later attempt (e.g. lazy load on first
  // sighting after a transient gateway failure) can retry.
  loadingPromise
    .then((textures) => {
      if (loadingWildlifeSpeciesTexturesCache.get(cacheKey) === loadingPromise) {
        loadingWildlifeSpeciesTexturesResolved.set(cacheKey, textures);
      }
    })
    .catch(() => {
      if (loadingWildlifeSpeciesTexturesCache.get(cacheKey) === loadingPromise) {
        loadingWildlifeSpeciesTexturesCache.delete(cacheKey);
      }
    });

  return loadingPromise;
}

/**
 * Returns true when a species texture load is cached (pending or resolved).
 */
export function checkingWildlifeSpeciesTexturesCacheHasEntry(
  speciesId: string
): boolean {
  return loadingWildlifeSpeciesTexturesCache.has(speciesId);
}

/**
 * True when the species load finished and textures are held for eviction.
 */
export function checkingWildlifeSpeciesTexturesAreResolved(
  speciesId: string
): boolean {
  return loadingWildlifeSpeciesTexturesResolved.has(speciesId);
}

/**
 * Returns resolved textures when present (null while pending or missing).
 */
export function peekingWildlifeSpeciesTexturesResolved(
  speciesId: string
): DefiningWildlifeSpeciesTextures | null {
  return loadingWildlifeSpeciesTexturesResolved.get(speciesId) ?? null;
}

/**
 * Lists every species id currently held in the texture cache.
 */
export function listingWildlifeSpeciesTexturesCacheIds(): readonly string[] {
  return [...loadingWildlifeSpeciesTexturesCache.keys()];
}

/**
 * Removes one species entry from the texture cache without destroying GPU
 * resources. Callers that own eviction must destroy textures and unload Assets
 * first.
 */
export function removingWildlifeSpeciesTexturesCacheEntry(
  speciesId: string
): void {
  loadingWildlifeSpeciesTexturesCache.delete(speciesId);
  loadingWildlifeSpeciesTexturesResolved.delete(speciesId);
}

/** Clears the texture cache (tests only). */
export function clearingWildlifeSpeciesTexturesCacheForTests(): void {
  loadingWildlifeSpeciesTexturesCache.clear();
  loadingWildlifeSpeciesTexturesResolved.clear();
}

// Re-export for internal use in sprite layout
export { DEFINING_WILDLIFE_MOTION_CLIP_KINDS_LIST as DEFINING_WILDLIFE_MOTION_CLIP_KINDS };
