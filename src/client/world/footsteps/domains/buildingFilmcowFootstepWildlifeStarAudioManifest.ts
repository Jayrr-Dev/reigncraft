import { buildingFilmcowFootstepStarAudioManifestForClipIds } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import type { DefiningFilmcowFootstepSurfaceKind } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepWildlifeClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepWildlifeClipIdsForSurfaces';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for wildlife footsteps on one surface set.
 */
export function buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): Manifest {
  return buildingFilmcowFootstepStarAudioManifestForClipIds(
    resolvingFilmcowFootstepWildlifeClipIdsForSurfaces(surfaces)
  );
}
