import { computingPlazaFootstepDistanceAttenuation } from '@/components/world/footsteps/domains/computingPlazaFootstepDistanceAttenuation';
import {
  DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID,
  DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID,
} from '@/components/world/footsteps/domains/definingPlazaFootstepFalloffConstants';
import { describe, expect, it } from 'vitest';

describe('computingPlazaFootstepDistanceAttenuation', () => {
  const listenerPoint = { x: 0, y: 0 };

  it('returns full volume at the listener and inside the full-volume radius', () => {
    expect(
      computingPlazaFootstepDistanceAttenuation(listenerPoint, listenerPoint)
    ).toBe(1);
    expect(
      computingPlazaFootstepDistanceAttenuation(listenerPoint, {
        x: DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID,
        y: 0,
      })
    ).toBe(1);
  });

  it('returns zero at and beyond the max audible distance', () => {
    expect(
      computingPlazaFootstepDistanceAttenuation(listenerPoint, {
        x: DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID,
        y: 0,
      })
    ).toBe(0);
  });

  it('falls off faster than squared linear between full and max distance', () => {
    const midDistance =
      DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID +
      (DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID -
        DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID) *
        0.5;
    const damped = computingPlazaFootstepDistanceAttenuation(listenerPoint, {
      x: midDistance,
      y: 0,
    });
    const falloffSpan =
      DEFINING_PLAZA_FOOTSTEP_DISTANCE_MAX_AUDIBLE_GRID -
      DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID;
    const normalized =
      (midDistance - DEFINING_PLAZA_FOOTSTEP_DISTANCE_FULL_VOLUME_GRID) /
      falloffSpan;
    const squaredLinear = (1 - normalized) ** 2;

    expect(damped).toBeLessThan(squaredLinear);
  });
});
