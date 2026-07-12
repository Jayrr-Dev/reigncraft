/**
 * Star-audio preload for playable-animal footsteps on one surface set.
 *
 * @module components/world/domains/buildingWorldPlazaAnimalAvatarFootstepStarAudioManifest
 */

import { buildingFilmcowFootstepStarAudioManifestForClipIds } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SURFACE_DEFINITIONS,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepClipEntryId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';
import { resolvingFilmcowFootstepWildlifeClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepWildlifeClipIdsForSurfaces';
import type { Manifest } from 'star-audio';

/**
 * Wildlife walk/run pools plus landing clips for animal-avatar jump land.
 */
export function buildingWorldPlazaAnimalAvatarFootstepStarAudioManifestForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): Manifest {
  const clipIds = new Set<DefiningFilmcowFootstepClipId>(
    resolvingFilmcowFootstepWildlifeClipIdsForSurfaces(surfaces)
  );

  for (const surfaceKind of surfaces) {
    clipIds.add(
      resolvingFilmcowFootstepClipEntryId(
        DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SURFACE_DEFINITIONS[surfaceKind]
          .landingClipId
      )
    );
  }

  return buildingFilmcowFootstepStarAudioManifestForClipIds([...clipIds]);
}
