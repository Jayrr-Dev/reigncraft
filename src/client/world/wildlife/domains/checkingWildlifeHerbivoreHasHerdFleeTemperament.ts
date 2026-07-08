/**
 * Whether a passive herbivore species or instance should panic-flee as a herd.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHerbivoreHasHerdFleeTemperament
 */

import { checkingWildlifeAggressiveHerbivoreMayFight } from '@/components/world/wildlife/domains/checkingWildlifeAggressiveHerbivoreMayFight';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_HERD_FLEE_TEMPERAMENT_IDS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['passive', 'skittish']);

/** Passive and skittish farm/herd animals panic together when one is struck. */
export function checkingWildlifeHerbivoreHasHerdFleeTemperament(
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  return DEFINING_WILDLIFE_HERD_FLEE_TEMPERAMENT_IDS.has(species.temperamentId);
}

/** Returns false when an aggressive-spawn herbivore would stand and fight instead. */
export function checkingWildlifeInstanceJoinsHerdFlee(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance
): boolean {
  if (!checkingWildlifeHerbivoreHasHerdFleeTemperament(species)) {
    return false;
  }

  return !checkingWildlifeAggressiveHerbivoreMayFight(species, instance);
}
