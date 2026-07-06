/**
 * Wildlife instance store with hydrate/despawn radius management.
 *
 * @module components/world/wildlife/domains/managingWildlifeInstanceStore
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeAiState,
  DefiningWildlifeHungerState,
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeSpawnAtTileIndex,
  resolvingWildlifeSpawnPositionFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';

/** Radius around the player where wildlife instances are simulated. */
export const DEFINING_WILDLIFE_SIM_RADIUS_GRID = 28;

/** Radius beyond which instances are despawned. */
export const DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID = 36;

export type ManagingWildlifeInstanceStore = {
  instances: Map<string, DefiningWildlifeInstance>;
  knownAnchorIds: Set<string>;
};

export function creatingWildlifeInstanceStore(): ManagingWildlifeInstanceStore {
  return {
    instances: new Map(),
    knownAnchorIds: new Set(),
  };
}

function creatingWildlifeInitialHungerState(): DefiningWildlifeHungerState {
  return {
    hungerRatio: 0.85,
    driveLevel: 'sated',
    lastFedAtMs: null,
  };
}

function creatingWildlifeInitialAiState(): DefiningWildlifeAiState {
  return {
    intent: { mode: 'idle' },
    facingDirection: 'Down',
    motionClip: 'idle',
    isMoving: false,
    lastThinkAtMs: 0,
    wanderTarget: null,
  };
}

function creatingWildlifeInitialAggroState(): DefiningWildlifeAggroState {
  return {
    threats: [],
    activeTargetId: null,
    lastDamagedAtMs: null,
  };
}

function creatingWildlifeInstanceFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeInstance {
  const spawnPosition = resolvingWildlifeSpawnPositionFromAnchor(anchor);

  return {
    instanceId: anchor.anchorId,
    speciesId: anchor.speciesId,
    anchorId: anchor.anchorId,
    spawnAnchor: { x: spawnPosition.x, y: spawnPosition.y, layer: 1 },
    position: { x: spawnPosition.x, y: spawnPosition.y, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: species.vitals.baseMaxHealth,
      currentHealth: species.vitals.baseMaxHealth,
    },
    hungerState: creatingWildlifeInitialHungerState(),
    aiState: creatingWildlifeInitialAiState(),
    aggroState: creatingWildlifeInitialAggroState(),
    isDead: false,
    diedAtMs: null,
  };
}

function checkingWildlifePointWithinRadius(
  point: DefiningWorldPlazaWorldPoint,
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number
): boolean {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;

  return deltaX * deltaX + deltaY * deltaY <= radiusGrid * radiusGrid;
}

/**
 * Hydrates wildlife instances for spawn anchors entering the sim radius.
 */
export function hydratingWildlifeInstancesNearPoint(
  store: ManagingWildlifeInstanceStore,
  center: DefiningWorldPlazaWorldPoint,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null,
  nowMs: number
): void {
  const minTileX = Math.floor(center.x - DEFINING_WILDLIFE_SIM_RADIUS_GRID);
  const maxTileX = Math.ceil(center.x + DEFINING_WILDLIFE_SIM_RADIUS_GRID);
  const minTileY = Math.floor(center.y - DEFINING_WILDLIFE_SIM_RADIUS_GRID);
  const maxTileY = Math.ceil(center.y + DEFINING_WILDLIFE_SIM_RADIUS_GRID);

  for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
      for (let packIndex = 0; packIndex < 8; packIndex += 1) {
        const anchor = resolvingWildlifeSpawnAtTileIndex(
          tileX,
          tileY,
          packIndex
        );

        if (!anchor) {
          continue;
        }

        const spawnPosition = resolvingWildlifeSpawnPositionFromAnchor(anchor);

        if (
          !checkingWildlifePointWithinRadius(
            { x: spawnPosition.x, y: spawnPosition.y, layer: 1 },
            center,
            DEFINING_WILDLIFE_SIM_RADIUS_GRID
          )
        ) {
          continue;
        }

        if (store.instances.has(anchor.anchorId)) {
          store.knownAnchorIds.add(anchor.anchorId);
          continue;
        }

        const species = resolveSpecies(anchor.speciesId);

        if (!species) {
          continue;
        }

        store.instances.set(
          anchor.anchorId,
          creatingWildlifeInstanceFromAnchor(anchor, species, nowMs)
        );
        store.knownAnchorIds.add(anchor.anchorId);
      }
    }
  }
}

/**
 * Removes instances beyond the despawn radius from the store.
 */
export function despawningWildlifeInstancesBeyondRadius(
  store: ManagingWildlifeInstanceStore,
  center: DefiningWorldPlazaWorldPoint
): void {
  for (const [instanceId, instance] of store.instances) {
    if (
      !checkingWildlifePointWithinRadius(
        instance.position,
        center,
        DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID
      )
    ) {
      store.instances.delete(instanceId);
      store.knownAnchorIds.delete(instanceId);
    }
  }
}

/** Lists live instances as an array. */
export function listingWildlifeInstances(
  store: ManagingWildlifeInstanceStore
): readonly DefiningWildlifeInstance[] {
  return [...store.instances.values()];
}

/** Replaces one instance in the store. */
export function replacingWildlifeInstance(
  store: ManagingWildlifeInstanceStore,
  instance: DefiningWildlifeInstance
): void {
  store.instances.set(instance.instanceId, instance);
}

/** Clears the store (tests / room reset). */
export function clearingWildlifeInstanceStore(
  store: ManagingWildlifeInstanceStore
): void {
  store.instances.clear();
  store.knownAnchorIds.clear();
}
