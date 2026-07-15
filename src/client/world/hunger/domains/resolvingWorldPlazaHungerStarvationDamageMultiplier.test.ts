import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_ESCALATION_BASE } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  resolvingWorldPlazaHungerStarvationDamageMultiplier,
  resolvingWorldPlazaHungerStarvationElapsedInGameHours,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerStarvationDamageMultiplier';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHungerStarvationDamageMultiplier', () => {
  it('returns 0 hours and 1× damage when starvation has not started', () => {
    expect(
      resolvingWorldPlazaHungerStarvationElapsedInGameHours(null, 10_000)
    ).toBe(0);
    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs: null,
        nowMs: 10_000,
      })
    ).toBe(1);
  });

  it('ramps continuously before a full in-game hour elapses', () => {
    const starvingSinceMs = 1_000;
    const halfHourMs =
      starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 0.5;

    expect(
      resolvingWorldPlazaHungerStarvationElapsedInGameHours(
        starvingSinceMs,
        halfHourMs
      )
    ).toBeCloseTo(0.5, 10);
    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs,
        nowMs: halfHourMs,
      })
    ).toBeCloseTo(
      Math.pow(
        DEFINING_WORLD_PLAZA_HUNGER_STARVATION_DAMAGE_ESCALATION_BASE,
        0.5
      ),
      10
    );
  });

  it('doubles each completed in-game hour without food', () => {
    const starvingSinceMs = 1_000;

    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs,
        nowMs: starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS,
      })
    ).toBe(2);
    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs,
        nowMs: starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS * 3,
      })
    ).toBe(8);
  });
});
