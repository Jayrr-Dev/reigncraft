import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaDayNightCyclePhase', () => {
  it('maps noon to phase 0.5', () => {
    const noonEpochMs = 0.5 * DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;

    expect(resolvingWorldPlazaDayNightCyclePhase(noonEpochMs)).toBe(0.5);
  });

  it('maps 09:36 to phase 0.4', () => {
    const nineThirtySixEpochMs =
      (9 * 60 + 36) * (DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS / (24 * 60));

    expect(resolvingWorldPlazaDayNightCyclePhase(nineThirtySixEpochMs)).toBeCloseTo(
      0.4,
      5
    );
  });
});
