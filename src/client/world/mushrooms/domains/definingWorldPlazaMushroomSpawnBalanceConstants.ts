/**
 * Declarative mushroom spawn balance: rarity weights, time-of-day, biome density.
 *
 * Density stays table-driven so the hot path is O(1) lookups (no extra scans).
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';

/** Coarse fruiting band. Finer windows stay on `phaseWindow`. */
export type DefiningWorldPlazaMushroomTimeOfDay = 'day' | 'night' | 'any';

/** Spawn rarity tier. Higher rarity = lower pick weight. */
export type DefiningWorldPlazaMushroomRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary';

/** Relative pick weights when several species are eligible. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT = {
  common: 12,
  uncommon: 6,
  rare: 3,
  legendary: 1,
} as const satisfies Record<DefiningWorldPlazaMushroomRarity, number>;

/**
 * Biome mushroom abundance. 1 = baseline. Lower = fewer (higher effective modulus).
 * Plains/savanna stay sparse so rings do not carpet open grass.
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BIOME_SPAWN_DENSITY = {
  plains: 0.28,
  savanna: 0.32,
  flower_forest: 0.85,
  forest: 1,
  jungle: 1.1,
  swamp: 1.25,
  rocky: 0.55,
  snowy_plains: 0.4,
  badlands: 0.35,
  desert: 0.18,
  beach: 0.22,
  firelands: 0.45,
  ocean: 0,
} as const satisfies Record<DefiningWorldPlazaBiomeKind, number>;

export type DefiningWorldPlazaMushroomBiomeSpawnDensity =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_BIOME_SPAWN_DENSITY)[DefiningWorldPlazaBiomeKind];

/** True when cycle phase is in the daytime sun band. */
export function checkingWorldPlazaMushroomCyclePhaseIsDaytime(
  cyclePhase: number
): boolean {
  return (
    cyclePhase >= DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN &&
    cyclePhase < DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX
  );
}

/** True when species time-of-day allows the current cycle phase. */
export function checkingWorldPlazaMushroomTimeOfDayMatches(
  timeOfDay: DefiningWorldPlazaMushroomTimeOfDay,
  cyclePhase: number
): boolean {
  if (timeOfDay === 'any') {
    return true;
  }

  const isDaytime = checkingWorldPlazaMushroomCyclePhaseIsDaytime(cyclePhase);

  return timeOfDay === 'day' ? isDaytime : !isDaytime;
}

/**
 * Raises base modulus when biome density is low (fewer mushrooms).
 * Density 0 → unreachable modulus. Density 1 → unchanged.
 */
export function resolvingWorldPlazaMushroomEffectiveSpawnModulus(
  baseModulus: number,
  biomeKind: DefiningWorldPlazaBiomeKind
): number {
  const density = DEFINING_WORLD_PLAZA_MUSHROOM_BIOME_SPAWN_DENSITY[biomeKind];

  if (!(density > 0)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(1, Math.round(baseModulus / density));
}
