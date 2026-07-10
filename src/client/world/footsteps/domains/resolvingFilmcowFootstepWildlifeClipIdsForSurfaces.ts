import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES,
  type DefiningFilmcowFootstepClipId,
  type DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';

/**
 * Collects short walk, run, and wildlife size-tier clips for one surface set.
 */
export function resolvingFilmcowFootstepWildlifeClipIdsForSurfaces(
  surfaces: readonly DefiningFilmcowFootstepSurfaceKind[]
): readonly DefiningFilmcowFootstepClipId[] {
  const clipIds = new Set<DefiningFilmcowFootstepClipId>();

  for (const surfaceKind of surfaces) {
    for (const wildlifeSizeTier of Object.keys(
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES
    ) as Array<
      keyof typeof DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES
    >) {
      for (const clipId of resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion(
        surfaceKind,
        'walk',
        wildlifeSizeTier
      )) {
        clipIds.add(clipId);
      }

      for (const clipId of resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion(
        surfaceKind,
        'run',
        wildlifeSizeTier
      )) {
        clipIds.add(clipId);
      }
    }
  }

  return [...clipIds];
}
