/**
 * Same-species friendliness when the player is in an animal transform form.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSharesPlayerTransformSpecies
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Returns true when wildlife matches the player's current animal transform.
 *
 * Same-type animals treat the player as a packmate: no on-sight aggro, no
 * territory escalation, and no collision flee/startle.
 */
export function checkingWildlifeSharesPlayerTransformSpecies(
  wildlifeSpeciesId: string,
  playerTransformWildlifeSpeciesId: DefiningWildlifeSpeciesId | null | undefined
): boolean {
  if (!playerTransformWildlifeSpeciesId) {
    return false;
  }

  return wildlifeSpeciesId === playerTransformWildlifeSpeciesId;
}
