/**
 * Context-steering step with hazard lookahead for wildlife movement.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSteeringStep
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import {
  DEFINING_WILDLIFE_STEERING_CACHE_MS,
  DEFINING_WILDLIFE_STEERING_LOD_NEAR_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSteeringCache,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSteeringStepParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  desiredDirection: { x: number; y: number };
  speedGridPerSecond: number;
  deltaSeconds: number;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  distanceToPlayerGrid: number;
  nowMs: number;
  intentKey: string;
  steeringCache: DefiningWildlifeSteeringCache | null;
};

export type ResolvingWildlifeSteeringStepResult = {
  nextPosition: DefiningWorldPlazaWorldPoint;
  moved: boolean;
  steeringCache: DefiningWildlifeSteeringCache | null;
};

function normalizingDirection(direction: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0.0001) {
    return { x: 0, y: 0 };
  }

  return { x: direction.x / length, y: direction.y / length };
}

function filteringWildlifeSeparationNeighbors(
  origin: DefiningWorldPlazaWorldPoint,
  instanceId: string,
  nearbyInstances: readonly DefiningWildlifeInstance[]
): DefiningWildlifeInstance[] {
  const separationRadius =
    DEFINING_WILDLIFE_STEERING_WEIGHTS.separationRadiusGrid;
  const separationRadiusSquared = separationRadius * separationRadius;
  const neighbors: DefiningWildlifeInstance[] = [];

  for (const neighbor of nearbyInstances) {
    if (neighbor.instanceId === instanceId) {
      continue;
    }

    const deltaX = origin.x - neighbor.position.x;
    const deltaY = origin.y - neighbor.position.y;

    if (deltaX * deltaX + deltaY * deltaY < separationRadiusSquared) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

function scoringWildlifeCandidateDirection(
  origin: DefiningWorldPlazaWorldPoint,
  direction: { x: number; y: number },
  desiredDirection: { x: number; y: number },
  species: DefiningWildlifeSpeciesDefinition,
  separationNeighbors: readonly DefiningWildlifeInstance[],
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): number {
  let score =
    direction.x * desiredDirection.x + direction.y * desiredDirection.y;
  score *= DEFINING_WILDLIFE_STEERING_WEIGHTS.desireAlignment;

  for (
    let step = 1;
    step <= DEFINING_WILDLIFE_STEERING_WEIGHTS.lookaheadSteps;
    step += 1
  ) {
    const probePoint = {
      x:
        origin.x +
        direction.x *
          DEFINING_WILDLIFE_STEERING_WEIGHTS.lookaheadStepDistanceGrid *
          step,
      y:
        origin.y +
        direction.y *
          DEFINING_WILDLIFE_STEERING_WEIGHTS.lookaheadStepDistanceGrid *
          step,
      layer: origin.layer,
    };
    const verdict = checkingWildlifeHazardAtPoint({
      point: probePoint,
      species,
      placedBlocks,
    });

    if (verdict === 'lethal') {
      return DEFINING_WILDLIFE_STEERING_WEIGHTS.hazardLethalPenalty;
    }

    if (verdict === 'blocked') {
      score += DEFINING_WILDLIFE_STEERING_WEIGHTS.hazardBlockedPenalty;
    }
  }

  for (const neighbor of separationNeighbors) {
    const deltaX = origin.x - neighbor.position.x;
    const deltaY = origin.y - neighbor.position.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (
      distance > 0 &&
      distance < DEFINING_WILDLIFE_STEERING_WEIGHTS.separationRadiusGrid
    ) {
      score += DEFINING_WILDLIFE_STEERING_WEIGHTS.separationPenalty / distance;
    }
  }

  return score;
}

function resolvingWildlifeFullSteeringDirection(
  origin: DefiningWorldPlazaWorldPoint,
  instanceId: string,
  desiredDirection: { x: number; y: number },
  species: DefiningWildlifeSpeciesDefinition,
  nearbyInstances: readonly DefiningWildlifeInstance[],
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): { x: number; y: number } {
  const normalizedDesired = normalizingDirection(desiredDirection);
  const separationNeighbors = filteringWildlifeSeparationNeighbors(
    origin,
    instanceId,
    nearbyInstances
  );
  let bestDirection = normalizedDesired;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (
    let candidateIndex = 0;
    candidateIndex < DEFINING_WILDLIFE_STEERING_WEIGHTS.candidateDirectionCount;
    candidateIndex += 1
  ) {
    const angle =
      (candidateIndex /
        DEFINING_WILDLIFE_STEERING_WEIGHTS.candidateDirectionCount) *
      Math.PI *
      2;
    const candidateDirection = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    const score = scoringWildlifeCandidateDirection(
      origin,
      candidateDirection,
      normalizedDesired,
      species,
      separationNeighbors,
      placedBlocks
    );

    if (score > bestScore) {
      bestScore = score;
      bestDirection = candidateDirection;
    }
  }

  if (!Number.isFinite(bestScore)) {
    return { x: 0, y: 0 };
  }

  return bestDirection;
}

function resolvingWildlifeDirectSteeringDirection(
  origin: DefiningWorldPlazaWorldPoint,
  desiredDirection: { x: number; y: number },
  species: DefiningWildlifeSpeciesDefinition,
  stepDistance: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): { x: number; y: number } | null {
  const direction = normalizingDirection(desiredDirection);

  if (direction.x === 0 && direction.y === 0) {
    return null;
  }

  const probePoint = {
    x: origin.x + direction.x * stepDistance,
    y: origin.y + direction.y * stepDistance,
    layer: origin.layer,
  };
  const verdict = checkingWildlifeHazardAtPoint({
    point: probePoint,
    species,
    placedBlocks,
  });

  if (verdict === 'lethal' || verdict === 'blocked') {
    return null;
  }

  return direction;
}

function checkingWildlifeSteeringCacheValid(
  steeringCache: DefiningWildlifeSteeringCache | null,
  intentKey: string,
  nowMs: number
): steeringCache is DefiningWildlifeSteeringCache {
  if (!steeringCache) {
    return false;
  }

  if (steeringCache.intentKey !== intentKey) {
    return false;
  }

  return nowMs - steeringCache.cachedAtMs < DEFINING_WILDLIFE_STEERING_CACHE_MS;
}

function resolvingWildlifeSteeringDirection({
  instance,
  species,
  desiredDirection,
  nearbyInstances,
  placedBlocks,
  distanceToPlayerGrid,
  nowMs,
  intentKey,
  steeringCache,
  stepDistance,
}: {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  desiredDirection: { x: number; y: number };
  nearbyInstances: readonly DefiningWildlifeInstance[];
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  distanceToPlayerGrid: number;
  nowMs: number;
  intentKey: string;
  steeringCache: DefiningWildlifeSteeringCache | null;
  stepDistance: number;
}): {
  direction: { x: number; y: number };
  steeringCache: DefiningWildlifeSteeringCache | null;
} {
  if (checkingWildlifeSteeringCacheValid(steeringCache, intentKey, nowMs)) {
    return {
      direction: {
        x: steeringCache.directionX,
        y: steeringCache.directionY,
      },
      steeringCache,
    };
  }

  const useFullSteering =
    distanceToPlayerGrid < DEFINING_WILDLIFE_STEERING_LOD_NEAR_RADIUS_GRID;
  let direction: { x: number; y: number };

  if (useFullSteering) {
    direction = resolvingWildlifeFullSteeringDirection(
      instance.position,
      instance.instanceId,
      desiredDirection,
      species,
      nearbyInstances,
      placedBlocks
    );
  } else {
    const directDirection = resolvingWildlifeDirectSteeringDirection(
      instance.position,
      desiredDirection,
      species,
      stepDistance,
      placedBlocks
    );

    direction =
      directDirection ??
      resolvingWildlifeFullSteeringDirection(
        instance.position,
        instance.instanceId,
        desiredDirection,
        species,
        nearbyInstances,
        placedBlocks
      );
  }

  if (direction.x === 0 && direction.y === 0) {
    return { direction, steeringCache: null };
  }

  return {
    direction,
    steeringCache: {
      directionX: direction.x,
      directionY: direction.y,
      cachedAtMs: nowMs,
      intentKey,
    },
  };
}

/**
 * Picks the best steering direction and advances one movement step.
 */
