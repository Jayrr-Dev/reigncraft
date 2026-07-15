/**
 * Predicate helpers for 1-block mushroom bunches.
 *
 * @module components/world/mushrooms/domains/checkingWorldPlazaMushroomBunchSpawn
 */

import type { DefiningWorldPlazaMushroomBunchHabitatSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomBunchSpawnConstants';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_IDS,
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITH_CENTER,
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITHOUT_CENTER,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomBunchSpawnConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_ID_SET =
  new Set<string>(DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_IDS);

export function checkingWorldPlazaMushroomBunchHabitatSpeciesId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): speciesId is DefiningWorldPlazaMushroomBunchHabitatSpeciesId {
  return DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_ID_SET.has(
    speciesId
  );
}

/**
 * True when `count` fits inside the 1-block footprint for the include-center mode.
 */
export function checkingWorldPlazaMushroomBunchSpawnCount(
  count: number,
  includeCenterTile: boolean = true
): boolean {
  if (!Number.isInteger(count) || count < 1) {
    return false;
  }

  const maxCount = includeCenterTile
    ? DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITH_CENTER
    : DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITHOUT_CENTER;

  return count <= maxCount;
}
