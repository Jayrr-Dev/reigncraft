/**
 * Context-steering step with hazard lookahead for wildlife movement.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSteeringStep
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STEERING_WEIGHTS } from '@/components/world/wildlife/domains/definingWildlifeSteeringWeights';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSteeringStepParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  desiredDirection: { x: number; y: number };
  speedGridPerSecond: number;
  deltaSeconds: number;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
};

export type ResolvingWildlifeSteeringStepResult = {
  nextPosition: DefiningWorldPlazaWorldPoint;
  moved: boolean;
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

function scoringWildlifeCandidateDirection(
  origin: DefiningWorldPlazaWorldPoint,
  direction: { x: number; y: number },
  desiredDirection: { x: number; y: number },
  species: DefiningWildlifeSpeciesDefinition,
  nearbyInstances: readonly DefiningWildlifeInstance[],
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

  for (const neighbor of nearbyInstances) {
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
}: ResolvingWildlifeSteeringStepParams): ResolvingWildlifeSteeringStepResult {
  const normalizedDesired = normalizingDirection(desiredDirection);
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
      instance.position,
      candidateDirection,
      normalizedDesired,
      species,
      nearbyInstances.filter(
        (neighbor) => neighbor.instanceId !== instance.instanceId
      ),
      placedBlocks
    );

    if (score > bestScore) {
      bestScore = score;
      bestDirection = candidateDirection;
    }
  }

  if (!Number.isFinite(bestScore)) {
    return { nextPosition: instance.position, moved: false };
  }

  const stepDistance = speedGridPerSecond * deltaSeconds;

  return {
    nextPosition: {
      x: instance.position.x + bestDirection.x * stepDistance,
      y: instance.position.y + bestDirection.y * stepDistance,
      layer: instance.position.layer,
    },
    moved: stepDistance > 0,
  };
}
