/**
 * Evicts GPU textures and animation clips for one wildlife species.
 *
 * Tears down clip-owned frame textures, the species texture cache entry, and
 * Pixi Assets URL entries so mobile memory can drop after leaving a biome.
 *
 * @module components/world/wildlife/domains/evictingWildlifeSpeciesTextures
 */

import { removingWorldPlazaAnimationClipsByPrefix } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS } from '@/components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_ASSET_BASE_URL,
  type DefiningWildlifeLoadedMotionClipKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import {
  DEFINING_WILDLIFE_MOTION_CLIP_KINDS,
  checkingWildlifeSpeciesTexturesAreResolved,
  peekingWildlifeSpeciesLoadedSheetUrls,
  peekingWildlifeSpeciesTexturesResolved,
  removingWildlifeSpeciesTexturesCacheEntry,
  type DefiningWildlifeSpeciesTextures,
} from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { clearingWildlifeSpeciesTextureResidence } from '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence';
import { clearingWildlifeAnimationClipRegistrationForSpecies } from '@/components/world/wildlife/domains/registeringWildlifeAnimationClips';
import { Assets, Cache } from 'pixi.js';

const DEFINING_WILDLIFE_LOADED_MOTION_CLIP_KINDS: readonly DefiningWildlifeLoadedMotionClipKind[] =
  DEFINING_WILDLIFE_MOTION_CLIP_KINDS;

/**
 * Collects every candidate sheet URL used when loading one species.
 *
 * Prefer {@link peekingWildlifeSpeciesLoadedSheetUrls} for unload; this list
 * includes fallback candidates that may never have entered Pixi Cache.
 */
export function listingWildlifeSpeciesTextureSheetUrls(
  species: DefiningWildlifeSpeciesDefinition
): readonly string[] {
  const urls = new Set<string>();

  for (const motionKind of DEFINING_WILDLIFE_LOADED_MOTION_CLIP_KINDS) {
    for (const sheetUrl of buildingWildlifeMotionSheetUrls(
      species.spriteFolder,
      motionKind,
      species.speciesId
    )) {
      urls.add(sheetUrl);
    }
  }

  const extendedClipSheets =
    DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS[species.speciesId] ??
    {};
  const encodedFolder = species.spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  for (const fileNames of Object.values(extendedClipSheets)) {
    for (const fileName of fileNames) {
      urls.add(
        `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}/${fileName}`
      );
    }
  }

  return [...urls];
}

function destroyingWildlifeSpeciesDirectionRowTextures(
  textures: DefiningWildlifeSpeciesTextures
): void {
  for (const motionSheet of Object.values(textures)) {
    if (!motionSheet) {
      continue;
    }

    for (const rowTexture of Object.values(motionSheet.directionTextures)) {
      if (!rowTexture.destroyed) {
        rowTexture.destroy(false);
      }
    }
  }
}

/**
 * Unloads only sheet URLs still present in Pixi Cache.
 *
 * Skipping missing keys avoids `[Assets] Asset id … was not found in the Cache`
 * warnings from fallback candidates that never loaded.
 */
async function unloadingWildlifeSpeciesSheetUrls(
  sheetUrls: readonly string[]
): Promise<void> {
  await Promise.all(
    sheetUrls.map(async (sheetUrl) => {
      if (!Cache.has(sheetUrl)) {
        return;
      }

      try {
        await Assets.unload(sheetUrl);
      } catch {
        // Race: another unload may have cleared the entry; ignore.
      }
    })
  );
}

/**
 * Evicts one species from clip registry, texture cache, and Pixi Assets.
 *
 * Skips when the load promise is still pending so in-flight loads are not
 * torn down mid-decode.
 *
 * @returns true when eviction ran.
 */
export async function evictingWildlifeSpeciesTextures(
  species: DefiningWildlifeSpeciesDefinition
): Promise<boolean> {
  if (!checkingWildlifeSpeciesTexturesAreResolved(species.speciesId)) {
    return false;
  }

  const settledTextures = peekingWildlifeSpeciesTexturesResolved(
    species.speciesId
  );
  const loadedSheetUrls = peekingWildlifeSpeciesLoadedSheetUrls(
    species.speciesId
  );

  removingWorldPlazaAnimationClipsByPrefix(`wildlife-${species.speciesId}-`);
  clearingWildlifeAnimationClipRegistrationForSpecies(species.speciesId);

  if (settledTextures) {
    destroyingWildlifeSpeciesDirectionRowTextures(settledTextures);
  }

  removingWildlifeSpeciesTexturesCacheEntry(species.speciesId);
  clearingWildlifeSpeciesTextureResidence(species.speciesId);

  const sheetUrls =
    loadedSheetUrls.length > 0
      ? loadedSheetUrls
      : listingWildlifeSpeciesTextureSheetUrls(species);

  await unloadingWildlifeSpeciesSheetUrls(sheetUrls);

  return true;
}
