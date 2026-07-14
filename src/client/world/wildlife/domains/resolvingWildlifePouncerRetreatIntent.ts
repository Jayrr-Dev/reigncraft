/**
 * Pouncer retreat intent: run away while facing prey (backwards run).
 *
 * @module components/world/wildlife/domains/resolvingWildlifePouncerRetreatIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifePouncerRetreatIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
  retreatFromX: number;
  retreatFromY: number;
  retreatDistanceGrid: number;
};

/** True once the pouncer has covered the retreat distance. */
export function checkingWildlifePouncerRetreatComplete({
  position,
  retreatFromX,
  retreatFromY,
  retreatDistanceGrid,
}: {
  position: DefiningWorldPlazaWorldPoint;
  retreatFromX: number;
  retreatFromY: number;
  retreatDistanceGrid: number;
}): boolean {
  const traveledGrid = Math.hypot(
    position.x - retreatFromX,
    position.y - retreatFromY
  );

  return traveledGrid >= retreatDistanceGrid;
}

/** Stalk intent that steps away from prey while facing them. */
export function resolvingWildlifePouncerRetreatIntent({
  position,
  preyTargetId,
  preyPosition,
  retreatFromX,
  retreatFromY,
  retreatDistanceGrid,
}: ResolvingWildlifePouncerRetreatIntentParams): DefiningWildlifeBehaviorIntent {
  const awayDeltaX = position.x - preyPosition.x;
  const awayDeltaY = position.y - preyPosition.y;
  const awayDistance = Math.hypot(awayDeltaX, awayDeltaY);
  const awayDirectionX = awayDistance <= 0.0001 ? 1 : awayDeltaX / awayDistance;
  const awayDirectionY = awayDistance <= 0.0001 ? 0 : awayDeltaY / awayDistance;
  const remainingGrid = Math.max(
    0.35,
    retreatDistanceGrid -
      Math.hypot(position.x - retreatFromX, position.y - retreatFromY)
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
    pace: 'run',
  };
}
