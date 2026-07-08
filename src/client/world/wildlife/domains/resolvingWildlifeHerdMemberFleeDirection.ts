/**
 * Blends a shared herd panic heading with each member's own away-from-threat vector.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeHerdMemberFleeDirection
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_HERD_FLEE_DIRECTION_INFLUENCE,
  DEFINING_WILDLIFE_HERD_FLEE_DIRECTION_SPREAD_RADIANS,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import { resolvingWildlifeAwayFromThreatDirection } from '@/components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint';

export type ResolvingWildlifeHerdMemberFleeDirectionParams = {
  memberPosition: DefiningWorldPlazaWorldPoint;
  herdAnchorPosition: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
};

function resolvingWildlifeHerdFleeDirectionSpreadSeed(
  position: DefiningWorldPlazaWorldPoint
): number {
  const tileX = Math.floor(position.x);
  const tileY = Math.floor(position.y);

  return (tileX * 48271 + tileY * 31847 + 17) >>> 0;
}

function resolvingWildlifeNormalizedDirection(direction: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0) {
    return { x: 1, y: 0 };
  }

  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

function rotatingWildlifeDirection(
  direction: { x: number; y: number },
  angleRadians: number
): { x: number; y: number } {
  const cosAngle = Math.cos(angleRadians);
  const sinAngle = Math.sin(angleRadians);

  return {
    x: direction.x * cosAngle - direction.y * sinAngle,
    y: direction.x * sinAngle + direction.y * cosAngle,
  };
}

/** Returns a herd-influenced flee heading with per-member spread. */
export function resolvingWildlifeHerdMemberFleeDirection({
  memberPosition,
  herdAnchorPosition,
  threatPoint,
}: ResolvingWildlifeHerdMemberFleeDirectionParams): {
  x: number;
  y: number;
} {
  const herdDirection = resolvingWildlifeAwayFromThreatDirection(
    herdAnchorPosition,
    threatPoint
  );
  const memberDirection = resolvingWildlifeAwayFromThreatDirection(
    memberPosition,
    threatPoint
  );
  const influence = DEFINING_WILDLIFE_HERD_FLEE_DIRECTION_INFLUENCE;
  const blendedDirection = resolvingWildlifeNormalizedDirection({
    x: herdDirection.x * influence + memberDirection.x * (1 - influence),
    y: herdDirection.y * influence + memberDirection.y * (1 - influence),
  });
  const spreadSeed =
    resolvingWildlifeHerdFleeDirectionSpreadSeed(memberPosition);
  const spreadAngle =
    ((spreadSeed % 1000) / 1000 - 0.5) *
    2 *
    DEFINING_WILDLIFE_HERD_FLEE_DIRECTION_SPREAD_RADIANS;

  return rotatingWildlifeDirection(blendedDirection, spreadAngle);
}
