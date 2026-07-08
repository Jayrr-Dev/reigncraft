/**
 * Picks a flee destination on walkable terrain away from a threat point.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeFleeTargetReachableFromPosition } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetReachableFromPosition';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import {
  DEFINING_WILDLIFE_FLEE_THREAT_COINCIDENT_EPSILON_GRID,
  DEFINING_WILDLIFE_FLEE_THREAT_OVERLAP_EPSILON_GRID,
  DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT,
  DEFINING_WILDLIFE_FLEE_WALKABLE_DESIRE_ALIGNMENT_WEIGHT,
  DEFINING_WILDLIFE_FLEE_WALKABLE_DISTANCE_STEP_GRID,
  DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID,
  DEFINING_WILDLIFE_FLEE_WALKABLE_THREAT_DISTANCE_WEIGHT,
} from '@/components/world/wildlife/domains/definingWildlifeFleeConstants';
import { checkingWildlifeFleeTargetHasMeaningfulLegDistance } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetHasMeaningfulLegDistance';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeWalkableFleeTargetPointParams = {
  position: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  fleeDistanceGrid: number;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  /** When set, all flee sampling aligns to this heading instead of per-position away vectors. */
  preferredFleeDirection?: { x: number; y: number };
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

function resolvingWildlifeFleeEscapeBearingSeed(
  position: DefiningWorldPlazaWorldPoint
): number {
  const tileX = Math.floor(position.x);
  const tileY = Math.floor(position.y);

  return (tileX * 92821 + tileY * 68917) >>> 0;
}

function resolvingWildlifeNormalizedDirection(direction: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= DEFINING_WILDLIFE_FLEE_THREAT_COINCIDENT_EPSILON_GRID) {
    return { x: 1, y: 0 };
  }

  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

