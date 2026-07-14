/**
 * True when a wildlife instance's pet bond has reached Allied standing.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetAllied
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

/** True when the pet bond (Familiar+ loyalty) unlocks the `allied` capability. */
export function checkingWildlifePetAllied(
  instance: Pick<DefiningWildlifeInstance, 'petBond'>
): boolean {
  const petBond = instance.petBond;

  if (!petBond) {
    return false;
  }

  return checkingWildlifePetHasCapability(petBond.loyalty, 'allied');
}
