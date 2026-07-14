/**
 * Mutable NPC instance store hydrated from the placement registry.
 *
 * @module components/world/npc/domains/managingNpcInstanceStore
 */

import { DEFINING_NPC_PLACEMENT_REGISTRY } from '@/components/world/npc/domains/definingNpcPlacementRegistry';
import { resolvingNpcSpeciesDefinition } from '@/components/world/npc/domains/definingNpcSpeciesRegistry';
import type {
  DefiningNpcId,
  DefiningNpcInstance,
  DefiningNpcPreyTarget,
} from '@/components/world/npc/domains/definingNpcTypes';
import { checkingNpcIsHuntablePrey } from '@/components/world/npc/domains/checkingNpcIsHuntablePrey';

export type ManagingNpcInstanceStore = {
  readonly instances: Map<DefiningNpcId, DefiningNpcInstance>;
};

type ManagingNpcInstanceListener = () => void;

const listeners = new Set<ManagingNpcInstanceListener>();

function creatingNpcInstanceFromPlacement(
  placement: (typeof DEFINING_NPC_PLACEMENT_REGISTRY)[number]
): DefiningNpcInstance | null {
  const species = resolvingNpcSpeciesDefinition(placement.speciesId);

  if (!species) {
    return null;
  }

  return {
    npcId: placement.npcId,
    speciesId: placement.speciesId,
    displayName: placement.displayName,
    position: { x: placement.worldX, y: placement.worldY },
    facing: 'Down',
    actionIds: species.actionIds,
    healthState: {
      currentHealth: species.baseMaxHealth,
      maxHealth: species.baseMaxHealth,
    },
    isDead: false,
    diedAtMs: null,
    motionClip: 'idle',
  };
}

function creatingNpcInstanceStore(): ManagingNpcInstanceStore {
  const instances = new Map<DefiningNpcId, DefiningNpcInstance>();

  for (const placement of DEFINING_NPC_PLACEMENT_REGISTRY) {
    const instance = creatingNpcInstanceFromPlacement(placement);

    if (instance) {
      instances.set(instance.npcId, instance);
    }
  }

  return { instances };
}

let npcInstanceStore: ManagingNpcInstanceStore = creatingNpcInstanceStore();

function notifyingNpcInstanceListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Returns the shared NPC store (hydrated once from placements). */
export function readingNpcInstanceStore(): ManagingNpcInstanceStore {
  return npcInstanceStore;
}

/** Lists every NPC instance currently in the store. */
export function listingNpcInstances(
  store: ManagingNpcInstanceStore = npcInstanceStore
): readonly DefiningNpcInstance[] {
  return [...store.instances.values()];
}

/** Returns one NPC by id, or null. */
export function gettingNpcInstance(
  npcId: DefiningNpcId,
  store: ManagingNpcInstanceStore = npcInstanceStore
): DefiningNpcInstance | null {
  return store.instances.get(npcId) ?? null;
}

/** Replaces one NPC instance and notifies listeners. */
export function settingNpcInstance(
  instance: DefiningNpcInstance,
  store: ManagingNpcInstanceStore = npcInstanceStore
): void {
  store.instances.set(instance.npcId, instance);
  notifyingNpcInstanceListeners();
}

/**
 * Applies flat damage from wildlife melee. Returns the updated instance, or
 * null when missing / already dead.
 */
export function applyingNpcInstanceDamage(
  npcId: DefiningNpcId,
  damageAmount: number,
  nowMs: number,
  store: ManagingNpcInstanceStore = npcInstanceStore
): DefiningNpcInstance | null {
  const instance = store.instances.get(npcId);

  if (!instance || instance.isDead) {
    return null;
  }

  const nextHealth = Math.max(
    0,
    instance.healthState.currentHealth - Math.max(0, damageAmount)
  );
  const isDead = nextHealth <= 0;
  const next: DefiningNpcInstance = {
    ...instance,
    healthState: {
      ...instance.healthState,
      currentHealth: nextHealth,
    },
    isDead,
    diedAtMs: isDead ? nowMs : instance.diedAtMs,
    motionClip: isDead ? 'die' : 'takeDamage',
  };

  store.instances.set(npcId, next);
  notifyingNpcInstanceListeners();

  return next;
}

/** Living NPCs as wildlife prey descriptors. */
export function listingNpcPreyTargets(
  store: ManagingNpcInstanceStore = npcInstanceStore
): readonly DefiningNpcPreyTarget[] {
  const targets: DefiningNpcPreyTarget[] = [];

  for (const instance of store.instances.values()) {
    if (!checkingNpcIsHuntablePrey(instance)) {
      continue;
    }

    const species = resolvingNpcSpeciesDefinition(instance.speciesId);

    if (!species) {
      continue;
    }

    targets.push({
      targetId: instance.npcId,
      position: instance.position,
      massKg: species.massKg,
      trophicTier: species.trophicTier,
    });
  }

  return targets;
}

/** Subscribe to NPC instance mutations (panels / labels). */
export function subscribingNpcInstanceStore(
  listener: ManagingNpcInstanceListener
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Test helper: rebuild store from placement registry. */
export function resettingNpcInstanceStoreForTests(): ManagingNpcInstanceStore {
  npcInstanceStore = creatingNpcInstanceStore();
  notifyingNpcInstanceListeners();

  return npcInstanceStore;
}
