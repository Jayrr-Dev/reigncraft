import { computingWorldPlazaEntityPoisonTickIntervalMs } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonTickIntervalMs';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityPoisonTickIntervalMs', () => {
  it('ticks slower at the start and faster near the end', () => {
    const startedAtMs = 0;
    const expiresAtMs = 10_000;
    const baseTickIntervalMs = 1_000;

    const earlyInterval = computingWorldPlazaEntityPoisonTickIntervalMs({
      startedAtMs,
      expiresAtMs,
      nowMs: 1_000,
      baseTickIntervalMs,
    });
    const lateInterval = computingWorldPlazaEntityPoisonTickIntervalMs({
      startedAtMs,
      expiresAtMs,
      nowMs: 9_000,
      baseTickIntervalMs,
    });

    expect(earlyInterval).toBeGreaterThan(lateInterval);
    expect(earlyInterval).toBeGreaterThan(baseTickIntervalMs);
    expect(lateInterval).toBeLessThan(baseTickIntervalMs);
  });
});
