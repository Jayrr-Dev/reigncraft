import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeStalkPlayerApproachResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachResponse';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPlayerApproachResponse', () => {
  it('returns one of flee, enrage, or regroup', () => {
    const response = resolvingWildlifeStalkPlayerApproachResponse([
      creatingWildlifeTestInstance({ instanceId: 'wildlife:0:0:alpha' }),
    ]);

    expect(['flee', 'enrage', 'regroup']).toContain(response);
  });

  it('is stable for the same pack anchor', () => {
    const packmates = [
      creatingWildlifeTestInstance({ instanceId: 'wildlife:0:0:alpha' }),
      creatingWildlifeTestInstance({ instanceId: 'wildlife:0:0:beta' }),
    ];

    expect(resolvingWildlifeStalkPlayerApproachResponse(packmates)).toBe(
      resolvingWildlifeStalkPlayerApproachResponse(packmates)
    );
  });
});
