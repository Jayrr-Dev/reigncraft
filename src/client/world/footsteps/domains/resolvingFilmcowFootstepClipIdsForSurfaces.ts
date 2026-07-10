import {
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

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

    for (const clipId of surfaceDefinition.walkClipIds) {
      clipIds.add(clipId);
    }

    for (const clipId of surfaceDefinition.runClipIds) {
      clipIds.add(clipId);
    }

    clipIds.add(surfaceDefinition.landingClipId);
  }

  return [...clipIds];
}
