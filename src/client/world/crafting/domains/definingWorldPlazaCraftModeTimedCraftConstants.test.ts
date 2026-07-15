import {
  computingWorldPlazaCraftModeBoostedEndsAtMs,
  computingWorldPlazaCraftModeDurationMsFromComplexity,
  computingWorldPlazaCraftModeHaltedSchedule,
  computingWorldPlazaCraftModeRemainingMs,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MAX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MIN,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeTimedCraftConstants';
import { describe, expect, it } from 'vitest';

describe('craft mode timed craft constants', () => {
  it('maps complexity 1–10 to 5s–3min', () => {
    expect(computingWorldPlazaCraftModeDurationMsFromComplexity(1)).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MIN
    );
    expect(computingWorldPlazaCraftModeDurationMsFromComplexity(10)).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MAX
    );
    expect(computingWorldPlazaCraftModeDurationMsFromComplexity(5)).toBe(
      82_778
    );
  });

  it('pulls end time forward by a weaker base cut, amplified by combo', () => {
    const nowMs = 1_000_000;
    const baseEndsAtMs = nowMs + 80_000;
    const nextEndsAtMs = computingWorldPlazaCraftModeBoostedEndsAtMs({
      nowMs,
      endsAtMs: baseEndsAtMs,
      baseDurationMs: 100_000,
      strikeCombo: 1,
    });
    const comboEndsAtMs = computingWorldPlazaCraftModeBoostedEndsAtMs({
      nowMs,
      endsAtMs: baseEndsAtMs,
      baseDurationMs: 100_000,
      strikeCombo: 5,
    });

    expect(baseEndsAtMs - nextEndsAtMs).toBe(4_900);
    expect(baseEndsAtMs - comboEndsAtMs).toBeGreaterThan(
      baseEndsAtMs - nextEndsAtMs
    );
  });

  it('freezes remaining time while halted, then resumes', () => {
    const nowMs = 1_000_000;
    const schedule = computingWorldPlazaCraftModeHaltedSchedule({
      nowMs,
      endsAtMs: nowMs + 40_000,
      pausedUntilMs: null,
      haltMs: 2_500,
    });

    expect(schedule.pausedUntilMs).toBe(nowMs + 2_500);
    expect(schedule.endsAtMs).toBe(nowMs + 2_500 + 40_000);
    expect(
      computingWorldPlazaCraftModeRemainingMs({
        nowMs: nowMs + 1_000,
        endsAtMs: schedule.endsAtMs,
        pausedUntilMs: schedule.pausedUntilMs,
      })
    ).toBe(40_000);
    expect(
      computingWorldPlazaCraftModeRemainingMs({
        nowMs: schedule.pausedUntilMs,
        endsAtMs: schedule.endsAtMs,
        pausedUntilMs: schedule.pausedUntilMs,
      })
    ).toBe(40_000);
  });
});
