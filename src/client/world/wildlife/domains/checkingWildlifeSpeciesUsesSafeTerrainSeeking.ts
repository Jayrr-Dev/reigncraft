/**
 * Predicate for the Safe-terrain seeking behavior.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesUsesSafeTerrainSeeking
 */

import { DEFINING_WILDLIFE_SAFE_TERRAIN_SEEKING_SPECIES } from '@/components/world/wildlife/domains/definingWildlifeSafeTerrainSeekingConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Returns true when this species biases movement toward nearby jumpable
 * rivers or cliffs (Safe-terrain seeking).
 */
export function checkingWildlifeSpeciesUsesSafeTerrainSeeking(
  speciesId: DefiningWildlifeSpeciesId
): boolean {
  return DEFINING_WILDLIFE_SAFE_TERRAIN_SEEKING_SPECIES.has(speciesId);
}

/**
 * Returns true when the species both opts into Safe-terrain seeking and
 * can actually jump (guards against grounded fleet prey like ostrich).
 */
export function checkingWildlifeSpeciesCanSeekSafeTerrain(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'speciesId' | 'jump'>
): boolean {
  return (
    species.jump.canJump &&
    checkingWildlifeSpeciesUsesSafeTerrainSeeking(species.speciesId)
  );
}
