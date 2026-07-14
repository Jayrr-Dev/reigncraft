import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  computingWorldPlazaPathologyInfectionStudyHoursElapsed,
  computingWorldPlazaPathologyInfectionStudyHoursToCredit,
} from '@/components/world/domains/computingWorldPlazaPathologyInfectionStudyHours';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaPathologyInfectionStudyHours', () => {
  const contractedAtMs = 1_000_000;

  it('counts whole in-game hours from contraction, including incubation', () => {
    expect(
      computingWorldPlazaPathologyInfectionStudyHoursElapsed({
        contractedAtMs,
        expiresAtMs: contractedAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 10,
        worldEpochMs: contractedAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 2.5,
      })
    ).toBe(2);
  });

  it('stops accruing after the disease expires', () => {
    const expiresAtMs =
      contractedAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 3;

    expect(
      computingWorldPlazaPathologyInfectionStudyHoursElapsed({
        contractedAtMs,
        expiresAtMs,
        worldEpochMs: expiresAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 5,
      })
    ).toBe(3);
  });

  it('only credits hours not already awarded for the instance', () => {
    expect(
      computingWorldPlazaPathologyInfectionStudyHoursToCredit({
        contractedAtMs,
        expiresAtMs: contractedAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 8,
        worldEpochMs: contractedAtMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 5,
        pathologyStudyHoursCredited: 2,
      })
    ).toBe(3);
  });
});
