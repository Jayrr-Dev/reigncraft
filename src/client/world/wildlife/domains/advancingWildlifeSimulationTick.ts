/**
 * Main wildlife simulation tick orchestrator.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSimulationTick
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import {
  advancingWildlifeAggroTick,
  applyingWildlifeDamageThreat,
  sharingWildlifePackThreat,
} from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';
import {
  advancingWildlifeHungerTick,
  refillingWildlifeHungerAfterKill,
} from '@/components/world/wildlife/domains/advancingWildlifeHungerTick';
import { advancingWildlifeStaminaTick } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS } from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { computingWildlifeSelectedPreyInstanceId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeNetworkSnapshot,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { formattingWildlifeIntentKey } from '@/components/world/wildlife/domains/formattingWildlifeIntentKey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  despawningWildlifeInstancesBeyondRadius,
  hydratingWildlifeInstancesNearPoint,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
  type ManagingWildlifeSpatialGrid,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { checkingWildlifeShouldThink } from '@/components/world/wildlife/domains/resolvingWildlifeThinkSchedule';

/** @deprecated Use `DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS` from ai LOD constants. */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_MS =
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS;

const DEFINING_WILDLIFE_MELEE_RANGE_GRID = 1.1;
const DEFINING_WILDLIFE_MELEE_COOLDOWN_MS = 900;

export type AdvancingWildlifeSimulationTickParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  deltaSeconds: number;
  nowMs: number;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  onPlayerDamaged?: (damageAmount: number) => void;
  isLeader: boolean;
  remoteSnapshots?: readonly DefiningWildlifeNetworkSnapshot[];
};

export type AdvancingWildlifeSimulationTickResult = {
  snapshots: readonly DefiningWildlifeNetworkSnapshot[];
  /** Push applied to the player so they cannot pass through animals. */
  playerPushOut: { x: number; y: number } | null;
};

/** Player body radius used for animal-vs-player collision (grid units). */
const DEFINING_WILDLIFE_PLAYER_COLLISION_RADIUS_GRID = 0.32;

/** Max combined wildlife + player collision radius for spatial queries. */
const DEFINING_WILDLIFE_PLAYER_COLLISION_QUERY_RADIUS_GRID = 1.5;

/**
 * Resolves circle overlap between the player and live animals.
 *
 * The animal takes most of the correction (it steps aside); the remainder is
 * returned so the caller can push the player out, blocking pass-through.
 */
function resolvingWildlifePlayerCollision(
  instances: Map<string, DefiningWildlifeInstance>,
  playerPosition: DefiningWorldPlazaWorldPoint,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null,
  spatialGrid: ManagingWildlifeSpatialGrid
): { x: number; y: number } | null {
  let pushX = 0;
  let pushY = 0;
  let hasPush = false;

  const candidates = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: playerPosition,
    radiusGrid: DEFINING_WILDLIFE_PLAYER_COLLISION_QUERY_RADIUS_GRID,
  });

  for (const instance of candidates) {
    const instanceId = instance.instanceId;
    const liveInstance = instances.get(instanceId) ?? instance;

    if (liveInstance.isDead) {
      continue;
    }

    const species = resolveSpecies(liveInstance.speciesId);

    if (!species) {
      continue;
    }

    const combinedRadius =
      species.collisionRadiusGrid +
      DEFINING_WILDLIFE_PLAYER_COLLISION_RADIUS_GRID;
    const deltaX = playerPosition.x - liveInstance.position.x;
    const deltaY = playerPosition.y - liveInstance.position.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance >= combinedRadius) {
      continue;
    }

    const overlap = combinedRadius - distance;
    const directionX = distance > 0.0001 ? deltaX / distance : 1;
    const directionY = distance > 0.0001 ? deltaY / distance : 0;

    instances.set(instanceId, {
      ...liveInstance,
      position: {
        x: liveInstance.position.x - directionX * overlap * 0.6,
        y: liveInstance.position.y - directionY * overlap * 0.6,
        layer: liveInstance.position.layer,
      },
    });

    pushX += directionX * overlap * 0.4;
    pushY += directionY * overlap * 0.4;
    hasPush = true;
  }

  return hasPush ? { x: pushX, y: pushY } : null;
}

