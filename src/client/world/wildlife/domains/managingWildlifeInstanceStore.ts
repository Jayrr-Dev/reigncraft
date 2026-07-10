/**
 * Wildlife instance store with hydrate/despawn radius management.
 *
 * @module components/world/wildlife/domains/managingWildlifeInstanceStore
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { creatingWildlifeSpawnHealthState } from '@/components/world/wildlife/domains/creatingWildlifeSpawnHealthState';
import { DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeAggroState,
  DefiningWildlifeAiState,
  DefiningWildlifeHungerState,
  DefiningWildlifeInstance,
  DefiningWildlifePendingRespawn,
  DefiningWildlifeSpawnAnchor,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';
import { resolvingWildlifeAggressionLevelFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeInstanceBaseMaxHealth } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { resolvingWildlifeLargeSizeFrameFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor';
import { resolvingWildlifePendingRespawnThinkAnchor } from '@/components/world/wildlife/domains/resolvingWildlifePendingRespawnThinkAnchor';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import { resolvingWildlifeSleepBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor';
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

export type ManagingWildlifeInstanceStore = {
  instances: Map<string, DefiningWildlifeInstance>;
  knownAnchorIds: Set<string>;
  pendingRespawns: Map<string, DefiningWildlifePendingRespawn>;
  lastHydratedAtMs: number;
};

export function creatingWildlifeInstanceStore(): ManagingWildlifeInstanceStore {
  return {
    instances: new Map(),
    knownAnchorIds: new Set(),
    pendingRespawns: new Map(),
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
    attackComboIndex: 0,
    howlingUntilMs: null,
    lastHowlAtMs: null,
    howlSummon: null,
    jumpState: null,
    lastJumpEndedAtMs: null,
    startledUntilMs: null,
    chargeWindupStartedAtMs: null,
    hasUsedBluffCharge: false,
    bluffChargePlayerExitedTerritory: false,
    bluffReturnPoint: null,
    fleeTargetPoint: null,
    pendingGroundFoodBite: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    docileFollowUntilMs: null,
    docileLastReactAtMs: null,
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
    lastAggroedAtMs: null,
    stalkingPreySinceMs: null,
    stalkConfidentSinceMs: null,
    stalkAttackingPreySinceMs: null,
    stalkPhase: 'idle',
    stalkPhaseEnteredAtMs: null,
    pendingStalkEvents: [],
  };
}

export type CreatingWildlifeInstanceAtPositionParams = {
  instanceId: string;
  anchorId: string;
  species: DefiningWildlifeSpeciesDefinition;
  position: DefiningWorldPlazaWorldPoint;
  spawnAnchor: DefiningWorldPlazaWorldPoint;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  sleepScheduleSample: number;
  sizeScaleSample: number;
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null;
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
  sleepScheduleSample,
  sizeScaleSample,
  largeSizeFrame,
  thinkScheduleAnchor,
  nowMs,
}: CreatingWildlifeInstanceAtPositionParams): DefiningWildlifeInstance {
  const spawnHealthProfile = {
    speciesId: species.speciesId,
    aggressionLevel,
    sizeScaleSample,
    largeSizeFrame,
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
    sleepScheduleSample,
    sizeScaleSample,
    largeSizeFrame,
    packAlphaInstanceId: null,
    packAlphaDeathScatterUntilMs: null,
    customDisplayName: null,
    spawnAnchor,
    position,
    facingDirection: 'Down',
    healthState: creatingWildlifeSpawnHealthState(
      baseMaxHealth,
      largeSizeFrame,
      species
    ),
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
    hasBeenStudied: false,
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
  const isOmegaWolf = checkingWildlifeOmegaWolfSpecies(anchor.speciesId);
  const aggressionLevel: DefiningWildlifeAggressionLevel = isOmegaWolf
    ? 'aggressive'
    : resolvingWildlifeAggressionLevelFromAnchor(anchor, species);
  const sleepScheduleSample =
    resolvingWildlifeSleepBellCurveSampleFromAnchor(anchor);
  const sizeScaleSample = isOmegaWolf
    ? 3
    : resolvingWildlifeSizeBellCurveSampleFromAnchor(anchor);
  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    sizeScaleSample,
    species
  );
  const largeSizeFrame: DefiningWildlifeLargeSizeFrame | null = isOmegaWolf
    ? 'apex'
    : resolvingWildlifeLargeSizeFrameFromAnchor(anchor, sizeTier);
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
    sleepScheduleSample,
    sizeScaleSample,
    largeSizeFrame,
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
 * Forgets streamed-out anchors once their spawn leaves the despawn radius so
 * wildlife can hydrate again when the player returns to the area.
 */
