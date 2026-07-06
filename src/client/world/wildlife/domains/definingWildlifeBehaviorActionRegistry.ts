/**
 * Behavior tree action resolution into movement/combat intents.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorActionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  checkingWildlifeMayTargetPlayer,
  resolvingWildlifeNearestHuntablePreyInstanceId,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorActionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_WANDER_SALT = 97;

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

function buildingWildlifeWanderTarget(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWorldPlazaWorldPoint {
  const tileX = Math.floor(blackboard.instance.spawnAnchor.x);
  const tileY = Math.floor(blackboard.instance.spawnAnchor.y);
  const offsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + blackboard.nowMs
    ),
    -3,
    3
  );
  const offsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + blackboard.nowMs + 1
    ),
    -3,
    3
  );

  return {
    x: blackboard.instance.spawnAnchor.x + offsetX,
    y: blackboard.instance.spawnAnchor.y + offsetY,
    layer: blackboard.instance.spawnAnchor.layer,
  };
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

  return {
    mode: 'wander',
    targetPoint: buildingWildlifeWanderTarget(blackboard),
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
      return {
        mode: 'wander',
        targetPoint: buildingWildlifeWanderTarget(blackboard),
      };
    }

    const deltaX = blackboard.instance.position.x - threatPoint.x;
    const deltaY = blackboard.instance.position.y - threatPoint.y;
    const length = Math.hypot(deltaX, deltaY) || 1;

    return {
      mode: 'flee',
      targetPoint: {
        x: blackboard.instance.position.x + (deltaX / length) * 6,
        y: blackboard.instance.position.y + (deltaY / length) * 6,
        layer: blackboard.instance.position.layer,
      },
    };
  },
  chaseTarget: resolvingChaseTarget,
  meleeAttack: (blackboard) => {
    const chaseIntent = resolvingChaseTarget(blackboard);

    if (chaseIntent.mode === 'chase') {
      return {
        mode: 'attack',
        targetInstanceId: chaseIntent.targetInstanceId,
        targetPoint: chaseIntent.targetPoint,
      };
    }

    return { mode: 'idle' };
  },
  graze: () => ({ mode: 'graze' }),
  wander: (blackboard) => ({
    mode: 'wander',
    targetPoint: buildingWildlifeWanderTarget(blackboard),
  }),
  idleNearWater: () => ({ mode: 'idle' }),
  returnToLeashAnchor: (blackboard) => ({
    mode: 'return',
    targetPoint: blackboard.instance.spawnAnchor,
  }),
};

export function resolvingWildlifeBehaviorActionIntent(
  actionId: DefiningWildlifeBehaviorActionId,
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  return DEFINING_WILDLIFE_ACTION_REGISTRY[actionId](blackboard);
}
