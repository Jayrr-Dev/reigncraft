/**
 * Boot-time wildlife texture warm-up with bounded concurrency.
 *
 * Resolves the spawn-table roster for the boot biomes and loads those
 * species' sheets a few at a time. Results land in the shared
 * `loadingWildlifeSpeciesTextures` cache, so runtime lazy loading reuses
 * them for free. Species outside the roster are not touched here.
 *
 * @module components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures
 */

import {
  DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS,
  DEFINING_WILDLIFE_BOOT_PRELOAD_SPECIES_CONCURRENCY,
} from '@/components/world/wildlife/domains/definingWildlifeBootTexturePreloadConstants';
import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { loadingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';

/** Reports 0..1 completion across the boot roster. */
type PreloadingWildlifeBootProgressReporter = (completedRatio: number) => void;

/**
 * Lists the deduped species ids spawnable in the boot preload biomes,
 * including fixed pack-composition members.
 */
export function listingWildlifeBootPreloadSpeciesIds(): readonly DefiningWildlifeSpeciesId[] {
  const speciesIds = new Set<DefiningWildlifeSpeciesId>();

  for (const biomeKind of DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS) {
    const spawnConfig = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE[biomeKind];

    if (!spawnConfig) {
      continue;
    }

    for (const entry of spawnConfig.entries) {
      speciesIds.add(entry.speciesId);

      for (const member of entry.packComposition ?? []) {
        speciesIds.add(member.speciesId);
      }
    }
  }

  return [...speciesIds];
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

      if (speciesDefinition) {
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
