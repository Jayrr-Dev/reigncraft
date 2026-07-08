/**
 * Surround-slot movement and post-ring rush intents for stalker packs.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkSurroundEngagementIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_SURROUND_SLOT_ARRIVAL_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

export type ResolvingWildlifeStalkSurroundEngagementIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
  surroundPoint: DefiningWorldPlazaWorldPoint;
  currentIntent: DefiningWildlifeBehaviorIntent;
  formation: ResolvingWildlifeStalkSpawnPackFormation;
  alphaHasCommittedAttack: boolean;
  /** Confident-pack formation phase: move to flank slots but nobody rushes yet. */
  holdFormation?: boolean;
};

function resolvingDistanceGrid(
  left: DefiningWorldPlazaWorldPoint,
  right: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function checkingWildlifeStalkIntentTargetsPrey({
  intent,
  preyTargetId,
  preyPosition,
  surroundPoint,
}: {
  intent: DefiningWildlifeBehaviorIntent;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
  surroundPoint: DefiningWorldPlazaWorldPoint;
}): boolean {
  if (
    intent.mode !== 'chase' &&
    intent.mode !== 'attack' &&
    intent.mode !== 'stalk'
  ) {
    return false;
  }

  if (
    !('targetInstanceId' in intent) ||
    intent.targetInstanceId !== preyTargetId
  ) {
    return false;
  }

  if (!intent.targetPoint) {
    return false;
  }

  return (
    resolvingDistanceGrid(intent.targetPoint, preyPosition) <
    resolvingDistanceGrid(intent.targetPoint, surroundPoint)
  );
}

/**
 * Walks to a flank point, runs the last stretch, then closes on the prey.
 */
export function resolvingWildlifeStalkSurroundEngagementIntent({
  position,
  preyTargetId,
  preyPosition,
  surroundPoint,
  currentIntent,
  formation,
  alphaHasCommittedAttack,
  holdFormation = false,
}: ResolvingWildlifeStalkSurroundEngagementIntentParams): DefiningWildlifeBehaviorIntent {
  const distanceToSurroundSlot = resolvingDistanceGrid(position, surroundPoint);
  const distanceToPrey = resolvingDistanceGrid(position, preyPosition);
  const isCommittedToPreyRush = checkingWildlifeStalkIntentTargetsPrey({
    intent: currentIntent,
    preyTargetId,
    preyPosition,
    surroundPoint,
  });
  const mayRushPrey =
    !holdFormation && (formation.isAlpha || alphaHasCommittedAttack);

  if (!mayRushPrey) {
    if (
      distanceToSurroundSlot >
      DEFINING_WILDLIFE_STALK_SURROUND_SLOT_ARRIVAL_RADIUS_GRID
    ) {
      if (
        distanceToSurroundSlot >
        DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID
      ) {
        return {
          mode: 'stalk',
          targetInstanceId: preyTargetId,
          targetPoint: surroundPoint,
        };
      }

      return {
        mode: 'chase',
        targetInstanceId: preyTargetId,
        targetPoint: surroundPoint,
      };
    }

    return {
      mode: 'stalk',
      targetInstanceId: preyTargetId,
      targetPoint: surroundPoint,
    };
  }

  if (
    !isCommittedToPreyRush &&
    distanceToSurroundSlot >
      DEFINING_WILDLIFE_STALK_SURROUND_SLOT_ARRIVAL_RADIUS_GRID
  ) {
    if (
      distanceToSurroundSlot >
      DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID
    ) {
      return {
        mode: 'stalk',
        targetInstanceId: preyTargetId,
        targetPoint: surroundPoint,
      };
    }

    return {
      mode: 'chase',
      targetInstanceId: preyTargetId,
      targetPoint: surroundPoint,
    };
  }

  if (distanceToPrey <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return {
      mode: 'attack',
      targetInstanceId: preyTargetId,
      targetPoint: preyPosition,
    };
  }

  return {
    mode: 'chase',
    targetInstanceId: preyTargetId,
    targetPoint: preyPosition,
  };
}
