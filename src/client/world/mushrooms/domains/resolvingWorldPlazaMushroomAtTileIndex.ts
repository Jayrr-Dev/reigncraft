/**
 * Resolves which mushroom (if any) is present on a tile for the current day/phase.
 *
 * @module components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex
 */

import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import { checkingWorldPlazaMushroomHabitatSpeciesId } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import { checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex';
import { computingWorldPlazaMushroomSeedUnitFromTileIndex } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PLACEMENT_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT,
  DEFINING_WORLD_PLAZA_MUSHROOM_TILE_MODULUS,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import {
  checkingWorldPlazaMushroomDayScheduleMatches,
  checkingWorldPlazaMushroomPhaseWindowMatches,
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG,
  type DefiningWorldPlazaMushroomCatalogEntry,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import {
  checkingWorldPlazaMushroomTimeOfDayMatches,
  resolvingWorldPlazaMushroomEffectiveSpawnModulus,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { pickingWorldPlazaMushroomCatalogEntryByRarityWeight } from '@/components/world/mushrooms/domains/pickingWorldPlazaMushroomCatalogEntryByRarityWeight';
import { resolvingWorldPlazaMushroomHabitatClaimAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomHabitatClaimAtTileIndex';

export type ResolvingWorldPlazaMushroomAtTileIndexParams = {
  readonly tileX: number;
  readonly tileY: number;
  readonly dayNumber?: number;
  readonly cyclePhase?: number;
  readonly epochMs?: number;
};

export function resolvingWorldPlazaMushroomSparseAtTileIndex({
  tileX,
  tileY,
  dayNumber,
  cyclePhase,
}: {
  readonly tileX: number;
  readonly tileY: number;
  readonly dayNumber: number;
  readonly cyclePhase: number;
}): DefiningWorldPlazaMushroomCatalogEntry | null {
  if (
    checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({ tileX, tileY })
  ) {
    return null;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const effectiveModulus = resolvingWorldPlazaMushroomEffectiveSpawnModulus(
    DEFINING_WORLD_PLAZA_MUSHROOM_TILE_MODULUS,
    biome.kind
  );

  if (!Number.isFinite(effectiveModulus)) {
    return null;
  }

  const placementUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_MUSHROOM_PLACEMENT_SEED_SALT
  );

  if (Math.floor(placementUnit * effectiveModulus) !== 0) {
    return null;
  }

  const eligible = DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.filter((entry) => {
    if (checkingWorldPlazaMushroomHabitatSpeciesId(entry.speciesId)) {
      return false;
    }

    if (!entry.biomeKinds.includes(biome.kind)) {
      return false;
    }

    if (!checkingWorldPlazaMushroomDayScheduleMatches(entry, dayNumber)) {
      return false;
    }

    if (
      !checkingWorldPlazaMushroomTimeOfDayMatches(entry.timeOfDay, cyclePhase)
    ) {
      return false;
    }

    if (
      !checkingWorldPlazaMushroomPhaseWindowMatches(
        entry.phaseWindow,
        cyclePhase
      )
    ) {
      return false;
    }

    return true;
  });

  if (eligible.length === 0) {
    return null;
  }

  const speciesUnit = computingWorldPlazaMushroomSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT
  );

  return pickingWorldPlazaMushroomCatalogEntryByRarityWeight(
    eligible,
    speciesUnit
  );
}

/**
 * Deterministic mushroom species on a land tile, or null when none spawn now.
 */
export function resolvingWorldPlazaMushroomAtTileIndex({
  tileX,
  tileY,
  dayNumber,
  cyclePhase,
  epochMs = Date.now(),
}: ResolvingWorldPlazaMushroomAtTileIndexParams): DefiningWorldPlazaMushroomCatalogEntry | null {
  if (
    checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({ tileX, tileY })
  ) {
    return null;
  }

  const resolvedDayNumber =
    dayNumber ?? formattingWorldPlazaDayNightDayNumber(epochMs);
  const resolvedCyclePhase =
    cyclePhase ?? resolvingWorldPlazaDayNightCyclePhase(epochMs);

  const habitatClaim = resolvingWorldPlazaMushroomHabitatClaimAtTileIndex({
    tileX,
    tileY,
    dayNumber: resolvedDayNumber,
    cyclePhase: resolvedCyclePhase,
  });

  if (habitatClaim) {
    return habitatClaim;
  }

  return resolvingWorldPlazaMushroomSparseAtTileIndex({
    tileX,
    tileY,
    dayNumber: resolvedDayNumber,
    cyclePhase: resolvedCyclePhase,
  });
}

export function resolvingWorldPlazaMushroomSpeciesIdAtTileIndex(
  tileX: number,
  tileY: number,
  epochMs = Date.now()
): DefiningWorldPlazaMushroomSpeciesId | null {
  return (
    resolvingWorldPlazaMushroomAtTileIndex({ tileX, tileY, epochMs })
      ?.speciesId ?? null
  );
}
