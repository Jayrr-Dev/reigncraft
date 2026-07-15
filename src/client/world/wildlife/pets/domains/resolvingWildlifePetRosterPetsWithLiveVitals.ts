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

/** Panel text rounds ratios; skip new object when change stays under 1%. */
const RESOLVING_WILDLIFE_PET_ROSTER_LIVE_VITALS_RATIO_EPSILON = 0.01;

function checkingWildlifePetRosterLiveVitalsRatioNearlyEqual(
  left: number | null,
  right: number
): boolean {
  if (left === null) {
    return false;
  }

  return (
    Math.abs(left - right) <
    RESOLVING_WILDLIFE_PET_ROSTER_LIVE_VITALS_RATIO_EPSILON
  );
}

/**
 * Stable fingerprint for open-panel refresh. Changes only when UI-visible vitals
 * or death state change enough to redraw rows.
 */
export function formattingWildlifePetRosterLiveVitalsFingerprint(
  pets: readonly DefiningWildlifePetPersistedRecord[]
): string {
  let fingerprint = '';

  for (const pet of pets) {
    const hungerPercent =
      pet.hungerRatio === null ? '' : Math.round(pet.hungerRatio * 100);
    const staminaPercent =
      pet.staminaRatio === null ? '' : Math.round(pet.staminaRatio * 100);

    fingerprint += `${pet.petId}:${pet.healthCurrent ?? ''}:${pet.isActive ? 1 : 0}:${pet.loyalty}:${hungerPercent}:${staminaPercent}:${pet.hasNeglectedBadge ? 1 : 0}:${pet.isNeglectHunting ? 1 : 0}:${pet.deathCauseKind ?? ''};`;
  }

  return fingerprint;
}

/**
 * Merges one roster record with its live wildlife instance when present.
 * Dead / fatal live instances force HP 0 and undeploy for display.
 * Returns the same record reference when display-relevant fields are unchanged.
 */
export function resolvingWildlifePetRosterRecordWithLiveVitals(
  record: DefiningWildlifePetPersistedRecord,
  instance: DefiningWildlifeInstance | null
): DefiningWildlifePetPersistedRecord {
  if (!instance || checkingWildlifePetRosterRecordIsDeceased(record)) {
    return record;
  }

  if (instance.isDead || instance.healthState.currentHealth <= 0) {
    const deathCauseKind =
      record.deathCauseKind ?? instance.healthState.lastDamageKind ?? null;

    if (
      record.healthCurrent === 0 &&
      record.isActive === false &&
      record.deathCauseKind === deathCauseKind &&
      checkingWildlifePetRosterLiveVitalsRatioNearlyEqual(
        record.hungerRatio,
        instance.hungerState.hungerRatio
      ) &&
      checkingWildlifePetRosterLiveVitalsRatioNearlyEqual(
        record.staminaRatio,
        instance.staminaState.staminaRatio
      )
    ) {
      return record;
    }

    return {
      ...record,
      healthCurrent: 0,
      isActive: false,
      deathCauseKind,
      hungerRatio: instance.hungerState.hungerRatio,
      staminaRatio: instance.staminaState.staminaRatio,
      lastKnownX: instance.position.x,
      lastKnownY: instance.position.y,
      lastKnownLayer: instance.position.layer ?? null,
    };
  }

  if (
    record.healthCurrent === instance.healthState.currentHealth &&
    checkingWildlifePetRosterLiveVitalsRatioNearlyEqual(
      record.hungerRatio,
      instance.hungerState.hungerRatio
    ) &&
    checkingWildlifePetRosterLiveVitalsRatioNearlyEqual(
      record.staminaRatio,
      instance.staminaState.staminaRatio
    ) &&
    record.loyalty === (instance.petBond?.loyalty ?? record.loyalty) &&
    record.hasNeglectedBadge ===
      (instance.petBond?.hasNeglectedBadge === true) &&
    record.isNeglectHunting === (instance.petBond?.isNeglectHunting === true) &&
    record.spritcoreUpgrades.bonusMaxHealth ===
      (instance.petBond?.spritcoreUpgrades?.bonusMaxHealth ??
        record.spritcoreUpgrades.bonusMaxHealth) &&
    record.spritcoreUpgrades.bonusAttackPower ===
      (instance.petBond?.spritcoreUpgrades?.bonusAttackPower ??
        record.spritcoreUpgrades.bonusAttackPower) &&
    record.spritcoreUpgrades.bonusAttackSpeed ===
      (instance.petBond?.spritcoreUpgrades?.bonusAttackSpeed ??
        record.spritcoreUpgrades.bonusAttackSpeed) &&
    record.deathCauseKind === null
  ) {
    return record;
  }

  return {
    ...record,
    healthCurrent: instance.healthState.currentHealth,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    loyalty: instance.petBond?.loyalty ?? record.loyalty,
    hasNeglectedBadge: instance.petBond?.hasNeglectedBadge === true,
    isNeglectHunting: instance.petBond?.isNeglectHunting === true,
    spritcoreUpgrades:
      instance.petBond?.spritcoreUpgrades ?? record.spritcoreUpgrades,
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
  let didChange = false;
  const nextPets = pets.map((record) => {
    const nextRecord = resolvingWildlifePetRosterRecordWithLiveVitals(
      record,
      lookupInstance(record.petId)
    );

    if (nextRecord !== record) {
      didChange = true;
    }

    return nextRecord;
  });

  return didChange ? nextPets : pets;
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
