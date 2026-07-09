/**
 * Main wildlife simulation tick orchestrator.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSimulationTick
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaDayNightCycleSample } from '@/components/world/domains/resolvingWorldPlazaDayNightCycleSample';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
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
import {
  advancingWildlifeBluffCharge,
  clearingWildlifeBluffReturnOnArrival,
  seedingWildlifeBluffChargeReturnPoint,
} from '@/components/world/wildlife/domains/advancingWildlifeBluffCharge';
import { advancingWildlifeCorpseLifecycle } from '@/components/world/wildlife/domains/advancingWildlifeCorpseLifecycle';
import { advancingWildlifeEnvironmentalDamageTick } from '@/components/world/wildlife/domains/advancingWildlifeEnvironmentalDamageTick';
import { advancingWildlifeHealthStatusTick } from '@/components/world/wildlife/domains/advancingWildlifeHealthStatusTick';
import { advancingWildlifeHungerTick } from '@/components/world/wildlife/domains/advancingWildlifeHungerTick';
import { advancingWildlifeHunterKillFeedingTick } from '@/components/world/wildlife/domains/advancingWildlifeHunterKillFeedingTick';
import { advancingWildlifePendingRespawns } from '@/components/world/wildlife/domains/advancingWildlifePendingRespawns';
import { advancingWildlifeSleepTick } from '@/components/world/wildlife/domains/advancingWildlifeSleepTick';
import { advancingWildlifeSpeechTick } from '@/components/world/wildlife/domains/advancingWildlifeSpeechTick';
import { advancingWildlifeStalkPlayerApproachTick } from '@/components/world/wildlife/domains/advancingWildlifeStalkPlayerApproachTick';
import { advancingWildlifeStaminaTick } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import {
  advancingWildlifeWolfHowlTriggers,
  applyingWildlifeWolfHowlPresentation,
  checkingWildlifeInstanceIsHowling,
} from '@/components/world/wildlife/domains/advancingWildlifeWolfHowlTick';
import {
  applyingWildlifeWolfHowlPackAttraction,
  type ApplyingWildlifeWolfHowlEvent,
} from '@/components/world/wildlife/domains/applyingWildlifeWolfHowlPackAttraction';
import { resolvingWildlifeWolfHowlSummonOverride } from '@/components/world/wildlife/domains/resolvingWildlifeWolfHowlSummonIntent';
import { computingWildlifeAcceleratedRunSpeed } from '@/components/world/wildlife/domains/computingWildlifeAcceleratedRunSpeed';
import { resolvingWildlifeSpeciesAccelerationConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesAccelerationRegistry';
import { applyingWildlifeAdrenalineRushOnFleeEntry } from '@/components/world/wildlife/domains/applyingWildlifeAdrenalineRushOnFleeEntry';
import { applyingWildlifeDefendYoungDamageResponse } from '@/components/world/wildlife/domains/applyingWildlifeDefendYoungDamageResponse';
import {
  applyingWildlifeDocileApproachReactOutcome,
  clearingWildlifeDocileExpiredFollowTimer,
} from '@/components/world/wildlife/domains/applyingWildlifeDocileApproachReactOutcome';
import { applyingWildlifeDocilePlayerHitBehaviorResponse } from '@/components/world/wildlife/domains/applyingWildlifeDocilePlayerHitBehaviorResponse';
import {
  applyingWildlifeGroundFoodBite,
  clearingWildlifePendingGroundFoodBite,
} from '@/components/world/wildlife/domains/applyingWildlifeGroundFoodBite';
import { applyingWildlifeHerbivoreHerdFleeResponse } from '@/components/world/wildlife/domains/applyingWildlifeHerbivoreHerdFleeResponse';
import { applyingWildlifeInstanceHealthPayload } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthPayload';
import { applyingWildlifeInstancePhysicalDamage } from '@/components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage';
import { applyingWildlifePackAlphaDeathScatter } from '@/components/world/wildlife/domains/applyingWildlifePackAlphaDeathScatter';
import { applyingWildlifeSpawnPackAlphaLocks } from '@/components/world/wildlife/domains/applyingWildlifeSpawnPackAlphaLocks';
import { applyingWildlifeStalkPackDamageResponse } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackDamageResponse';
import { applyingWildlifeStalkEventToInstance } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackEvent';
import {
  attemptingWildlifeMeatGroundDropOnDeath,
  type DefiningWildlifeMeatDropContext,
} from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import { checkingWildlifeFleeTargetHasMeaningfulLegDistance } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetHasMeaningfulLegDistance';
import { checkingWildlifeFleeTargetReachableFromPosition } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetReachableFromPosition';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { checkingWildlifeHerbivoreHasHerdFleeTemperament } from '@/components/world/wildlife/domains/checkingWildlifeHerbivoreHasHerdFleeTemperament';
import { checkingWildlifeInstanceIsDefendYoungVictim } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsDefendYoungVictim';
import { checkingWildlifeIsFeedingOnKill } from '@/components/world/wildlife/domains/checkingWildlifeIsFeedingOnKill';
import { checkingWildlifeMayMeleeWildlifeTarget } from '@/components/world/wildlife/domains/checkingWildlifeMayMeleeWildlifeTarget';
import { checkingWildlifePlayerStartlesWildlife } from '@/components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife';
import { checkingWildlifeProximityPreyInterrupt } from '@/components/world/wildlife/domains/checkingWildlifeProximityPreyInterrupt';
import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import { checkingWildlifeStalkPhaseIsFleeing } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { checkingWildlifeStalkerShadowingAtDamage } from '@/components/world/wildlife/domains/checkingWildlifeStalkerShadowingAtDamage';
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
import { DEFINING_WILDLIFE_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeCollisionConstants';
import { DEFINING_WILDLIFE_DOCILE_FOLLOW_COMFORT_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeDocileConstants';
import {
  DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS,
  checkingWildlifeOmegaWolfSpecies,
  checkingWildlifeSameStalkPackSpecies,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import { DEFINING_WILDLIFE_SEPARATION_ANXIETY_COMFORT_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeSeparationAnxietyConstants';
import { DEFINING_WILDLIFE_SOCIAL_HUNTER_COMFORT_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeSocialHunterConstants';
import { resolvingWildlifeSpeciesExhaustedExitRatio } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeNetworkSnapshot,
  DefiningWildlifePlayerMeleeHit,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';
import { feedingWildlifeHunterFromKill } from '@/components/world/wildlife/domains/feedingWildlifeHunterFromKill';
import { formattingWildlifeIntentKey } from '@/components/world/wildlife/domains/formattingWildlifeIntentKey';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
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
import { resolvingWildlifeBehaviorNeighborQueryRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeBehaviorNeighborQueryRadiusGrid';
import {
  resolvingWildlifeInstanceCollisionRadiusGrid,
  resolvingWildlifeInstanceMaxStaminaRatio,
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceStaminaConfig,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeInstanceFacingDirection } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceFacingDirection';
import { resolvingWildlifeInstanceSeparation } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSeparation';
import {
  advancingWildlifeJumpState,
  resolvingWildlifePounceJumpPlan,
  resolvingWildlifeTerrainGapJumpPlan,
} from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import {
  DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID,
  resolvingWildlifeLocomotionPresentation,
  syncingWildlifeStationaryLocomotionPresentation,
} from '@/components/world/wildlife/domains/resolvingWildlifeLocomotionPresentation';
import { resolvingWildlifeMeleeEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeMeleeEngagementIntent';
import {
  checkingWildlifeFleesFromPlayerCollision,
  checkingWildlifeIsHuntingPlayer,
  checkingWildlifeIsStartledFromPlayerCollision,
  resolvingWildlifeLockedPlayerFleeIntent,
  resolvingWildlifePlayerCollisionStartleUntilMs,
} from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import {
  clearingWildlifeSleepBumpContact,
  resolvingWildlifeSleepBumpFromPlayerCollision,
} from '@/components/world/wildlife/domains/resolvingWildlifeSleepBumpFromPlayerCollision';
import {
  resolvingWildlifeStalkShadowingAtDamageContext,
  type ResolvingWildlifeStalkShadowingAtDamageContextParams,
} from '@/components/world/wildlife/domains/resolvingWildlifeStalkShadowingAtDamageContext';
import { resolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { checkingWildlifeShouldThink } from '@/components/world/wildlife/domains/resolvingWildlifeThinkSchedule';
import { resolvingWildlifeOverlapThreatEscapeStep } from '@/components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint';
import {
  resolvingWildlifeWolfAttackComboIndexAfterSwing,
  resolvingWildlifeWolfAttackComboIndexForSwing,
  resolvingWildlifeWolfAttackDamageMultiplier,
  resolvingWildlifeWolfAttackMotionClip,
} from '@/components/world/wildlife/domains/resolvingWildlifeWolfAttackMotionClip';
import { syncingAllWildlifeInstanceStandingLayers } from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';
import { wakingWildlifeNearbySleepersFromHit } from '@/components/world/wildlife/domains/wakingWildlifeNearbySleepersFromHit';

/** @deprecated Use `DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS` from ai LOD constants. */
export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_MS =
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS;

export type AdvancingWildlifeSimulationTickParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  isPlayerWalking?: boolean;
  isPlayerRunning?: boolean;
  isPlayerJumping?: boolean;
  playerPreviousPosition?: DefiningWorldPlazaWorldPoint | null;
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
  const overlappingInstanceIds = new Set<string>();

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
      resolvingWildlifeInstanceCollisionRadiusGrid(species, liveInstance) +
      DEFINING_WILDLIFE_PLAYER_COLLISION_RADIUS_GRID;
    const deltaX = playerPosition.x - liveInstance.position.x;
    const deltaY = playerPosition.y - liveInstance.position.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance >= combinedRadius) {
      continue;
    }

    overlappingInstanceIds.add(instanceId);

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

      if (liveInstance.aiState.isSleeping) {
        instances.set(
          instanceId,
          resolvingWildlifeSleepBumpFromPlayerCollision({
            instance: liveInstance,
            species,
            pushedPosition,
            playerPosition,
            playerUserId,
            hazardSampling,
            nowMs,
          })
        );
      } else {
        const shouldStartle =
          isPlayerStartling &&
          checkingWildlifeFleesFromPlayerCollision(
            species.temperamentId,
            liveInstance.aggressionLevel
          );

        if (shouldStartle) {
          const alreadyStartled = checkingWildlifeIsStartledFromPlayerCollision(
            liveInstance.aiState.startledUntilMs,
            nowMs
          );

          if (alreadyStartled) {
            instances.set(instanceId, {
              ...liveInstance,
              position: pushedPosition,
            });
          } else {
            const fleeIntent = resolvingWildlifeLockedPlayerFleeIntent({
              position: pushedPosition,
              playerPosition,
              lockedFleeTargetPoint: liveInstance.aiState.fleeTargetPoint,
              species,
              hazardSampling,
            });
            const startledInstance = applyingWildlifeAdrenalineRushOnFleeEntry({
              instance: {
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
              },
              species,
              previousIntentMode: liveInstance.aiState.intent.mode,
              nextIntentMode: fleeIntent.mode,
            });

            instances.set(instanceId, startledInstance);
          }
        } else {
          instances.set(instanceId, {
            ...liveInstance,
            position: pushedPosition,
          });
        }
      }
    }

    pushX += directionX * overlap * 0.4;
    pushY += directionY * overlap * 0.4;
    hasPush = true;
  }

  for (const [instanceId, liveInstance] of instances) {
    if (
      liveInstance.aiState.hasPlayerSleepBumpContact &&
      !overlappingInstanceIds.has(instanceId)
    ) {
      instances.set(instanceId, clearingWildlifeSleepBumpContact(liveInstance));
    }
  }

  return hasPush ? { x: pushX, y: pushY } : null;
}

