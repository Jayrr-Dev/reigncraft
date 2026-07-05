import { computingWorldPlazaEntityBleedTickDamage } from '@/components/world/health/domains/computingWorldPlazaEntityBleedTickDamage';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityBleedTickDamage', () => {
  it('drains the full bleed pool over the duration with a front-loaded curve', () => {
    const totalBleedDamage = 100;
    const durationMs = 10_000;
    const tickIntervalMs = 1_000;
    const startedAtMs = 0;
    const expiresAtMs = durationMs;
    let remainingBleedDamage = totalBleedDamage;
    let lastTickAtMs = startedAtMs;
    let totalDealt = 0;
    const tickDamages: number[] = [];

    for (
      let nowMs = tickIntervalMs;
      nowMs <= durationMs;
      nowMs += tickIntervalMs
    ) {
      const tickDamage = computingWorldPlazaEntityBleedTickDamage({
        remainingBleedDamage,
        startedAtMs,
        expiresAtMs,
        nowMs,
        tickIntervalMs: nowMs - lastTickAtMs,
      });

      tickDamages.push(tickDamage);
      totalDealt += tickDamage;
      remainingBleedDamage -= tickDamage;
      lastTickAtMs = nowMs;
    }

    expect(totalDealt).toBeCloseTo(totalBleedDamage, 1);
    expect(remainingBleedDamage).toBeCloseTo(0, 1);
    expect(tickDamages[0] ?? 0).toBeGreaterThan(
      tickDamages[tickDamages.length - 1] ?? 0
    );
  });

  it('returns zero when the bleed pool is empty', () => {
    expect(
      computingWorldPlazaEntityBleedTickDamage({
        remainingBleedDamage: 0,
        startedAtMs: 0,
        expiresAtMs: 30_000,
        nowMs: 1_000,
        tickIntervalMs: 1_000,
      })
    ).toBe(0);
  });
});
