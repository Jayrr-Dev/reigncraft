/**
 * Pure roll for a fishing cast wildlife encounter.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterRoll
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_BEARS_BY_BIOME,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_KINDS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID,
  type DefiningWorldPlazaFishingCastEncounterKind,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWorldPlazaFishingCastEncounterPlan = {
  readonly encounterKind: DefiningWorldPlazaFishingCastEncounterKind;
  readonly speciesId: DefiningWildlifeSpeciesId;
  readonly aggressionLevel: DefiningWildlifeAggressionLevel;
  readonly temperamentOverrideId: DefiningWildlifeTemperamentId | null;
  readonly fishingCastEncounter: {
    readonly kind: 'predator' | 'pinguin' | 'fairy';
    readonly armedAtMs: number;
    readonly fleeDistanceGrid: number;
    readonly expiresAtMs: number | null;
    readonly phase: 'stalking' | 'curious' | 'following';
  };
};

export type ResolvingWorldPlazaFishingCastEncounterRollParams = {
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
  readonly nowMs: number;
  /** Unit random in [0, 1). Inject for tests. */
  readonly rollUnit?: () => number;
};

function pickingUnitRandom(rollUnit: (() => number) | undefined): number {
  return rollUnit ? rollUnit() : Math.random();
}

function pickingEncounterKind(
  rollUnit: (() => number) | undefined
): DefiningWorldPlazaFishingCastEncounterKind {
  const kinds = DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_KINDS;
  const index = Math.min(
    kinds.length - 1,
    Math.floor(pickingUnitRandom(rollUnit) * kinds.length)
  );

  return kinds[index]!;
}

function pickingBearSpeciesId(
  biomeKind: DefiningWorldPlazaBiomeKind,
  rollUnit: (() => number) | undefined
): DefiningWildlifeSpeciesId {
  const pool =
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_BEARS_BY_BIOME[biomeKind] ??
    ([
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
    ] as const);
  const index = Math.min(
    pool.length - 1,
    Math.floor(pickingUnitRandom(rollUnit) * pool.length)
  );

  return pool[index]!;
}

/**
 * Rolls whether this cast spawns a wildlife encounter and returns the plan.
 * Null when the 4% gate misses.
 */
export function resolvingWorldPlazaFishingCastEncounterRoll({
  biomeKind,
  nowMs,
  rollUnit,
}: ResolvingWorldPlazaFishingCastEncounterRollParams): ResolvingWorldPlazaFishingCastEncounterPlan | null {
  if (
    pickingUnitRandom(rollUnit) >=
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE
  ) {
    return null;
  }

  const encounterKind = pickingEncounterKind(rollUnit);

  if (encounterKind === 'bear') {
    return {
      encounterKind,
      speciesId: pickingBearSpeciesId(biomeKind, rollUnit),
      aggressionLevel: 'aggressive',
      temperamentOverrideId: 'predator',
      fishingCastEncounter: {
        kind: 'predator',
        armedAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs: null,
        phase: 'stalking',
      },
    };
  }

  if (encounterKind === 'wolf') {
    return {
      encounterKind,
      speciesId: DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID,
      aggressionLevel: 'aggressive',
      // Keep pack_hunter AI; stalk window is gated by fishingCastEncounter.
      temperamentOverrideId: null,
      fishingCastEncounter: {
        kind: 'predator',
        armedAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs: null,
        phase: 'stalking',
      },
    };
  }

  if (encounterKind === 'pinguin') {
    return {
      encounterKind,
      speciesId: DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID,
      aggressionLevel: 'tame',
      temperamentOverrideId: 'docile',
      fishingCastEncounter: {
        kind: 'pinguin',
        armedAtMs: nowMs,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS,
        phase: 'curious',
      },
    };
  }

  return {
    encounterKind: 'fairy',
    speciesId: DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID,
    aggressionLevel: 'tame',
    temperamentOverrideId: null,
    fishingCastEncounter: {
      kind: 'fairy',
      armedAtMs: nowMs,
      fleeDistanceGrid:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
      expiresAtMs:
        nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS,
      phase: 'following',
    },
  };
}
