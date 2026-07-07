import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWildlifeShouldSleepAtCyclePhase } from '@/components/world/wildlife/domains/resolvingWildlifeShouldSleepAtCyclePhase';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeShouldSleepAtCyclePhase', () => {
  it('keeps diurnal cows and zebras awake at 09:36', () => {
    const morningPhase = (9 * 60 + 36) / (24 * 60);

    for (const speciesId of ['cow', 'zebra'] as const) {
      expect(
        resolvingWildlifeShouldSleepAtCyclePhase({
          activityPattern: 'diurnal',
          cyclePhase: morningPhase,
          instanceId: `wildlife:${speciesId}:1`,
          sleepScheduleSample: 0,
        })
      ).toBe(false);
    }
  });

  it('keeps diurnal species awake during the day at 0σ', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.5,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('puts diurnal species to sleep at night at 0σ', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.05,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: 0,
      })
    ).toBe(true);
  });

  it('shortens diurnal sleep for negative σ samples', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.18,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: -2,
      })
    ).toBe(false);
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.18,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: 0,
      })
    ).toBe(true);
  });

  it('extends diurnal sleep for positive σ samples', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.795,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: 2,
      })
    ).toBe(true);
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'diurnal',
        cyclePhase: 0.795,
        instanceId: 'wildlife:cow:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('puts nocturnal species to sleep during the day at 0σ', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'nocturnal',
        cyclePhase: 0.5,
        instanceId: 'wildlife:grey-wolf:1',
        sleepScheduleSample: 0,
      })
    ).toBe(true);
  });

  it('keeps nocturnal species awake at night at 0σ', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'nocturnal',
        cyclePhase: 0.05,
        instanceId: 'wildlife:grey-wolf:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('keeps crepuscular species awake around sunrise', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'crepuscular',
        cyclePhase: DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
        instanceId: 'wildlife:deer:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('keeps crepuscular species awake at midday', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'crepuscular',
        cyclePhase: 0.5,
        instanceId: 'wildlife:deer:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('puts crepuscular species to sleep in the middle of the night', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'crepuscular',
        cyclePhase: 0.01,
        instanceId: 'wildlife:deer:1',
        sleepScheduleSample: 0,
      })
    ).toBe(true);
  });

  it('keeps crepuscular species awake around sunset', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'crepuscular',
        cyclePhase: DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
        instanceId: 'wildlife:deer:1',
        sleepScheduleSample: 0,
      })
    ).toBe(false);
  });

  it('keeps cathemeral species awake during the day', () => {
    expect(
      resolvingWildlifeShouldSleepAtCyclePhase({
        activityPattern: 'cathemeral',
        cyclePhase: 0.5,
        instanceId: 'wildlife:crocodile:1',
        sleepScheduleSample: 2,
      })
    ).toBe(false);
  });

  it('returns a stable cathemeral sleep roll for one night bucket', () => {
    const firstRoll = resolvingWildlifeShouldSleepAtCyclePhase({
      activityPattern: 'cathemeral',
      cyclePhase: 0.05,
      instanceId: 'wildlife:crocodile:1',
      sleepScheduleSample: 0,
    });
    const secondRoll = resolvingWildlifeShouldSleepAtCyclePhase({
      activityPattern: 'cathemeral',
      cyclePhase: 0.05,
      instanceId: 'wildlife:crocodile:1',
      sleepScheduleSample: 0,
    });

    expect(firstRoll).toBe(secondRoll);
  });

  it('raises cathemeral night sleep frequency for positive σ samples', () => {
    let lowSigmaSleepCount = 0;
    let highSigmaSleepCount = 0;

    for (let step = 0; step < 12; step += 1) {
      const nightSpanPhase =
        1 -
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE +
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE;
      const cyclePhase =
        (DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE +
          ((step + 0.5) / 12) * nightSpanPhase) %
        1;

      if (
        resolvingWildlifeShouldSleepAtCyclePhase({
          activityPattern: 'cathemeral',
          cyclePhase,
          instanceId: 'wildlife:crocodile:1',
          sleepScheduleSample: -2,
        })
      ) {
        lowSigmaSleepCount += 1;
      }

      if (
        resolvingWildlifeShouldSleepAtCyclePhase({
          activityPattern: 'cathemeral',
          cyclePhase,
          instanceId: 'wildlife:crocodile:1',
          sleepScheduleSample: 2,
        })
      ) {
        highSigmaSleepCount += 1;
      }
    }

    expect(highSigmaSleepCount).toBeGreaterThan(lowSigmaSleepCount);
  });
});
