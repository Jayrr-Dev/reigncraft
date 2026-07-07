import { resolvingWildlifeSleepScheduleProfileFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSleepScheduleProfileFromSample';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSleepScheduleProfileFromSample', () => {
  it('keeps 0σ animals on the baseline schedule', () => {
    expect(resolvingWildlifeSleepScheduleProfileFromSample(0)).toEqual({
      shiftedSigma: 0,
      phaseWindowOffset: 0,
      cathemeralSleepProbability: 0.42,
    });
  });

  it('widens sleep windows for positive σ samples', () => {
    const profile = resolvingWildlifeSleepScheduleProfileFromSample(2);

    expect(profile.phaseWindowOffset).toBeGreaterThan(0);
    expect(profile.cathemeralSleepProbability).toBeGreaterThan(0.42);
  });

  it('narrows sleep windows for negative σ samples', () => {
    const profile = resolvingWildlifeSleepScheduleProfileFromSample(-2);

    expect(profile.phaseWindowOffset).toBeLessThan(0);
    expect(profile.cathemeralSleepProbability).toBeLessThan(0.42);
  });
});
