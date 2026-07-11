/**
 * Mutable store for Spirited Sprites beta preview spawns.
 *
 * Visual-only: no AI, combat, or wildlife registry coupling.
 * Positions mutate each walk tick without bumping revision.
 *
 * @module components/world/beta/spirited/domains/managingSpiritedSpritesBetaSpawnStore
 */

import type { DefiningSpiritedSpritesBetaAnimalId } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type ManagingSpiritedSpritesBetaSpawnInstance = {
  readonly instanceId: string;
  readonly animalId: DefiningSpiritedSpritesBetaAnimalId;
  readonly spawnedAtMs: number;
  /** Spawn anchor used as wander center. */
  readonly originX: number;
  readonly originY: number;
  position: DefiningWorldPlazaWorldPoint;
  facingFrame: number;
  velocityX: number;
  velocityY: number;
  wanderTargetX: number;
  wanderTargetY: number;
  nextRetargetAtSec: number;
  bobPhaseSec: number;
};

export type ManagingSpiritedSpritesBetaSpawnStore = {
  instances: Map<string, ManagingSpiritedSpritesBetaSpawnInstance>;
  revision: number;
};

export function creatingSpiritedSpritesBetaSpawnStore(): ManagingSpiritedSpritesBetaSpawnStore {
  return {
    instances: new Map(),
    revision: 0,
  };
}

/**
 * Lists all live Spirited beta spawn instances.
 */
export function listingSpiritedSpritesBetaSpawnInstances(
  store: ManagingSpiritedSpritesBetaSpawnStore
): readonly ManagingSpiritedSpritesBetaSpawnInstance[] {
  return [...store.instances.values()];
}

/**
 * Adds one Spirited beta spawn instance and bumps revision.
 */
export function addingSpiritedSpritesBetaSpawnInstance(
  store: ManagingSpiritedSpritesBetaSpawnStore,
  instance: ManagingSpiritedSpritesBetaSpawnInstance
): void {
  store.instances.set(instance.instanceId, instance);
  store.revision += 1;
}

/**
 * Clears every Spirited beta spawn instance.
 */
export function clearingSpiritedSpritesBetaSpawnInstances(
  store: ManagingSpiritedSpritesBetaSpawnStore
): void {
  if (store.instances.size === 0) {
    return;
  }

  store.instances.clear();
  store.revision += 1;
}
