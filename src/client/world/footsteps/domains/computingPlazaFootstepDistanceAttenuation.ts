import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_PLAZA_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT,
  DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID,
  DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID,
} from '@/components/world/footsteps/domains/definingPlazaFootstepFalloffConstants';

/**
 * Distance falloff multiplier from listener to one footstep source point.
 */
export function computingPlazaFootstepDistanceAttenuation(
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

  if (distanceGrid >= DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID) {
    return 0;
  }

  if (distanceGrid <= DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID) {
    return 1;
  }

  const falloffSpan =
    DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID -
    DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID;
  const normalized =
    (distanceGrid - DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated ** DEFINING_PLAZA_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT;
}
