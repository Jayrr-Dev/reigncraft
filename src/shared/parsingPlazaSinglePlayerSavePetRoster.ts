/**
 * Pure parse / serialize helpers for pet roster save data. Shared between
 * client and server so both sides validate the same JSON shape.
 *
 * @module shared/parsingPlazaSinglePlayerSavePetRoster
 */

import type {
  PlazaSinglePlayerSavePetInventoryItem,
  PlazaSinglePlayerSavePetRecord,
  PlazaSinglePlayerSavePetRoster,
} from './plazaSinglePlayerSavesDevvit';

/** Maximum loyalty points a companion can earn (mirrors client registry). */
export const PLAZA_SINGLE_PLAYER_SAVE_PET_MAX_LOYALTY = 1000 as const;

const PLAZA_SINGLE_PLAYER_SAVE_PET_COMMAND_IDS: readonly PlazaSinglePlayerSavePetRecord['command'][] =
  ['follow', 'stay', 'attack', 'defend'];

const PLAZA_SINGLE_PLAYER_SAVE_PET_AGGRESSION_LEVELS: readonly PlazaSinglePlayerSavePetRecord['aggressionLevel'][] =
  ['tame', 'normal', 'aggressive'];

type ParsingPlazaSinglePlayerSavePetInventoryItemRaw = {
  id?: unknown;
  itemTypeId?: unknown;
  quantity?: unknown;
  slotIndex?: unknown;
  metadata?: unknown;
};

type ParsingPlazaSinglePlayerSavePetRecordRaw = {
  petId?: unknown;
  speciesId?: unknown;
  displayName?: unknown;
  loyalty?: unknown;
  isActive?: unknown;
  command?: unknown;
  healthCurrent?: unknown;
  hungerRatio?: unknown;
  staminaRatio?: unknown;
  sizeScaleSample?: unknown;
  aggressionLevel?: unknown;
  weaponItem?: unknown;
  armorItem?: unknown;
  learnedSkillIds?: unknown;
  equippedSkillId?: unknown;
  soulsaveConsumed?: unknown;
  hasNeglectedBadge?: unknown;
  isNeglectHunting?: unknown;
  spritcoreUpgrades?: unknown;
  lastKnownX?: unknown;
  lastKnownY?: unknown;
  lastKnownLayer?: unknown;
  deathCauseKind?: unknown;
  acquiredAtMs?: unknown;
  updatedAtMs?: unknown;
};

type ParsingPlazaSinglePlayerSavePetRosterRaw = {
  activePetId?: unknown;
  pets?: unknown;
};

export type ParsingPlazaSinglePlayerSavePetRosterResult = {
  roster: PlazaSinglePlayerSavePetRoster;
  droppedPetCount: number;
};

function parsingPlazaSinglePlayerSavePetFiniteNumber(
  value: unknown
): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function parsingPlazaSinglePlayerSavePetNullableFiniteNumber(
  value: unknown
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return parsingPlazaSinglePlayerSavePetFiniteNumber(value);
}

function parsingPlazaSinglePlayerSavePetNullableString(
  value: unknown
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parsingPlazaSinglePlayerSavePetRatio(value: unknown): number | null {
  const parsed = parsingPlazaSinglePlayerSavePetNullableFiniteNumber(value);

  if (parsed === null) {
    return null;
  }

  return Math.min(1, Math.max(0, parsed));
}

function parsingPlazaSinglePlayerSavePetMetadata(
  value: unknown
): Readonly<Record<string, unknown>> | undefined {
  if (
    value === null ||
    value === undefined ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return undefined;
  }

  const metadata: Record<string, unknown> = {};

  for (const [key, entryValue] of Object.entries(value)) {
    metadata[key] = entryValue;
  }

  return metadata;
}

function parsingPlazaSinglePlayerSavePetInventoryItem(
  raw: unknown
): PlazaSinglePlayerSavePetInventoryItem | null {
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const itemRaw = raw as ParsingPlazaSinglePlayerSavePetInventoryItemRaw;

  if (
    typeof itemRaw.id !== 'string' ||
    typeof itemRaw.itemTypeId !== 'string'
  ) {
    return null;
  }

  const quantity =
    typeof itemRaw.quantity === 'number' && itemRaw.quantity >= 1
      ? Math.round(itemRaw.quantity)
      : 1;
  const slotIndex =
    typeof itemRaw.slotIndex === 'number' && Number.isFinite(itemRaw.slotIndex)
      ? Math.round(itemRaw.slotIndex)
      : 0;
  const metadata = parsingPlazaSinglePlayerSavePetMetadata(itemRaw.metadata);

  return {
    id: itemRaw.id,
    itemTypeId: itemRaw.itemTypeId,
    quantity,
    slotIndex,
    ...(metadata ? { metadata } : {}),
  };
}

function checkingPlazaSinglePlayerSavePetCommandId(
  value: string
): value is PlazaSinglePlayerSavePetRecord['command'] {
  for (const commandId of PLAZA_SINGLE_PLAYER_SAVE_PET_COMMAND_IDS) {
    if (commandId === value) {
      return true;
    }
  }

  return false;
}

function checkingPlazaSinglePlayerSavePetAggressionLevel(
  value: string
): value is PlazaSinglePlayerSavePetRecord['aggressionLevel'] {
  for (const aggressionLevel of PLAZA_SINGLE_PLAYER_SAVE_PET_AGGRESSION_LEVELS) {
    if (aggressionLevel === value) {
      return true;
    }
  }

  return false;
}

function parsingPlazaSinglePlayerSavePetCommandId(
  value: unknown
): PlazaSinglePlayerSavePetRecord['command'] {
  if (
    typeof value === 'string' &&
    checkingPlazaSinglePlayerSavePetCommandId(value)
  ) {
    return value;
  }

  return 'follow';
}

function parsingPlazaSinglePlayerSavePetAggressionLevel(
  value: unknown
): PlazaSinglePlayerSavePetRecord['aggressionLevel'] {
  if (
    typeof value === 'string' &&
    checkingPlazaSinglePlayerSavePetAggressionLevel(value)
  ) {
    return value;
  }

  return 'normal';
}

function parsingPlazaSinglePlayerSavePetStringArray(
  value: unknown
): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (entry): entry is string => typeof entry === 'string' && entry.length > 0
  );
}

