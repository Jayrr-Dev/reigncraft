import { computingWorldPlazaEntityPoisonTickDamage } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonTickDamage';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityPoisonTickDamage', () => {
  it('drains the full poison pool using the 15/35/50 ramp', () => {
    const totalPoisonDamage = 100;
    const durationMs = 10_000;
    const tickIntervalMs = 1_000;
    const startedAtMs = 0;
    const expiresAtMs = durationMs;
    let remainingPoisonDamage = totalPoisonDamage;
    let lastTickAtMs = startedAtMs;
    let totalDealt = 0;
    const segmentDamages = {
      firstHalf: 0,
      middle: 0,
      final: 0,
    };

    for (let nowMs = tickIntervalMs; nowMs <= durationMs; nowMs += tickIntervalMs) {
      const tickDamage = computingWorldPlazaEntityPoisonTickDamage({
        remainingPoisonDamage,
        totalPoisonDamage,
        startedAtMs,
        expiresAtMs,
        nowMs,
        lastTickAtMs,
        tickIntervalMs: nowMs - lastTickAtMs,
      });

      const progress = nowMs / durationMs;

      if (progress <= 0.5) {
        segmentDamages.firstHalf += tickDamage;
      } else if (progress <= 0.85) {
        segmentDamages.middle += tickDamage;
      } else {
        segmentDamages.final += tickDamage;
      }

      totalDealt += tickDamage;
      remainingPoisonDamage -= tickDamage;
      lastTickAtMs = nowMs;
    }

    expect(totalDealt).toBeCloseTo(totalPoisonDamage, 1);
    expect(remainingPoisonDamage).toBeCloseTo(0, 1);
    expect(segmentDamages.firstHalf).toBeCloseTo(15, 1);
    expect(segmentDamages.middle + segmentDamages.final).toBeCloseTo(85, 1);
    expect(segmentDamages.final).toBeGreaterThan(segmentDamages.middle);
    expect(segmentDamages.final).toBeGreaterThan(segmentDamages.firstHalf);
  });
});
