/**
 * Mutable store for player-placed bear trap instances.
 *
 * @module components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore
 */

import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type {
  DefiningWorldPlazaBearTrapId,
  DefiningWorldPlazaBearTrapInstance,
  DefiningWorldPlazaBearTrapState,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';

export type ManagingWorldPlazaBearTrapInstanceStore = {
  readonly instances: Map<
    DefiningWorldPlazaBearTrapId,
    DefiningWorldPlazaBearTrapInstance
  >;
};

type ManagingWorldPlazaBearTrapInstanceListener = () => void;

const listeners = new Set<ManagingWorldPlazaBearTrapInstanceListener>();

let bearTrapInstanceStore: ManagingWorldPlazaBearTrapInstanceStore = {
  instances: new Map(),
};

let nextTrapSerial = 1;

function notifyingWorldPlazaBearTrapInstanceListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function mintingWorldPlazaBearTrapId(): DefiningWorldPlazaBearTrapId {
  const id = `bear-trap-${nextTrapSerial}`;
  nextTrapSerial += 1;
  return id;
}

/** Returns the shared bear trap store. */
export function readingWorldPlazaBearTrapInstanceStore(): ManagingWorldPlazaBearTrapInstanceStore {
  return bearTrapInstanceStore;
}

/** Lists every trap instance. */
export function listingWorldPlazaBearTrapInstances(
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): readonly DefiningWorldPlazaBearTrapInstance[] {
  return [...store.instances.values()];
}

/** Returns one trap by id, or null. */
export function gettingWorldPlazaBearTrapInstance(
  trapId: DefiningWorldPlazaBearTrapId,
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): DefiningWorldPlazaBearTrapInstance | null {
  return store.instances.get(trapId) ?? null;
}

/**
 * Places an armed trap at a world point. Returns the new instance.
 */
export function placingWorldPlazaBearTrap(params: {
  readonly worldX: number;
  readonly worldY: number;
  readonly ownerId: string | null;
  readonly trapId?: DefiningWorldPlazaBearTrapId;
  readonly state?: DefiningWorldPlazaBearTrapState;
  readonly store?: ManagingWorldPlazaBearTrapInstanceStore;
}): DefiningWorldPlazaBearTrapInstance {
  const store = params.store ?? bearTrapInstanceStore;
  const state = params.state ?? 'armed';
  const instance: DefiningWorldPlazaBearTrapInstance = {
    trapId: params.trapId ?? mintingWorldPlazaBearTrapId(),
    position: { x: params.worldX, y: params.worldY },
    state,
    ownerId: params.ownerId,
    snapStartedAtMs: null,
    snapFrame:
      state === 'armed'
        ? DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN
        : DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.CLOSED,
  };

  store.instances.set(instance.trapId, instance);
  notifyingWorldPlazaBearTrapInstanceListeners();
  return instance;
}

/** Arms a closed trap (sprung or disarmed → armed open). */
export function armingWorldPlazaBearTrap(
  trapId: DefiningWorldPlazaBearTrapId,
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): DefiningWorldPlazaBearTrapInstance | null {
  const instance = store.instances.get(trapId);

  if (!instance || instance.state === 'armed') {
    return null;
  }

  const next: DefiningWorldPlazaBearTrapInstance = {
    ...instance,
    state: 'armed',
    snapStartedAtMs: null,
    snapFrame: DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN,
  };

  store.instances.set(trapId, next);
  notifyingWorldPlazaBearTrapInstanceListeners();
  return next;
}

/** Disarms a sprung trap (sprung → disarmed closed). */
export function disarmingWorldPlazaBearTrap(
  trapId: DefiningWorldPlazaBearTrapId,
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): DefiningWorldPlazaBearTrapInstance | null {
  const instance = store.instances.get(trapId);

  if (!instance || instance.state !== 'sprung') {
    return null;
  }

  const next: DefiningWorldPlazaBearTrapInstance = {
    ...instance,
    state: 'disarmed',
    snapStartedAtMs: null,
    snapFrame: DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.CLOSED,
  };

  store.instances.set(trapId, next);
  notifyingWorldPlazaBearTrapInstanceListeners();
  return next;
}

/**
 * Springs an armed trap: starts snap animation and marks sprung.
 */
export function springingWorldPlazaBearTrap(
  trapId: DefiningWorldPlazaBearTrapId,
  nowMs: number,
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): DefiningWorldPlazaBearTrapInstance | null {
  const instance = store.instances.get(trapId);

  if (!instance || instance.state !== 'armed') {
    return null;
  }

  const next: DefiningWorldPlazaBearTrapInstance = {
    ...instance,
    state: 'sprung',
    snapStartedAtMs: nowMs,
    snapFrame: DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN,
  };

  store.instances.set(trapId, next);
  notifyingWorldPlazaBearTrapInstanceListeners();
  return next;
}

/** Removes a trap from the world. */
export function removingWorldPlazaBearTrap(
  trapId: DefiningWorldPlazaBearTrapId,
  store: ManagingWorldPlazaBearTrapInstanceStore = bearTrapInstanceStore
): boolean {
  const removed = store.instances.delete(trapId);

  if (removed) {
    notifyingWorldPlazaBearTrapInstanceListeners();
  }

  return removed;
}

/** Replaces store contents (local persistence hydrate). */
export function hydratingWorldPlazaBearTrapInstanceStore(
  instances: readonly DefiningWorldPlazaBearTrapInstance[]
): ManagingWorldPlazaBearTrapInstanceStore {
  const next = new Map<
    DefiningWorldPlazaBearTrapId,
    DefiningWorldPlazaBearTrapInstance
  >();

  for (const instance of instances) {
    next.set(instance.trapId, instance);
  }

  bearTrapInstanceStore = { instances: next };
  notifyingWorldPlazaBearTrapInstanceListeners();
  return bearTrapInstanceStore;
}

/** Subscribe to trap instance mutations (layer / labels). */
export function subscribingWorldPlazaBearTrapInstanceStore(
  listener: ManagingWorldPlazaBearTrapInstanceListener
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test helper: clear all traps. */
export function resettingWorldPlazaBearTrapInstanceStoreForTests(): ManagingWorldPlazaBearTrapInstanceStore {
  bearTrapInstanceStore = { instances: new Map() };
  nextTrapSerial = 1;
  notifyingWorldPlazaBearTrapInstanceListeners();
  return bearTrapInstanceStore;
}
