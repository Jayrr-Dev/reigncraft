import {
  creatingWorldPlazaMobileDebugSampler,
  markingWorldPlazaMobileDebugFrame,
} from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';
import { describe, expect, it } from 'vitest';

describe('markingWorldPlazaMobileDebugFrame', () => {
  it('records frame deltas after the priming frame', () => {
    const sampler = creatingWorldPlazaMobileDebugSampler(0);

    const primingStats = markingWorldPlazaMobileDebugFrame(sampler, 100);
    expect(primingStats.frameSampleCount).toBe(0);
    expect(primingStats.framesPerSecond).toBe(0);

    const firstStats = markingWorldPlazaMobileDebugFrame(sampler, 116.67);
    expect(firstStats.frameSampleCount).toBe(1);
    expect(firstStats.frameAverageMs).toBeCloseTo(16.67, 1);
    expect(firstStats.framesPerSecond).toBeGreaterThan(50);

    const secondStats = markingWorldPlazaMobileDebugFrame(sampler, 133.34);
    expect(secondStats.frameSampleCount).toBe(2);
    expect(secondStats.frameMaxMs).toBeCloseTo(16.67, 1);
  });
});