function buildingWildlifeBehaviorNeighborLists(
  liveInstances: readonly DefiningWildlifeInstance[]
): Map<string, readonly DefiningWildlifeInstance[]> {
  const neighborsById = new Map<string, readonly DefiningWildlifeInstance[]>();

  for (const instance of liveInstances) {
    neighborsById.set(
      instance.instanceId,
      liveInstances.filter((entry) => entry.instanceId !== instance.instanceId)
    );
  }

  return neighborsById;
}

function resolvingWildlifeDistanceToPlayer(
  position: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint | null
): number {
  if (!playerPosition) {
    return 0;
  }

  return Math.hypot(
    position.x - playerPosition.x,
    position.y - playerPosition.y
  );
}

/** Distance below which a movement target counts as reached. */
const DEFINING_WILDLIFE_TARGET_ARRIVAL_RADIUS_GRID = 0.35;

function resolvingDesiredDirection(
  instance: DefiningWildlifeInstance,
  intent: DefiningWildlifeBehaviorIntent
): { x: number; y: number } {
  const targetPoint =
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'flee' ||
    intent.mode === 'wander' ||
    intent.mode === 'return'
      ? intent.targetPoint
      : null;

  if (!targetPoint) {
    return { x: 0, y: 0 };
  }

  const deltaX = targetPoint.x - instance.position.x;
  const deltaY = targetPoint.y - instance.position.y;
  const length = Math.hypot(deltaX, deltaY);

  // Arrival deadzone: without it animals orbit their target in tight circles.
  if (length <= DEFINING_WILDLIFE_TARGET_ARRIVAL_RADIUS_GRID) {
    return { x: 0, y: 0 };
  }

  return { x: deltaX / length, y: deltaY / length };
}

function applyingWildlifeMeleeAttack(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  target: DefiningWildlifeInstance | null,
  targetSpecies: DefiningWildlifeSpeciesDefinition | null,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  intent: DefiningWildlifeBehaviorIntent,
  nowMs: number,
  onPlayerDamaged?: (damageAmount: number) => void
): {
  attacker: DefiningWildlifeInstance;
  target: DefiningWildlifeInstance | null;
} {
  if (intent.mode !== 'attack') {
    return { attacker, target };
  }

  if (target && targetSpecies) {
    const distance = Math.hypot(
      attacker.position.x - target.position.x,
      attacker.position.y - target.position.y
    );

    if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      return { attacker, target };
    }

    const damageResult = computingWorldPlazaEntityHealthDamage({
      state: target.healthState,
      rawAmount: attackerSpecies.vitals.attackPower,
      kind: 'physical',
      nowMs,
      options: { skipDamageRoll: true },
    });

    const nextHealth = damageResult.state.currentHealth;
    const died = nextHealth <= 0;

    return {
      attacker: {
        ...attacker,
        hungerState: died
          ? refillingWildlifeHungerAfterKill(
              attacker.hungerState,
              attackerSpecies,
              nowMs
            )
          : attacker.hungerState,
        aiState: {
          ...attacker.aiState,
          motionClip: 'attack',
        },
      },
      target: {
        ...target,
        healthState: damageResult.state,
        isDead: died,
        diedAtMs: died ? nowMs : null,
        aiState: {
          ...target.aiState,
          motionClip: died ? 'die' : 'takeDamage',
        },
      },
    };
  }

  if (playerPosition && onPlayerDamaged) {
    const distance = Math.hypot(
      attacker.position.x - playerPosition.x,
      attacker.position.y - playerPosition.y
    );

    if (distance <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      onPlayerDamaged(attackerSpecies.vitals.attackPower);
    }
  }

  return {
    attacker: {
      ...attacker,
      aiState: { ...attacker.aiState, motionClip: 'attack' },
    },
    target,
  };
}

