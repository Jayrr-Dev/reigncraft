import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';

/**
 * Distance falloff multiplier from listener to one wildlife footstep source point.
 */
export function computingWildlifeFootstepDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint
): number {
  if (!listenerPoint) {
    return 1;
  }

  const distanceGrid = Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );

  if (distanceGrid >= DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID) {
    return 0;
  }

  if (distanceGrid <= DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID) {
    return 1;
  }

  const falloffSpan =
    DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID -
    DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID;
  const normalized =
    (distanceGrid - DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated * attenuated;
}

/**
 * Effective playback volume for one wildlife footstep at a world point.
 */
export function computingWildlifeFootstepEffectiveVolume(
  sizeTier: DefiningFilmcowFootstepWildlifeSizeTier,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): number {
  const distanceAttenuation = computingWildlifeFootstepDistanceAttenuation(
    listenerPoint,
    sourcePoint
  );

  if (distanceAttenuation <= 0) {
    return 0;
  }

  return (
    DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME[sizeTier] *
    distanceAttenuation *
    gettingWorldPlazaSfxVolume()
  );
}
