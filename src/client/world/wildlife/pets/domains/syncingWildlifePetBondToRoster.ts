/**
 * Mirrors a live pet-bonded wildlife instance into the persisted roster.
 *
 * @module components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetRosterHasLivingActiveRoom } from '@/components/world/wildlife/pets/domains/checkingWildlifePetRosterDeployable';
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
 * became persistent and a living-active slot is free (max 3), this activates
 * it without dropping other deployed companions.
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
  const existingRecord = roster.pets.find((pet) => pet.petId === petBond.petId);
  const shouldActivate =
    existingRecord?.isActive === true ||
    (becamePersistent &&
      checkingWildlifePetRosterHasLivingActiveRoom(roster.pets));

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

function checkingWildlifePetLearnedSkillIdsEqual(
  left: readonly string[],
  right: readonly string[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

/**
 * Periodic vitals-only sync for an already-persisted pet bond (position,
 * health, hunger, stamina, loyalty). No-ops for instances without a
 * persistent bond, or bonds not yet present in the roster.
 *
 * Skips `updatingWildlifePetRecord` when nothing meaningful changed so a
 * React effect that depends on the roster snapshot cannot re-enter forever.
 *
 * Dead companions stay in the roster (for a future revive) but are undeployed
 * so an active slot frees up and the spawn loop cannot recreate a corpse.
 */
export function syncingWildlifePetInstanceVitalsToRoster(
  instance: DefiningWildlifeInstance,
  nowMs: number = Date.now()
): void {
  const petBond = instance.petBond;

  if (!petBond) {
    return;
  }

  const roster = readingWildlifePetRosterSnapshot();
  const existingRecord = roster.pets.find((pet) => pet.petId === petBond.petId);

  if (!existingRecord) {
    return;
  }

  if (instance.isDead || instance.healthState.currentHealth <= 0) {
    syncingWildlifePetDeathToRoster(instance, nowMs);
    return;
  }

  const nextLearnedSkillIds = [...petBond.learnedSkillIds];
  const nextLayer = instance.position.layer ?? null;

  if (
    existingRecord.loyalty === petBond.loyalty &&
    existingRecord.command === petBond.command &&
    existingRecord.healthCurrent === instance.healthState.currentHealth &&
    existingRecord.hungerRatio === instance.hungerState.hungerRatio &&
    existingRecord.staminaRatio === instance.staminaState.staminaRatio &&
    checkingWildlifePetLearnedSkillIdsEqual(
      existingRecord.learnedSkillIds,
      nextLearnedSkillIds
    ) &&
    existingRecord.equippedSkillId === petBond.equippedSkillId &&
    existingRecord.soulsaveConsumed === petBond.soulsaveConsumed &&
    existingRecord.weaponItem === petBond.weaponItem &&
    existingRecord.armorItem === petBond.armorItem &&
    existingRecord.lastKnownX === instance.position.x &&
    existingRecord.lastKnownY === instance.position.y &&
    existingRecord.lastKnownLayer === nextLayer &&
    existingRecord.deathCauseKind === null
  ) {
    return;
  }

  updatingWildlifePetRecord(petBond.petId, {
    loyalty: petBond.loyalty,
    command: petBond.command,
    healthCurrent: instance.healthState.currentHealth,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    learnedSkillIds: nextLearnedSkillIds,
    equippedSkillId: petBond.equippedSkillId,
    soulsaveConsumed: petBond.soulsaveConsumed,
    weaponItem: petBond.weaponItem,
    armorItem: petBond.armorItem,
    lastKnownX: instance.position.x,
    lastKnownY: instance.position.y,
    lastKnownLayer: nextLayer,
    deathCauseKind: null,
    updatedAtMs: nowMs,
  });
}

/**
 * Permanent companion death: keep the roster record (revive later), set HP 0,
 * undeploy so a living-active slot opens for a new Familiar bond.
 *
 * Requires an existing roster row so a stale live `isPersistent` flag cannot
 * leave the Companions panel stuck on Alive.
 */
export function syncingWildlifePetDeathToRoster(
  instance: DefiningWildlifeInstance,
  nowMs: number = Date.now()
): void {
  const petBond = instance.petBond;

  if (!petBond) {
    return;
  }

  const roster = readingWildlifePetRosterSnapshot();
  const existingRecord = roster.pets.find((pet) => pet.petId === petBond.petId);

  if (!existingRecord) {
    return;
  }

  const deathCauseKind =
    existingRecord.deathCauseKind ??
    instance.healthState.lastDamageKind ??
    null;
  const nextLearnedSkillIds = [...petBond.learnedSkillIds];
  const nextLayer = instance.position.layer ?? null;

  if (
    existingRecord.loyalty === petBond.loyalty &&
    existingRecord.command === petBond.command &&
    existingRecord.healthCurrent === 0 &&
    existingRecord.hungerRatio === instance.hungerState.hungerRatio &&
    existingRecord.staminaRatio === instance.staminaState.staminaRatio &&
    checkingWildlifePetLearnedSkillIdsEqual(
      existingRecord.learnedSkillIds,
      nextLearnedSkillIds
    ) &&
    existingRecord.equippedSkillId === petBond.equippedSkillId &&
    existingRecord.soulsaveConsumed === petBond.soulsaveConsumed &&
    existingRecord.weaponItem === petBond.weaponItem &&
    existingRecord.armorItem === petBond.armorItem &&
    existingRecord.lastKnownX === instance.position.x &&
    existingRecord.lastKnownY === instance.position.y &&
    existingRecord.lastKnownLayer === nextLayer &&
    existingRecord.deathCauseKind === deathCauseKind &&
    existingRecord.isActive === false
  ) {
    return;
  }

  updatingWildlifePetRecord(petBond.petId, {
    loyalty: petBond.loyalty,
    command: petBond.command,
    healthCurrent: 0,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    learnedSkillIds: nextLearnedSkillIds,
    equippedSkillId: petBond.equippedSkillId,
    soulsaveConsumed: petBond.soulsaveConsumed,
    weaponItem: petBond.weaponItem,
    armorItem: petBond.armorItem,
    lastKnownX: instance.position.x,
    lastKnownY: instance.position.y,
    lastKnownLayer: nextLayer,
    deathCauseKind,
    isActive: false,
    updatedAtMs: nowMs,
  });
}
