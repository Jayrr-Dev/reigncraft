/**
 * Habitat predicates for stump / pasture mushroom utilities.
 *
 * @module components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS,
  DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS,
  type DefiningWorldPlazaMushroomPastureBiomeKind,
  type DefiningWorldPlazaMushroomPastureHabitatSpeciesId,
  type DefiningWorldPlazaMushroomStumpHabitatSpeciesId,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatSpawnConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_SPECIES_IDS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatLayoutRegistry';

const DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_SPECIES_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_SPECIES_IDS
);

export function checkingWorldPlazaMushroomHabitatSpeciesId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): boolean {
  return DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_SPECIES_ID_SET.has(speciesId);
}

const DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS
);

const DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_ID_SET =
  new Set<string>(DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS);

const DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KIND_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS
);

export function checkingWorldPlazaMushroomStumpHabitatSpeciesId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): speciesId is DefiningWorldPlazaMushroomStumpHabitatSpeciesId {
  return DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_ID_SET.has(
    speciesId
  );
}

export function checkingWorldPlazaMushroomPastureHabitatSpeciesId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): speciesId is DefiningWorldPlazaMushroomPastureHabitatSpeciesId {
  return DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_ID_SET.has(
    speciesId
  );
}

export function checkingWorldPlazaMushroomPastureBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): biomeKind is DefiningWorldPlazaMushroomPastureBiomeKind {
  return DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KIND_SET.has(biomeKind);
}
