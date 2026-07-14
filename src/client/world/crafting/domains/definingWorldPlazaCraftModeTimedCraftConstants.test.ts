import {
  computingWorldPlazaCraftModeBoostedEndsAtMs,
  computingWorldPlazaCraftModeDurationMsFromComplexity,
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

  it('pulls end time forward by a noticeable share of base duration', () => {
    const nowMs = 1_000_000;
    const nextEndsAtMs = computingWorldPlazaCraftModeBoostedEndsAtMs({
      nowMs,
      endsAtMs: nowMs + 80_000,
      baseDurationMs: 100_000,
    });

    expect(nowMs + 80_000 - nextEndsAtMs).toBe(14_000);
  });
});
