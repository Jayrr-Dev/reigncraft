/**
 * Picks a flee destination on walkable terrain away from a threat point.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import {
  DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT,
  DEFINING_WILDLIFE_FLEE_WALKABLE_DESIRE_ALIGNMENT_WEIGHT,
  DEFINING_WILDLIFE_FLEE_WALKABLE_DISTANCE_STEP_GRID,
  DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_FLEE_WALKABLE_THREAT_DISTANCE_WEIGHT,
} from '@/components/world/wildlife/domains/definingWildlifeFleeConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeWalkableFleeTargetPointParams = {
  position: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  fleeDistanceGrid: number;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

function checkingWildlifeWalkableFleeTargetPoint(
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

function resolvingWildlifeAwayFromThreatDirection(
  position: DefiningWorldPlazaWorldPoint,
  threatPoint: DefiningWorldPlazaWorldPoint
): { x: number; y: number } {
  const deltaX = position.x - threatPoint.x;
  const deltaY = position.y - threatPoint.y;
  const length = Math.hypot(deltaX, deltaY) || 1;

  return {
    x: deltaX / length,
    y: deltaY / length,
  };
}

function buildingWildlifeFleeTargetPoint(
  position: DefiningWorldPlazaWorldPoint,
  direction: { x: number; y: number },
  distanceGrid: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: position.x + direction.x * distanceGrid,
    y: position.y + direction.y * distanceGrid,
    layer: position.layer,
  };
}

/**
 * Returns a flee destination that avoids water, lava, and other blocked tiles.
 */
export function resolvingWildlifeWalkableFleeTargetPoint({
  position,
  threatPoint,
  fleeDistanceGrid,
  species,
  hazardSampling,
}: ResolvingWildlifeWalkableFleeTargetPointParams): DefiningWorldPlazaWorldPoint {
  const awayDirection = resolvingWildlifeAwayFromThreatDirection(
    position,
    threatPoint
  );
  const awayAngle = Math.atan2(awayDirection.y, awayDirection.x);
  const idealTarget = buildingWildlifeFleeTargetPoint(
    position,
    awayDirection,
    fleeDistanceGrid
  );

  if (
    checkingWildlifeWalkableFleeTargetPoint(
      idealTarget,
      species,
      hazardSampling
    )
  ) {
    return idealTarget;
  }

  let bestPoint: DefiningWorldPlazaWorldPoint | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (
    let candidateIndex = 0;
    candidateIndex < DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT;
    candidateIndex += 1
  ) {
    const angle =
      (candidateIndex /
        DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT) *
      Math.PI *
      2;
    const direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    const candidatePoint = buildingWildlifeFleeTargetPoint(
      position,
      direction,
      fleeDistanceGrid
    );

    if (
      !checkingWildlifeWalkableFleeTargetPoint(
        candidatePoint,
        species,
        hazardSampling
      )
    ) {
      continue;
    }

    const alignment =
      direction.x * awayDirection.x + direction.y * awayDirection.y;
    const threatDistance = Math.hypot(
      candidatePoint.x - threatPoint.x,
      candidatePoint.y - threatPoint.y
    );
    const score =
      alignment * DEFINING_WILDLIFE_FLEE_WALKABLE_DESIRE_ALIGNMENT_WEIGHT +
      threatDistance *
        DEFINING_WILDLIFE_FLEE_WALKABLE_THREAT_DISTANCE_WEIGHT;

    if (score > bestScore) {
      bestScore = score;
      bestPoint = candidatePoint;
    }
  }

  if (bestPoint) {
    return bestPoint;
  }

  for (
    let distanceGrid = fleeDistanceGrid;
    distanceGrid >= DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID;
    distanceGrid -= DEFINING_WILDLIFE_FLEE_WALKABLE_DISTANCE_STEP_GRID
  ) {
    const candidatePoint = buildingWildlifeFleeTargetPoint(
      position,
      awayDirection,
      distanceGrid
    );

    if (
      checkingWildlifeWalkableFleeTargetPoint(
        candidatePoint,
        species,
        hazardSampling
      )
    ) {
      return candidatePoint;
    }
  }

  for (
    let candidateIndex = 0;
    candidateIndex < DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT;
    candidateIndex += 1
  ) {
    const angle =
      awayAngle +
      (candidateIndex /
        DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT) *
        Math.PI *
        2;
    const direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    for (
      let distanceGrid = fleeDistanceGrid;
      distanceGrid >= DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID;
      distanceGrid -= DEFINING_WILDLIFE_FLEE_WALKABLE_DISTANCE_STEP_GRID
    ) {
      const candidatePoint = buildingWildlifeFleeTargetPoint(
        position,
        direction,
        distanceGrid
      );

      if (
        checkingWildlifeWalkableFleeTargetPoint(
          candidatePoint,
          species,
          hazardSampling
        )
      ) {
        return candidatePoint;
      }
    }
  }

  return idealTarget;
}
