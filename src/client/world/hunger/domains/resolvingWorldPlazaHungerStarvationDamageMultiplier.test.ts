import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  resolvingWorldPlazaHungerStarvationDamageMultiplier,
  resolvingWorldPlazaHungerStarvationHoursWithoutFood,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerStarvationDamageMultiplier';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHungerStarvationDamageMultiplier', () => {
  it('returns 0 hours and 1× damage when starvation has not started', () => {
    expect(
      resolvingWorldPlazaHungerStarvationHoursWithoutFood(null, 10_000)
    ).toBe(0);
    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs: null,
        nowMs: 10_000,
      })
    ).toBe(1);
  });

  it('stays at 1× until a full in-game hour elapses', () => {
    const starvingSinceMs = 1_000;
    const almostOneHour =
      starvingSinceMs + COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS - 1;

    expect(
      resolvingWorldPlazaHungerStarvationHoursWithoutFood(
        starvingSinceMs,
        almostOneHour
      )
    ).toBe(0);
    expect(
      resolvingWorldPlazaHungerStarvationDamageMultiplier({
        starvingSinceMs,
        nowMs: almostOneHour,
      })
    ).toBe(1);
  });

  it('adds +1× per completed in-game hour without food', () => {
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
    ).toBe(4);
  });
});
