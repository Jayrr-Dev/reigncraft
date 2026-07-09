import { computingWorldPlazaAcceleratedRunSpeed } from '@/components/world/domains/computingWorldPlazaAcceleratedRunSpeed';
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaAcceleratedRunSpeed', () => {
  const walk = 2;
  const run = 3;
  const mid =
    walk + (run - walk) * DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO;
  const fullStamina = 1;

  it('starts at walk, hits mid speed at fast phase, full run at total ramp', () => {
    expect(
      computingWorldPlazaAcceleratedRunSpeed(walk, run, 0, fullStamina)
    ).toBeCloseTo(walk);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS / 2,
        fullStamina
      )
    ).toBeCloseTo(walk + (mid - walk) * 0.5);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS,
        fullStamina
      )
    ).toBeCloseTo(mid);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS +
          DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS / 2,
        fullStamina
      )
    ).toBeCloseTo(mid + (run - mid) * 0.5);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(
        walk,
        run,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
        fullStamina
      )
    ).toBeCloseTo(run);
    expect(
      computingWorldPlazaAcceleratedRunSpeed(walk, run, 10, fullStamina)
    ).toBeCloseTo(run);
  });

  it('returns full run immediately when both phases are zero', () => {
    expect(
      computingWorldPlazaAcceleratedRunSpeed(walk, run, 0, fullStamina, 0, 0)
    ).toBe(run);
  });

  it('skips top phase when fast ratio is 1', () => {
    expect(
      computingWorldPlazaAcceleratedRunSpeed(walk, run, 1, fullStamina, 1, 3, 1)
    ).toBeCloseTo(run);
  });

  it('fades burst speed toward walk across the last stamina band', () => {
    const fadeStart =
      DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO;
    const atFullBurst = computingWorldPlazaAcceleratedRunSpeed(
      walk,
      run,
      DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
      fadeStart
    );
    expect(atFullBurst).toBeCloseTo(run);

    const halfway = computingWorldPlazaAcceleratedRunSpeed(
      walk,
      run,
      DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
      fadeStart / 2
    );
    expect(halfway).toBeCloseTo(walk + (run - walk) * 0.5);

    const empty = computingWorldPlazaAcceleratedRunSpeed(
      walk,
      run,
      DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
      0
    );
    expect(empty).toBeCloseTo(walk);
  });
});
