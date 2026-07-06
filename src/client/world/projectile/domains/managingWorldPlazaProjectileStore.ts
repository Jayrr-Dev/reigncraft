import { creatingWorldPlazaProjectileInstance } from '@/components/world/projectile/domains/creatingWorldPlazaProjectileInstance';
import type {
  DefiningWorldPlazaProjectileInstance,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Ref-backed projectile instance store with idempotent spawn dedupe.
 *
 * @module components/world/projectile/domains/managingWorldPlazaProjectileStore
 */

export type ManagingWorldPlazaProjectileStore = {
  instances: DefiningWorldPlazaProjectileInstance[];
  seenProjectileIds: Set<string>;
};

export function creatingWorldPlazaProjectileStore(): ManagingWorldPlazaProjectileStore {
  return {
    instances: [],
    seenProjectileIds: new Set(),
  };
}

/**
 * Spawns a projectile if its id has not been seen before.
 */
export function spawningWorldPlazaProjectile(
  store: ManagingWorldPlazaProjectileStore,
  request: SpawningWorldPlazaProjectileRequest
): string | null {
  const instance = creatingWorldPlazaProjectileInstance(request);
  if (!instance) {
    return null;
  }

  if (store.seenProjectileIds.has(instance.projectileId)) {
    return null;
  }

  store.seenProjectileIds.add(instance.projectileId);
  store.instances.push(instance);
  return instance.projectileId;
}

/**
 * Replaces live instances after a simulation step.
 */
export function replacingWorldPlazaProjectileStoreInstances(
  store: ManagingWorldPlazaProjectileStore,
  instances: readonly DefiningWorldPlazaProjectileInstance[]
): void {
  store.instances = [...instances];
}

/**
 * Clears all projectile instances (tests / room reset).
 */
export function clearingWorldPlazaProjectileStore(
  store: ManagingWorldPlazaProjectileStore
): void {
  store.instances = [];
  store.seenProjectileIds.clear();
}
