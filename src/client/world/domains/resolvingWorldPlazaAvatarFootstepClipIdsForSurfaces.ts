import { DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSurfaceDefinitions';
import type {
  DefiningFilmcowFootstepClipId,
  DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  mappingFilmcowFootstepClipEntryIds,
  resolvingFilmcowFootstepClipEntryId,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';

/**
 * Collects the unique walk, run, and landing clips used by avatar footstep surfaces.
 */
export function resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): readonly DefiningFilmcowFootstepClipId[] {
  const clipIds = new Set<DefiningFilmcowFootstepClipId>();

  for (const surfaceKind of surfaces) {
    const surfaceDefinition =
      DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];

    for (const clipId of mappingFilmcowFootstepClipEntryIds(
      surfaceDefinition.walkClipIds
    )) {
      clipIds.add(clipId);
    }

    for (const clipId of mappingFilmcowFootstepClipEntryIds(
      surfaceDefinition.runClipIds
    )) {
      clipIds.add(clipId);
    }

    clipIds.add(
      resolvingFilmcowFootstepClipEntryId(surfaceDefinition.landingClipId)
    );
  }

  return [...clipIds];
}
