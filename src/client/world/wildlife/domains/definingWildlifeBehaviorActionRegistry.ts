/**
 * Behavior tree action resolution into movement/combat intents.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorActionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifePackAlphaHasCommittedPreyAttack } from '@/components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack';
import { checkingWildlifeStalkerCaughtUpToStillPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkerCaughtUpToStillPrey';
import { checkingWildlifeStalkerPreyTooClose } from '@/components/world/wildlife/domains/checkingWildlifeStalkerPreyTooClose';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  checkingWildlifeMayTargetPlayer,
  resolvingWildlifeNearestHuntablePreyInstanceId,
  resolvingWildlifeProximityPreyInstanceId,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorActionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import { DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';
import { resolvingWildlifePackRoamWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifePackRoamWanderIntent';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';
import { resolvingWildlifeStalkFollowTargetPoint } from '@/components/world/wildlife/domains/resolvingWildlifeStalkFollowTargetPoint';
import { resolvingWildlifeStalkPackFollowDistances } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackFollowDistances';
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

function resolvingForageGroundFoodIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const groundFoodId = blackboard.selectedGroundFoodItemId;

  if (!groundFoodId) {
    return { mode: 'idle' };
  }

  const groundItem = listingWildlifeGroundFoodItems().find(
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
    const threatPoint =
      resolvingThreatTargetPoint(blackboard) ?? blackboard.playerPosition;

    if (!threatPoint) {
      return resolvingWildlifeWanderIntent(blackboard);
    }

    return resolvingWildlifeFleeFromThreatPointIntent({
      position: blackboard.instance.position,
      threatPoint,
      fleeDistanceGrid:
        blackboard.instance.aggroState.stalkPackResponse === 'flee'
          ? DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID
          : undefined,
      species: blackboard.species,
      hazardSampling: blackboard.hazardSampling,
    });
  },
  chaseTarget: resolvingChaseTarget,
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

    if (
      checkingWildlifeStalkerCaughtUpToStillPrey({
        position: blackboard.instance.position,
        preyPosition: prey.position,
        preyStillDurationMs: prey.stillDurationMs,
      })
    ) {
      return { mode: 'idle' };
    }

    const preyTooClose = checkingWildlifeStalkerPreyTooClose({
      position: blackboard.instance.position,
      preyPosition: prey.position,
    });
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
    const followDistances =
      resolvingWildlifeStalkPackFollowDistances(formation);

    return {
      mode: 'stalk',
      targetInstanceId: prey.targetId,
      targetPoint: resolvingWildlifeStalkFollowTargetPoint({
        position: blackboard.instance.position,
        playerPosition: prey.position,
        ...followDistances,
      }),
      ...(preyTooClose ? { facingPoint: prey.position } : undefined),
    };
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

    return resolvingWildlifeStalkSurroundEngagementIntent({
      position: blackboard.instance.position,
      preyTargetId: prey.targetId,
      preyPosition: prey.position,
      surroundPoint,
      currentIntent: blackboard.instance.aiState.intent,
      formation,
      alphaHasCommittedAttack,
    });
  },
};

export function resolvingWildlifeBehaviorActionIntent(
  actionId: DefiningWildlifeBehaviorActionId,
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  return DEFINING_WILDLIFE_ACTION_REGISTRY[actionId](blackboard);
}
