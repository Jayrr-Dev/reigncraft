import { describe, expect, it } from 'vitest';

import { computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterAmbienceNearPlayer';

describe('computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation', () => {
  it('is full volume on the water tile center', () => {
    expect(
      computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation(
        { x: 4.5, y: 8.5 },
        4,
        8
      )
    ).toBe(1);
  });

  it('falls off to zero beyond the max audible distance', () => {
    expect(
      computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation(
        { x: 20, y: 8.5 },
        4,
        8
      )
    ).toBe(0);
  });
});