function parsingPlazaSinglePlayerSavePetNonNegativeNumber(
  value: unknown
): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

function parsingPlazaSinglePlayerSavePetSpritcoreUpgrades(
  raw: unknown
): PlazaSinglePlayerSavePetRecord['spritcoreUpgrades'] {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {
      bonusMaxHealth: 0,
      bonusAttackPower: 0,
      bonusAttackSpeed: 0,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 0,
    };
  }

  const record = raw as Record<string, unknown>;

  return {
    bonusMaxHealth: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.bonusMaxHealth
    ),
    bonusAttackPower: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.bonusAttackPower
    ),
    bonusAttackSpeed: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.bonusAttackSpeed
    ),
    bonusDefense: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.bonusDefense
    ),
    bonusMoveSpeed: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.bonusMoveSpeed
    ),
    totalSpritcoreInvested: parsingPlazaSinglePlayerSavePetNonNegativeNumber(
      record.totalSpritcoreInvested
    ),
  };
}

/** Validates one persisted pet record from save JSON. */
export function parsingPlazaSinglePlayerSavePetRecord(
  raw: unknown
): PlazaSinglePlayerSavePetRecord | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return null;
  }

  const recordRaw = raw as ParsingPlazaSinglePlayerSavePetRecordRaw;

  if (
    typeof recordRaw.petId !== 'string' ||
    recordRaw.petId.length === 0 ||
    typeof recordRaw.speciesId !== 'string' ||
    recordRaw.speciesId.length === 0
  ) {
    return null;
  }

  const acquiredAtMs = parsingPlazaSinglePlayerSavePetFiniteNumber(
    recordRaw.acquiredAtMs
  );
  const updatedAtMs = parsingPlazaSinglePlayerSavePetFiniteNumber(
    recordRaw.updatedAtMs
  );

  if (acquiredAtMs === null || updatedAtMs === null) {
    return null;
  }

  const loyaltyRaw =
    parsingPlazaSinglePlayerSavePetFiniteNumber(recordRaw.loyalty) ?? 0;
  const loyalty = Math.min(
    PLAZA_SINGLE_PLAYER_SAVE_PET_MAX_LOYALTY,
    Math.max(0, Math.round(loyaltyRaw))
  );
  const sizeScaleSample =
    parsingPlazaSinglePlayerSavePetFiniteNumber(recordRaw.sizeScaleSample) ?? 0;

  return {
    petId: recordRaw.petId,
    speciesId: recordRaw.speciesId,
    displayName:
      recordRaw.displayName === null
        ? null
        : parsingPlazaSinglePlayerSavePetNullableString(recordRaw.displayName),
    loyalty,
    isActive: recordRaw.isActive === true,
    command: parsingPlazaSinglePlayerSavePetCommandId(recordRaw.command),
    healthCurrent: parsingPlazaSinglePlayerSavePetNullableFiniteNumber(
      recordRaw.healthCurrent
    ),
    hungerRatio: parsingPlazaSinglePlayerSavePetRatio(recordRaw.hungerRatio),
    staminaRatio: parsingPlazaSinglePlayerSavePetRatio(recordRaw.staminaRatio),
    sizeScaleSample,
    aggressionLevel: parsingPlazaSinglePlayerSavePetAggressionLevel(
      recordRaw.aggressionLevel
    ),
    weaponItem: parsingPlazaSinglePlayerSavePetInventoryItem(
      recordRaw.weaponItem
    ),
    armorItem: parsingPlazaSinglePlayerSavePetInventoryItem(
      recordRaw.armorItem
    ),
    learnedSkillIds: parsingPlazaSinglePlayerSavePetStringArray(
      recordRaw.learnedSkillIds
    ),
    equippedSkillId: parsingPlazaSinglePlayerSavePetNullableString(
      recordRaw.equippedSkillId
    ),
    soulsaveConsumed: recordRaw.soulsaveConsumed === true,
    hasNeglectedBadge: recordRaw.hasNeglectedBadge === true,
    isNeglectHunting: recordRaw.isNeglectHunting === true,
    spritcoreUpgrades: parsingPlazaSinglePlayerSavePetSpritcoreUpgrades(
      recordRaw.spritcoreUpgrades
    ),
    lastKnownX: parsingPlazaSinglePlayerSavePetNullableFiniteNumber(
      recordRaw.lastKnownX
    ),
    lastKnownY: parsingPlazaSinglePlayerSavePetNullableFiniteNumber(
      recordRaw.lastKnownY
    ),
    lastKnownLayer: parsingPlazaSinglePlayerSavePetNullableFiniteNumber(
      recordRaw.lastKnownLayer
    ),
    deathCauseKind: parsingPlazaSinglePlayerSavePetNullableString(
      recordRaw.deathCauseKind
    ),
    acquiredAtMs,
    updatedAtMs,
  };
}

