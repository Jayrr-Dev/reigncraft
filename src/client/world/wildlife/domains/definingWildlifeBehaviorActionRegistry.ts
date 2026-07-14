/**
 * Behavior tree action resolution into movement/combat intents.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorActionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import { checkingWildlifePackAlphaHasCommittedPreyAttack } from '@/components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack';
import {
  checkingWildlifeStalkPhaseIsFleeing,
  checkingWildlifeStalkPhaseIsFormingUp,
  checkingWildlifeStalkPhaseIsRegrouping,
  checkingWildlifeStalkPhaseIsRetreating,
  checkingWildlifeStalkPhaseIsSurrounding,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  checkingWildlifeMayTargetPlayer,
  resolvingWildlifeNearestHuntablePreyInstanceId,
  resolvingWildlifeProximityPreyInstanceId,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorActionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import {
  checkingWildlifeGroundFlowerItemId,
  parsingWildlifeGroundFlowerItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import {
  checkingWildlifeGroundGrassItemId,
  parsingWildlifeGroundGrassItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import {
  DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import { checkingWildlifeGroundFlowerOptimisticIsPicked } from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { checkingWildlifeGroundGrassOptimisticIsCleared } from '@/components/world/wildlife/domains/managingWildlifeGroundGrassBridge';
import { resolvingWildlifeDocileApproachReactIntent } from '@/components/world/wildlife/domains/resolvingWildlifeDocileApproachReactIntent';
import { resolvingWildlifeDocileFollowPlayerIntent } from '@/components/world/wildlife/domains/resolvingWildlifeDocileFollowPlayerIntent';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';
import { resolvingWildlifePackRoamWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifePackRoamWanderIntent';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import { resolvingWildlifeSeparationAnxietyFollowIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyFollowIntent';
import { resolvingWildlifeSocialHunterSeekPackIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackIntent';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';
import { resolvingWildlifeStalkEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeStalkEngagementIntent';
import { resolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
import {
  checkingWildlifeStalkPlayerApproachRetreatComplete,
  resolvingWildlifeStalkPlayerApproachRetreatIntent,
} from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatIntent';
import { resolvingWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyContext';
import { resolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';
import { resolvingWildlifeStalkSurroundEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSurroundEngagementIntent';
import { resolvingWildlifeStalkSurroundTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSurroundTargetPoint';
import { resolvingWildlifeWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifeWanderIntent';

function resolvingThreatTargetPoint(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWorldPlazaWorldPoint | null {
  const targetId = blackboard.instance.aggroState.activeTargetId;

  if (!targetId) {
    return null;
  }

  if (targetId === blackboard.playerUserId && blackboard.playerPosition) {
    return blackboard.playerPosition;
  }

  const prey = blackboard.nearbyInstances.find(
    (entry) => entry.instanceId === targetId
  );

  return prey?.position ?? null;
}

function resolvingChaseTarget(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const threatPoint = resolvingThreatTargetPoint(blackboard);

  if (threatPoint && blackboard.instance.aggroState.activeTargetId) {
    return {
      mode: 'chase',
      targetInstanceId: blackboard.instance.aggroState.activeTargetId,
      targetPoint: threatPoint,
    };
  }

  const proximityPreyInstanceId =
    resolvingWildlifeProximityPreyInstanceId(blackboard);

  if (proximityPreyInstanceId) {
    const proximityPrey = blackboard.nearbyInstances.find(
      (entry) => entry.instanceId === proximityPreyInstanceId
    );

    if (proximityPrey) {
      return {
        mode: 'chase',
        targetInstanceId: proximityPreyInstanceId,
        targetPoint: proximityPrey.position,
      };
    }
  }

  const preyInstanceId =
    resolvingWildlifeNearestHuntablePreyInstanceId(blackboard);

  if (preyInstanceId) {
    const prey = blackboard.nearbyInstances.find(
      (entry) => entry.instanceId === preyInstanceId
    );

    if (prey) {
      return {
        mode: 'chase',
        targetInstanceId: preyInstanceId,
        targetPoint: prey.position,
      };
    }
  }

  if (
    checkingWildlifeMayTargetPlayer(blackboard) &&
    blackboard.playerPosition &&
    blackboard.playerUserId
  ) {
    return {
      mode: 'chase',
      targetInstanceId: blackboard.playerUserId,
      targetPoint: blackboard.playerPosition,
    };
  }

  return resolvingWildlifeWanderIntent(blackboard);
}

function resolvingForageGroundFlowerIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  groundFoodId: string
): DefiningWildlifeBehaviorIntent {
  const tile = parsingWildlifeGroundFlowerItemId(groundFoodId);

  if (!tile) {
    return { mode: 'idle' };
  }

  if (
    checkingWorldPlazaRuntimeFlowerIsPicked(tile.tileX, tile.tileY) ||
    checkingWildlifeGroundFlowerOptimisticIsPicked(tile.tileX, tile.tileY)
  ) {
    return { mode: 'idle' };
  }

  const targetPoint = {
    x: tile.tileX + 0.5,
    y: tile.tileY + 0.5,
    layer: 1,
  };
  const distanceToFood = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToFood <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return {
      mode: 'forageEat',
      targetGroundItemId: groundFoodId,
      targetPoint,
    };
  }

  return {
    mode: 'forageChase',
    targetGroundItemId: groundFoodId,
    targetPoint,
  };
}

function resolvingForageGroundGrassIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  groundFoodId: string
): DefiningWildlifeBehaviorIntent {
  const tile = parsingWildlifeGroundGrassItemId(groundFoodId);

  if (!tile) {
    return { mode: 'idle' };
  }

  if (
    checkingWorldPlazaRuntimeLongGrassIsCleared(tile.tileX, tile.tileY) ||
    checkingWildlifeGroundGrassOptimisticIsCleared(tile.tileX, tile.tileY)
  ) {
    return { mode: 'idle' };
  }

  const targetPoint = {
    x: tile.tileX + 0.5,
    y: tile.tileY + 0.5,
    layer: 1,
  };
  const distanceToFood = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToFood <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return {
      mode: 'forageEat',
      targetGroundItemId: groundFoodId,
      targetPoint,
    };
  }

  return {
    mode: 'forageChase',
    targetGroundItemId: groundFoodId,
    targetPoint,
  };
}

function resolvingForageGroundFoodIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const groundFoodId = blackboard.selectedGroundFoodItemId;

  if (!groundFoodId) {
    return { mode: 'idle' };
  }

  if (checkingWildlifeGroundFlowerItemId(groundFoodId)) {
    return resolvingForageGroundFlowerIntent(blackboard, groundFoodId);
  }

  if (checkingWildlifeGroundGrassItemId(groundFoodId)) {
    return resolvingForageGroundGrassIntent(blackboard, groundFoodId);
  }

  const groundItem = listingWildlifeGroundFoodItems(blackboard.nowMs).find(
    (entry) => entry.id === groundFoodId
  );

  if (!groundItem || groundItem.quantity <= 0) {
    return { mode: 'idle' };
  }

  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);
  const distanceToFood = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToFood <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return {
      mode: 'forageEat',
      targetGroundItemId: groundFoodId,
      targetPoint,
    };
  }

  return {
    mode: 'forageChase',
    targetGroundItemId: groundFoodId,
    targetPoint,
  };
}

const DEFINING_WILDLIFE_ACTION_REGISTRY: Record<
  DefiningWildlifeBehaviorActionId,
  (
    blackboard: DefiningWildlifeBehaviorBlackboard
  ) => DefiningWildlifeBehaviorIntent
> = {
  fleeFromThreat: (blackboard) => {
    const scatterUntilMs =
      blackboard.instance.packAlphaDeathScatterUntilMs ?? null;
    const lockedScatterFleeTarget =
      scatterUntilMs !== null &&
      blackboard.nowMs < scatterUntilMs &&
      blackboard.instance.aiState.fleeTargetPoint
        ? blackboard.instance.aiState.fleeTargetPoint
        : null;

    if (lockedScatterFleeTarget) {
      return {
        mode: 'flee',
        targetPoint: lockedScatterFleeTarget,
      };
    }

    const threatPoint =
      resolvingThreatTargetPoint(blackboard) ?? blackboard.playerPosition;

    if (!threatPoint) {
      return resolvingWildlifeWanderIntent(blackboard);
    }

    return resolvingWildlifeFleeFromThreatPointIntent({
      position: blackboard.instance.position,
      threatPoint,
      fleeDistanceGrid: checkingWildlifeStalkPhaseIsRegrouping(
        blackboard.instance.aggroState
      )
        ? DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID
        : checkingWildlifeStalkPhaseIsFleeing(blackboard.instance.aggroState)
          ? DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID
          : undefined,
      species: blackboard.species,
      hazardSampling: blackboard.hazardSampling,
    });
  },
  chaseTarget: resolvingChaseTarget,
  followGuardian: resolvingWildlifeSeparationAnxietyFollowIntent,
  seekPackmate: resolvingWildlifeSocialHunterSeekPackIntent,
  followPlayer: resolvingWildlifeDocileFollowPlayerIntent,
  docileApproachReact: resolvingWildlifeDocileApproachReactIntent,
  meleeAttack: (blackboard) => {
    const chaseIntent = resolvingChaseTarget(blackboard);

    if (chaseIntent.mode !== 'chase') {
      return { mode: 'idle' };
    }

    const distanceToTarget = Math.hypot(
      chaseIntent.targetPoint.x - blackboard.instance.position.x,
      chaseIntent.targetPoint.y - blackboard.instance.position.y
    );

    // Only swing in range; otherwise keep chasing so the animal never
    // freezes in attack mode while the target walks away.
    if (distanceToTarget <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      return {
        mode: 'attack',
        targetInstanceId: chaseIntent.targetInstanceId,
        targetPoint: chaseIntent.targetPoint,
      };
    }

    return chaseIntent;
  },
  graze: () => ({ mode: 'graze' }),
  forageGroundFood: resolvingForageGroundFoodIntent,
  wander: resolvingWildlifePackRoamWanderIntent,
  idleNearWater: () => ({ mode: 'idle' }),
  returnToLeashAnchor: (blackboard) => ({
    mode: 'return',
    targetPoint: blackboard.instance.spawnAnchor,
  }),
  returnToBluffOrigin: (blackboard) => ({
    mode: 'return',
    targetPoint:
      blackboard.instance.aiState.bluffReturnPoint ??
      blackboard.instance.spawnAnchor,
  }),
  warnTerritoryIntruder: (blackboard) => {
    if (!blackboard.playerPosition || !blackboard.playerUserId) {
      return { mode: 'idle' };
    }

    return {
      mode: 'territoryWarn',
      targetInstanceId: blackboard.playerUserId,
      targetPoint: blackboard.playerPosition,
    };
  },
  stalkPrey: (blackboard) => {
    const prey = resolvingWildlifeStalkPreyContext({
      activeTargetId: blackboard.instance.aggroState.activeTargetId,
      nearbyInstances: blackboard.nearbyInstances,
      playerUserId: blackboard.playerUserId,
      playerPosition: blackboard.playerPosition,
      playerHealthRatio: blackboard.playerHealthRatio,
      playerStaminaRatio: blackboard.playerStaminaRatio,
      playerStaminaIsDepleted: blackboard.playerStaminaIsDepleted,
      playerStillDurationMs: blackboard.playerStillDurationMs,
    });

    if (!prey) {
      return { mode: 'idle' };
    }

    const approachState =
      blackboard.instance.aggroState.stalkPlayerApproachState ?? null;

    if (
      checkingWildlifeStalkPhaseIsRetreating(blackboard.instance.aggroState) &&
      approachState &&
      approachState.retreatStartedAtMs === null &&
      blackboard.nowMs - approachState.noticedAtMs < approachState.noticeDelayMs
    ) {
      return {
        mode: 'stalk',
        targetInstanceId: prey.targetId,
        targetPoint: blackboard.instance.position,
        facingPoint: prey.position,
        pace: 'walk',
      };
    }

    if (
      checkingWildlifeStalkPhaseIsRetreating(blackboard.instance.aggroState) &&
      approachState &&
      approachState.retreatStartedAtMs !== null &&
      !checkingWildlifeStalkPlayerApproachRetreatComplete({
        position: blackboard.instance.position,
        approachState,
      })
    ) {
      return resolvingWildlifeStalkPlayerApproachRetreatIntent({
        position: blackboard.instance.position,
        preyTargetId: prey.targetId,
        preyPosition: prey.position,
        approachState,
      });
    }

    const packmates = listingWildlifeStalkPackmatesTargetingPrey({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
      preyTargetId: prey.targetId,
    });
    const formation = resolvingWildlifeStalkSpawnPackFormation({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
      packmatesTargetingPrey: packmates,
      resolveSpecies: blackboard.resolveSpecies,
    });
    const followDistances = resolvingWildlifeStalkPackFollowDistances({
      ...formation,
      speciesId: blackboard.instance.speciesId,
    });
    const nearbyAndSelf = [
      blackboard.instance,
      ...blackboard.nearbyInstances.filter(
        (neighbor) => neighbor.instanceId !== blackboard.instance.instanceId
      ),
    ];
    const alpha = resolvingWildlifeSpawnPackAlphaInstance({
      instance: blackboard.instance,
      instances: nearbyAndSelf,
      resolveSpecies: blackboard.resolveSpecies,
    });

    return resolvingWildlifeStalkEngagementIntent({
      instanceId: blackboard.instance.instanceId,
      nowMs: blackboard.nowMs,
      position: blackboard.instance.position,
      preyTargetId: prey.targetId,
      preyPosition: prey.position,
      preyStillDurationMs: prey.stillDurationMs,
      followDistances,
      formation,
      alphaPosition: alpha?.position ?? null,
    });
  },
  surroundAndAttackPrey: (blackboard) => {
    const prey = resolvingWildlifeStalkPreyContext({
      activeTargetId: blackboard.instance.aggroState.activeTargetId,
      nearbyInstances: blackboard.nearbyInstances,
      playerUserId: blackboard.playerUserId,
      playerPosition: blackboard.playerPosition,
      playerHealthRatio: blackboard.playerHealthRatio,
      playerStaminaRatio: blackboard.playerStaminaRatio,
      playerStaminaIsDepleted: blackboard.playerStaminaIsDepleted,
      playerStillDurationMs: blackboard.playerStillDurationMs,
    });

    if (!prey) {
      return { mode: 'idle' };
    }

    const packmates = listingWildlifeStalkPackmatesTargetingPrey({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
      preyTargetId: prey.targetId,
    });
    const formation = resolvingWildlifeStalkSpawnPackFormation({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
      packmatesTargetingPrey: packmates,
      resolveSpecies: blackboard.resolveSpecies,
    });
    const surroundPoint = resolvingWildlifeStalkSurroundTargetPoint({
      instance: blackboard.instance,
      preyPosition: prey.position,
      formation,
    });
    const nearbyAndSelf = [
      blackboard.instance,
      ...blackboard.nearbyInstances.filter(
        (neighbor) => neighbor.instanceId !== blackboard.instance.instanceId
      ),
    ];
    const alpha = resolvingWildlifeSpawnPackAlphaInstance({
      instance: blackboard.instance,
      instances: nearbyAndSelf,
      resolveSpecies: blackboard.resolveSpecies,
    });
    const alphaHasCommittedAttack =
      alpha === null ||
      alpha.instanceId === blackboard.instance.instanceId ||
      checkingWildlifePackAlphaHasCommittedPreyAttack({
        alpha,
        preyTargetId: prey.targetId,
        preyPosition: prey.position,
      });
    const holdFormation = checkingWildlifeStalkPhaseIsFormingUp(
      blackboard.instance.aggroState
    );
    const forceReFlank = checkingWildlifeStalkPhaseIsSurrounding(
      blackboard.instance.aggroState
    );

    return resolvingWildlifeStalkSurroundEngagementIntent({
      position: blackboard.instance.position,
      preyTargetId: prey.targetId,
      preyPosition: prey.position,
      surroundPoint,
      currentIntent: blackboard.instance.aiState.intent,
      formation,
      alphaHasCommittedAttack,
      holdFormation,
      forceReFlank,
    });
  },
};

export function resolvingWildlifeBehaviorActionIntent(
  actionId: DefiningWildlifeBehaviorActionId,
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  return DEFINING_WILDLIFE_ACTION_REGISTRY[actionId](blackboard);
}
