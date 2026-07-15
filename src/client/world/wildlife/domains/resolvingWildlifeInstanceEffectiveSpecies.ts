/**
 * Species view for AI / aggro with instance overrides (temperament / god spawn).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceEffectiveSpecies
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

type DefiningWildlifeInstanceSpeciesOverrideProfile = Pick<
  DefiningWildlifeInstance,
  'isGodSpawn' | 'temperamentOverrideId'
>;

/** Temperament used by behavior trees and temperament-gated combat rules. */
export function resolvingWildlifeInstanceEffectiveTemperamentId(
  instance: DefiningWildlifeInstanceSpeciesOverrideProfile,
  species: Pick<DefiningWildlifeSpeciesDefinition, 'temperamentId'>
): DefiningWildlifeTemperamentId {
  return instance.temperamentOverrideId ?? species.temperamentId;
}

/**
 * Returns a species snapshot with instance temperament overrides applied.
 * God spawns also force always-aggro sight flags.
 */
export function resolvingWildlifeInstanceEffectiveSpecies(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstanceSpeciesOverrideProfile
): DefiningWildlifeSpeciesDefinition {
  const temperamentId = resolvingWildlifeInstanceEffectiveTemperamentId(
    instance,
    species
  );
  const temperamentChanged = temperamentId !== species.temperamentId;

  if (!temperamentChanged && !instance.isGodSpawn) {
    return species;
  }

  return {
    ...species,
    temperamentId,
    aggressionSpawn: instance.isGodSpawn
      ? {
          ...species.aggressionSpawn,
          alwaysAttacksPlayerOnSight: true,
          aggressiveAttacksOnSight: true,
        }
      : species.aggressionSpawn,
  };
}
