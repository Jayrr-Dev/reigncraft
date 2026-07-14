/**
 * Predicates for wildlife instances that carry a player pet bond.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceIsOwnedPet
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

/** True when this instance carries any pet bond (curious through bonded). */
export function checkingWildlifeInstanceIsOwnedPet(
  instance: Pick<DefiningWildlifeInstance, 'petBond'>
): boolean {
  return Boolean(instance.petBond);
}

/**
 * True when the pet bond is persistent (Familiar+ loyalty). Persistent
 * companions skip the normal despawn radius and pack-alpha lifecycle rules.
 */
export function checkingWildlifeInstanceIsOwnedPersistentPet(
  instance: Pick<DefiningWildlifeInstance, 'petBond'>
): boolean {
  return Boolean(instance.petBond?.isPersistent);
}

/**
 * True when overhead hunger UI should render (Familiar+ `hungerUi`).
 * Wild animals and pre-Familiar bonds never show the hunger orb.
 */
export function checkingWildlifeInstanceShowsHungerUi(
  instance: Pick<DefiningWildlifeInstance, 'petBond'>
): boolean {
  const loyalty = instance.petBond?.loyalty;
  if (loyalty === undefined) {
    return false;
  }

  return checkingWildlifePetHasCapability(loyalty, 'hungerUi');
}

/**
 * True when this instance is a bonded pet owned by a different player than
 * `localUserId`. Remote-owned pets are network-driven ghosts: their
 * position/vitals come from the owner's client, so the local simulation
 * must not run behavior AI or ticks on them.
 */
export function checkingWildlifeInstanceIsRemoteOwnedPet(
  instance: Pick<DefiningWildlifeInstance, 'petBond'>,
  localUserId: string | null
): boolean {
  const ownerUserId = instance.petBond?.ownerUserId;

  return Boolean(ownerUserId) && ownerUserId !== localUserId;
}
