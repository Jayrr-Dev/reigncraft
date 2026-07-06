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
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  checkingWildlifeMayTargetPlayer,
  resolvingWildlifeNearestHuntablePreyInstanceId,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type { DefiningWildlifeBehaviorActionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';

const DEFINING_WILDLIFE_WANDER_SALT = 97;

/** Wander targets stay stable for this window, then re-roll. */
const DEFINING_WILDLIFE_WANDER_BUCKET_MS = 6_000;

/** Fraction of wander windows the animal simply stands still. */
const DEFINING_WILDLIFE_WANDER_IDLE_CHANCE = 0.45;

/** Reaching within this distance of a wander target counts as arrived. */
export const DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID = 0.4;

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

/**
 * Resolves a calm wander intent: targets are stable for a whole time bucket
 * (no per-think re-rolls, which made animals jitter in circles), animals pause
 * between legs, and an already-reached target turns into idling.
 */
function resolvingWildlifeWanderIntent(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeBehaviorIntent {
  const tileX = Math.floor(blackboard.instance.spawnAnchor.x);
  const tileY = Math.floor(blackboard.instance.spawnAnchor.y);
  // packIndex-like uniqueness comes from the anchor tile itself; add the time
  // bucket so each animal re-rolls its destination every few seconds.
  const timeBucket = Math.floor(
    blackboard.nowMs / DEFINING_WILDLIFE_WANDER_BUCKET_MS
  );

  const idleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3 + 2
  );

  if (idleRoll < DEFINING_WILDLIFE_WANDER_IDLE_CHANCE) {
    return { mode: 'idle' };
  }

  const offsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3
    ),
    -3,
    3
  );
  const offsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_WANDER_SALT + timeBucket * 3 + 1
    ),
    -3,
    3
  );

  const targetPoint = {
    x: blackboard.instance.spawnAnchor.x + offsetX,
    y: blackboard.instance.spawnAnchor.y + offsetY,
    layer: blackboard.instance.spawnAnchor.layer,
  };

  const distanceToTarget = Math.hypot(
    targetPoint.x - blackboard.instance.position.x,
    targetPoint.y - blackboard.instance.position.y
  );

  if (distanceToTarget <= DEFINING_WILDLIFE_WANDER_ARRIVAL_RADIUS_GRID) {
    return { mode: 'idle' };
  }

  return { mode: 'wander', targetPoint };
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

  return resolvingWildlifeWanderIntent(blackboard);
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

    return resolvingWildlifeFleeFromThreatPointIntent(
      blackboard.instance.position,
      threatPoint
    );
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
  wander: resolvingWildlifeWanderIntent,
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
