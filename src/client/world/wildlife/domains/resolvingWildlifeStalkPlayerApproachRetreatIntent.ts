/**
 * Stalk retreat intent while backing away from a closing player.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeStalkPlayerApproachState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeStalkPlayerApproachRetreatIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
  approachState: DefiningWildlifeStalkPlayerApproachState;
};

/** True once the wolf has covered the rolled retreat distance. */
export function checkingWildlifeStalkPlayerApproachRetreatComplete({
  position,
  approachState,
}: {
  position: DefiningWorldPlazaWorldPoint;
  approachState: DefiningWildlifeStalkPlayerApproachState;
}): boolean {
  if (approachState.retreatStartedAtMs === null) {
    return false;
  }

  const traveledGrid = Math.hypot(
    position.x - approachState.retreatFromX,
    position.y - approachState.retreatFromY
  );

  return traveledGrid >= approachState.retreatDistanceGrid;
}

/** Picks a stalk intent that steps away from prey with walk or run pace. */
export function resolvingWildlifeStalkPlayerApproachRetreatIntent({
  position,
  preyTargetId,
  preyPosition,
  approachState,
}: ResolvingWildlifeStalkPlayerApproachRetreatIntentParams): DefiningWildlifeBehaviorIntent {
  const awayDeltaX = position.x - preyPosition.x;
  const awayDeltaY = position.y - preyPosition.y;
  const awayDistance = Math.hypot(awayDeltaX, awayDeltaY);
  const awayDirectionX = awayDistance <= 0.0001 ? 1 : awayDeltaX / awayDistance;
  const awayDirectionY = awayDistance <= 0.0001 ? 0 : awayDeltaY / awayDistance;
  const retreatFromPoint = {
    x: approachState.retreatFromX,
    y: approachState.retreatFromY,
    layer: position.layer,
  };
  const remainingGrid = Math.max(
    0.35,
    approachState.retreatDistanceGrid -
      Math.hypot(
        position.x - retreatFromPoint.x,
        position.y - retreatFromPoint.y
      )
  );

  return {
    mode: 'stalk',
    targetInstanceId: preyTargetId,
    targetPoint: {
      x: position.x + awayDirectionX * remainingGrid,
      y: position.y + awayDirectionY * remainingGrid,
      layer: position.layer,
    },
    facingPoint: preyPosition,
    pace: approachState.playerPace === 'run' ? 'run' : 'walk',
  };
}