function resolvingWildlifeMeleeTargetPosition(
  intent: DefiningWildlifeBehaviorIntent,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  playerUserId: string | null,
  nearbyInstances: readonly DefiningWildlifeInstance[],
  updatedById: Map<string, DefiningWildlifeInstance>,
  instances: readonly DefiningWildlifeInstance[]
): DefiningWorldPlazaWorldPoint | null {
  if (intent.mode !== 'chase' && intent.mode !== 'attack') {
    return null;
  }

  if (intent.targetPoint) {
    return intent.targetPoint;
  }

  if (!intent.targetInstanceId) {
    return null;
  }

  if (intent.targetInstanceId === playerUserId) {
    return playerPosition;
  }

  const target =
    updatedById.get(intent.targetInstanceId) ??
    nearbyInstances.find(
      (entry) => entry.instanceId === intent.targetInstanceId
    ) ??
    instances.find((entry) => entry.instanceId === intent.targetInstanceId) ??
    null;

  return target?.position ?? null;
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
    checkingWildlifeFleeTargetHasMeaningfulLegDistance({
      position: instance.position,
      fleeTargetPoint: lockedTargetPoint,
    }) &&
    checkingWildlifeFleeTargetPointIsWalkable(
      lockedTargetPoint,
      species,
      hazardSampling
    ) &&
    checkingWildlifeFleeTargetReachableFromPosition({
      position: instance.position,
      fleeTargetPoint: lockedTargetPoint,
      species,
      hazardSampling,
    })
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
    intent.mode === 'stalk' ||
    intent.mode === 'followGuardian' ||
    intent.mode === 'seekPackmate' ||
    intent.mode === 'followPlayer' ||
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
      : intent.mode === 'followGuardian'
        ? DEFINING_WILDLIFE_SEPARATION_ANXIETY_COMFORT_DISTANCE_GRID
        : intent.mode === 'seekPackmate'
          ? DEFINING_WILDLIFE_SOCIAL_HUNTER_COMFORT_DISTANCE_GRID
          : intent.mode === 'followPlayer'
            ? DEFINING_WILDLIFE_DOCILE_FOLLOW_COMFORT_DISTANCE_GRID
            : intent.mode === 'stalk'
              ? 0.55
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
function resolvingWildlifeAttackMotionClipHoldMs(
  motionClip: DefiningWildlifeInstance['aiState']['motionClip']
): number {
  if (motionClip === 'attack3') {
    return DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS;
  }

  if (motionClip === 'attack2') {
    return DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS;
  }

  return DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS;
}

function checkingWildlifeAttackMotionClip(
  motionClip: DefiningWildlifeInstance['aiState']['motionClip']
): boolean {
  return (
    motionClip === 'attack' ||
    motionClip === 'attack2' ||
    motionClip === 'attack3'
  );
}

function resolvingWildlifeAttackWindupClip(
  attacker: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance['aiState']['motionClip'] {
  const lastAttackAtMs = attacker.aiState.lastAttackAtMs;
  const motionClip = attacker.aiState.motionClip;

  if (
    lastAttackAtMs !== null &&
    checkingWildlifeAttackMotionClip(motionClip) &&
    nowMs - lastAttackAtMs < resolvingWildlifeAttackMotionClipHoldMs(motionClip)
  ) {
    return motionClip;
  }

  return 'idle';
}

function applyingWildlifeMeleeAttack(
  attackerInput: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  target: DefiningWildlifeInstance | null,
  targetSpecies: DefiningWildlifeSpeciesDefinition | null,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  intent: DefiningWildlifeBehaviorIntent,
  nowMs: number,
  isRunning: boolean,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling,
  onPlayerHitByWildlife?: (hit: DefiningWildlifePlayerMeleeHit) => void,
  stalkMeleeContext?: {
    nearbyInstances: readonly DefiningWildlifeInstance[];
    resolveSpecies: (
      speciesId: string
    ) => DefiningWildlifeSpeciesDefinition | null;
    playerUserId: string | null;
    playerHealthRatio: number | null;
    playerStaminaRatio: number | null;
    playerStaminaIsDepleted: boolean;
    playerStillDurationMs: number;
  }
): {
  attacker: DefiningWildlifeInstance;
  target: DefiningWildlifeInstance | null;
} {
  let attacker = attackerInput;

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

  const comboIndex = resolvingWildlifeWolfAttackComboIndexForSwing({
    speciesId: attackerSpecies.speciesId,
    attackComboIndex: attacker.aiState.attackComboIndex,
    lastAttackAtMs: attacker.aiState.lastAttackAtMs,
    nowMs,
  });
  const attackMotionClip = resolvingWildlifeWolfAttackMotionClip(
    attackerSpecies.speciesId,
    comboIndex
  );
  const attackPower = Math.round(
    resolvingWildlifeMeleeAttackPower(
      attackerSpecies.vitals.attackPower,
      attackerSpecies,
      attacker,
      isRunning,
      nowMs
    ) *
      resolvingWildlifeWolfAttackDamageMultiplier(
        attackerSpecies.speciesId,
        attackMotionClip
      )
  );

  let swingLanded = false;
  let nextTarget = target;

  if (target && targetSpecies) {
    const distance = Math.hypot(
      attacker.position.x - target.position.x,
      attacker.position.y - target.position.y
    );

    if (distance <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      const damagedTarget = applyingWildlifeInstancePhysicalDamage({
        instance: target,
        rawAmount: attackPower,
        nowMs,
        attacker,
        wakeContext: target.aiState.isSleeping
          ? {
              threatPoint: attacker.position,
              threatTargetId: attacker.instanceId,
              species: targetSpecies,
              hazardSampling,
            }
          : null,
      });
      const appliedHealthDamage = Math.max(
        0,
        target.healthState.currentHealth -
          damagedTarget.healthState.currentHealth
      );

      nextTarget =
        appliedHealthDamage > 0
          ? applyingWildlifeDamageThreat(
              damagedTarget,
              targetSpecies,
              attacker.instanceId,
              appliedHealthDamage,
              nowMs
            )
          : damagedTarget;

      if (
        appliedHealthDamage > 0 &&
        attacker.healthState.physicalDamageLifestealModifiers.length > 0
      ) {
        const lifestealRatio =
          attacker.healthState.physicalDamageLifestealModifiers.reduce(
            (sum, mod) =>
              mod.expiresAtMs === null || mod.expiresAtMs > nowMs
                ? sum + mod.ratio
                : sum,
            0
          );
        const healAmount = Math.round(appliedHealthDamage * lifestealRatio);

        if (healAmount > 0) {
          const effectiveMaxHealth =
            attacker.healthState.baseMaxHealth *
            attacker.healthState.maxHealthScale;

          attacker = {
            ...attacker,
            healthState: {
              ...attacker.healthState,
              currentHealth: Math.min(
                effectiveMaxHealth,
                attacker.healthState.currentHealth + healAmount
              ),
            },
          };
        }
      }

      swingLanded = true;
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
      const isOmegaWolf = checkingWildlifeOmegaWolfSpecies(
        attackerSpecies.speciesId
      );
      const playerDamageAmount = isOmegaWolf
        ? Math.round(
            attackPower *
              (1 + DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS * 0.5)
          )
        : attackPower;

      onPlayerHitByWildlife({
        instanceId: attacker.instanceId,
        speciesId: attackerSpecies.speciesId,
        damageAmount: playerDamageAmount,
      });

      if (
        isOmegaWolf &&
        attacker.healthState.physicalDamageLifestealModifiers.length > 0
      ) {
        const lifestealRatio =
          attacker.healthState.physicalDamageLifestealModifiers.reduce(
            (sum, mod) =>
              mod.expiresAtMs === null || mod.expiresAtMs > nowMs
                ? sum + mod.ratio
                : sum,
            0
          );
        const healAmount = Math.round(playerDamageAmount * lifestealRatio);

        if (healAmount > 0) {
          const effectiveMaxHealth =
            attacker.healthState.baseMaxHealth *
            attacker.healthState.maxHealthScale;

          attacker = {
            ...attacker,
            healthState: {
              ...attacker.healthState,
              currentHealth: Math.min(
                effectiveMaxHealth,
                attacker.healthState.currentHealth + healAmount
              ),
            },
          };
        }
      }

      swingLanded = true;
    }
  }

  if (!swingLanded) {
    return { attacker, target };
  }

  const hitPlayer =
    playerPosition !== null &&
    Math.hypot(
      attacker.position.x - playerPosition.x,
      attacker.position.y - playerPosition.y
    ) <= DEFINING_WILDLIFE_MELEE_RANGE_GRID;

  let nextAttacker: DefiningWildlifeInstance = attacker;

  if (
    attackerSpecies.temperamentId === 'stalker' &&
    hitPlayer &&
    stalkMeleeContext
  ) {
    nextAttacker = applyingWildlifeStalkEventToInstance({
      instance: attacker,
      species: attackerSpecies,
      nearbyInstances: stalkMeleeContext.nearbyInstances,
      eventKind: 'ATTACK_COMMITTED',
      nowMs,
      resolveSpecies: stalkMeleeContext.resolveSpecies,
      playerUserId: stalkMeleeContext.playerUserId,
      playerHealthRatio: stalkMeleeContext.playerHealthRatio,
      playerStaminaRatio: stalkMeleeContext.playerStaminaRatio,
      playerStaminaIsDepleted: stalkMeleeContext.playerStaminaIsDepleted,
      playerStillDurationMs: stalkMeleeContext.playerStillDurationMs,
      playerPosition,
    });
  }

  return {
    attacker: {
      ...nextAttacker,
      aiState: {
        ...nextAttacker.aiState,
        isMoving: false,
        motionClip: attackMotionClip,
        lastAttackAtMs: nowMs,
        attackComboIndex: resolvingWildlifeWolfAttackComboIndexAfterSwing(
          attackerSpecies.speciesId,
          comboIndex
        ),
      },
    },
    target: nextTarget,
  };
}

function applyingWildlifeStationaryLocomotionPresentationToStore(
  store: ManagingWildlifeInstanceStore
): void {
  for (const instance of listingWildlifeInstances(store)) {
    const locomotion =
      syncingWildlifeStationaryLocomotionPresentation(instance);

    if (!locomotion) {
      continue;
    }

    replacingWildlifeInstance(store, {
      ...instance,
      aiState: {
        ...instance.aiState,
        ...locomotion,
      },
    });
  }
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

    const positionDelta = Math.hypot(
      snapshot.x - existing.position.x,
      snapshot.y - existing.position.y
    );
    const syncedMotionClip =
      positionDelta <= DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID &&
      (snapshot.motionClip === 'walk' || snapshot.motionClip === 'run')
        ? 'idle'
        : snapshot.motionClip;

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
        isMoving:
          positionDelta > DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID,
        motionClip:
          syncedMotionClip as DefiningWildlifeInstance['aiState']['motionClip'],
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
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  resolveSpecies,
  deltaSeconds,
  nowMs,
  placedBlocks = [],
  placedBlocksByTile,
  isDaytime,
  onPlayerHitByWildlife,
  isLeader,
  remoteSnapshots = [],
  meatDropContext = null,
  isPlayerRunning = false,
  isPlayerJumping = false,
  isPlayerWalking = false,
  playerPreviousPosition = null,
}: AdvancingWildlifeSimulationTickParams): AdvancingWildlifeSimulationTickResult {
  const isPlayerStartling = checkingWildlifePlayerStartlesWildlife(
    isPlayerRunning,
    isPlayerJumping
  );
  const cycleSample = resolvingWorldPlazaDayNightCycleSample(nowMs);
  const cyclePhase = cycleSample.cyclePhase;
  const resolvedIsDaytime = isDaytime ?? cycleSample.isDaytime;
  const hazardSampling = {
    placedBlocks,
    placedBlocksByTile,
    isDaytime: resolvedIsDaytime,
  };
  hydratingWildlifeInstancesNearPoint(
    store,
    center,
    resolveSpecies,
    nowMs,
    cyclePhase
  );
  advancingWildlifeCorpseLifecycle(store, center, nowMs);
  advancingWildlifePendingRespawns({
    store,
    playerCenter: center,
    resolveSpecies,
    nowMs,
    isDaytime: hazardSampling.isDaytime,
    placedBlocks: hazardSampling.placedBlocks,
    placedBlocksByTile: hazardSampling.placedBlocksByTile,
  });
  despawningWildlifeInstancesBeyondRadius(store, center, nowMs);

  if (!isLeader) {
    applyingRemoteWildlifeSnapshots(store, remoteSnapshots);
    applyingWildlifeStationaryLocomotionPresentationToStore(store);
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

  applyingWildlifeSpawnPackAlphaLocks({
    store,
    resolveSpecies,
    nowMs,
  });

  const instances = [...listingWildlifeInstances(store)];
  const liveInstances = instances.filter((entry) => !entry.isDead);
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);

  if (playerPosition && playerUserId) {
    advancingWildlifeStalkPlayerApproachTick({
      store,
      playerPosition,
      playerPreviousPosition,
      playerUserId,
      isPlayerWalking,
      isPlayerRunning,
      playerHealthRatio: playerHealthRatio ?? null,
      playerStaminaRatio: playerStaminaRatio ?? null,
      playerStaminaIsDepleted,
      playerStillDurationMs,
      nowMs,
      resolveSpecies,
    });
  }

  const steeringQueryRadius =
    DEFINING_WILDLIFE_STEERING_WEIGHTS.separationRadiusGrid + 0.5;
  const updatedById = new Map<string, DefiningWildlifeInstance>();
  const wolfHowlEvents: ApplyingWildlifeWolfHowlEvent[] = [];

  for (const staleInstance of instances) {
    // Earlier iterations may have already written to this instance (e.g. a
    // predator applied melee damage). Start from that version, not the
    // start-of-tick snapshot, or the damage gets silently reverted here.
    const instance = updatedById.get(staleInstance.instanceId) ?? staleInstance;
    const positionAtTickStart = instance.position;
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
      nextInstance = attemptingWildlifeMeatGroundDropOnDeath(
        store,
        nextInstance,
        species,
        meatDropContext
      );
      updatedById.set(nextInstance.instanceId, nextInstance);
      continue;
    }

    nextInstance = advancingWildlifeHealthStatusTick({
      instance: nextInstance,
      deltaMs: deltaSeconds * 1000,
      nowMs,
    });

    if (nextInstance.isDead) {
      nextInstance = attemptingWildlifeMeatGroundDropOnDeath(
        store,
        nextInstance,
        species,
        meatDropContext
      );
      updatedById.set(nextInstance.instanceId, nextInstance);
      continue;
    }

    nextInstance = advancingWildlifeSleepTick({
      instance: nextInstance,
      species,
      cyclePhase,
      nowMs,
    });

    if (nextInstance.isDead) {
      updatedById.set(nextInstance.instanceId, nextInstance);
      continue;
    }

    nextInstance = clearingWildlifeDocileExpiredFollowTimer(
      nextInstance,
      nowMs
    );

    const isSleeping = nextInstance.aiState.isSleeping;

    const isFeedingOnKill = checkingWildlifeIsFeedingOnKill(
      nextInstance,
      nowMs
    );

    const isStartledFromPlayerCollision =
      !isFeedingOnKill &&
      !isSleeping &&
      !checkingWildlifeIsHuntingPlayer(nextInstance, playerUserId) &&
      Boolean(playerPosition) &&
      checkingWildlifeFleesFromPlayerCollision(
        species.temperamentId,
        nextInstance.aggressionLevel
      ) &&
      checkingWildlifeIsStartledFromPlayerCollision(
        nextInstance.aiState.startledUntilMs,
        nowMs
      );

    if (isStartledFromPlayerCollision && playerPosition) {
      const previousIntentMode = nextInstance.aiState.intent.mode;
      const fleeIntent = resolvingWildlifeLockedPlayerFleeIntent({
        position: nextInstance.position,
        playerPosition,
        lockedFleeTargetPoint: nextInstance.aiState.fleeTargetPoint,
        species,
        hazardSampling,
      });
      const nextFleeTargetPoint = fleeIntent.targetPoint ?? null;
      const fleeTargetChanged =
        nextFleeTargetPoint?.x !== nextInstance.aiState.fleeTargetPoint?.x ||
        nextFleeTargetPoint?.y !== nextInstance.aiState.fleeTargetPoint?.y ||
        fleeIntent.mode !== nextInstance.aiState.intent.mode;

      nextInstance = applyingWildlifeAdrenalineRushOnFleeEntry({
        instance: {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            intent: fleeIntent,
            fleeTargetPoint: nextFleeTargetPoint,
            steeringCache: fleeTargetChanged
              ? null
              : nextInstance.aiState.steeringCache,
          },
        },
        species,
        previousIntentMode,
        nextIntentMode: fleeIntent.mode,
      });
    }

    if (isFeedingOnKill) {
      nextInstance = advancingWildlifeHunterKillFeedingTick(
        nextInstance,
        nowMs
      );
    }

    const proximityNeighbors =
      species.diet === 'herbivore' ||
      isFeedingOnKill ||
      isStartledFromPlayerCollision ||
      isSleeping
        ? []
        : queryingWildlifeInstancesNearPoint({
            grid: spatialGrid,
            point: nextInstance.position,
            radiusGrid: resolvingWildlifePreyProximityAttackRadiusGrid(species),
            excludeInstanceId: nextInstance.instanceId,
          });
    const hasProximityPreyInterrupt =
      !isFeedingOnKill &&
      !isStartledFromPlayerCollision &&
      !isSleeping &&
      checkingWildlifeProximityPreyInterrupt({
        instance: nextInstance,
        species,
        nearbyInstances: proximityNeighbors,
        resolveSpecies,
      });

    const shouldThink =
      !isFeedingOnKill &&
      !isStartledFromPlayerCollision &&
      !isSleeping &&
      (checkingWildlifeShouldThink({
        lastThinkAtMs: nextInstance.aiState.lastThinkAtMs,
        position: nextInstance.position,
        playerPosition,
        nowMs,
      }) ||
        hasProximityPreyInterrupt);

    if (
      (isSleeping ||
        (!shouldThink &&
          !nextInstance.aiState.jumpState &&
          !isStartledFromPlayerCollision &&
          (nextInstance.aiState.intent.mode === 'idle' ||
            nextInstance.aiState.intent.mode === 'graze' ||
            (nextInstance.aiState.intent.mode === 'stalk' &&
              (() => {
                const holdDirection = resolvingDesiredDirection(
                  nextInstance,
                  nextInstance.aiState.intent
                );

                return holdDirection.x === 0 && holdDirection.y === 0;
              })())))) &&
      !nextInstance.aiState.jumpState &&
      !isStartledFromPlayerCollision
    ) {
      if (isSleeping) {
        nextInstance = {
          ...nextInstance,
          speechState: advancingWildlifeSpeechTick({
            instance: nextInstance,
            nowMs,
          }),
        };
        updatedById.set(nextInstance.instanceId, nextInstance);
        continue;
      }

      const staminaResult = advancingWildlifeStaminaTick(
        nextInstance.staminaState,
        false,
        deltaSeconds,
        resolvingWildlifeInstanceStaminaConfig(species, nextInstance),
        resolvingWildlifeSpeciesExhaustedExitRatio(species.speciesId),
        resolvingWildlifeInstanceMaxStaminaRatio(nextInstance, species)
      );

      updatedById.set(nextInstance.instanceId, {
        ...nextInstance,
        staminaState: staminaResult.state,
        aiState: {
          ...nextInstance.aiState,
          isMoving: false,
          motionClip: 'idle',
        },
      });

      continue;
    }

    const behaviorNeighbors = queryingWildlifeInstancesNearPoint({
      grid: spatialGrid,
      point: nextInstance.position,
      radiusGrid: resolvingWildlifeBehaviorNeighborQueryRadiusGrid(
        species,
        nextInstance.aggressionLevel
      ),
      excludeInstanceId: nextInstance.instanceId,
    });

    const distanceToPlayer = resolvingWildlifeDistanceToPlayer(
      nextInstance.position,
      playerPosition
    );

    if (shouldThink && !isStartledFromPlayerCollision && !isFeedingOnKill) {
      const thinkElapsedSeconds =
        (nowMs - nextInstance.aiState.lastThinkAtMs) / 1000;
      const nearbyInstances = behaviorNeighbors.map(
        (neighbor) => updatedById.get(neighbor.instanceId) ?? neighbor
      );
      const previousIntent = nextInstance.aiState.intent;
      const aggroBefore = nextInstance.aggroState;

      nextInstance = {
        ...nextInstance,
        aggroState: advancingWildlifeAggroTick({
          instance: nextInstance,
          species,
          nearbyInstances,
          playerPosition,
          playerUserId,
          playerHealthRatio,
          playerStaminaRatio,
          playerStaminaIsDepleted,
          playerStillDurationMs,
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
        isPlayerWalking,
        isPlayerRunning,
        isPlayerJumping,
        nowMs,
        hazardSampling,
        selectedPreyInstanceId: null,
        selectedProximityPreyInstanceId: null,
        selectedGroundFoodItemId: null,
        playerHealthRatio,
        playerStaminaRatio,
        playerStaminaIsDepleted,
        playerStillDurationMs,
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
      let resolvedIntent = fleeLockResult.intent;
      const howlSummonResolution = resolvingWildlifeWolfHowlSummonOverride({
        instance: nextInstance,
        intent: resolvedIntent,
        nowMs,
      });

      resolvedIntent = howlSummonResolution.intent;
      const isGrazing = resolvedIntent.mode === 'graze';

      // Leash return resets aggro so the animal does not re-chase the same
      // target the moment it crosses back inside the leash boundary.
      let nextAggroState =
        resolvedIntent.mode === 'return'
          ? {
              threats: [],
              activeTargetId: null,
              lastDamagedAtMs: nextInstance.aggroState.lastDamagedAtMs,
              lastAggroedAtMs: nextInstance.aggroState.lastAggroedAtMs ?? null,
              stalkingPreySinceMs: null,
              stalkConfidentSinceMs: null,
              stalkAttackingPreySinceMs: null,
              stalkPhase: 'idle' as const,
              stalkPhaseEnteredAtMs: null,
              pendingStalkEvents: [],
              stalkPlayerApproachState: null,
              stalkPlayerApproachReactedAtMs: null,
              stalkLockedPreyTargetId: null,
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
          howlSummon: howlSummonResolution.howlSummon,
          chargeWindupStartedAtMs: chargeResult.chargeWindupStartedAtMs,
          fleeTargetPoint: fleeLockResult.fleeTargetPoint,
          lastThinkAtMs: nowMs,
          steeringCache: null,
        },
      };

      nextInstance = applyingWildlifeAdrenalineRushOnFleeEntry({
        instance: nextInstance,
        species,
        previousIntentMode: previousIntent.mode,
        nextIntentMode: resolvedIntent.mode,
      });

      nextInstance = seedingWildlifeBluffChargeReturnPoint(
        nextInstance,
        species.speciesId,
        chargeResult.chargeWindupStartedAtMs
      );
      nextInstance = clearingWildlifeBluffReturnOnArrival(nextInstance);

      nextInstance = applyingWildlifeDocileApproachReactOutcome({
        instance: nextInstance,
        species,
        intent: resolvedIntent,
        blackboard,
        nowMs,
      });

      const preyTargetId = nextInstance.aggroState.activeTargetId;
      const packmatesTargetingPrey =
        preyTargetId === null
          ? []
          : listingWildlifeStalkPackmatesTargetingPrey({
              instance: nextInstance,
              nearbyInstances,
              preyTargetId,
            });
      const stalkFormation = resolvingWildlifeStalkSpawnPackFormation({
        instance: nextInstance,
        nearbyInstances,
        packmatesTargetingPrey,
        resolveSpecies,
      });

      const lastHowlAtMsBeforeTriggers = nextInstance.aiState.lastHowlAtMs;

      nextInstance = advancingWildlifeWolfHowlTriggers({
        instance: nextInstance,
        previousAggroState: aggroBefore,
        nextAggroState: nextInstance.aggroState,
        previousIntent,
        nextIntent: resolvedIntent,
        isPackAlpha: stalkFormation.isAlpha,
        nowMs,
      });

      if (nextInstance.aiState.lastHowlAtMs !== lastHowlAtMsBeforeTriggers) {
        wolfHowlEvents.push({
          howlerInstanceId: nextInstance.instanceId,
          point: nextInstance.position,
        });
      }
    }

    nextInstance = applyingWildlifeWolfHowlPresentation(nextInstance, nowMs);

    if (checkingWildlifeInstanceIsHowling(nextInstance, nowMs)) {
      nextInstance = {
        ...nextInstance,
        speechState: advancingWildlifeSpeechTick({
          instance: nextInstance,
          nowMs,
        }),
      };
      updatedById.set(nextInstance.instanceId, nextInstance);
      continue;
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
          // Landing must drop the run clip; otherwise wolves freeze on a gallop
          // frame until the next intent rewrite.
          isMoving: !jumpStep.isComplete,
          motionClip: jumpStep.isComplete ? 'idle' : 'run',
          jumpState: jumpStep.isComplete ? null : jumpStep.jumpState,
          lastJumpEndedAtMs: jumpStep.isComplete
            ? nowMs
            : nextInstance.aiState.lastJumpEndedAtMs,
        },
      });
      continue;
    }

    let intent = nextInstance.aiState.intent;
    // Stamina drain uses pre-bluff intent so an active charge still burns stamina
    // before the abort check below.
    const preBluffDesiredDirection = resolvingDesiredDirection(
      nextInstance,
      intent
    );
    const preBluffTryingToMove =
      preBluffDesiredDirection.x !== 0 || preBluffDesiredDirection.y !== 0;
    const wantsToRunForStamina =
      (intent.mode === 'flee' ||
        intent.mode === 'chase' ||
        intent.mode === 'followGuardian' ||
        intent.mode === 'seekPackmate' ||
        intent.mode === 'followPlayer' ||
        intent.mode === 'forageChase' ||
        intent.mode === 'attack' ||
        (intent.mode === 'stalk' && intent.pace === 'run')) &&
      preBluffTryingToMove;
    const staminaResult = advancingWildlifeStaminaTick(
      nextInstance.staminaState,
      wantsToRunForStamina,
      deltaSeconds,
      resolvingWildlifeInstanceStaminaConfig(species, nextInstance),
      resolvingWildlifeSpeciesExhaustedExitRatio(species.speciesId),
      resolvingWildlifeInstanceMaxStaminaRatio(nextInstance, species)
    );

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

    const bluffResult = advancingWildlifeBluffCharge({
      instance: nextInstance,
      species,
      playerPosition,
      playerUserId,
      nowMs,
    });
    nextInstance = bluffResult.instance;
    intent = nextInstance.aiState.intent;

    const desiredDirection = resolvingDesiredDirection(nextInstance, intent);
    const isTryingToMove = desiredDirection.x !== 0 || desiredDirection.y !== 0;
    const wantsToRun =
      (intent.mode === 'flee' ||
        intent.mode === 'chase' ||
        intent.mode === 'followGuardian' ||
        intent.mode === 'seekPackmate' ||
        intent.mode === 'followPlayer' ||
        intent.mode === 'forageChase' ||
        intent.mode === 'attack' ||
        (intent.mode === 'stalk' && intent.pace === 'run')) &&
      isTryingToMove;
    const isRunning = wantsToRun && staminaResult.isRunning;

    const walkSpeed = resolvingWildlifeInstanceWalkSpeedGridPerSecond(
      species,
      nextInstance
    );
    const runSpeed = resolvingWildlifeInstanceRunSpeedGridPerSecond(
      species,
      nextInstance
    );
    const acceleratedRunSpeed = isRunning
      ? computingWildlifeAcceleratedRunSpeed(
          walkSpeed,
          runSpeed,
          staminaResult.state.runningForSeconds,
          resolvingWildlifeSpeciesAccelerationConfig(species.speciesId)
        )
      : runSpeed;
    const speed = wantsToRun
      ? isRunning
        ? acceleratedRunSpeed
        : walkSpeed
      : intent.mode === 'wander' ||
          intent.mode === 'return' ||
          intent.mode === 'stalk'
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
        (intent.mode === 'stalk'
          ? null
          : resolvingWildlifeTerrainGapJumpPlan({
              instance: nextInstance,
              species,
              desiredDirection,
              hazardSampling,
              nowMs,
            }));

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
      let nextPosition = steering.nextPosition;
      let didMove = steering.moved;

      if (
        !didMove &&
        intent.mode === 'flee' &&
        playerPosition &&
        isTryingToMove
      ) {
        const overlapEscapePosition = resolvingWildlifeOverlapThreatEscapeStep({
          position: nextInstance.position,
          threatPoint: playerPosition,
          species,
          hazardSampling,
        });

        if (overlapEscapePosition) {
          nextPosition = overlapEscapePosition;
          didMove = true;
        }
      }

      nextInstance = {
        ...nextInstance,
        position: nextPosition,
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          nextPosition,
          intent,
          didMove ? nextPosition.x - nextInstance.position.x : movedX,
          didMove ? nextPosition.y - nextInstance.position.y : movedY,
          nextInstance.facingDirection
        ),
        aiState: {
          ...nextInstance.aiState,
          isMoving: didMove,
          motionClip: didMove ? (isRunning ? 'run' : 'walk') : 'idle',
          steeringCache:
            didMove && !steering.moved ? null : steering.steeringCache,
        },
      };
    } else if (
      intent.mode === 'graze' ||
      intent.mode === 'idle' ||
      intent.mode === 'territoryWarn' ||
      !isTryingToMove
    ) {
      const motionClip =
        intent.mode === 'attack'
          ? resolvingWildlifeAttackWindupClip(nextInstance, nowMs)
          : 'idle';

      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          isMoving: false,
          motionClip,
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
    } else {
      // Any non-eating intent (combat, flee, chase) cancels the chew timer so
      // returning to the stack later always restarts the full 5-10s window.
      nextInstance = clearingWildlifePendingGroundFoodBite(nextInstance);
    }

    const meleeTargetPosition = resolvingWildlifeMeleeTargetPosition(
      intent,
      playerPosition,
      playerUserId,
      behaviorNeighbors,
      updatedById,
      instances
    );
    const engagementIntent = resolvingWildlifeMeleeEngagementIntent({
      intent,
      position: nextInstance.position,
      targetPosition: meleeTargetPosition,
    });

    if (engagementIntent.mode !== intent.mode) {
      intent = engagementIntent;
      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          intent: engagementIntent,
        },
      };
    }

    if (intent.mode === 'attack') {
      const stalkMeleeContext =
        species.temperamentId === 'stalker'
          ? {
              nearbyInstances: behaviorNeighbors,
              resolveSpecies,
              playerUserId,
              playerHealthRatio,
              playerStaminaRatio,
              playerStaminaIsDepleted,
              playerStillDurationMs,
            }
          : undefined;

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
        checkingWildlifeMayMeleeWildlifeTarget({
          attackerSpecies: species,
          targetSpecies: preySpecies,
          targetInstanceId: prey.instanceId,
          activeTargetId: nextInstance.aggroState.activeTargetId,
          hungerDriveLevel:
            nextInstance.hungerState.driveLevel === 'starving'
              ? 'starving'
              : 'hungry',
        })
      ) {
        const preyWasSleeping = prey.aiState.isSleeping;
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          prey,
          preySpecies,
          playerPosition,
          intent,
          nowMs,
          isRunning,
          hazardSampling,
          onPlayerHitByWildlife,
          stalkMeleeContext
        );
        nextInstance = attackResult.attacker;

        if (attackResult.target) {
          if (attackResult.target.isDead) {
            const feedResult = feedingWildlifeHunterFromKill({
              store,
              preyInstance: attackResult.target,
              preySpecies,
              hunterInstance: nextInstance,
              hunterSpecies: species,
              meatDropContext,
              nowMs,
            });
            nextInstance = feedResult.hunter;
            updatedById.set(feedResult.prey.instanceId, feedResult.prey);
          } else {
            updatedById.set(
              attackResult.target.instanceId,
              attackResult.target
            );
          }

          if (preyWasSleeping) {
            wakingWildlifeNearbySleepersFromHit({
              store,
              hitInstanceId: attackResult.target.instanceId,
              speciesId: prey.speciesId,
              species: preySpecies,
              centerPoint: attackResult.target.position,
              threatPoint: attackResult.attacker.position,
              threatTargetId: attackResult.attacker.instanceId,
              hazardSampling,
              nowMs,
            });
          }
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
          hazardSampling,
          onPlayerHitByWildlife,
          stalkMeleeContext
        );
        nextInstance = attackResult.attacker;
      }
    }

    const movedThisTickX = nextInstance.position.x - positionAtTickStart.x;
    const movedThisTickY = nextInstance.position.y - positionAtTickStart.y;

    if (
      intent.mode === 'chase' ||
      intent.mode === 'attack' ||
      intent.mode === 'stalk' ||
      intent.mode === 'followGuardian' ||
      intent.mode === 'seekPackmate' ||
      intent.mode === 'followPlayer' ||
      intent.mode === 'territoryWarn' ||
      intent.mode === 'forageChase' ||
      intent.mode === 'forageEat'
    ) {
      nextInstance = {
        ...nextInstance,
        facingDirection: resolvingWildlifeInstanceFacingDirection(
          nextInstance.position,
          intent,
          movedThisTickX,
          movedThisTickY,
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
          movedThisTickX,
          movedThisTickY,
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

    const locomotionPresentation = resolvingWildlifeLocomotionPresentation({
      aiState: nextInstance.aiState,
      intent: nextInstance.aiState.intent,
      movedDistanceGrid: Math.hypot(
        nextInstance.position.x - positionAtTickStart.x,
        nextInstance.position.y - positionAtTickStart.y
      ),
      deltaSeconds,
      nowMs,
    });

    nextInstance = {
      ...nextInstance,
      aiState: {
        ...nextInstance.aiState,
        ...locomotionPresentation,
      },
    };

    updatedById.set(nextInstance.instanceId, nextInstance);
  }

  for (const [instanceId, instance] of updatedById) {
    replacingWildlifeInstance(store, instance);
  }

  applyingWildlifeWolfHowlPackAttraction({
    store,
    events: wolfHowlEvents,
    nowMs,
  });

  resolvingWildlifeInstanceSeparation({
    instances: store.instances,
    resolveSpecies,
  });
  applyingWildlifeStationaryLocomotionPresentationToStore(store);

  const playerPushOut = playerPosition
    ? resolvingWildlifePlayerCollision(
        store.instances,
        playerPosition,
        playerUserId,
        resolveSpecies,
        spatialGrid,
        nowMs,
        isPlayerStartling,
        hazardSampling
      )
    : null;

  // Standing-layer sync only for instances that moved this tick (or after
  // separation). Idle animals keep their last resolved layer.
  const movedInstanceIds = new Set<string>();

  for (const instance of listingWildlifeInstances(store)) {
    if (instance.aiState.isMoving) {
      movedInstanceIds.add(instance.instanceId);
    }
  }

  if (movedInstanceIds.size > 0) {
    syncingAllWildlifeInstanceStandingLayers(
      store,
      placedBlocks,
      placedBlocksByTile,
      movedInstanceIds
    );
  }

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
  meatDropContext: DefiningWildlifeMeatDropContext | null = null,
  projectileArchetypeId: string | null = null,
  stalkShadowingContext: Omit<
    ResolvingWildlifeStalkShadowingAtDamageContextParams,
    'preyTargetId' | 'nearbyInstances'
  > | null = null
): DefiningWildlifeInstance | null {
  const instance = store.instances.get(instanceId);

  if (!instance || instance.isDead) {
    return null;
  }

  const species = resolveSpecies(instance.speciesId);

  if (!species) {
    return null;
  }

  const wasSleeping = instance.aiState.isSleeping;
  const wakeContext =
    wasSleeping && meatDropContext
      ? {
          threatPoint: meatDropContext.playerPosition,
          threatTargetId: attackerTargetId,
          species,
          hazardSampling: {
            placedBlocks: [],
            isDaytime: true,
          },
        }
      : null;
  const projectileArchetype = projectileArchetypeId
    ? resolvingWorldPlazaProjectileArchetype(projectileArchetypeId)
    : null;
  const damageAppliedInstance = projectileArchetype
    ? applyingWildlifeInstanceHealthPayload({
        instance,
        payload: projectileArchetype.payload,
        nowMs,
        wakeContext,
      })
    : applyingWildlifeInstancePhysicalDamage({
        instance,
        rawAmount: damageAmount,
        nowMs,
        wakeContext,
      });

  const died = damageAppliedInstance.isDead;
  const appliedHealthDamage = Math.max(
    0,
    instance.healthState.currentHealth -
      damageAppliedInstance.healthState.currentHealth
  );
  let behaviorResponseInstance = damageAppliedInstance;

  if (
    appliedHealthDamage > 0 &&
    !died &&
    meatDropContext &&
    checkingWildlifeSpeciesIsDocile(species)
  ) {
    behaviorResponseInstance = applyingWildlifeDocilePlayerHitBehaviorResponse({
      instance: damageAppliedInstance,
      species,
      threatPoint: meatDropContext.playerPosition,
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      nowMs,
    });
  }

  const nextInstance = applyingWildlifeDamageThreat(
    behaviorResponseInstance,
    species,
    attackerTargetId,
    appliedHealthDamage,
    nowMs
  );

  replacingWildlifeInstance(store, nextInstance);

  const liveInstances = listingWildlifeInstances(store).filter(
    (entry) => !entry.isDead
  );
  const stalkPreyVitals =
    stalkShadowingContext === null
      ? null
      : resolvingWildlifeStalkShadowingAtDamageContext({
          ...stalkShadowingContext,
          preyTargetId: attackerTargetId,
          nearbyInstances: liveInstances,
        });
  const stalkResponseApplied =
    appliedHealthDamage > 0 &&
    checkingWildlifeStalkerShadowingAtDamage({
      instance: damageAppliedInstance,
      species,
      preyTargetId: attackerTargetId,
      nowMs,
      ...(stalkPreyVitals ?? {}),
    });

  if (stalkResponseApplied) {
    applyingWildlifeStalkPackDamageResponse({
      store,
      damagedInstance: nextInstance,
      species,
      preyTargetId: attackerTargetId,
      nearbyInstances: liveInstances,
      nowMs,
      resolveSpecies,
    });
  }

  if (died) {
    attemptingWildlifeMeatGroundDropOnDeath(
      store,
      nextInstance,
      species,
      meatDropContext,
      {
        killerTargetId: attackerTargetId,
        nowMs,
      }
    );

    applyingWildlifePackAlphaDeathScatter({
      store,
      deadInstance: nextInstance,
      species,
      threatPoint: meatDropContext?.playerPosition ?? null,
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      resolveSpecies,
      nowMs,
    });
  }

  if (wasSleeping) {
    wakingWildlifeNearbySleepersFromHit({
      store,
      hitInstanceId: instanceId,
      speciesId: instance.speciesId,
      species,
      centerPoint: nextInstance.position,
      threatPoint: meatDropContext?.playerPosition ?? nextInstance.position,
      threatTargetId: attackerTargetId,
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      nowMs,
    });
  }

  const sharedThreat =
    appliedHealthDamage *
    species.aggro.threatPerDamage *
    DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO;
  const threatPoint = meatDropContext?.playerPosition ?? nextInstance.position;
  const defendYoungApplied =
    appliedHealthDamage > 0 &&
    checkingWildlifeInstanceIsDefendYoungVictim(nextInstance, species);

  if (defendYoungApplied) {
    applyingWildlifeDefendYoungDamageResponse({
      store,
      damagedInstance: nextInstance,
      species,
      attackerTargetId,
      sharedThreat,
      nowMs,
      resolveSpecies,
    });
  }

  const herdFleeApplied =
    appliedHealthDamage > 0 &&
    !stalkResponseApplied &&
    checkingWildlifeHerbivoreHasHerdFleeTemperament(species);

  if (herdFleeApplied) {
    applyingWildlifeHerbivoreHerdFleeResponse({
      store,
      damagedInstance: nextInstance,
      species,
      attackerTargetId,
      threatPoint,
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
      sharedThreat,
      nowMs,
      resolveSpecies,
    });
  } else if (!defendYoungApplied) {
    const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
    const packmates = queryingWildlifeInstancesNearPoint({
      grid: spatialGrid,
      point: nextInstance.position,
      radiusGrid: species.aggro.packShareRadiusGrid,
      excludeInstanceId: instanceId,
    });

    for (const packmate of packmates) {
      if (
        !checkingWildlifeSameStalkPackSpecies(
          packmate.speciesId,
          instance.speciesId
        )
      ) {
        continue;
      }

      const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

      if (
        stalkResponseApplied ||
        checkingWildlifeStalkPhaseIsFleeing(livePackmate.aggroState)
      ) {
        continue;
      }

      replacingWildlifeInstance(
        store,
        sharingWildlifePackThreat(
          livePackmate,
          species,
          attackerTargetId,
          sharedThreat,
          nowMs
        )
      );
    }
  }

  return nextInstance;
}
