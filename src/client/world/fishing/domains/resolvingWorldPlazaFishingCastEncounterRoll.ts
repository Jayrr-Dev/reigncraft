/**
 * Pure roll for a fishing cast wildlife encounter.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterRoll
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_BEARS_BY_BIOME,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_BY_BIOME,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_LINGER_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_CURIOUS_HERD_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_ELEPHANT_HERD_LINGER_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_SKITTISH_LINGER_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_TAME_FOLLOW_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_REGISTRY,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
  type DefiningWorldPlazaFishingCastEncounterEventId,
  type DefiningWorldPlazaFishingCastEncounterRegistryEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import { checkingWorldPlazaFishingCastEncounterOnCooldown } from '@/components/world/fishing/domains/managingWorldPlazaFishingCastEncounterCooldown';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeFishingCastEncounterState,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWorldPlazaFishingCastEncounterMemberPlan = {
  readonly speciesId: DefiningWildlifeSpeciesId;
  readonly aggressionLevel: DefiningWildlifeAggressionLevel;
  readonly temperamentOverrideId: DefiningWildlifeTemperamentId | null;
  readonly fishingCastEncounter: DefiningWildlifeFishingCastEncounterState;
  readonly isTameableBondCandidate: boolean;
};

export type ResolvingWorldPlazaFishingCastEncounterPlan = {
  readonly encounterKind: DefiningWorldPlazaFishingCastEncounterEventId;
  readonly toast: string;
  readonly packAnchorId: string;
  readonly members: readonly ResolvingWorldPlazaFishingCastEncounterMemberPlan[];
};

export type ResolvingWorldPlazaFishingCastEncounterRollParams = {
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
  readonly nowMs: number;
  readonly lastEncounterAtMs?: number | null;
  /** Unit random in [0, 1). Inject for tests. */
  readonly rollUnit?: () => number;
};

function pickingUnitRandom(rollUnit: (() => number) | undefined): number {
  return rollUnit ? rollUnit() : Math.random();
}

function listingEligibleEncounterEvents(
  biomeKind: DefiningWorldPlazaBiomeKind
): readonly DefiningWorldPlazaFishingCastEncounterRegistryEntry[] {
  const eligible = DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_REGISTRY.filter(
    (entry) => {
      if (!entry.biomeKinds || entry.biomeKinds.length === 0) {
        return true;
      }

      return entry.biomeKinds.includes(biomeKind);
    }
  );

  if (eligible.length > 0) {
    return eligible;
  }

  return DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_REGISTRY.filter(
    (entry) => entry.eventId === 'fairy'
  );
}

function pickingWeightedEncounterEvent(
  entries: readonly DefiningWorldPlazaFishingCastEncounterRegistryEntry[],
  rollUnit: (() => number) | undefined
): DefiningWorldPlazaFishingCastEncounterRegistryEntry {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = pickingUnitRandom(rollUnit) * totalWeight;

  for (const entry of entries) {
    roll -= entry.weight;

    if (roll < 0) {
      return entry;
    }
  }

  return entries[entries.length - 1]!;
}

function rollingPackSize(
  packSizeRange: readonly [number, number],
  rollUnit: (() => number) | undefined
): number {
  const [min, max] = packSizeRange;

  if (min >= max) {
    return min;
  }

  const span = max - min + 1;

  return min + Math.floor(pickingUnitRandom(rollUnit) * span);
}

function pickingFromPool(
  pool: readonly DefiningWildlifeSpeciesId[],
  rollUnit: (() => number) | undefined
): DefiningWildlifeSpeciesId {
  const index = Math.min(
    pool.length - 1,
    Math.floor(pickingUnitRandom(rollUnit) * pool.length)
  );

  return pool[index]!;
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

  return pickingFromPool(pool, rollUnit);
}

function pickingCuriousHerdSpeciesId(
  biomeKind: DefiningWorldPlazaBiomeKind,
  rollUnit: (() => number) | undefined
): DefiningWildlifeSpeciesId {
  const pool =
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_BY_BIOME[
      biomeKind
    ] ??
    ([
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_CURIOUS_HERD_SPECIES_ID,
    ] as const);

  return pickingFromPool(pool, rollUnit);
}

function pickingLionPrideSpeciesId(
  packIndex: number,
  rollUnit: (() => number) | undefined
): DefiningWildlifeSpeciesId {
  if (packIndex === 0) {
    return 'lion';
  }

  return pickingFromPool(['lion', 'lioness'], rollUnit);
}

function pickingElephantHerdSpeciesId(
  packIndex: number
): DefiningWildlifeSpeciesId {
  if (packIndex === 2) {
    return 'elephant';
  }

  return 'elephant-female';
}

function resolvingSpeciesIdForPackMember(
  entry: DefiningWorldPlazaFishingCastEncounterRegistryEntry,
  biomeKind: DefiningWorldPlazaBiomeKind,
  packIndex: number,
  rollUnit: (() => number) | undefined
): DefiningWildlifeSpeciesId {
  const source = entry.speciesSource;

  if (source.mode === 'fixed') {
    return source.speciesId;
  }

  if (source.mode === 'pool') {
    return pickingFromPool(source.speciesIds, rollUnit);
  }

  if (source.mode === 'bear_by_biome') {
    return pickingBearSpeciesId(biomeKind, rollUnit);
  }

  if (source.mode === 'curious_herd_by_biome') {
    return pickingCuriousHerdSpeciesId(biomeKind, rollUnit);
  }

  if (source.mode === 'lion_pride') {
    return pickingLionPrideSpeciesId(packIndex, rollUnit);
  }

  return pickingElephantHerdSpeciesId(packIndex);
}