function buildingWildlifeNetworkSnapshots(
  instances: readonly DefiningWildlifeInstance[]
): readonly DefiningWildlifeNetworkSnapshot[] {
  return instances
    .filter((instance) => !instance.isDead)
    .map((instance) => ({
      instanceId: instance.instanceId,
      speciesId: instance.speciesId,
      x: instance.position.x,
      y: instance.position.y,
      facingDirection: instance.facingDirection,
      motionClip: instance.aiState.motionClip,
      healthCurrent: instance.healthState.currentHealth,
    }));
}

function applyingRemoteWildlifeSnapshots(
  store: ManagingWildlifeInstanceStore,
  snapshots: readonly DefiningWildlifeNetworkSnapshot[]
): void {
  for (const snapshot of snapshots) {
    const existing = store.instances.get(snapshot.instanceId);

    if (!existing) {
      continue;
    }

    replacingWildlifeInstance(store, {
      ...existing,
      position: {
        x: snapshot.x,
        y: snapshot.y,
        layer: existing.position.layer,
      },
      facingDirection:
        snapshot.facingDirection as DefiningWildlifeInstance['facingDirection'],
      healthState: {
        ...existing.healthState,
        currentHealth: snapshot.healthCurrent,
      },
      aiState: {
        ...existing.aiState,
        motionClip:
          snapshot.motionClip as DefiningWildlifeInstance['aiState']['motionClip'],
      },
    });
  }
}

/**
 * Advances one wildlife simulation frame.
 */
