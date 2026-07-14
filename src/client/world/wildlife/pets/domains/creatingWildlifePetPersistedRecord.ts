/**
 * Factory for persisted pet records from live wildlife instances.
 *
 * @module components/world/wildlife/pets/domains/creatingWildlifePetPersistedRecord
 */

import type {
  DefiningWildlifePetBondState,
  DefiningWildlifePetCommandId,
  DefiningWildlifePetPersistedRecord,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CreatingWildlifePetPersistedRecordParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string;
  petId?: string;
  loyalty?: number;
  displayName?: string | null;
  isActive?: boolean;
  command?: DefiningWildlifePetCommandId;
  bondState?: Partial<DefiningWildlifePetBondState>;
  nowMs: number;
};

function creatingWildlifePetId(petId: string | undefined): string {
  if (petId && petId.length > 0) {
    return petId;
  }

  return crypto.randomUUID();
}

/** Builds a save-ready pet record from one wildlife instance and owner. */
export function creatingWildlifePetPersistedRecord(
  params: CreatingWildlifePetPersistedRecordParams
): DefiningWildlifePetPersistedRecord {
  const { instance, bondState, nowMs } = params;
  const loyalty = bondState?.loyalty ?? params.loyalty ?? 0;
  const displayName = params.displayName ?? instance.customDisplayName ?? null;
  const command = bondState?.command ?? params.command ?? 'follow';
  const weaponItem = bondState?.weaponItem ?? null;
  const armorItem = bondState?.armorItem ?? null;
  const learnedSkillIds = bondState?.learnedSkillIds ?? [];
  const equippedSkillId = bondState?.equippedSkillId ?? null;
  const soulsaveConsumed = bondState?.soulsaveConsumed ?? false;

  return {
    petId: creatingWildlifePetId(bondState?.petId ?? params.petId),
    speciesId: instance.speciesId,
    displayName,
    loyalty,
    isActive: params.isActive ?? false,
    command,
    healthCurrent: instance.healthState.currentHealth,
    hungerRatio: instance.hungerState.hungerRatio,
    staminaRatio: instance.staminaState.staminaRatio,
    sizeScaleSample: instance.sizeScaleSample,
    aggressionLevel: instance.aggressionLevel,
    weaponItem,
    armorItem,
    learnedSkillIds: [...learnedSkillIds],
    equippedSkillId,
    soulsaveConsumed,
    lastKnownX: instance.position.x,
    lastKnownY: instance.position.y,
    lastKnownLayer: instance.position.layer ?? null,
    acquiredAtMs: nowMs,
    updatedAtMs: nowMs,
  };
}

/** Derives runtime bond state from a persisted record. */
export function creatingWildlifePetBondStateFromPersistedRecord(
  record: DefiningWildlifePetPersistedRecord,
  ownerUserId: string
): DefiningWildlifePetBondState {
  return {
    petId: record.petId,
    ownerUserId,
    loyalty: record.loyalty,
    command: record.command,
    learnedSkillIds: [...record.learnedSkillIds],
    equippedSkillId: record.equippedSkillId,
    soulsaveConsumed: record.soulsaveConsumed,
    weaponItem: record.weaponItem,
    armorItem: record.armorItem,
    isPersistent: checkingWildlifePetHasCapability(record.loyalty, 'persistent'),
  };
}
