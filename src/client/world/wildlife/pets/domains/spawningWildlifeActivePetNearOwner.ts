/**
 * Spawns (or finds) the live wildlife instance for the active bonded pet.
 *
 * @module components/world/wildlife/pets/domains/spawningWildlifeActivePetNearOwner
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { creatingWildlifePetBondStateFromPersistedRecord } from '@/components/world/wildlife/pets/domains/creatingWildlifePetPersistedRecord';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { updatingWildlifePetRecord } from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';

/** Offset from the owner where a freshly spawned pet appears (grid units). */
const DEFINING_WILDLIFE_PET_SPAWN_OFFSET_GRID = 1.5;

export type SpawningWildlifeActivePetNearOwnerParams = {
  store: ManagingWildlifeInstanceStore;
  ownerUserId: string;
  ownerPosition: DefiningWorldPlazaWorldPoint;
  record: DefiningWildlifePetPersistedRecord;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  nowMs: number;
};

/** Stable per-pet instance id so re-spawns bind to the same live instance. */
export function formattingWildlifePetInstanceId(petId: string): string {
  return `wildlife:pet:${petId}`;
}

function findingWildlifeInstanceByPetId(
  store: ManagingWildlifeInstanceStore,
  petId: string
): DefiningWildlifeInstance | null {
  for (const instance of store.instances.values()) {
    if (instance.petBond?.petId === petId) {
      return instance;
    }
  }

  return null;
}

/**
 * Returns the live instance for the roster's active pet, spawning it near
 * the owner (restoring health/hunger/stamina from the record) when it is
 * not already present in the store.
 *
 * Dead companions (saved health ≤ 0) are not respawned — that would recreate
 * a corpse, re-run death loot, and spam meat every spawn interval.
 */
export function spawningWildlifeActivePetNearOwner({
  store,
  ownerUserId,
  ownerPosition,
  record,
  resolveSpecies,
  nowMs,
}: SpawningWildlifeActivePetNearOwnerParams): DefiningWildlifeInstance | null {
  const existingInstance = findingWildlifeInstanceByPetId(store, record.petId);

  if (existingInstance) {
    return existingInstance;
  }

  if (record.healthCurrent !== null && record.healthCurrent <= 0) {
    // Dead record stays for revive; just free the living-active slot.
    if (record.isActive) {
      updatingWildlifePetRecord(record.petId, {
        isActive: false,
        healthCurrent: 0,
        updatedAtMs: nowMs,
      });
    }

    return null;
  }

  const species = resolveSpecies(record.speciesId);

  if (!species) {
    return null;
  }

  const instanceId = formattingWildlifePetInstanceId(record.petId);
  const spawnPoint: DefiningWorldPlazaWorldPoint = {
    x: ownerPosition.x + DEFINING_WILDLIFE_PET_SPAWN_OFFSET_GRID,
    y: ownerPosition.y + DEFINING_WILDLIFE_PET_SPAWN_OFFSET_GRID,
    layer: ownerPosition.layer,
  };
  const thinkScheduleAnchor: DefiningWildlifeSpawnAnchor = {
    anchorId: instanceId,
    tileX: Math.floor(spawnPoint.x),
    tileY: Math.floor(spawnPoint.y),
    speciesId: record.speciesId,
    packIndex: 0,
    packSize: 1,
    seed: 0,
  };
  const petBond = creatingWildlifePetBondStateFromPersistedRecord(
    record,
    ownerUserId
  );

  const freshInstance = creatingWildlifeInstanceAtPosition({
    instanceId,
    anchorId: instanceId,
    species,
    position: spawnPoint,
    spawnAnchor: spawnPoint,
    aggressionLevel: record.aggressionLevel,
    sleepScheduleSample: 0,
    sizeScaleSample: record.sizeScaleSample,
    largeSizeFrame: null,
    thinkScheduleAnchor,
    nowMs,
    petBond,
    customDisplayName: record.displayName,
  });

  const restoredHealth =
    record.healthCurrent === null
      ? freshInstance.healthState.currentHealth
      : Math.min(
          Math.max(record.healthCurrent, 1),
          freshInstance.healthState.baseMaxHealth
        );

  const restoredInstance: DefiningWildlifeInstance = {
    ...freshInstance,
    healthState: {
      ...freshInstance.healthState,
      currentHealth: restoredHealth,
    },
    hungerState:
      record.hungerRatio === null
        ? freshInstance.hungerState
        : { ...freshInstance.hungerState, hungerRatio: record.hungerRatio },
    staminaState:
      record.staminaRatio === null
        ? freshInstance.staminaState
        : {
            ...freshInstance.staminaState,
            staminaRatio: record.staminaRatio,
          },
  };

  store.instances.set(instanceId, restoredInstance);
  store.knownAnchorIds.add(instanceId);

  return restoredInstance;
}
