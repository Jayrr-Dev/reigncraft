import { computingWildlifeAcceleratedRunSpeed } from '@/components/world/wildlife/domains/computingWildlifeAcceleratedRunSpeed';
import {
  DEFINING_WILDLIFE_DEFAULT_ACCELERATION_CONFIG,
  resolvingWildlifeSpeciesAccelerationConfig,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesAccelerationRegistry';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeAcceleratedRunSpeed', () => {
  const walk = 1.6;
  const run = 4;

  it('returns base run speed immediately for default (instant) config', () => {
    expect(
      computingWildlifeAcceleratedRunSpeed(
        walk,
        run,
        0,
        DEFINING_WILDLIFE_DEFAULT_ACCELERATION_CONFIG
      )
    ).toBe(run);
  });

  it('lerps walk to run across the burst ramp', () => {
    const deer = resolvingWildlifeSpeciesAccelerationConfig('deer');

    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 0, deer)
    ).toBeCloseTo(walk);
    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 0.2, deer)
    ).toBeCloseTo(walk + (run - walk) * 0.5);
    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 0.4, deer)
    ).toBeCloseTo(run);
  });

  it('applies momentum after the burst ramp completes', () => {
    const antilope = resolvingWildlifeSpeciesAccelerationConfig('antilope');
    const peak = run * (1 + antilope.momentumBonusMultiplier);

    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 0.6, antilope)
    ).toBeCloseTo(run);
    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 2.6, antilope)
    ).toBeCloseTo(run + (peak - run) * 0.5);
    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 4.6, antilope)
    ).toBeCloseTo(peak);
  });

  it('keeps deer at base run with zero momentum bonus', () => {
    const deer = resolvingWildlifeSpeciesAccelerationConfig('deer');

    expect(
      computingWildlifeAcceleratedRunSpeed(walk, run, 10, deer)
    ).toBeCloseTo(run);
  });
});

describe('resolvingWildlifeSpeciesAccelerationConfig', () => {
  it('returns themed fleet prey rows and default for other species', () => {
    expect(resolvingWildlifeSpeciesAccelerationConfig('zebra')).toEqual({
      burstRampSeconds: 1.5,
      momentumBonusMultiplier: 0.12,
      momentumRampSeconds: 6,
    });
    expect(resolvingWildlifeSpeciesAccelerationConfig('cow')).toEqual(
      DEFINING_WILDLIFE_DEFAULT_ACCELERATION_CONFIG
    );
  });
});
