/**
 * Main wildlife simulation tick orchestrator.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSimulationTick
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  advancingWildlifeAggroTick,
  applyingWildlifeDamageThreat,
  sharingWildlifePackThreat,
} from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';
import {
  advancingWildlifeChargeWindup,
  clearingWildlifeChargeWindupAfterStamina,
  resolvingWildlifeMeleeAttackPower,
} from '@/components/world/wildlife/domains/advancingWildlifeChargeWindup';
import { advancingWildlifeEnvironmentalDamageTick } from '@/components/world/wildlife/domains/advancingWildlifeEnvironmentalDamageTick';
import {
  advancingWildlifeHungerTick,
  refillingWildlifeHungerAfterKill,
} from '@/components/world/wildlife/domains/advancingWildlifeHungerTick';
import { advancingWildlifeSpeechTick } from '@/components/world/wildlife/domains/advancingWildlifeSpeechTick';
import { advancingWildlifeStaminaTick } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { applyingWildlifeGroundFoodBite } from '@/components/world/wildlife/domains/applyingWildlifeGroundFoodBite';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import {
  attemptingWildlifeMeatGroundDropOnDeath,
  type DefiningWildlifeMeatDropContext,
} from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import { checkingWildlifePlayerStartlesWildlife } from '@/components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife';
import {
  DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_MELEE_RANGE_GRID,
  DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO,
} from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS } from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  computingWildlifeSelectedGroundFoodItemId,
  computingWildlifeSelectedPreyInstanceId,
  computingWildlifeSelectedProximityPreyInstanceId,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_FLEE_TARGET_ARRIVAL_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeBehaviorHysteresisConstants';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { resolvingWildlifeSpeciesExhaustedExitRatio } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeNetworkSnapshot,
  DefiningWildlifePlayerMeleeHit,
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
import {
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceStaminaConfig,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeInstanceFacingDirection } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceFacingDirection';
import { resolvingWildlifeInstanceSeparation } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSeparation';
import {
  advancingWildlifeJumpState,
  resolvingWildlifePounceJumpPlan,
  resolvingWildlifeWaterGapJumpPlan,
} from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import {
  checkingWildlifeFleesFromPlayerCollision,
  checkingWildlifeIsHuntingPlayer,
  checkingWildlifeIsStartledFromPlayerCollision,
  resolvingWildlifeLockedPlayerFleeIntent,
  resolvingWildlifePlayerCollisionStartleUntilMs,
} from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { checkingWildlifeShouldThink } from '@/components/world/wildlife/domains/resolvingWildlifeThinkSchedule';
import { syncingAllWildlifeInstanceStandingLayers } from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';

/** @deprecated Use `DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS` from ai LOD constants. */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_MS =
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS;

export type AdvancingWildlifeSimulationTickParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  isPlayerRunning?: boolean;
  isPlayerJumping?: boolean;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  deltaSeconds: number;
  nowMs: number;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  isDaytime?: boolean;
  onPlayerHitByWildlife?: (hit: DefiningWildlifePlayerMeleeHit) => void;
  isLeader: boolean;
  remoteSnapshots?: readonly DefiningWildlifeNetworkSnapshot[];
  meatDropContext?: DefiningWildlifeMeatDropContext | null;
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
  playerUserId: string | null,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null,
  spatialGrid: ManagingWildlifeSpatialGrid,
  nowMs: number,
  isPlayerStartling: boolean,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
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

    if (liveInstance.isDead || liveInstance.aiState.jumpState) {
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
    const isHuntingPlayer = checkingWildlifeIsHuntingPlayer(
      liveInstance,
      playerUserId
    );

    if (!isHuntingPlayer) {
      const pushedPosition = {
        x: liveInstance.position.x - directionX * overlap * 0.6,
        y: liveInstance.position.y - directionY * overlap * 0.6,
        layer: liveInstance.position.layer,
      };
      const shouldStartle =
        isPlayerStartling &&
        checkingWildlifeFleesFromPlayerCollision(
          species.temperamentId,
          liveInstance.aggressionLevel
        );

      if (shouldStartle) {
        const fleeIntent = resolvingWildlifeLockedPlayerFleeIntent({
          position: pushedPosition,
          playerPosition,
          lockedFleeTargetPoint: liveInstance.aiState.fleeTargetPoint,
          species,
          hazardSampling,
        });

        instances.set(instanceId, {
          ...liveInstance,
          position: pushedPosition,
          aiState: {
            ...liveInstance.aiState,
            intent: fleeIntent,
            fleeTargetPoint: fleeIntent.targetPoint ?? null,
            startledUntilMs:
              resolvingWildlifePlayerCollisionStartleUntilMs(nowMs),
            steeringCache: null,
          },
        });
      } else {
        instances.set(instanceId, {
          ...liveInstance,
          position: pushedPosition,
        });
      }
    }

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

function checkingWildlifeFleeTargetPointIsWalkable(
  point: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): boolean {
  return (
    checkingWildlifeHazardAtPoint({
      point,
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    }) === 'safe'
  );
}

/**
 * Locks any flee intent onto its first destination until the animal arrives,
 * so re-thinks do not re-aim the flee every few hundred milliseconds and
 * rubber-band the animal around a moving threat.
 */
function applyingWildlifeFleeTargetLock(
  instance: DefiningWildlifeInstance,
  intent: DefiningWildlifeBehaviorIntent,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): {
  intent: DefiningWildlifeBehaviorIntent;
  fleeTargetPoint: DefiningWorldPlazaWorldPoint | null;
} {
  if (intent.mode !== 'flee') {
    return {
      intent,
      fleeTargetPoint: null,
    };
  }

  const lockedTargetPoint = instance.aiState.fleeTargetPoint;

  if (
    lockedTargetPoint &&
    checkingWildlifeFleeTargetPointIsWalkable(
      lockedTargetPoint,
      species,
      hazardSampling
    )
  ) {
    const distanceToLockedTarget = Math.hypot(
      lockedTargetPoint.x - instance.position.x,
      lockedTargetPoint.y - instance.position.y
    );

    if (
      distanceToLockedTarget > DEFINING_WILDLIFE_FLEE_TARGET_ARRIVAL_RADIUS_GRID
    ) {
      return {
        intent: { mode: 'flee', targetPoint: lockedTargetPoint },
        fleeTargetPoint: lockedTargetPoint,
      };
    }
  }

  return {
    intent,
    fleeTargetPoint: intent.targetPoint ?? null,
  };
}

function resolvingDesiredDirection(
  instance: DefiningWildlifeInstance,
  intent: DefiningWildlifeBehaviorIntent
): { x: number; y: number } {
  const targetPoint =
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'forageChase' ||
    intent.mode === 'forageEat' ||
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
  const arrivalRadius =
    intent.mode === 'chase' || intent.mode === 'forageChase'
      ? DEFINING_WILDLIFE_MELEE_RANGE_GRID * 0.92
      : DEFINING_WILDLIFE_TARGET_ARRIVAL_RADIUS_GRID;

  // Arrival deadzone: without it animals orbit their target in tight circles.
  // Flee skips this so animals do not freeze when they pass near an unreachable
  // water waypoint while still trying to escape a nearby threat.
  if (length <= arrivalRadius && intent.mode !== 'flee') {
    return { x: 0, y: 0 };
  }

  return { x: deltaX / length, y: deltaY / length };
}

/**
 * Returns whether the attacker's swing cooldown has elapsed.
 */
function checkingWildlifeAttackReady(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): boolean {
  const lastAttackAtMs = attacker.aiState.lastAttackAtMs;

  return (
    lastAttackAtMs === null ||
    nowMs - lastAttackAtMs >= attackerSpecies.vitals.attackIntervalMs
  );
}

/**
 * Motion clip between swings: hold the one-shot attack clip briefly so it
 * plays out, then fall back to idle so the next swing re-triggers it.
 */
function resolvingWildlifeAttackWindupClip(
  attacker: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance['aiState']['motionClip'] {
  const lastAttackAtMs = attacker.aiState.lastAttackAtMs;

  if (
    lastAttackAtMs !== null &&
    nowMs - lastAttackAtMs < DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS
  ) {
    return 'attack';
  }

  return 'idle';
}

function applyingWildlifeMeleeAttack(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  target: DefiningWildlifeInstance | null,
  targetSpecies: DefiningWildlifeSpeciesDefinition | null,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  intent: DefiningWildlifeBehaviorIntent,
  nowMs: number,
  isRunning: boolean,
  onPlayerHitByWildlife?: (hit: DefiningWildlifePlayerMeleeHit) => void
): {
  attacker: DefiningWildlifeInstance;
  target: DefiningWildlifeInstance | null;
} {
  if (intent.mode !== 'attack') {
    return { attacker, target };
  }

  if (!checkingWildlifeAttackReady(attacker, attackerSpecies, nowMs)) {
    return {
      attacker: {
        ...attacker,
        aiState: {
          ...attacker.aiState,
          isMoving: false,
          motionClip: resolvingWildlifeAttackWindupClip(attacker, nowMs),
        },
      },
      target,
    };
  }

  const attackPower = resolvingWildlifeMeleeAttackPower(
    attackerSpecies.vitals.attackPower,
    attackerSpecies.speciesId,
    attacker,
    isRunning,
    nowMs
  );

  let swingLanded = false;
  let nextTarget = target;
  let nextHungerState = attacker.hungerState;

  if (target && targetSpecies) {
    const distance = Math.hypot(
      attacker.position.x - target.position.x,
      attacker.position.y - target.position.y
    );

    if (distance <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      const damagedTarget =
        applyingWildlifeInstanceHealthDamageWithFloatFeedback({
          instance: target,
          rawAmount: attackPower,
          kind: 'physical',
          nowMs,
        });

      nextTarget = damagedTarget;
      swingLanded = true;

      if (damagedTarget.isDead) {
        nextHungerState = refillingWildlifeHungerAfterKill(
          attacker.hungerState,
          attackerSpecies,
          nowMs
        );
      }
    }
  }

  // A swing always clips the player when they stand within melee range, even
  // if the nominal target is another animal or already moved out of reach.
  if (playerPosition && onPlayerHitByWildlife) {
    const playerDistance = Math.hypot(
      attacker.position.x - playerPosition.x,
      attacker.position.y - playerPosition.y
    );

    if (playerDistance <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      onPlayerHitByWildlife({
        speciesId: attackerSpecies.speciesId,
        damageAmount: attackPower,
      });
      swingLanded = true;
    }
  }

  if (!swingLanded) {
    return { attacker, target };
  }

  return {
    attacker: {
      ...attacker,
      hungerState: nextHungerState,
      aiState: {
        ...attacker.aiState,
        isMoving: false,
        motionClip: 'attack',
        lastAttackAtMs: nowMs,
      },
    },
    target: nextTarget,
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
  placedBlocksByTile,
  isDaytime = computingWorldPlazaDayNightSunState().isDaytime,
  onPlayerHitByWildlife,
  isLeader,
  remoteSnapshots = [],
  meatDropContext = null,
  isPlayerRunning = false,
  isPlayerJumping = false,
}: AdvancingWildlifeSimulationTickParams): AdvancingWildlifeSimulationTickResult {
  const isPlayerStartling = checkingWildlifePlayerStartlesWildlife(
    isPlayerRunning,
    isPlayerJumping
  );
  const hazardSampling = {
    placedBlocks,
    placedBlocksByTile,
    isDaytime,
  };
  hydratingWildlifeInstancesNearPoint(store, center, resolveSpecies, nowMs);
  despawningWildlifeInstancesBeyondRadius(store, center, nowMs);

  if (!isLeader) {
    applyingRemoteWildlifeSnapshots(store, remoteSnapshots);
    const followerSpatialGrid = buildingWildlifeSpatialGrid(
      listingWildlifeInstances(store)
    );
    const followerPlayerPushOut = playerPosition
      ? resolvingWildlifePlayerCollision(
          store.instances,
          playerPosition,
          playerUserId,
          resolveSpecies,
          followerSpatialGrid,
          nowMs,
          isPlayerStartling,
          hazardSampling
        )
      : null;

    syncingAllWildlifeInstanceStandingLayers(
      store,
      placedBlocks,
      placedBlocksByTile
    );

    return {
      snapshots: buildingWildlifeNetworkSnapshots(
        listingWildlifeInstances(store)
      ),
      playerPushOut: followerPlayerPushOut,
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

  for (const staleInstance of instances) {
    // Earlier iterations may have already written to this instance (e.g. a
    // predator applied melee damage). Start from that version, not the
    // start-of-tick snapshot, or the damage gets silently reverted here.
    const instance = updatedById.get(staleInstance.instanceId) ?? staleInstance;
    const species = resolveSpecies(instance.speciesId);

    if (!species || instance.isDead) {
      updatedById.set(instance.instanceId, instance);
      continue;
    }

    let nextInstance = advancingWildlifeEnvironmentalDamageTick({
      instance,
      species,
      isDaytime: hazardSampling.isDaytime,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      nowMs,
    });

    if (nextInstance.isDead) {
      updatedById.set(nextInstance.instanceId, nextInstance);
      continue;
    }

    const isStartledFromPlayerCollision =
      playerPosition &&
      checkingWildlifeFleesFromPlayerCollision(
        species.temperamentId,
        nextInstance.aggressionLevel
      ) &&
      checkingWildlifeIsStartledFromPlayerCollision(
        nextInstance.aiState.startledUntilMs,
        nowMs
      );

    if (isStartledFromPlayerCollision && playerPosition) {
      const fleeIntent = resolvingWildlifeLockedPlayerFleeIntent({
        position: nextInstance.position,
        playerPosition,
        lockedFleeTargetPoint: nextInstance.aiState.fleeTargetPoint,
        species,
        hazardSampling,
      });

      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          intent: fleeIntent,
          fleeTargetPoint: fleeIntent.targetPoint ?? null,
          steeringCache: null,
        },
      };
    }

    const shouldThink = checkingWildlifeShouldThink({
      lastThinkAtMs: nextInstance.aiState.lastThinkAtMs,
      position: nextInstance.position,
      playerPosition,
      nowMs,
    });

    if (
      !shouldThink &&
      !nextInstance.aiState.jumpState &&
      !isStartledFromPlayerCollision &&
      (nextInstance.aiState.intent.mode === 'idle' ||
        nextInstance.aiState.intent.mode === 'graze')
    ) {
      const staminaResult = advancingWildlifeStaminaTick(
        nextInstance.staminaState,
        false,
        deltaSeconds,
        resolvingWildlifeInstanceStaminaConfig(species, nextInstance),
        resolvingWildlifeSpeciesExhaustedExitRatio(species.speciesId)
      );

      if (
        staminaResult.state.staminaRatio !==
          nextInstance.staminaState.staminaRatio ||
        staminaResult.state.isExhausted !==
          nextInstance.staminaState.isExhausted
      ) {
        updatedById.set(nextInstance.instanceId, {
          ...nextInstance,
          staminaState: staminaResult.state,
        });
      } else {
        updatedById.set(nextInstance.instanceId, nextInstance);
      }

      continue;
    }

    const distanceToPlayer = resolvingWildlifeDistanceToPlayer(
      nextInstance.position,
      playerPosition
    );

    if (shouldThink && !isStartledFromPlayerCollision) {
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
        isPlayerRunning,
        isPlayerJumping,
        nowMs,
        hazardSampling,
        selectedPreyInstanceId: null,
        selectedProximityPreyInstanceId: null,
        selectedGroundFoodItemId: null,
        resolveSpecies,
      };
      const selectedPreyInstanceId = computingWildlifeSelectedPreyInstanceId(
        blackboardWithoutPrey
      );
      const selectedProximityPreyInstanceId =
        computingWildlifeSelectedProximityPreyInstanceId(blackboardWithoutPrey);
      const selectedGroundFoodItemId =
        computingWildlifeSelectedGroundFoodItemId({
          ...blackboardWithoutPrey,
          selectedPreyInstanceId,
        });

      const blackboard: DefiningWildlifeBehaviorBlackboard = {
        ...blackboardWithoutPrey,
        selectedPreyInstanceId,
        selectedProximityPreyInstanceId,
        selectedGroundFoodItemId,
      };

      const intent = advancingWildlifeBehaviorTick(blackboard);
      const chargeResult = advancingWildlifeChargeWindup({
        intent,
        instance: nextInstance,
        speciesId: species.speciesId,
        playerUserId,
        playerPosition,
        nowMs,
      });
      const fleeLockResult = applyingWildlifeFleeTargetLock(
        nextInstance,
        chargeResult.intent,
        species,
        hazardSampling
      );
      const resolvedIntent = fleeLockResult.intent;
      const isGrazing = resolvedIntent.mode === 'graze';

      // Leash return resets aggro so the animal does not re-chase the same
      // target the moment it crosses back inside the leash boundary.
      const nextAggroState =
        resolvedIntent.mode === 'return'
          ? {
              threats: [],
              activeTargetId: null,
              lastDamagedAtMs: nextInstance.aggroState.lastDamagedAtMs,
            }
          : nextInstance.aggroState;

      nextInstance = {
        ...nextInstance,
        aggroState: nextAggroState,
        hungerState: advancingWildlifeHungerTick({
          state: nextInstance.hungerState,
          species,
          deltaSeconds: thinkElapsedSeconds,
          isGrazing,
          nowMs,
        }).state,
        aiState: {
          ...nextInstance.aiState,
          intent: resolvedIntent,
          chargeWindupStartedAtMs: chargeResult.chargeWindupStartedAtMs,
          fleeTargetPoint: fleeLockResult.fleeTargetPoint,
          lastThinkAtMs: nowMs,
          steeringCache: null,
        },
      };
    }

    const activeJumpState = nextInstance.aiState.jumpState;

    if (activeJumpState) {
      const jumpStep = advancingWildlifeJumpState(activeJumpState, nowMs);
      const jumpMovedX = jumpStep.position.x - nextInstance.position.x;
      const jumpMovedY = jumpStep.position.y - nextInstance.position.y;
      let jumpPosition = jumpStep.position;

      if (jumpStep.isComplete) {
        const landingTile =
          resolvingWorldPlazaIsometricTileIndexAtGridPoint(jumpPosition);

        jumpPosition = {
          ...jumpPosition,
          layer: resolvingWorldPlazaSurfaceLayerAtTileIndex(
            landingTile.tileX,
            landingTile.tileY,
            placedBlocks,
            placedBlocksByTile
          ),
        };
      }

      updatedById.set(nextInstance.instanceId, {
        ...nextInstance,
        position: jumpPosition,
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          jumpPosition,
          nextInstance.aiState.intent,
          jumpMovedX,
          jumpMovedY,
          nextInstance.facingDirection
        ),
        aiState: {
          ...nextInstance.aiState,
          isMoving: true,
          motionClip: 'run',
          jumpState: jumpStep.isComplete ? null : jumpStep.jumpState,
          lastJumpEndedAtMs: jumpStep.isComplete
            ? nowMs
            : nextInstance.aiState.lastJumpEndedAtMs,
        },
      });
      continue;
    }

    const intent = nextInstance.aiState.intent;
    const desiredDirection = resolvingDesiredDirection(nextInstance, intent);
    const isTryingToMove = desiredDirection.x !== 0 || desiredDirection.y !== 0;
    const wantsToRun =
      (intent.mode === 'flee' ||
        intent.mode === 'chase' ||
        intent.mode === 'forageChase' ||
        intent.mode === 'attack') &&
      isTryingToMove;
    const staminaResult = advancingWildlifeStaminaTick(
      nextInstance.staminaState,
      wantsToRun,
      deltaSeconds,
      resolvingWildlifeInstanceStaminaConfig(species, nextInstance),
      resolvingWildlifeSpeciesExhaustedExitRatio(species.speciesId)
    );
    const isRunning = wantsToRun && staminaResult.isRunning;

    nextInstance = {
      ...nextInstance,
      staminaState: staminaResult.state,
      aiState: {
        ...nextInstance.aiState,
        chargeWindupStartedAtMs: clearingWildlifeChargeWindupAfterStamina(
          species.speciesId,
          nextInstance.aiState.chargeWindupStartedAtMs,
          staminaResult.state
        ),
      },
    };

    const walkSpeed = resolvingWildlifeInstanceWalkSpeedGridPerSecond(
      species,
      nextInstance
    );
    const runSpeed = resolvingWildlifeInstanceRunSpeedGridPerSecond(
      species,
      nextInstance
    );
    const speed = wantsToRun
      ? isRunning
        ? runSpeed
        : walkSpeed
      : intent.mode === 'wander' || intent.mode === 'return'
        ? walkSpeed
        : 0;

    if (
      speed > 0 &&
      intent.mode !== 'attack' &&
      intent.mode !== 'forageEat' &&
      intent.mode !== 'graze' &&
      intent.mode !== 'idle' &&
      (desiredDirection.x !== 0 || desiredDirection.y !== 0)
    ) {
      const pouncePlan =
        intent.mode === 'chase'
          ? resolvingWildlifePounceJumpPlan({
              instance: nextInstance,
              species,
              targetPoint: intent.targetPoint,
              hazardSampling,
              nowMs,
            })
          : null;
      const jumpPlan =
        pouncePlan ??
        resolvingWildlifeWaterGapJumpPlan({
          instance: nextInstance,
          species,
          desiredDirection,
          hazardSampling,
          nowMs,
        });

      if (jumpPlan) {
        updatedById.set(nextInstance.instanceId, {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            isMoving: true,
            motionClip: 'run',
            jumpState: jumpPlan,
            steeringCache: null,
          },
        });
        continue;
      }

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
        hazardSampling,
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
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          steering.nextPosition,
          intent,
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
    } else if (
      intent.mode === 'graze' ||
      intent.mode === 'idle' ||
      intent.mode === 'territoryWarn'
    ) {
      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          isMoving: false,
          motionClip: 'idle',
        },
      };
    }

    if (intent.mode === 'forageEat') {
      nextInstance = applyingWildlifeGroundFoodBite(
        nextInstance,
        species,
        intent.targetGroundItemId,
        nowMs
      );
    }

    if (intent.mode === 'attack') {
      // Prefer the already-updated copy so damage stacks within one tick
      // instead of being re-applied to the stale start-of-tick snapshot.
      const prey =
        intent.targetInstanceId && intent.targetInstanceId !== playerUserId
          ? (updatedById.get(intent.targetInstanceId) ??
            instances.find(
              (entry) => entry.instanceId === intent.targetInstanceId
            ) ??
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
          nowMs,
          isRunning,
          onPlayerHitByWildlife
        );
        nextInstance = attackResult.attacker;

        if (attackResult.target) {
          const droppedTarget = attackResult.target.isDead
            ? attemptingWildlifeMeatGroundDropOnDeath(
                store,
                attackResult.target,
                preySpecies,
                meatDropContext
              )
            : attackResult.target;
          updatedById.set(droppedTarget.instanceId, droppedTarget);
        }
      } else if (playerPosition && onPlayerHitByWildlife) {
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          null,
          null,
          playerPosition,
          intent,
          nowMs,
          isRunning,
          onPlayerHitByWildlife
        );
        nextInstance = attackResult.attacker;
      }
    }

    if (
      intent.mode === 'chase' ||
      intent.mode === 'attack' ||
      intent.mode === 'territoryWarn' ||
      intent.mode === 'forageChase' ||
      intent.mode === 'forageEat'
    ) {
      nextInstance = {
        ...nextInstance,
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          nextInstance.position,
          intent,
          0,
          0,
          nextInstance.facingDirection
        ),
      };
    } else if (
      nextInstance.aiState.chargeWindupStartedAtMs !== null &&
      playerPosition &&
      playerUserId
    ) {
      nextInstance = {
        ...nextInstance,
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          nextInstance.position,
          {
            mode: 'chase',
            targetInstanceId: playerUserId,
            targetPoint: playerPosition,
          },
          0,
          0,
          nextInstance.facingDirection
        ),
      };
    }

    nextInstance = {
      ...nextInstance,
      speechState: advancingWildlifeSpeechTick({
        instance: nextInstance,
        nowMs,
      }),
    };

    updatedById.set(nextInstance.instanceId, nextInstance);
  }

  for (const [instanceId, instance] of updatedById) {
    replacingWildlifeInstance(store, instance);
  }

  resolvingWildlifeInstanceSeparation({
    instances: store.instances,
    resolveSpecies,
  });

  const playerPushOut = playerPosition
    ? resolvingWildlifePlayerCollision(
        store.instances,
        playerPosition,
        playerUserId,
        resolveSpecies,
        buildingWildlifeSpatialGrid(listingWildlifeInstances(store)),
        nowMs,
        isPlayerStartling,
        hazardSampling
      )
    : null;

  syncingAllWildlifeInstanceStandingLayers(
    store,
    placedBlocks,
    placedBlocksByTile
  );

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
  nowMs: number,
  meatDropContext: DefiningWildlifeMeatDropContext | null = null
): DefiningWildlifeInstance | null {
  const instance = store.instances.get(instanceId);

  if (!instance || instance.isDead) {
    return null;
  }

  const species = resolveSpecies(instance.speciesId);

  if (!species) {
    return null;
  }

  const damageAppliedInstance =
    applyingWildlifeInstanceHealthDamageWithFloatFeedback({
      instance,
      rawAmount: damageAmount,
      kind: 'physical',
      nowMs,
    });

  const died = damageAppliedInstance.isDead;
  const nextInstance = applyingWildlifeDamageThreat(
    damageAppliedInstance,
    species,
    attackerTargetId,
    damageAmount,
    nowMs
  );

  replacingWildlifeInstance(store, nextInstance);

  if (died) {
    attemptingWildlifeMeatGroundDropOnDeath(
      store,
      nextInstance,
      species,
      meatDropContext
    );
  }

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
