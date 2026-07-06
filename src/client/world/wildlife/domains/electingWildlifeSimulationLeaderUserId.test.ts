import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import { describe, expect, it } from 'vitest';

describe('electingWildlifeSimulationLeaderUserId', () => {
  it('picks the lowest user id as leader', () => {
    expect(
      electingWildlifeSimulationLeaderUserId('reddit:zebra', [
        'reddit:alpha',
        'reddit:mike',
      ])
    ).toBe('reddit:alpha');
  });

  it('returns the solo user when alone', () => {
    expect(electingWildlifeSimulationLeaderUserId('reddit:solo', [])).toBe(
      'reddit:solo'
    );
  });
});
