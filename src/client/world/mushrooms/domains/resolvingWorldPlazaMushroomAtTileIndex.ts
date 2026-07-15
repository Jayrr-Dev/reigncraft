/**
 * Resolves which mushroom (if any) is present on a tile for the current day/phase.
 *
 * @module components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex
 */

import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
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
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

function seedingWorldPlazaMushroomUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

export type ResolvingWorldPlazaMushroomAtTileIndexParams = {
  readonly tileX: number;
  readonly tileY: number;
  readonly dayNumber?: number;
  readonly cyclePhase?: number;
  readonly epochMs?: number;
};

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
  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  const placementUnit = seedingWorldPlazaMushroomUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_MUSHROOM_PLACEMENT_SEED_SALT
  );

  if (
    Math.floor(placementUnit * DEFINING_WORLD_PLAZA_MUSHROOM_TILE_MODULUS) !== 0
  ) {
    return null;
  }

  const resolvedDayNumber =
    dayNumber ?? formattingWorldPlazaDayNightDayNumber(epochMs);
  const resolvedCyclePhase =
    cyclePhase ?? resolvingWorldPlazaDayNightCyclePhase(epochMs);
  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

  const eligible = DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.filter((entry) => {
    if (!entry.biomeKinds.includes(biome.kind)) {
      return false;
    }

    if (!checkingWorldPlazaMushroomDayScheduleMatches(entry, resolvedDayNumber)) {
      return false;
    }

    if (
      !checkingWorldPlazaMushroomPhaseWindowMatches(
        entry.phaseWindow,
        resolvedCyclePhase
      )
    ) {
      return false;
    }

    return true;
  });

  if (eligible.length === 0) {
    return null;
  }

  const speciesUnit = seedingWorldPlazaMushroomUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_SEED_SALT
  );
  const pickIndex = Math.floor(speciesUnit * eligible.length) % eligible.length;

  return eligible[pickIndex] ?? null;
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
