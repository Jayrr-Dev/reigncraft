/**
 * Boot-time wildlife texture warm-up with bounded concurrency.
 *
 * Resolves the spawn-table roster for the boot biomes and loads those
 * species' sheets a few at a time. On mobile only the highest-weight species
 * from the boot biomes are warmed. Results land in the shared
 * `loadingWildlifeSpeciesTextures` cache, so runtime lazy loading reuses
 * them for free.
 *
 * @module components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures
 */

import { checkingWildlifeSpeciesUsesGlowOrbPresentation } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation';
import { DEFINING_WILDLIFE_BOOT_PRELOAD_MAX_SPECIES_MOBILE } from '@/components/world/wildlife/domains/definingWildlifeBiomeProximityTextureConstants';
import {
  DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS,
  DEFINING_WILDLIFE_BOOT_PRELOAD_SPECIES_CONCURRENCY,
} from '@/components/world/wildlife/domains/definingWildlifeBootTexturePreloadConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpeciesIdsForBiomeKinds } from '@/components/world/wildlife/domains/listingWildlifeSpeciesIdsForBiomeKinds';
import { loadingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';

/** Reports 0..1 completion across the boot roster. */
type PreloadingWildlifeBootProgressReporter = (completedRatio: number) => void;

function resolvingWildlifeBootPreloadMaxSpecies(): number | null {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return DEFINING_WILDLIFE_BOOT_PRELOAD_MAX_SPECIES_MOBILE;
  }

  return null;
}

/**
 * Lists the deduped species ids warmed during boot for the configured biomes.
 */
export function listingWildlifeBootPreloadSpeciesIds(): readonly DefiningWildlifeSpeciesId[] {
  return listingWildlifeSpeciesIdsForBiomeKinds(
    DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS,
    resolvingWildlifeBootPreloadMaxSpecies()
  );
}

/**
 * Warms boot roster textures with a bounded worker pool.
 *
 * Individual species failures are swallowed: the runtime lazy loader
 * retries when the species first appears, and boot must not die because
 * one optional sheet 404s.
 */
export async function preloadingWildlifeBootSpeciesTextures(
  reportProgress: PreloadingWildlifeBootProgressReporter
): Promise<void> {
  const speciesIds = listingWildlifeBootPreloadSpeciesIds();

  if (speciesIds.length === 0) {
    reportProgress(1);
    return;
  }

  let nextIndex = 0;
  let completedCount = 0;

  async function loadingNextSpeciesWorker(): Promise<void> {
    while (nextIndex < speciesIds.length) {
      const speciesIndex = nextIndex;
      nextIndex += 1;
      const speciesDefinition = resolvingWildlifeSpeciesDefinition(
        speciesIds[speciesIndex]!
      );

      if (
        speciesDefinition &&
        !checkingWildlifeSpeciesUsesGlowOrbPresentation(speciesDefinition)
      ) {
        try {
          await loadingWildlifeSpeciesTextures(speciesDefinition);
        } catch {
          // Lazy runtime loading retries this species on first sighting.
        }
      }

      completedCount += 1;
      reportProgress(completedCount / speciesIds.length);
    }
  }

  const workerCount = Math.min(
    DEFINING_WILDLIFE_BOOT_PRELOAD_SPECIES_CONCURRENCY,
    speciesIds.length
  );

  await Promise.all(
    Array.from({ length: workerCount }, () => loadingNextSpeciesWorker())
  );
}
