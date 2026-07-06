/**
 * Behavior tree blackboard and condition evaluation.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import type { DefiningWildlifeBehaviorConditionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import {
  checkingWildlifePredatorMayAttackPlayer,
  checkingWildlifePredatorMayHuntPrey,
} from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeBehaviorBlackboard = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  nowMs: number;
  selectedPreyInstanceId: string | null;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function resolvingDistanceGrid(
  a: DefiningWorldPlazaWorldPoint,
  b: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function resolvingNearestHuntablePrey(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeInstance | null {
  let nearest: DefiningWildlifeInstance | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of blackboard.nearbyInstances) {
    if (candidate.instanceId === blackboard.instance.instanceId) {
      continue;
    }

    if (candidate.isDead) {
      continue;
    }

    const preySpecies = blackboard.resolveSpecies(candidate.speciesId);

    if (!preySpecies) {
      continue;
    }

    if (
      !checkingWildlifePredatorMayHuntPrey(
        blackboard.species,
        preySpecies,
        blackboard.instance.hungerState.driveLevel === 'starving'
          ? 'starving'
          : 'hungry'
      )
    ) {
      continue;
    }

    const distance = resolvingDistanceGrid(
      blackboard.instance.position,
      candidate.position
    );

    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest;
}

const DEFINING_WILDLIFE_CONDITION_REGISTRY: Record<
  DefiningWildlifeBehaviorConditionId,
  (blackboard: DefiningWildlifeBehaviorBlackboard) => boolean
> = {
  isDead: (blackboard) => blackboard.instance.isDead,
  hasActiveThreatTarget: (blackboard) =>
    blackboard.instance.aggroState.activeTargetId !== null,
  isPlayerWithinAggroRadius: (blackboard) => {
    if (!blackboard.playerPosition) {
      return false;
    }

    return (
      resolvingDistanceGrid(
        blackboard.instance.position,
        blackboard.playerPosition
      ) <= blackboard.species.aggro.aggroRadiusGrid
    );
  },
  isHungerAtLeastHungry: (blackboard) =>
    blackboard.instance.hungerState.driveLevel === 'hungry' ||
    blackboard.instance.hungerState.driveLevel === 'starving',
  isHungerStarving: (blackboard) =>
    blackboard.instance.hungerState.driveLevel === 'starving',
  hasHuntablePreyNearby: (blackboard) =>
    blackboard.selectedPreyInstanceId !== null,
  isHealthBelowFleeThreshold: (blackboard) => {
    const healthRatio =
      blackboard.instance.healthState.currentHealth /
      Math.max(1, blackboard.instance.healthState.baseMaxHealth);

    return (
      healthRatio < 0.35 ||
      blackboard.instance.aggroState.activeTargetId !== null
    );
  },
  isPlayerTooClose: (blackboard) => {
    if (!blackboard.playerPosition) {
      return false;
    }

    return (
      resolvingDistanceGrid(
        blackboard.instance.position,
        blackboard.playerPosition
      ) <=
      blackboard.species.aggro.aggroRadiusGrid * 0.75
    );
  },
  isNearWater: (blackboard) => {
    const tileX = Math.floor(blackboard.instance.position.x);
    const tileY = Math.floor(blackboard.instance.position.y);

    return Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX, tileY));
  },
  isBeyondLeashDistance: (blackboard) =>
    resolvingDistanceGrid(
      blackboard.instance.position,
      blackboard.instance.spawnAnchor
    ) > blackboard.species.aggro.leashDistanceGrid,
};

export function checkingWildlifeBehaviorCondition(
  conditionId: DefiningWildlifeBehaviorConditionId,
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  return DEFINING_WILDLIFE_CONDITION_REGISTRY[conditionId](blackboard);
}

export function computingWildlifeSelectedPreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  return resolvingNearestHuntablePrey(blackboard)?.instanceId ?? null;
}

export function resolvingWildlifeNearestHuntablePreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  return blackboard.selectedPreyInstanceId;
}

export function checkingWildlifeMayTargetPlayer(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  return checkingWildlifePredatorMayAttackPlayer(
    blackboard.species,
    blackboard.instance.hungerState.driveLevel,
    blackboard.instance.aggroState.activeTargetId === blackboard.playerUserId
  );
}
