import { computingWorldPlazaOreSmeltingBoostedEndsAtMs } from '@/components/world/crafting/domains/computingWorldPlazaOreSmeltingBoostedEndsAtMs';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaOreSmeltingBoostedEndsAtMs', () => {
  it('pulls end time forward by a noticeable share of base duration', () => {
    const nowMs = 1_000_000;
    const baseDurationMs = 100_000;
    const endsAtMs = nowMs + 80_000;
    const nextEndsAtMs = computingWorldPlazaOreSmeltingBoostedEndsAtMs({
      nowMs,
      endsAtMs,
      baseDurationMs,
    });

    expect(endsAtMs - nextEndsAtMs).toBe(14_000);
  });

  it('leaves a small remainder instead of completing instantly', () => {
    const nowMs = 5_000;
    const nextEndsAtMs = computingWorldPlazaOreSmeltingBoostedEndsAtMs({
      nowMs,
      endsAtMs: nowMs + 3_000,
      baseDurationMs: 60_000,
    });

    expect(nextEndsAtMs - nowMs).toBe(250);
  });
});
