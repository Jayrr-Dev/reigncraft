/**
 * Mirrors a live pet-bonded wildlife instance into the persisted roster.
 *
 * @module components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { creatingWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/creatingWildlifePetPersistedRecord';
import {
  readingWildlifePetRosterSnapshot,
  updatingWildlifePetRecord,
  upsertingWildlifePetRecord,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';

export type SyncingWildlifePetBondToRosterParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string;
  /** True the tick this bond just crossed into the Familiar+ tier. */
  becamePersistent?: boolean;
  nowMs: number;
};

/**
 * Upserts the roster record for a persistent pet bond. When the bond just
 * became persistent and no companion is currently active, this activates it
 * (deactivating any other roster pet through the single-active invariant).
 */
export function syncingWildlifePetBondToRoster({
  instance,
  ownerUserId,
  becamePersistent = false,
  nowMs,
}: SyncingWildlifePetBondToRosterParams): void {
  const petBond = instance.petBond;

  if (!petBond?.isPersistent) {
    return;
  }

  const roster = readingWildlifePetRosterSnapshot();
  const existingRecord = roster.pets.find(
    (pet) => pet.petId === petBond.petId
  );
  const shouldActivate =
    existingRecord?.isActive ??
    (becamePersistent && roster.activePetId === null);

  const record = creatingWildlifePetPersistedRecord({
    instance,
    ownerUserId,
    petId: petBond.petId,
    bondState: petBond,
    isActive: shouldActivate,
    nowMs,
  });

  upsertingWildlifePetRecord(record);
}

/**
 * Periodic vitals-only sync for an already-persisted pet bond (position,
 * health, hunger, stamina, loyalty). No-ops for instances without a
 * persistent bond, or bonds not yet present in the roster.
 */
export function syncingWildlifePetInstanceVitalsToRoster(
  instance: DefiningWildlifeInstance,
  nowMs: number = Date.now()
): void {
  const petBond = instance.petBond;

  if (!petBond?.isPersistent) {
    return;
  }

  updatingWildlifePetRecord(petBond.petId, {
    loyalty: petBond.loyalty,
    command: petBond.command,
    healthCurrent: instance.healthState.currentHealth,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    learnedSkillIds: [...petBond.learnedSkillIds],
    equippedSkillId: petBond.equippedSkillId,
    soulsaveConsumed: petBond.soulsaveConsumed,
    weaponItem: petBond.weaponItem,
    armorItem: petBond.armorItem,
    lastKnownX: instance.position.x,
    lastKnownY: instance.position.y,
    lastKnownLayer: instance.position.layer ?? null,
    updatedAtMs: nowMs,
  });
}
