import { computingWildlifeFootstepIntervalMs } from '@/components/world/wildlife/domains/computingWildlifeFootstepIntervalMs';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeFootstepIntervalMs', () => {
  it('returns a slower interval for larger walkers', () => {
    const smallInterval = computingWildlifeFootstepIntervalMs('walk', 0.8, 1.5);
    const largeInterval = computingWildlifeFootstepIntervalMs('walk', 1.5, 1.5);

    expect(largeInterval).not.toBeNull();
    expect(smallInterval).not.toBeNull();
    expect(largeInterval).toBeGreaterThan(smallInterval ?? 0);
  });

  it('returns null for non-locomotion clips', () => {
    expect(computingWildlifeFootstepIntervalMs('idle', 1, 1.5)).toBeNull();
  });
});
