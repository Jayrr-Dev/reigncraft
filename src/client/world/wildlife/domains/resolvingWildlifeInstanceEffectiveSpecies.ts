/**
 * Species view for AI / aggro with instance overrides (god spawn temperament).
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
 * Returns a species snapshot with god-spawn temperament + always-aggro flags.
 * Identity-preserving when the instance is not a god spawn.
 */
export function resolvingWildlifeInstanceEffectiveSpecies(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstanceSpeciesOverrideProfile
): DefiningWildlifeSpeciesDefinition {
  if (!instance.isGodSpawn) {
    return species;
  }

  const temperamentId = resolvingWildlifeInstanceEffectiveTemperamentId(
    instance,
    species
  );

  return {
    ...species,
    temperamentId,
    aggressionSpawn: {
      ...species.aggressionSpawn,
      alwaysAttacksPlayerOnSight: true,
      aggressiveAttacksOnSight: true,
    },
  };
}