/** Empty roster used when save data is missing or invalid. */
export function creatingEmptyPlazaSinglePlayerSavePetRoster(): PlazaSinglePlayerSavePetRoster {
  return {
    activePetId: null,
    pets: [],
  };
}

/** Validates roster JSON and drops malformed pet rows. */
export function parsingPlazaSinglePlayerSavePetRoster(
  raw: unknown
): ParsingPlazaSinglePlayerSavePetRosterResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {
      roster: creatingEmptyPlazaSinglePlayerSavePetRoster(),
      droppedPetCount: 0,
    };
  }

  const rosterRaw = raw as ParsingPlazaSinglePlayerSavePetRosterRaw;

  if (!Array.isArray(rosterRaw.pets)) {
    return {
      roster: creatingEmptyPlazaSinglePlayerSavePetRoster(),
      droppedPetCount: 0,
    };
  }

  const pets: PlazaSinglePlayerSavePetRecord[] = [];
  let droppedPetCount = 0;

  for (const petRaw of rosterRaw.pets) {
    const parsedPet = parsingPlazaSinglePlayerSavePetRecord(petRaw);

    if (!parsedPet) {
      droppedPetCount += 1;
      continue;
    }

    pets.push(parsedPet);
  }

  const activePetId = parsingPlazaSinglePlayerSavePetNullableString(
    rosterRaw.activePetId
  );
  const resolvedActivePetId =
    activePetId !== null && pets.some((pet) => pet.petId === activePetId)
      ? activePetId
      : null;

  return {
    roster: {
      activePetId: resolvedActivePetId,
      pets,
    },
    droppedPetCount,
  };
}

/** JSON-serializable roster payload for save slots / multiplayer roster. */
export function serializingPlazaSinglePlayerSavePetRoster(
  roster: PlazaSinglePlayerSavePetRoster
): PlazaSinglePlayerSavePetRoster {
  return {
    activePetId: roster.activePetId,
    pets: roster.pets.map((pet) =>
      serializingPlazaSinglePlayerSavePetRecord(pet)
    ),
  };
}

/** Serializes one pet record for save slots / multiplayer roster. */
export function serializingPlazaSinglePlayerSavePetRecord(
  record: PlazaSinglePlayerSavePetRecord
): PlazaSinglePlayerSavePetRecord {
  return {
    ...record,
    learnedSkillIds: [...record.learnedSkillIds],
    weaponItem: record.weaponItem ? { ...record.weaponItem } : null,
    armorItem: record.armorItem ? { ...record.armorItem } : null,
    spritcoreUpgrades: { ...record.spritcoreUpgrades },
  };
}

/** Checks whether a roster has any pets worth persisting. */
export function checkingPlazaSinglePlayerSavePetRosterHasPets(
  roster: PlazaSinglePlayerSavePetRoster | null | undefined
): boolean {
  return Boolean(roster && roster.pets.length > 0);
}