function buildingPredatorEncounterState(
  nowMs: number
): DefiningWildlifeFishingCastEncounterState {
  return {
    kind: 'predator',
    armedAtMs:
      nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
    fleeDistanceGrid:
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
    expiresAtMs: null,
    phase: 'stalking',
  };
}

function buildingMemberPlan(
  entry: DefiningWorldPlazaFishingCastEncounterRegistryEntry,
  biomeKind: DefiningWorldPlazaBiomeKind,
  packIndex: number,
  packSize: number,
  nowMs: number,
  rollUnit: (() => number) | undefined
): ResolvingWorldPlazaFishingCastEncounterMemberPlan {
  const speciesId = resolvingSpeciesIdForPackMember(
    entry,
    biomeKind,
    packIndex,
    rollUnit
  );
  const isTameableBondCandidate =
    entry.tameablePackIndex != null && entry.tameablePackIndex === packIndex;

  if (entry.behavior === 'predator') {
    return {
      speciesId,
      aggressionLevel: entry.aggressionLevel ?? 'aggressive',
      temperamentOverrideId: entry.temperamentOverrideId ?? 'predator',
      fishingCastEncounter: buildingPredatorEncounterState(nowMs),
      isTameableBondCandidate: false,
    };
  }

  if (entry.behavior === 'pinguin') {
    return {
      speciesId,
      aggressionLevel: entry.aggressionLevel ?? 'tame',
      temperamentOverrideId: entry.temperamentOverrideId ?? 'docile',
      fishingCastEncounter: {
        kind: 'pinguin',
        armedAtMs: nowMs,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS,
        phase: 'curious',
      },
      isTameableBondCandidate: false,
    };
  }

  if (entry.behavior === 'fairy') {
    return {
      speciesId,
      aggressionLevel: entry.aggressionLevel ?? 'tame',
      temperamentOverrideId: entry.temperamentOverrideId ?? null,
      fishingCastEncounter: {
        kind: 'fairy',
        armedAtMs: nowMs,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS,
        phase: 'following',
      },
      isTameableBondCandidate: false,
    };
  }

  if (entry.behavior === 'curious') {
    if (isTameableBondCandidate) {
      return {
        speciesId,
        aggressionLevel: 'tame',
        temperamentOverrideId: 'docile',
        fishingCastEncounter: {
          kind: 'curious',
          armedAtMs: nowMs,
          fleeDistanceGrid:
            DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
          expiresAtMs:
            nowMs +
            DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_TAME_FOLLOW_MS,
          phase: 'curious',
        },
        isTameableBondCandidate: true,
      };
    }

    return {
      speciesId,
      aggressionLevel: 'normal',
      temperamentOverrideId: 'skittish',
      fishingCastEncounter: {
        kind: 'herd',
        armedAtMs: nowMs,
        fleeDistanceGrid:
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
        expiresAtMs:
          nowMs +
          DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_MONKEY_SKITTISH_LINGER_MS,
        phase: 'following',
      },
      isTameableBondCandidate: false,
    };
  }

  const herdLingerMs =
    entry.eventId === 'elephant_herd'
      ? DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_ELEPHANT_HERD_LINGER_MS
      : DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CURIOUS_HERD_LINGER_MS;

  return {
    speciesId,
    aggressionLevel: entry.aggressionLevel ?? 'normal',
    temperamentOverrideId: entry.temperamentOverrideId ?? null,
    fishingCastEncounter: {
      kind: 'herd',
      armedAtMs: nowMs,
      fleeDistanceGrid:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID,
      expiresAtMs: nowMs + herdLingerMs,
      phase: 'following',
    },
    isTameableBondCandidate: false,
  };
}

/**
 * Rolls whether this cast spawns a wildlife encounter and returns the plan.
 * Null when the chance gate misses or cooldown is active.
 */
export function resolvingWorldPlazaFishingCastEncounterRoll({
  biomeKind,
  nowMs,
  lastEncounterAtMs = null,
  rollUnit,
}: ResolvingWorldPlazaFishingCastEncounterRollParams): ResolvingWorldPlazaFishingCastEncounterPlan | null {
  if (
    pickingUnitRandom(rollUnit) >=
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE
  ) {
    return null;
  }

  if (
    checkingWorldPlazaFishingCastEncounterOnCooldown(nowMs, lastEncounterAtMs)
  ) {
    return null;
  }

  const eligibleEvents = listingEligibleEncounterEvents(biomeKind);
  const event = pickingWeightedEncounterEvent(eligibleEvents, rollUnit);
  const packSize = rollingPackSize(event.packSizeRange, rollUnit);
  const packAnchorId = `fishing-cast:${event.eventId}:${nowMs}`;
  const members: ResolvingWorldPlazaFishingCastEncounterMemberPlan[] = [];

  for (let packIndex = 0; packIndex < packSize; packIndex += 1) {
    members.push(
      buildingMemberPlan(event, biomeKind, packIndex, packSize, nowMs, rollUnit)
    );
  }

  return {
    encounterKind: event.eventId,
    toast: event.toast,
    packAnchorId,
    members,
  };
}

/** @deprecated Use members on the plan. Kept for transitional callers. */
export function resolvingWorldPlazaFishingCastEncounterPlanPrimaryMember(
  plan: ResolvingWorldPlazaFishingCastEncounterPlan
): ResolvingWorldPlazaFishingCastEncounterMemberPlan {
  return plan.members[0]!;
}
