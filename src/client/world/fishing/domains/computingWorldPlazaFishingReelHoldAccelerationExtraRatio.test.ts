import { computingWorldPlazaFishingReelHoldAccelerationExtraRatio } from '@/components/world/fishing/domains/computingWorldPlazaFishingReelHoldAccelerationExtraRatio';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN,
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaFishingReelHoldAccelerationExtraRatio', () => {
  it('starts near the min ratio', () => {
    expect(computingWorldPlazaFishingReelHoldAccelerationExtraRatio(0)).toBe(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN
    );
  });

  it('peaks near mid-cycle', () => {
    const midMs = DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS * 0.5;
    const midRatio =
      computingWorldPlazaFishingReelHoldAccelerationExtraRatio(midMs);

    expect(midRatio).toBeCloseTo(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MAX,
      5
    );
  });

  it('slows again near cycle end', () => {
    const lateMs = DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS * 0.95;
    const lateRatio =
      computingWorldPlazaFishingReelHoldAccelerationExtraRatio(lateMs);
    const midRatio = computingWorldPlazaFishingReelHoldAccelerationExtraRatio(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS * 0.5
    );

    expect(lateRatio).toBeLessThan(midRatio);
    expect(lateRatio).toBeGreaterThanOrEqual(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN
    );
  });

  it('repeats the ease cycle while held', () => {
    const firstMid = computingWorldPlazaFishingReelHoldAccelerationExtraRatio(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS * 0.5
    );
    const secondMid = computingWorldPlazaFishingReelHoldAccelerationExtraRatio(
      DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS * 1.5
    );

    expect(secondMid).toBeCloseTo(firstMid, 5);
  });
});