export function resolvingWildlifeSteeringStep({
  instance,
  species,
  desiredDirection,
  speedGridPerSecond,
  deltaSeconds,
  nearbyInstances,
  placedBlocks = [],
  distanceToPlayerGrid,
  nowMs,
  intentKey,
  steeringCache,
}: ResolvingWildlifeSteeringStepParams): ResolvingWildlifeSteeringStepResult {
  const stepDistance = speedGridPerSecond * deltaSeconds;

  if (stepDistance <= 0) {
    return {
      nextPosition: instance.position,
      moved: false,
      steeringCache,
    };
  }

  const { direction, steeringCache: nextSteeringCache } =
    resolvingWildlifeSteeringDirection({
      instance,
      species,
      desiredDirection,
      nearbyInstances,
      placedBlocks,
      distanceToPlayerGrid,
      nowMs,
      intentKey,
      steeringCache,
      stepDistance,
    });

  if (direction.x === 0 && direction.y === 0) {
    return {
      nextPosition: instance.position,
      moved: false,
      steeringCache: nextSteeringCache,
    };
  }

  return {
    nextPosition: {
      x: instance.position.x + direction.x * stepDistance,
      y: instance.position.y + direction.y * stepDistance,
      layer: instance.position.layer,
    },
    moved: true,
    steeringCache: nextSteeringCache,
  };
}
