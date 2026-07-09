/**
 * Runtime aggro radius with global difficulty multiplier applied.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeciesAggroRadiusGrid
 */

import { DEFINING_WILDLIFE_DIFFICULTY_LEVERS } from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Returns species on-sight aggro radius scaled by difficulty levers. */
export function resolvingWildlifeSpeciesAggroRadiusGrid(
  species: DefiningWildlifeSpeciesDefinition
): number {
  return (
    species.aggro.aggroRadiusGrid *
    DEFINING_WILDLIFE_DIFFICULTY_LEVERS.aggroRadiusMultiplier
  );
}
