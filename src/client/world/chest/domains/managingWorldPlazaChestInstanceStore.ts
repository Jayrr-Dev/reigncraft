/**
 * Mutable chest instance store hydrated from the placement registry.
 *
 * @module components/world/chest/domains/managingWorldPlazaChestInstanceStore
 */

import {
  DEFINING_WORLD_PLAZA_CHEST_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE,
} from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { DEFINING_WORLD_PLAZA_CHEST_PLACEMENT_REGISTRY } from '@/components/world/chest/domains/definingWorldPlazaChestPlacementRegistry';
import type {
  DefiningWorldPlazaChestId,
  DefiningWorldPlazaChestInstance,
  DefiningWorldPlazaChestKeySource,
  DefiningWorldPlazaChestPlacement,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { checkingWorldPlazaLocalChestIsOpened } from '@/components/world/chest/domains/managingWorldPlazaLocalOpenedChests';

export type ManagingWorldPlazaChestInstanceStore = {
  readonly instances: Map<
    DefiningWorldPlazaChestId,
    DefiningWorldPlazaChestInstance
  >;
};

type ManagingWorldPlazaChestInstanceListener = () => void;

const listeners = new Set<ManagingWorldPlazaChestInstanceListener>();

function creatingWorldPlazaChestInstanceFromPlacement(
  placement: DefiningWorldPlazaChestPlacement,
  persistenceOwnerId: string | null
): DefiningWorldPlazaChestInstance {
  const wasOpened =
    persistenceOwnerId !== null &&
    checkingWorldPlazaLocalChestIsOpened(persistenceOwnerId, placement.chestId);

  return {
    chestId: placement.chestId,
    position: { x: placement.worldX, y: placement.worldY },
    facing: placement.facing,
    variant: placement.variant,
    state: wasOpened ? 'open' : placement.initialState,
    loot: placement.loot,
    collisionRadiusGrid:
      placement.collisionRadiusGrid ??
      DEFINING_WORLD_PLAZA_CHEST_COLLISION_RADIUS_GRID,
    displayScale:
      placement.displayScale ?? DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE,
    keySource: placement.keySource,
    keyWildlifeSpeciesId: placement.keyWildlifeSpeciesId,
  };
}

function creatingWorldPlazaChestInstanceStore(
  persistenceOwnerId: string | null = null
): ManagingWorldPlazaChestInstanceStore {
  const instances = new Map<
    DefiningWorldPlazaChestId,
    DefiningWorldPlazaChestInstance
  >();

  for (const placement of DEFINING_WORLD_PLAZA_CHEST_PLACEMENT_REGISTRY) {
    const instance = creatingWorldPlazaChestInstanceFromPlacement(
      placement,
      persistenceOwnerId
    );
    instances.set(instance.chestId, instance);
  }

  return { instances };
}

let chestInstanceStore: ManagingWorldPlazaChestInstanceStore =
  creatingWorldPlazaChestInstanceStore();

function notifyingWorldPlazaChestInstanceListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Returns the shared chest store. */
export function readingWorldPlazaChestInstanceStore(): ManagingWorldPlazaChestInstanceStore {
  return chestInstanceStore;
}

/**
 * Rebuilds the store from the placement registry, applying opened persistence.
 */
export function hydratingWorldPlazaChestInstanceStore(
  persistenceOwnerId: string | null
): ManagingWorldPlazaChestInstanceStore {
  chestInstanceStore = creatingWorldPlazaChestInstanceStore(persistenceOwnerId);
  notifyingWorldPlazaChestInstanceListeners();
  return chestInstanceStore;
}

/** Lists every chest instance. */
export function listingWorldPlazaChestInstances(
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): readonly DefiningWorldPlazaChestInstance[] {
  return [...store.instances.values()];
}

/** Returns one chest by id, or null. */
export function gettingWorldPlazaChestInstance(
  chestId: DefiningWorldPlazaChestId,
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): DefiningWorldPlazaChestInstance | null {
  return store.instances.get(chestId) ?? null;
}

/**
 * Inserts a chest from placement when missing. Existing instances are unchanged.
 * Returns true when a new instance was added.
 */
export function upsertingWorldPlazaChestInstanceFromPlacement(
  placement: DefiningWorldPlazaChestPlacement,
  persistenceOwnerId: string | null,
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): boolean {
  if (store.instances.has(placement.chestId)) {
    return false;
  }

  const instance = creatingWorldPlazaChestInstanceFromPlacement(
    placement,
    persistenceOwnerId
  );

  store.instances.set(instance.chestId, instance);
  notifyingWorldPlazaChestInstanceListeners();

  return true;
}

/** Lists locked chest instances still awaiting a key or open action. */
export function listingWorldPlazaLockedChestInstances(
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): readonly DefiningWorldPlazaChestInstance[] {
  return listingWorldPlazaChestInstances(store).filter(
    (instance) => instance.state === 'locked'
  );
}

/** Key sources that still have at least one locked chest in the store. */
export function listingWorldPlazaActiveLockedChestKeySources(
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): ReadonlySet<DefiningWorldPlazaChestKeySource> {
  const activeSources = new Set<DefiningWorldPlazaChestKeySource>();

  for (const instance of store.instances.values()) {
    if (instance.state !== 'locked' || !instance.keySource) {
      continue;
    }

    activeSources.add(instance.keySource);
  }

  return activeSources;
}

/**
 * Opens a closed chest. Locked and already-open chests are unchanged.
 * Returns the updated instance, or null when missing / not closed.
 */
export function openingWorldPlazaChest(
  chestId: DefiningWorldPlazaChestId,
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): DefiningWorldPlazaChestInstance | null {
  const instance = store.instances.get(chestId);

  if (!instance || instance.state !== 'closed') {
    return null;
  }

  const next: DefiningWorldPlazaChestInstance = {
    ...instance,
    state: 'open',
  };

  store.instances.set(chestId, next);
  notifyingWorldPlazaChestInstanceListeners();

  return next;
}

/**
 * Unlocks and opens a locked chest. Closed and already-open chests are unchanged.
 * Returns the updated instance, or null when missing / not locked.
 */
export function unlockingAndOpeningWorldPlazaChest(
  chestId: DefiningWorldPlazaChestId,
  store: ManagingWorldPlazaChestInstanceStore = chestInstanceStore
): DefiningWorldPlazaChestInstance | null {
  const instance = store.instances.get(chestId);

  if (!instance || instance.state !== 'locked') {
    return null;
  }

  const next: DefiningWorldPlazaChestInstance = {
    ...instance,
    state: 'open',
  };

  store.instances.set(chestId, next);
  notifyingWorldPlazaChestInstanceListeners();

  return next;
}

/** Subscribe to chest instance mutations (layer / labels). */
export function subscribingWorldPlazaChestInstanceStore(
  listener: ManagingWorldPlazaChestInstanceListener
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Test helper: rebuild store from placement registry without persistence. */
export function resettingWorldPlazaChestInstanceStoreForTests(): ManagingWorldPlazaChestInstanceStore {
  chestInstanceStore = creatingWorldPlazaChestInstanceStore(null);
  notifyingWorldPlazaChestInstanceListeners();
  return chestInstanceStore;
}