export function advancingWildlifeSimulationTick({
  store,
  center,
  playerPosition,
  playerUserId,
  resolveSpecies,
  deltaSeconds,
  nowMs,
  placedBlocks = [],
  onPlayerDamaged,
  isLeader,
  remoteSnapshots = [],
}: AdvancingWildlifeSimulationTickParams): AdvancingWildlifeSimulationTickResult {
  hydratingWildlifeInstancesNearPoint(store, center, resolveSpecies, nowMs);
  despawningWildlifeInstancesBeyondRadius(store, center, nowMs);

  if (!isLeader) {
    applyingRemoteWildlifeSnapshots(store, remoteSnapshots);
    const followerSpatialGrid = buildingWildlifeSpatialGrid(
      listingWildlifeInstances(store)
    );

    return {
      snapshots: buildingWildlifeNetworkSnapshots(
        listingWildlifeInstances(store)
      ),
      playerPushOut: playerPosition
        ? resolvingWildlifePlayerCollision(
            store.instances,
            playerPosition,
            resolveSpecies,
            followerSpatialGrid
          )
        : null,
    };
  }

  const instances = [...listingWildlifeInstances(store)];
  const liveInstances = instances.filter((entry) => !entry.isDead);
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
  const behaviorNeighborsById =
    buildingWildlifeBehaviorNeighborLists(liveInstances);
  const steeringQueryRadius =
    DEFINING_WILDLIFE_STEERING_WEIGHTS.separationRadiusGrid + 0.5;
  const updatedById = new Map<string, DefiningWildlifeInstance>();

  for (const instance of instances) {
    const species = resolveSpecies(instance.speciesId);

    if (!species || instance.isDead) {
      updatedById.set(instance.instanceId, instance);
      continue;
    }

    const shouldThink = checkingWildlifeShouldThink({
      lastThinkAtMs: instance.aiState.lastThinkAtMs,
      position: instance.position,
      playerPosition,
      nowMs,
    });

    if (
      !shouldThink &&
      (instance.aiState.intent.mode === 'idle' ||
        instance.aiState.intent.mode === 'graze')
    ) {
      const staminaResult = advancingWildlifeStaminaTick(
        instance.staminaState,
        false,
        deltaSeconds
      );

      if (
        staminaResult.state.staminaRatio !==
          instance.staminaState.staminaRatio ||
        staminaResult.state.isExhausted !== instance.staminaState.isExhausted
      ) {
        updatedById.set(instance.instanceId, {
          ...instance,
          staminaState: staminaResult.state,
        });
      } else {
        updatedById.set(instance.instanceId, instance);
      }

      continue;
    }

    let nextInstance = instance;
    const distanceToPlayer = resolvingWildlifeDistanceToPlayer(
      nextInstance.position,
      playerPosition
    );

    if (shouldThink) {
      const thinkElapsedSeconds =
        (nowMs - nextInstance.aiState.lastThinkAtMs) / 1000;
      const nearbyInstances =
        behaviorNeighborsById.get(nextInstance.instanceId) ?? [];

      nextInstance = {
        ...nextInstance,
        aggroState: advancingWildlifeAggroTick({
          instance: nextInstance,
          species,
          nearbyInstances,
          playerPosition,
          playerUserId,
          deltaSeconds: thinkElapsedSeconds,
          nowMs,
        }),
      };

      const blackboardWithoutPrey: DefiningWildlifeBehaviorBlackboard = {
        instance: nextInstance,
        species,
        nearbyInstances,
        playerPosition,
        playerUserId,
        nowMs,
        selectedPreyInstanceId: null,
        resolveSpecies,
      };
      const selectedPreyInstanceId = computingWildlifeSelectedPreyInstanceId(
        blackboardWithoutPrey
      );

      const blackboard: DefiningWildlifeBehaviorBlackboard = {
        ...blackboardWithoutPrey,
        selectedPreyInstanceId,
      };

      const intent = advancingWildlifeBehaviorTick(blackboard);
      const isGrazing = intent.mode === 'graze';

      nextInstance = {
        ...nextInstance,
        hungerState: advancingWildlifeHungerTick({
          state: nextInstance.hungerState,
          species,
          deltaSeconds: thinkElapsedSeconds,
          isGrazing,
          nowMs,
        }).state,
        aiState: {
          ...nextInstance.aiState,
          intent,
          lastThinkAtMs: nowMs,
          steeringCache: null,
        },
      };
    }

    const intent = nextInstance.aiState.intent;
    const desiredDirection = resolvingDesiredDirection(nextInstance, intent);
    const isTryingToMove = desiredDirection.x !== 0 || desiredDirection.y !== 0;
    const wantsToRun =
      (intent.mode === 'flee' ||
        intent.mode === 'chase' ||
        intent.mode === 'attack') &&
      isTryingToMove;
    const staminaResult = advancingWildlifeStaminaTick(
      nextInstance.staminaState,
      wantsToRun,
      deltaSeconds
    );
    const isRunning = wantsToRun && staminaResult.isRunning;

    nextInstance = { ...nextInstance, staminaState: staminaResult.state };

    const speed = wantsToRun
      ? isRunning
        ? species.vitals.runSpeedGridPerSecond
        : species.vitals.walkSpeedGridPerSecond
      : intent.mode === 'wander' || intent.mode === 'return'
        ? species.vitals.walkSpeedGridPerSecond
        : 0;

    if (
      speed > 0 &&
      intent.mode !== 'attack' &&
      intent.mode !== 'graze' &&
      intent.mode !== 'idle' &&
      (desiredDirection.x !== 0 || desiredDirection.y !== 0)
    ) {
      const steeringNeighbors = queryingWildlifeInstancesNearPoint({
        grid: spatialGrid,
        point: nextInstance.position,
        radiusGrid: steeringQueryRadius,
        excludeInstanceId: nextInstance.instanceId,
      });
      const intentKey = formattingWildlifeIntentKey(intent);
      const steering = resolvingWildlifeSteeringStep({
        instance: nextInstance,
        species,
        desiredDirection,
        speedGridPerSecond: speed,
        deltaSeconds,
        nearbyInstances: steeringNeighbors,
        placedBlocks,
        distanceToPlayerGrid: distanceToPlayer,
        nowMs,
        intentKey,
        steeringCache: nextInstance.aiState.steeringCache,
      });

      const movedX = steering.nextPosition.x - nextInstance.position.x;
      const movedY = steering.nextPosition.y - nextInstance.position.y;

      nextInstance = {
        ...nextInstance,
        position: steering.nextPosition,
        facingDirection: resolvingWorldPlazaGirlSampleWalkDirection(
          movedX,
          movedY,
          nextInstance.facingDirection
        ),
        aiState: {
          ...nextInstance.aiState,
          isMoving: steering.moved,
          motionClip: isRunning ? 'run' : steering.moved ? 'walk' : 'idle',
          steeringCache: steering.steeringCache,
        },
      };
    } else if (intent.mode === 'graze' || intent.mode === 'idle') {
      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          isMoving: false,
          motionClip: 'idle',
        },
      };
    }

    if (intent.mode === 'attack') {
      const prey =
        intent.targetInstanceId && intent.targetInstanceId !== playerUserId
          ? (instances.find(
              (entry) => entry.instanceId === intent.targetInstanceId
            ) ??
            updatedById.get(intent.targetInstanceId) ??
            null)
          : null;
      const preySpecies = prey ? resolveSpecies(prey.speciesId) : null;

      if (
        prey &&
        preySpecies &&
        checkingWildlifePredatorMayHuntPrey(species, preySpecies)
      ) {
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          prey,
          preySpecies,
          playerPosition,
          intent,
          nowMs
        );
        nextInstance = attackResult.attacker;

        if (attackResult.target) {
          updatedById.set(attackResult.target.instanceId, attackResult.target);
        }
      } else if (playerPosition && onPlayerDamaged) {
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          null,
          null,
          playerPosition,
          intent,
          nowMs,
          onPlayerDamaged
        );
        nextInstance = attackResult.attacker;
      }
    }

    updatedById.set(nextInstance.instanceId, nextInstance);
  }

  for (const [instanceId, instance] of updatedById) {
    replacingWildlifeInstance(store, instance);
  }

  const playerPushOut = playerPosition
    ? resolvingWildlifePlayerCollision(
        store.instances,
        playerPosition,
        resolveSpecies,
        buildingWildlifeSpatialGrid(listingWildlifeInstances(store))
      )
    : null;

  return {
    snapshots: buildingWildlifeNetworkSnapshots(
      listingWildlifeInstances(store)
    ),
    playerPushOut,
  };
}

