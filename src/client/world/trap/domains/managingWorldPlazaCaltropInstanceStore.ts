/**
 * Mutable store for player-placed caltrop instances.
 *
 * @module components/world/trap/domains/managingWorldPlazaCaltropInstanceStore
 */

import type {
  DefiningWorldPlazaCaltropId,
  DefiningWorldPlazaCaltropInstance,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';

export type ManagingWorldPlazaCaltropInstanceStore = {
  readonly instances: Map<
    DefiningWorldPlazaCaltropId,
    DefiningWorldPlazaCaltropInstance
  >;
};

type ManagingWorldPlazaCaltropInstanceListener = () => void;

const listeners = new Set<ManagingWorldPlazaCaltropInstanceListener>();

let caltropInstanceStore: ManagingWorldPlazaCaltropInstanceStore = {
  instances: new Map(),
};

let nextTrapSerial = 1;

function notifyingWorldPlazaCaltropInstanceListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function mintingWorldPlazaCaltropId(): DefiningWorldPlazaCaltropId {
  const id = `caltrop-${nextTrapSerial}`;
  nextTrapSerial += 1;
  return id;
}

/** Returns the shared caltrop store. */
export function readingWorldPlazaCaltropInstanceStore(): ManagingWorldPlazaCaltropInstanceStore {
  return caltropInstanceStore;
}

/** Lists every caltrop instance. */
export function listingWorldPlazaCaltropInstances(
  store: ManagingWorldPlazaCaltropInstanceStore = caltropInstanceStore
): readonly DefiningWorldPlazaCaltropInstance[] {
  return [...store.instances.values()];
}

/** Returns one caltrop by id, or null. */
export function gettingWorldPlazaCaltropInstance(
  trapId: DefiningWorldPlazaCaltropId,
  store: ManagingWorldPlazaCaltropInstanceStore = caltropInstanceStore
): DefiningWorldPlazaCaltropInstance | null {
  return store.instances.get(trapId) ?? null;
}

/**
 * Places a caltrop at a world point. Returns the new instance.
 */
export function placingWorldPlazaCaltrop(params: {
  readonly worldX: number;
  readonly worldY: number;
  readonly ownerId: string | null;
  readonly trapId?: DefiningWorldPlazaCaltropId;
  readonly store?: ManagingWorldPlazaCaltropInstanceStore;
}): DefiningWorldPlazaCaltropInstance {
  const store = params.store ?? caltropInstanceStore;
  const instance: DefiningWorldPlazaCaltropInstance = {
    trapId: params.trapId ?? mintingWorldPlazaCaltropId(),
    position: { x: params.worldX, y: params.worldY },
    ownerId: params.ownerId,
  };

  store.instances.set(instance.trapId, instance);
  notifyingWorldPlazaCaltropInstanceListeners();
  return instance;
}

/** Removes a caltrop from the world. */
export function removingWorldPlazaCaltrop(
  trapId: DefiningWorldPlazaCaltropId,
  store: ManagingWorldPlazaCaltropInstanceStore = caltropInstanceStore
): boolean {
  const removed = store.instances.delete(trapId);

  if (removed) {
    notifyingWorldPlazaCaltropInstanceListeners();
  }

  return removed;
}

/** Replaces store contents (local persistence hydrate). */
export function hydratingWorldPlazaCaltropInstanceStore(
  instances: readonly DefiningWorldPlazaCaltropInstance[]
): ManagingWorldPlazaCaltropInstanceStore {
  const next = new Map<
    DefiningWorldPlazaCaltropId,
    DefiningWorldPlazaCaltropInstance
  >();

  for (const instance of instances) {
    next.set(instance.trapId, instance);
  }

  caltropInstanceStore = { instances: next };
  notifyingWorldPlazaCaltropInstanceListeners();
  return caltropInstanceStore;
}

/** Subscribe to caltrop instance mutations (layer / labels). */
export function subscribingWorldPlazaCaltropInstanceStore(
  listener: ManagingWorldPlazaCaltropInstanceListener
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test helper: clear all caltrops. */
export function resettingWorldPlazaCaltropInstanceStoreForTests(): ManagingWorldPlazaCaltropInstanceStore {
  caltropInstanceStore = { instances: new Map() };
  nextTrapSerial = 1;
  notifyingWorldPlazaCaltropInstanceListeners();
  return caltropInstanceStore;
}
