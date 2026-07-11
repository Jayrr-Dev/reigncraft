import {
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  mappingFilmcowFootstepClipEntryIds,
  resolvingFilmcowFootstepClipEntryId,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';

/**
 * Collects the unique walk, run, and landing clips used by one or more surfaces.
 */
export function resolvingFilmcowFootstepClipIdsForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): readonly DefiningFilmcowFootstepClipId[] {
  const clipIds = new Set<DefiningFilmcowFootstepClipId>();

  for (const surfaceKind of surfaces) {
    const surfaceDefinition =
      DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS[surfaceKind];

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
