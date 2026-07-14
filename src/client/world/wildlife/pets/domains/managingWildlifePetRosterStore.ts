/**
 * Module-level store for the bonded companion roster.
 *
 * LocalStorage is the hot cache. Signed-in single-player also mirrors the
 * roster into the Devvit Redis save slot.
 *
 * @module components/world/wildlife/pets/domains/managingWildlifePetRosterStore
 */

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { DEFINING_WILDLIFE_PET_MAX_ACTIVE } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type {
  DefiningWildlifePetPersistedRecord,
  DefiningWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { readingWildlifePetRosterFromStorage } from '@/components/world/wildlife/pets/domains/readingWildlifePetRosterFromStorage';
import { serializingWildlifePetRoster } from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';
import { writingWildlifePetRosterToStorage } from '@/components/world/wildlife/pets/domains/writingWildlifePetRosterToStorage';
import { savingPlazaPetsMultiplayerRoster } from '@/components/world/wildlife/pets/repositories/callingPlazaPetsDevvitApi';
import type { PlazaSaveSlotIndex } from '../../../../../shared/plazaGameSession';

const managingWildlifePetRosterSubscribers = new Set<() => void>();

const MANAGING_WILDLIFE_PET_ROSTER_EMPTY_SNAPSHOT: DefiningWildlifePetRoster =
  {
    activePetId: null,
    pets: [],
  };

let managingWildlifePetRosterStorageOwnerId: string | null = null;
let managingWildlifePetRosterCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
let managingWildlifePetRosterMultiplayerMirrorEnabled = false;
let managingWildlifePetRosterPetsById = new Map<
  string,
  DefiningWildlifePetPersistedRecord
>();
let managingWildlifePetRosterActivePetId: string | null = null;
let managingWildlifePetRosterSnapshotCache: DefiningWildlifePetRoster =
  MANAGING_WILDLIFE_PET_ROSTER_EMPTY_SNAPSHOT;

function refreshingWildlifePetRosterSnapshotCache(): void {
  if (managingWildlifePetRosterPetsById.size === 0) {
    managingWildlifePetRosterSnapshotCache =
      MANAGING_WILDLIFE_PET_ROSTER_EMPTY_SNAPSHOT;
    return;
  }

  managingWildlifePetRosterSnapshotCache = {
    activePetId: managingWildlifePetRosterActivePetId,
    pets: [...managingWildlifePetRosterPetsById.values()].sort(
      (left, right) => left.acquiredAtMs - right.acquiredAtMs
    ),
  };
}

function notifyingWildlifePetRosterSubscribers(): void {
  for (const onStoreChange of managingWildlifePetRosterSubscribers) {
    onStoreChange();
  }
}

function mirroringWildlifePetRosterToCloudSave(
  options?: Readonly<{ readonly skipWhenEmpty?: boolean }>
): void {
  if (managingWildlifePetRosterCloudSaveSlotIndex === null) {
    return;
  }

  const roster = managingWildlifePetRosterSnapshotCache;
  const hasPets = roster.pets.length > 0;

  if (options?.skipWhenEmpty && !hasPets) {
    return;
  }

  void savingPlazaSinglePlayerSaveSlotData(
    managingWildlifePetRosterCloudSaveSlotIndex,
    {
      petRoster: hasPets ? roster : null,
    }
  ).catch(() => {
    // Cloud mirror is best-effort; localStorage remains source for the session.
  });
}

function mirroringWildlifePetRosterToMultiplayer(): void {
  if (!managingWildlifePetRosterMultiplayerMirrorEnabled) {
    return;
  }

  void savingPlazaPetsMultiplayerRoster(
    serializingWildlifePetRoster(managingWildlifePetRosterSnapshotCache)
  ).catch(() => {
    // Multiplayer mirror is best-effort; localStorage remains the session cache.
  });
}

function persistingWildlifePetRoster(): void {
  refreshingWildlifePetRosterSnapshotCache();
  writingWildlifePetRosterToStorage(
    managingWildlifePetRosterStorageOwnerId,
    managingWildlifePetRosterSnapshotCache
  );
  mirroringWildlifePetRosterToCloudSave();
  mirroringWildlifePetRosterToMultiplayer();
}

/**
 * Enables or disables best-effort mirroring of every roster mutation to the
 * multiplayer companion roster API. Call once the local user's online
 * session is confirmed (signed-in Reddit user in a plaza room).
 */
export function settingWildlifePetRosterMultiplayerMirrorEnabled(
  enabled: boolean
): void {
  managingWildlifePetRosterMultiplayerMirrorEnabled = enabled;
}

/**
 * Replaces the entire in-memory roster from an externally fetched snapshot
 * (the multiplayer companion roster API) without touching localStorage
 * ownership. Used to seed the store for signed-in online sessions.
 */
export function replacingWildlifePetRosterFromSnapshot(
  roster: DefiningWildlifePetRoster
): void {
  managingWildlifePetRosterPetsById = new Map(
    roster.pets.map((pet) => [pet.petId, pet])
  );
  managingWildlifePetRosterActivePetId = roster.activePetId;
  refreshingWildlifePetRosterSnapshotCache();
  notifyingWildlifePetRosterSubscribers();
}

export type InitializingWildlifePetRosterStoreOptions = {
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

/**
 * Hydrates the pet roster from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param options - Optional Redis save-slot mirror context.
 */
export function initializingWildlifePetRosterStore(
  storageOwnerId: string | null,
  options?: InitializingWildlifePetRosterStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;

  if (managingWildlifePetRosterStorageOwnerId === storageOwnerId) {
    const previousCloudSaveSlotIndex =
      managingWildlifePetRosterCloudSaveSlotIndex;
    managingWildlifePetRosterCloudSaveSlotIndex = cloudSaveSlotIndex;

    // Cloud slot arrived after local hydrate: push current roster up.
    if (previousCloudSaveSlotIndex === null && cloudSaveSlotIndex !== null) {
      mirroringWildlifePetRosterToCloudSave({ skipWhenEmpty: true });
    }

    return;
  }

  managingWildlifePetRosterStorageOwnerId = storageOwnerId;
  managingWildlifePetRosterCloudSaveSlotIndex = cloudSaveSlotIndex;
  const roster = readingWildlifePetRosterFromStorage(storageOwnerId);
  managingWildlifePetRosterPetsById = new Map(
    roster.pets.map((pet) => [pet.petId, pet])
  );
  managingWildlifePetRosterActivePetId = roster.activePetId;
  refreshingWildlifePetRosterSnapshotCache();
  notifyingWildlifePetRosterSubscribers();

  // Heal Redis from local after boot hydrate (covers failed prior mirrors).
  if (cloudSaveSlotIndex !== null) {
    mirroringWildlifePetRosterToCloudSave({ skipWhenEmpty: true });
  }
}

/** Returns a stable snapshot of the pet roster for React subscriptions. */
export function readingWildlifePetRosterSnapshot(): DefiningWildlifePetRoster {
  return managingWildlifePetRosterSnapshotCache;
}

function applyingWildlifePetRosterMutation(mutator: () => void): void {
  mutator();
  persistingWildlifePetRoster();
  notifyingWildlifePetRosterSubscribers();
}

/**
 * Deactivates every roster pet other than `keepActivePetId`, enforcing
 * {@link DEFINING_WILDLIFE_PET_MAX_ACTIVE} bonded companion(s) active at once.
 */
function enforcingWildlifePetSingleActiveInvariant(
  petsById: Map<string, DefiningWildlifePetPersistedRecord>,
  keepActivePetId: string
): void {
  for (const [petId, pet] of petsById) {
    if (petId !== keepActivePetId && pet.isActive) {
      petsById.set(petId, { ...pet, isActive: false });
    }
  }
}

/**
 * Upserts one pet record. When the record is active, all other pets are
 * deactivated so at most {@link DEFINING_WILDLIFE_PET_MAX_ACTIVE} stay active.
 *
 * @param record - Pet record to insert or replace by `petId`.
 */
export function upsertingWildlifePetRecord(
  record: DefiningWildlifePetPersistedRecord
): void {
  applyingWildlifePetRosterMutation(() => {
    const nextPetsById = new Map(managingWildlifePetRosterPetsById);
    nextPetsById.set(record.petId, record);

    if (record.isActive) {
      enforcingWildlifePetSingleActiveInvariant(nextPetsById, record.petId);
      managingWildlifePetRosterActivePetId = record.petId;
    } else if (managingWildlifePetRosterActivePetId === record.petId) {
      managingWildlifePetRosterActivePetId = null;
    }

    managingWildlifePetRosterPetsById = nextPetsById;
  });
}

/**
 * Removes one pet record from the roster.
 *
 * @param petId - Pet instance id to remove.
 */
export function removingWildlifePetRecord(petId: string): void {
  if (!managingWildlifePetRosterPetsById.has(petId)) {
    return;
  }

  applyingWildlifePetRosterMutation(() => {
    const nextPetsById = new Map(managingWildlifePetRosterPetsById);
    nextPetsById.delete(petId);
    managingWildlifePetRosterPetsById = nextPetsById;

    if (managingWildlifePetRosterActivePetId === petId) {
      managingWildlifePetRosterActivePetId = null;
    }
  });
}

/**
 * Sets the single active companion, deactivating every other roster pet.
 *
 * @param petId - Pet id to activate, or null to deactivate the roster.
 */
export function settingWildlifePetActivePetId(petId: string | null): void {
  if (petId !== null && !managingWildlifePetRosterPetsById.has(petId)) {
    return;
  }

  applyingWildlifePetRosterMutation(() => {
    const nextPetsById = new Map<string, DefiningWildlifePetPersistedRecord>();

    for (const [existingPetId, pet] of managingWildlifePetRosterPetsById) {
      const isActive = existingPetId === petId;

      nextPetsById.set(
        existingPetId,
        pet.isActive === isActive ? pet : { ...pet, isActive }
      );
    }

    if (petId !== null) {
      enforcingWildlifePetSingleActiveInvariant(nextPetsById, petId);
    }

    managingWildlifePetRosterPetsById = nextPetsById;
    managingWildlifePetRosterActivePetId = petId;
  });
}

/**
 * Merges a partial patch into an existing pet record.
 *
 * @param petId - Pet instance id to update.
 * @param patch - Partial fields to merge (petId/speciesId are ignored).
 */
export function updatingWildlifePetRecord(
  petId: string,
  patch: Partial<
    Omit<DefiningWildlifePetPersistedRecord, 'petId' | 'speciesId'>
  >
): void {
  const existing = managingWildlifePetRosterPetsById.get(petId);

  if (!existing) {
    return;
  }

  applyingWildlifePetRosterMutation(() => {
    const nextRecord: DefiningWildlifePetPersistedRecord = {
      ...existing,
      ...patch,
      updatedAtMs: patch.updatedAtMs ?? Date.now(),
    };
    const nextPetsById = new Map(managingWildlifePetRosterPetsById);
    nextPetsById.set(petId, nextRecord);

    if (nextRecord.isActive) {
      enforcingWildlifePetSingleActiveInvariant(nextPetsById, petId);
      managingWildlifePetRosterActivePetId = petId;
    } else if (managingWildlifePetRosterActivePetId === petId) {
      managingWildlifePetRosterActivePetId = null;
    }

    managingWildlifePetRosterPetsById = nextPetsById;
  });
}

/**
 * Subscribes to pet roster changes.
 *
 * @param onStoreChange - Callback invoked when the roster changes.
 */
export function subscribingWildlifePetRoster(
  onStoreChange: () => void
): () => void {
  managingWildlifePetRosterSubscribers.add(onStoreChange);

  return () => {
    managingWildlifePetRosterSubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWildlifePetRosterStoreForTests(): void {
  managingWildlifePetRosterStorageOwnerId = null;
  managingWildlifePetRosterCloudSaveSlotIndex = null;
  managingWildlifePetRosterMultiplayerMirrorEnabled = false;
  managingWildlifePetRosterPetsById = new Map();
  managingWildlifePetRosterActivePetId = null;
  refreshingWildlifePetRosterSnapshotCache();
  managingWildlifePetRosterSubscribers.clear();
}
