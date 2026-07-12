/**
 * Whether a species uses calm rest → landmark herd travel.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHerdLandmarkEligibleTemperament
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_HERD_LANDMARK_TEMPERAMENT_IDS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['passive', 'skittish']);

/** Passive and skittish grazers rest then travel as herds (or solo). */
export function checkingWildlifeHerdLandmarkEligibleTemperament(
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  return DEFINING_WILDLIFE_HERD_LANDMARK_TEMPERAMENT_IDS.has(
    species.temperamentId
  );
}
