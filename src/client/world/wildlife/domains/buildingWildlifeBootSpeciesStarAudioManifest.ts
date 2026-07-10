/**
 * Star-audio manifest for boot-biome wildlife vocals.
 *
 * Mirrors the texture boot roster: only species from
 * `DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS` (plains today), capped on
 * mobile like `preloadingWildlifeBootSpeciesTextures`.
 *
 * @module components/world/wildlife/domains/buildingWildlifeBootSpeciesStarAudioManifest
 */

import { buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds } from '@/components/world/wildlife/domains/buildingWildlifeFarmAnimalStarAudioManifest';
import { listingWildlifeBootPreloadSpeciesIds } from '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures';
import { listingWildlifeSpeciesSfxClipIdsForSpeciesIds } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import type { Manifest } from 'star-audio';

/**
 * Vocal clips for every species warmed during world boot.
 */
export function buildingWildlifeBootSpeciesStarAudioManifest(): Manifest {
  return buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds(
    listingWildlifeSpeciesSfxClipIdsForSpeciesIds(
      listingWildlifeBootPreloadSpeciesIds()
    )
  );
}
