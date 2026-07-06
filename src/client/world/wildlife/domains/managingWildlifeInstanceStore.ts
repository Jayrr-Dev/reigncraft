/**
 * Wildlife instance store with hydrate/despawn radius management.
 *
 * @module components/world/wildlife/domains/managingWildlifeInstanceStore
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeAggroState,
  DefiningWildlifeAiState,
  DefiningWildlifeHungerState,
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { resolvingWildlifeAggressionLevelFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeInstanceBaseMaxHealth } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import {
  resolvingWildlifeSpawnAtTileIndex,
  resolvingWildlifeSpawnPositionFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';
import { seedingWildlifeInitialThinkAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeThinkSchedule';

/** Radius around the player where wildlife instances are simulated. */
export const DEFINING_WILDLIFE_SIM_RADIUS_GRID = 28;

/** Radius beyond which instances are despawned. */
export const DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID = 36;

/** Minimum interval between hydrate/despawn scans (ms). */
export const DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS = 750;

/** Dead animals stay visible this long before despawning (ms). */
export const DEFINING_WILDLIFE_CORPSE_TTL_MS = 15_000;

export type ManagingWildlifeInstanceStore = {
  instances: Map<string, DefiningWildlifeInstance>;
  knownAnchorIds: Set<string>;
  lastHydratedAtMs: number;
};

export function creatingWildlifeInstanceStore(): ManagingWildlifeInstanceStore {
  return {
    instances: new Map(),
    knownAnchorIds: new Set(),
    lastHydratedAtMs: 0,
  };
}

function creatingWildlifeInitialHungerState(): DefiningWildlifeHungerState {
  return {
    hungerRatio: 0.85,
    driveLevel: 'sated',
    lastFedAtMs: null,
  };
}

function creatingWildlifeInitialAiState(
  anchor: DefiningWildlifeSpawnAnchor,
  nowMs: number
): DefiningWildlifeAiState {
  return {
    intent: { mode: 'idle' },
    facingDirection: 'Down',
    motionClip: 'idle',
    isMoving: false,
    lastThinkAtMs: seedingWildlifeInitialThinkAtMs(anchor, nowMs),
    wanderTarget: null,
    steeringCache: null,
    lastAttackAtMs: null,
    jumpState: null,
    lastJumpEndedAtMs: null,
    startledUntilMs: null,
    chargeWindupStartedAtMs: null,
    fleeTargetPoint: null,
  };
}

function creatingWildlifeInitialSpeechState(): DefiningWildlifeSpeechState {
  return {
    activeBubble: null,
    lastEmittedAtMs: null,
    lastContextKey: null,
  };
}

function creatingWildlifeInitialAggroState(): DefiningWildlifeAggroState {
  return {
    threats: [],
    activeTargetId: null,
    lastDamagedAtMs: null,
  };
}

export type CreatingWildlifeInstanceAtPositionParams = {
  instanceId: string;
  anchorId: string;
  species: DefiningWildlifeSpeciesDefinition;
  position: DefiningWorldPlazaWorldPoint;
  spawnAnchor: DefiningWorldPlazaWorldPoint;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  thinkScheduleAnchor: DefiningWildlifeSpawnAnchor;
  nowMs: number;
};

/** Creates one wildlife instance at an explicit world position. */
export function creatingWildlifeInstanceAtPosition({
  instanceId,
  anchorId,
  species,
  position,
  spawnAnchor,
  aggressionLevel,
  thinkScheduleAnchor,
  nowMs,
}: CreatingWildlifeInstanceAtPositionParams): DefiningWildlifeInstance {
  const spawnHealthProfile = {
    speciesId: species.speciesId,
    aggressionLevel,
  };
  const baseMaxHealth = resolvingWildlifeInstanceBaseMaxHealth(
    species,
    spawnHealthProfile
  );

  return {
    instanceId,
    speciesId: species.speciesId,
    anchorId,
    aggressionLevel,
    spawnAnchor,
    position,
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth,
      currentHealth: baseMaxHealth,
    },
    hungerState: creatingWildlifeInitialHungerState(),
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: creatingWildlifeInitialAiState(thinkScheduleAnchor, nowMs),
    aggroState: creatingWildlifeInitialAggroState(),
    floatingTexts: [],
    speechState: creatingWildlifeInitialSpeechState(),
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
  };
}

function creatingWildlifeInstanceFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeInstance {
  const spawnPosition = resolvingWildlifeSpawnPositionFromAnchor(anchor);
  const spawnLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
    anchor.tileX,
    anchor.tileY,
    []
  );
  const aggressionLevel = resolvingWildlifeAggressionLevelFromAnchor(
    anchor,
    species
  );
  const spawnPoint = {
    x: spawnPosition.x,
    y: spawnPosition.y,
    layer: spawnLayer,
  };

  return creatingWildlifeInstanceAtPosition({
    instanceId: anchor.anchorId,
    anchorId: anchor.anchorId,
    species,
    position: spawnPoint,
    spawnAnchor: spawnPoint,
    aggressionLevel,
    thinkScheduleAnchor: anchor,
    nowMs,
  });
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
  if (
    nowMs - store.lastHydratedAtMs <
    DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS
  ) {
    return;
  }

  store.lastHydratedAtMs = nowMs;

  const modulus = DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS;
  const minTileX =
    Math.ceil((center.x - DEFINING_WILDLIFE_SIM_RADIUS_GRID) / modulus) *
    modulus;
  const maxTileX = Math.floor(center.x + DEFINING_WILDLIFE_SIM_RADIUS_GRID);
  const minTileY =
    Math.ceil((center.y - DEFINING_WILDLIFE_SIM_RADIUS_GRID) / modulus) *
    modulus;
  const maxTileY = Math.floor(center.y + DEFINING_WILDLIFE_SIM_RADIUS_GRID);

  // Only anchor tiles (modulus-aligned) can spawn, so skip everything else.
  for (let tileX = minTileX; tileX <= maxTileX; tileX += modulus) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY += modulus) {
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
  center: DefiningWorldPlazaWorldPoint,
  nowMs = 0
): void {
  for (const [instanceId, instance] of store.instances) {
    const isCorpseExpired =
      instance.isDead &&
      instance.diedAtMs !== null &&
      nowMs - instance.diedAtMs > DEFINING_WILDLIFE_CORPSE_TTL_MS;

    if (
      isCorpseExpired ||
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

/** Extra grid padding around an animal's collision circle for click hit-tests. */
export const DEFINING_WILDLIFE_CLICK_HITBOX_PADDING_GRID = 0.45;

/** Max distance from the player at which a click counts as a melee hit. */
export const DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID = 1.8;

/**
 * Finds the closest live animal whose hitbox contains the grid point.
 */
export function findingWildlifeInstanceAtGridPoint(
  store: ManagingWildlifeInstanceStore,
  gridPoint: { x: number; y: number },
  resolveCollisionRadiusGrid: (speciesId: string) => number
): DefiningWildlifeInstance | null {
  const liveInstances = listingWildlifeInstances(store);

  if (liveInstances.length === 0) {
    return null;
  }

  const maxHitRadius =
    Math.max(
      ...liveInstances.map(
        (instance) =>
          resolveCollisionRadiusGrid(instance.speciesId) +
          DEFINING_WILDLIFE_CLICK_HITBOX_PADDING_GRID
      )
    ) + 0.5;
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
  const candidates = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: gridPoint,
    radiusGrid: maxHitRadius,
  });

  let closest: DefiningWildlifeInstance | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const instance of candidates) {
    const hitRadius =
      resolveCollisionRadiusGrid(instance.speciesId) +
      DEFINING_WILDLIFE_CLICK_HITBOX_PADDING_GRID;
    const distance = Math.hypot(
      instance.position.x - gridPoint.x,
      instance.position.y - gridPoint.y
    );

    if (distance <= hitRadius && distance < closestDistance) {
      closest = instance;
      closestDistance = distance;
    }
  }

  return closest;
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
