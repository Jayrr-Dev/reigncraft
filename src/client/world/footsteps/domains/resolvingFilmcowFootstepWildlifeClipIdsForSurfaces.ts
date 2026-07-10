import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipIdsForSurfaces';

/**
 * Collects walk, run, landing, and wildlife size-tier clips for one surface set.
 */
export function resolvingFilmcowFootstepWildlifeClipIdsForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): readonly DefiningFilmcowFootstepClipId[] {
  const clipIds = new Set(resolvingFilmcowFootstepClipIdsForSurfaces(surfaces));

  for (const tierOverrides of Object.values(
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES
  )) {
    for (const clipId of tierOverrides.walkClipIds) {
      clipIds.add(clipId);
    }

    for (const clipId of tierOverrides.runClipIds) {
      clipIds.add(clipId);
    }
  }

  return [...clipIds];
}
