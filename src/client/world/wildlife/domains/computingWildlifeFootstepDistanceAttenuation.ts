import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT,
  DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';

/**
 * Distance falloff multiplier for wildlife footstep one-shots.
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

  return attenuated ** DEFINING_WILDLIFE_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT;
}