/** Unit vector away from a threat, or a seeded escape bearing when overlapping. */
export function resolvingWildlifeAwayFromThreatDirection(
  position: DefiningWorldPlazaWorldPoint,
  threatPoint: DefiningWorldPlazaWorldPoint
): { x: number; y: number } {
  const deltaX = position.x - threatPoint.x;
  const deltaY = position.y - threatPoint.y;
  const length = Math.hypot(deltaX, deltaY);

  if (length > DEFINING_WILDLIFE_FLEE_THREAT_COINCIDENT_EPSILON_GRID) {
    return {
      x: deltaX / length,
      y: deltaY / length,
    };
  }

  const escapeSeed = resolvingWildlifeFleeEscapeBearingSeed(position);
  const angle =
    (escapeSeed % DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT) /
    DEFINING_WILDLIFE_FLEE_WALKABLE_CANDIDATE_DIRECTION_COUNT *
    Math.PI *
    2;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function checkingWildlifeFleeCandidateTargetIsValid(
  position: DefiningWorldPlazaWorldPoint,
  candidatePoint: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling,
  requireReachableStep: boolean
): boolean {
  if (
    !checkingWildlifeFleeTargetHasMeaningfulLegDistance({
      position,
      fleeTargetPoint: candidatePoint,
    })
  ) {
    return false;
  }

  if (requireReachableStep) {
    return checkingWildlifeReachableWalkableFleeTargetPoint(
      position,
      candidatePoint,
      species,
      hazardSampling
    );
  }

  return checkingWildlifeWalkableFleeTargetPoint(
    candidatePoint,
    species,
    hazardSampling
  );
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

function checkingWildlifeReachableWalkableFleeTargetPoint(
  position: DefiningWorldPlazaWorldPoint,
  point: DefiningWorldPlazaWorldPoint,
  species: DefiningWildlifeSpeciesDefinition,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): boolean {
  return (
    checkingWildlifeWalkableFleeTargetPoint(point, species, hazardSampling) &&
    checkingWildlifeFleeTargetReachableFromPosition({
      position,
      fleeTargetPoint: point,
      species,
      hazardSampling,
    })
  );
}

/**
 * Returns a flee destination that is walkable and reachable in one step.
 */
function resolvingWildlifeFleeAwayDirection({
  position,
  threatPoint,
  preferredFleeDirection,
}: {
  position: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  preferredFleeDirection?: { x: number; y: number };
}): { x: number; y: number } {
  if (preferredFleeDirection) {
    return resolvingWildlifeNormalizedDirection(preferredFleeDirection);
  }

  return resolvingWildlifeAwayFromThreatDirection(position, threatPoint);
}

export function resolvingWildlifeReachableWalkableFleeTargetPoint({
  position,
  threatPoint,
  fleeDistanceGrid,
  species,
  hazardSampling,
  preferredFleeDirection,
}: ResolvingWildlifeWalkableFleeTargetPointParams): DefiningWorldPlazaWorldPoint {
  const awayDirection = resolvingWildlifeFleeAwayDirection({
    position,
    threatPoint,
    preferredFleeDirection,
  });
  const awayAngle = Math.atan2(awayDirection.y, awayDirection.x);
  const idealTarget = buildingWildlifeFleeTargetPoint(
    position,
    awayDirection,
    fleeDistanceGrid
  );

  if (
    checkingWildlifeFleeCandidateTargetIsValid(
      position,
      idealTarget,
      species,
      hazardSampling,
      true
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
      !checkingWildlifeFleeCandidateTargetIsValid(
        position,
        candidatePoint,
        species,
        hazardSampling,
        true
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
      checkingWildlifeFleeCandidateTargetIsValid(
        position,
        candidatePoint,
        species,
        hazardSampling,
        true
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
        checkingWildlifeFleeCandidateTargetIsValid(
          position,
          candidatePoint,
          species,
          hazardSampling,
          true
        )
      ) {
        return candidatePoint;
      }
    }
  }

  return resolvingWildlifeWalkableFleeTargetPoint({
    position,
    threatPoint,
    fleeDistanceGrid,
    species,
    hazardSampling,
  });
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
  preferredFleeDirection,
}: ResolvingWildlifeWalkableFleeTargetPointParams): DefiningWorldPlazaWorldPoint {
  const awayDirection = resolvingWildlifeFleeAwayDirection({
    position,
    threatPoint,
    preferredFleeDirection,
  });
  const awayAngle = Math.atan2(awayDirection.y, awayDirection.x);
  const idealTarget = buildingWildlifeFleeTargetPoint(
    position,
    awayDirection,
    fleeDistanceGrid
  );

  if (
    checkingWildlifeFleeCandidateTargetIsValid(
      position,
      idealTarget,
      species,
      hazardSampling,
      false
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
      !checkingWildlifeFleeCandidateTargetIsValid(
        position,
        candidatePoint,
        species,
        hazardSampling,
        false
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
      checkingWildlifeFleeCandidateTargetIsValid(
        position,
        candidatePoint,
        species,
        hazardSampling,
        false
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
        checkingWildlifeFleeCandidateTargetIsValid(
          position,
          candidatePoint,
          species,
          hazardSampling,
          false
        )
      ) {
        return candidatePoint;
      }
    }
  }

  return buildingWildlifeFleeTargetPoint(
    position,
    awayDirection,
    DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID
  );
}

export type ResolvingWildlifeOverlapThreatEscapeStepParams = {
  position: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  stepDistanceGrid?: number;
};

/**
 * Nudges wildlife one step off a threat when circle overlap blocks steering.
 */
export function resolvingWildlifeOverlapThreatEscapeStep({
  position,
  threatPoint,
  species,
  hazardSampling,
  stepDistanceGrid = DEFINING_WILDLIFE_FLEE_WALKABLE_MIN_DISTANCE_GRID,
}: ResolvingWildlifeOverlapThreatEscapeStepParams): DefiningWorldPlazaWorldPoint | null {
  const separation = Math.hypot(
    position.x - threatPoint.x,
    position.y - threatPoint.y
  );

  if (separation > DEFINING_WILDLIFE_FLEE_THREAT_OVERLAP_EPSILON_GRID) {
    return null;
  }

  const primaryDirection = resolvingWildlifeAwayFromThreatDirection(
    position,
    threatPoint
  );
  const candidateDirections: { x: number; y: number }[] = [primaryDirection];

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
    candidateDirections.push({
      x: Math.cos(angle),
      y: Math.sin(angle),
    });
  }

  for (const direction of candidateDirections) {
    const nextPosition = buildingWildlifeFleeTargetPoint(
      position,
      direction,
      stepDistanceGrid
    );

    if (
      checkingWildlifeHazardAtPoint({
        point: nextPosition,
        species,
        placedBlocks: hazardSampling.placedBlocks,
        placedBlocksByTile: hazardSampling.placedBlocksByTile,
        isDaytime: hazardSampling.isDaytime,
      }) === 'safe'
    ) {
      return nextPosition;
    }
  }

  return null;
}
