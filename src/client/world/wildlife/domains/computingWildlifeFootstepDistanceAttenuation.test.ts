import { computingWildlifeFootstepDistanceAttenuation } from '@/components/world/wildlife/domains/computingWildlifeFootstepDistanceAttenuation';
import {
  computingWildlifeFootstepEffectiveVolume,
  computingWildlifeFootstepEffectiveVolumeAtDistance,
} from '@/components/world/wildlife/domains/computingWildlifeFootstepEffectiveVolume';
import {
  DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeFootstepDistanceAttenuation', () => {
  const listenerPoint = { x: 0, y: 0 };

  it('returns full volume inside the wildlife full-volume radius', () => {
    expect(
      computingWildlifeFootstepDistanceAttenuation(listenerPoint, listenerPoint)
    ).toBe(1);
    expect(
      computingWildlifeFootstepDistanceAttenuation(listenerPoint, {
        x: DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID,
        y: 0,
      })
    ).toBe(1);
  });

  it('returns zero at and beyond the wildlife max audible distance', () => {
    expect(
      computingWildlifeFootstepDistanceAttenuation(listenerPoint, {
        x: DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID,
        y: 0,
      })
    ).toBe(0);
  });

  it('matches point-based volume when distance is already known', () => {
    const sourcePoint = { x: 6, y: 8 };
    const distanceGrid = 10;

    expect(
      computingWildlifeFootstepEffectiveVolumeAtDistance('medium', distanceGrid)
    ).toBe(
      computingWildlifeFootstepEffectiveVolume(
        'medium',
        sourcePoint,
        listenerPoint
      )
    );
  });
});