/**
 * Applies player or remote damage to one wildlife instance.
 */
export function applyingWildlifeInstanceDamage(
  store: ManagingWildlifeInstanceStore,
  instanceId: string,
  damageAmount: number,
  attackerTargetId: string,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null,
  nowMs: number
): DefiningWildlifeInstance | null {
  const instance = store.instances.get(instanceId);

  if (!instance || instance.isDead) {
    return null;
  }

  const species = resolveSpecies(instance.speciesId);

  if (!species) {
    return null;
  }

  const damageResult = computingWorldPlazaEntityHealthDamage({
    state: instance.healthState,
    rawAmount: damageAmount,
    kind: 'physical',
    nowMs,
    options: { skipDamageRoll: true },
  });

  const died = damageResult.state.currentHealth <= 0;
  const nextInstance = applyingWildlifeDamageThreat(
    {
      ...instance,
      healthState: damageResult.state,
      isDead: died,
      diedAtMs: died ? nowMs : null,
      aiState: {
        ...instance.aiState,
        motionClip: died ? 'die' : 'takeDamage',
      },
    },
    species,
    attackerTargetId,
    damageAmount,
    nowMs
  );

  replacingWildlifeInstance(store, nextInstance);

  const sharedThreat =
    damageAmount *
    species.aggro.threatPerDamage *
    DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO;
  const liveInstances = listingWildlifeInstances(store).filter(
    (entry) => !entry.isDead
  );
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
  const packmates = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: nextInstance.position,
    radiusGrid: species.aggro.packShareRadiusGrid,
    excludeInstanceId: instanceId,
  });

  for (const packmate of packmates) {
    if (packmate.speciesId !== instance.speciesId) {
      continue;
    }

    replacingWildlifeInstance(
      store,
      sharingWildlifePackThreat(
        packmate,
        species,
        attackerTargetId,
        sharedThreat,
        nowMs
      )
    );
  }

  return nextInstance;
}
