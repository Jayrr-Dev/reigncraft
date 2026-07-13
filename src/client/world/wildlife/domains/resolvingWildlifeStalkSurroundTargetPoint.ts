/**
 * Organic flank points for a committed PackHunter pack surround.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkSurroundTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import {
  DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID,
  DEFINING_WILDLIFE_PACK_FOLLOWER_SURROUND_RADIUS_OFFSET_GRID,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import {
  DEFINING_WILDLIFE_STALK_SURROUND_BEARING_JITTER_RAD,
  DEFINING_WILDLIFE_STALK_SURROUND_LATERAL_SPREAD_RAD,
  DEFINING_WILDLIFE_STALK_SURROUND_RADIUS_MAX_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeStalkSpawnPackFormation } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSpawnPackFormation';

export type ResolvingWildlifeStalkSurroundTargetPointParams = {
  instance: DefiningWildlifeInstance;
  preyPosition: DefiningWorldPlazaWorldPoint;
  formation: ResolvingWildlifeStalkSpawnPackFormation;
};

/**
 * Places the alpha on the closest lead point; followers take wider organic flanks.
 */
export function resolvingWildlifeStalkSurroundTargetPoint({
  instance,
  preyPosition,
  formation,
}: ResolvingWildlifeStalkSurroundTargetPointParams): DefiningWorldPlazaWorldPoint {
  const deltaX = instance.position.x - preyPosition.x;
  const deltaY = instance.position.y - preyPosition.y;
  const distanceFromPrey = Math.hypot(deltaX, deltaY);
  const approachBearing =
    distanceFromPrey > 0.15
      ? Math.atan2(deltaY, deltaX)
      : computingWildlifeInstanceSeedFraction(instance.instanceId, 17) *
        Math.PI *
        2;

  if (formation.isAlpha) {
    const bearing = approachBearing;

    return {
      x:
        preyPosition.x +
        Math.cos(bearing) * DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID,
      y:
        preyPosition.y +
        Math.sin(bearing) * DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID,
      layer: preyPosition.layer,
    };
  }

  const lateralSign = formation.followerRank % 2 === 1 ? 1 : -1;
  const lateralMagnitude = Math.ceil(formation.followerRank / 2);
  const lateralSpread =
    lateralSign *
    lateralMagnitude *
    DEFINING_WILDLIFE_STALK_SURROUND_LATERAL_SPREAD_RAD;
  const bearingJitter =
    (computingWildlifeInstanceSeedFraction(instance.instanceId, 73) - 0.5) *
    2 *
    DEFINING_WILDLIFE_STALK_SURROUND_BEARING_JITTER_RAD;
  const radius = Math.min(
    DEFINING_WILDLIFE_STALK_SURROUND_RADIUS_MAX_GRID,
    DEFINING_WILDLIFE_PACK_ALPHA_SURROUND_RADIUS_GRID +
      formation.followerRank *
        DEFINING_WILDLIFE_PACK_FOLLOWER_SURROUND_RADIUS_OFFSET_GRID
  );
  const bearing = approachBearing + lateralSpread + bearingJitter;

  return {
    x: preyPosition.x + Math.cos(bearing) * radius,
    y: preyPosition.y + Math.sin(bearing) * radius,
    layer: preyPosition.layer,
  };
}