function pruningWildlifeKnownAnchorsOutsideDespawnRadius(
  store: ManagingWildlifeInstanceStore,
  center: DefiningWorldPlazaWorldPoint
): void {
  for (const anchorId of [...store.knownAnchorIds]) {
    if (store.instances.has(anchorId) || store.pendingRespawns.has(anchorId)) {
      continue;
    }

    const parsedAnchor = parsingWildlifeProceduralAnchorId(anchorId);

    if (!parsedAnchor) {
      continue;
    }

    // Tile center is enough for prune radius; pack offsets are ≤1.2 grid.
    if (
      checkingWildlifePointWithinRadius(
        {
          x: parsedAnchor.tileX + 0.5,
          y: parsedAnchor.tileY + 0.5,
          layer: 1,
        },
        center,
        DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID
      )
    ) {
      continue;
    }

    store.knownAnchorIds.delete(anchorId);
  }
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
  nowMs: number,
  cyclePhase?: number
): void {
  if (
    nowMs - store.lastHydratedAtMs <
    DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS
  ) {
    return;
  }

  store.lastHydratedAtMs = nowMs;
  pruningWildlifeKnownAnchorsOutsideDespawnRadius(store, center);

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
          packIndex,
          cyclePhase
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

        if (
          store.instances.has(anchor.anchorId) ||
          store.pendingRespawns.has(anchor.anchorId) ||
          store.knownAnchorIds.has(anchor.anchorId)
        ) {
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
 * Removes live instances beyond the despawn radius from the store.
 * Keeps `knownAnchorIds` so fled animals are not recreated at their spawn
 * while the player is still fighting nearby.
 */
export function despawningWildlifeInstancesBeyondRadius(
  store: ManagingWildlifeInstanceStore,
  center: DefiningWorldPlazaWorldPoint,
  _nowMs = 0
): void {
  for (const [instanceId, instance] of store.instances) {
    if (instance.isDead) {
      continue;
    }

    if (
      !checkingWildlifePointWithinRadius(
        instance.position,
        center,
        DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID
      )
    ) {
      store.instances.delete(instanceId);
    }
  }
}

/**
 * Queues a dead instance for distant random respawn and clears its live slot.
 * Night-only species (Omega Wolf) never enter the pending ring: random respawn
 * would drop them 20–26 tiles from the player and feel like endless elite spawns.
 * Their spawn tile stays in `knownAnchorIds` so night hydrate cannot recreate
 * them until the player leaves the despawn radius.
 */
export function queueingWildlifePendingRespawnFromDeadInstance(
  store: ManagingWildlifeInstanceStore,
  instance: DefiningWildlifeInstance
): void {
  if (!instance.isDead || instance.diedAtMs === null) {
    return;
  }

  store.pendingRespawns.delete(instance.anchorId);

  if (checkingWildlifeSpeciesIsNightOnlySpawn(instance.speciesId)) {
    store.knownAnchorIds.add(instance.anchorId);
    return;
  }

  store.knownAnchorIds.delete(instance.anchorId);
  store.pendingRespawns.set(instance.anchorId, {
    anchorId: instance.anchorId,
    speciesId: instance.speciesId,
    aggressionLevel: instance.aggressionLevel,
    sleepScheduleSample: instance.sleepScheduleSample,
    sizeScaleSample: instance.sizeScaleSample,
    largeSizeFrame: instance.largeSizeFrame ?? null,
    spawnAnchor: instance.spawnAnchor,
    thinkScheduleAnchor: resolvingWildlifePendingRespawnThinkAnchor(instance),
    deathPosition: {
      x: instance.position.x,
      y: instance.position.y,
      layer: instance.position.layer,
    },
    diedAtMs: instance.diedAtMs,
    placementSeed: instance.diedAtMs,
  });
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
  resolveCollisionRadiusGrid: (instance: DefiningWildlifeInstance) => number
): DefiningWildlifeInstance | null {
  const liveInstances = listingWildlifeInstances(store);

  if (liveInstances.length === 0) {
    return null;
  }

  const maxHitRadius =
    Math.max(
      ...liveInstances.map(
        (instance) =>
          resolveCollisionRadiusGrid(instance) +
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
      resolveCollisionRadiusGrid(instance) +
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

/** Returns one instance by id, or null. */
export function gettingWildlifeInstance(
  store: ManagingWildlifeInstanceStore,
  instanceId: string
): DefiningWildlifeInstance | null {
  return store.instances.get(instanceId) ?? null;
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
  store.pendingRespawns.clear();
}
