/**
 * Overlays live wildlife vitals onto roster records for the open companions panel.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetRosterPetsWithLiveVitals
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { checkingWildlifePetRosterRecordIsDeceased } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPanelRows';
import { findingWildlifeInstanceByPetId } from '@/components/world/wildlife/pets/domains/spawningWildlifeActivePetNearOwner';

export type ResolvingWildlifePetRosterLiveVitalsLookup = (
  petId: string
) => DefiningWildlifeInstance | null;

/**
 * Merges one roster record with its live wildlife instance when present.
 * Dead / fatal live instances force HP 0 and undeploy for display.
 */
export function resolvingWildlifePetRosterRecordWithLiveVitals(
  record: DefiningWildlifePetPersistedRecord,
  instance: DefiningWildlifeInstance | null
): DefiningWildlifePetPersistedRecord {
  if (!instance || checkingWildlifePetRosterRecordIsDeceased(record)) {
    return record;
  }

  if (instance.isDead || instance.healthState.currentHealth <= 0) {
    return {
      ...record,
      healthCurrent: 0,
      isActive: false,
      deathCauseKind:
        record.deathCauseKind ?? instance.healthState.lastDamageKind ?? null,
      hungerRatio: instance.hungerState.hungerRatio,
      staminaRatio: instance.staminaState.staminaRatio,
      lastKnownX: instance.position.x,
      lastKnownY: instance.position.y,
      lastKnownLayer: instance.position.layer ?? null,
    };
  }

  return {
    ...record,
    healthCurrent: instance.healthState.currentHealth,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    lastKnownX: instance.position.x,
    lastKnownY: instance.position.y,
    lastKnownLayer: instance.position.layer ?? null,
    deathCauseKind: null,
  };
}

/** Overlays live vitals for every roster pet via an instance lookup. */
export function resolvingWildlifePetRosterPetsWithLiveVitals(
  pets: readonly DefiningWildlifePetPersistedRecord[],
  lookupInstance: ResolvingWildlifePetRosterLiveVitalsLookup
): readonly DefiningWildlifePetPersistedRecord[] {
  return pets.map((record) =>
    resolvingWildlifePetRosterRecordWithLiveVitals(
      record,
      lookupInstance(record.petId)
    )
  );
}

/** Store-backed lookup used by the open companions panel. */
export function resolvingWildlifePetRosterPetsWithLiveVitalsFromStore(
  pets: readonly DefiningWildlifePetPersistedRecord[],
  store: ManagingWildlifeInstanceStore
): readonly DefiningWildlifePetPersistedRecord[] {
  return resolvingWildlifePetRosterPetsWithLiveVitals(pets, (petId) =>
    findingWildlifeInstanceByPetId(store, petId)
  );
}
