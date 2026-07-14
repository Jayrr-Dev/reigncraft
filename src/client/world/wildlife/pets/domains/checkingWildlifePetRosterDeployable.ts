/**
 * Pure helpers for living / active companion roster slots.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetRosterDeployable
 */

import { DEFINING_WILDLIFE_PET_MAX_ACTIVE } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

/** True when a roster pet is flagged active and not permanently dead (HP ≤ 0). */
export function checkingWildlifePetRosterRecordIsLivingActive(
  record: DefiningWildlifePetPersistedRecord
): boolean {
  if (!record.isActive) {
    return false;
  }

  if (record.healthCurrent !== null && record.healthCurrent <= 0) {
    return false;
  }

  return true;
}

/** Count of living active companions (counts toward {@link DEFINING_WILDLIFE_PET_MAX_ACTIVE}). */
export function countingWildlifePetRosterLivingActive(
  pets: readonly DefiningWildlifePetPersistedRecord[]
): number {
  let count = 0;

  for (const pet of pets) {
    if (checkingWildlifePetRosterRecordIsLivingActive(pet)) {
      count += 1;
    }
  }

  return count;
}

/** True when another living active companion can still be deployed. */
export function checkingWildlifePetRosterHasLivingActiveRoom(
  pets: readonly DefiningWildlifePetPersistedRecord[]
): boolean {
  return (
    countingWildlifePetRosterLivingActive(pets) <
    DEFINING_WILDLIFE_PET_MAX_ACTIVE
  );
}

/**
 * Picks the primary companion id for UI / network: prefer `preferredPetId`
 * when still living-active, else the most recently updated living-active pet.
 */
export function resolvingWildlifePetRosterPrimaryActivePetId(
  pets: readonly DefiningWildlifePetPersistedRecord[],
  preferredPetId: string | null = null
): string | null {
  const livingActive = pets.filter(
    checkingWildlifePetRosterRecordIsLivingActive
  );

  if (livingActive.length === 0) {
    return null;
  }

  if (
    preferredPetId !== null &&
    livingActive.some((pet) => pet.petId === preferredPetId)
  ) {
    return preferredPetId;
  }

  let newest = livingActive[0]!;

  for (let index = 1; index < livingActive.length; index += 1) {
    const candidate = livingActive[index]!;

    if (candidate.updatedAtMs >= newest.updatedAtMs) {
      newest = candidate;
    }
  }

  return newest.petId;
}
