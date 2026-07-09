import { computingWorldPlazaAcceleratedRunSpeed } from '@/components/world/domains/computingWorldPlazaAcceleratedRunSpeed';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaAcceleratedRunSpeed', () => {
  const walk = 2;
  const run = 3;

  it('starts at walk speed and reaches full run at the burst ramp', () => {
    expect(computingWorldPlazaAcceleratedRunSpeed(walk, run, 0)).toBeCloseTo(
      walk
    );
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS / 2
      )
    ).toBeCloseTo(walk + (run - walk) * 0.5);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS
      )
    ).toBeCloseTo(run);
    expect(computingWorldPlazaAcceleratedRunSpeed(walk, run, 2)).toBeCloseTo(
      run
    );
  });

  it('returns full run immediately when burst ramp is zero', () => {
    expect(computingWorldPlazaAcceleratedRunSpeed(walk, run, 0, 0)).toBe(run);
  });
});
