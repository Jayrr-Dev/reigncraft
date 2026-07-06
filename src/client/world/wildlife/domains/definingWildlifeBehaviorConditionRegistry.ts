/**
 * Behavior tree blackboard and condition evaluation.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWildlifeAggressiveHerbivoreMayFight } from '@/components/world/wildlife/domains/checkingWildlifeAggressiveHerbivoreMayFight';
import {
  checkingWildlifeIsMotivatedToForageGroundFood,
  checkingWildlifeIsMotivatedToHunt,
} from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { checkingWildlifePlayerStartlesWildlife } from '@/components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife';
import { checkingWildlifeShouldTerritoryWarn } from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import {
  DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER,
  DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER,
  DEFINING_WILDLIFE_LEASH_RETURN_EXIT_FRACTION,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorHysteresisConstants';
import type { DefiningWildlifeBehaviorConditionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import {
  checkingWildlifePredatorMayAttackPlayer,
  checkingWildlifePredatorMayHuntPrey,
} from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeNearestEdibleGroundFood } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type DefiningWildlifeBehaviorBlackboard = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  isPlayerRunning: boolean;
  isPlayerJumping: boolean;
  nowMs: number;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  selectedPreyInstanceId: string | null;
  selectedProximityPreyInstanceId: string | null;
  selectedGroundFoodItemId: string | null;
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

function resolvingNearestHuntablePreyWithinRadius(
  blackboard: DefiningWildlifeBehaviorBlackboard,
  radiusGrid: number
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

    if (distance > radiusGrid) {
      continue;
    }

    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function resolvingNearestHuntablePrey(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeInstance | null {
  return resolvingNearestHuntablePreyWithinRadius(
    blackboard,
    DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID
  );
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

    if (
      !checkingWildlifeMayAggroPlayerOnSight(
        blackboard.species,
        blackboard.instance.aggressionLevel,
        blackboard.instance.hungerState.driveLevel
      )
    ) {
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
  isMotivatedToHunt: (blackboard) =>
    checkingWildlifeIsMotivatedToHunt(
      blackboard.species,
      blackboard.instance.hungerState.driveLevel
    ),
  isMotivatedToForageGroundFood: (blackboard) =>
    checkingWildlifeIsMotivatedToForageGroundFood(
      blackboard.species,
      blackboard.instance.hungerState.driveLevel
    ),
  hasHuntablePreyNearby: (blackboard) =>
    blackboard.selectedPreyInstanceId !== null,
  hasHuntablePreyInProximity: (blackboard) =>
    blackboard.selectedProximityPreyInstanceId !== null,
  hasEdibleGroundFoodNearby: (blackboard) =>
    blackboard.selectedGroundFoodItemId !== null,
  isHealthBelowFleeThreshold: (blackboard) => {
    const healthRatio =
      blackboard.instance.healthState.currentHealth /
      Math.max(1, blackboard.instance.healthState.baseMaxHealth);

    if (healthRatio < 0.35) {
      return true;
    }

    if (blackboard.instance.aggroState.activeTargetId === null) {
      return false;
    }

    return !checkingWildlifeAggressiveHerbivoreMayFight(
      blackboard.species,
      blackboard.instance
    );
  },
  isPlayerTooClose: (blackboard) => {
    if (!blackboard.playerPosition) {
      return false;
    }

    if (
      blackboard.species.diet === 'herbivore' &&
      blackboard.instance.aggressionLevel === 'aggressive'
    ) {
      return false;
    }

    const fleeRadiusMultiplier = resolvingWildlifeAggressionLevelProfile(
      blackboard.instance.aggressionLevel
    ).fleeRadiusMultiplier;
    const fleeEntryRadiusGrid =
      blackboard.species.aggro.aggroRadiusGrid *
      DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER *
      fleeRadiusMultiplier;
    const distanceToPlayer = resolvingDistanceGrid(
      blackboard.instance.position,
      blackboard.playerPosition
    );

    // Hysteresis: an in-progress flee keeps going until the animal clears a
    // wider exit radius, even if the player stopped sprinting. Without this,
    // animals pivot back the instant the startle input flickers, producing a
    // run-away / walk-back loop.
    if (blackboard.instance.aiState.intent.mode === 'flee') {
      return (
        distanceToPlayer <=
        fleeEntryRadiusGrid * DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER
      );
    }

    if (
      !checkingWildlifePlayerStartlesWildlife(
        blackboard.isPlayerRunning,
        blackboard.isPlayerJumping
      )
    ) {
      return false;
    }

    return distanceToPlayer <= fleeEntryRadiusGrid;
  },
  isAggressiveHerbivoreMayFight: (blackboard) =>
    checkingWildlifeAggressiveHerbivoreMayFight(
      blackboard.species,
      blackboard.instance
    ),
  isNearWater: (blackboard) => {
    const tileX = Math.floor(blackboard.instance.position.x);
    const tileY = Math.floor(blackboard.instance.position.y);

    return Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX, tileY));
  },
  isBeyondLeashDistance: (blackboard) => {
    const distanceToAnchor = resolvingDistanceGrid(
      blackboard.instance.position,
      blackboard.instance.spawnAnchor
    );

    // Hysteresis: once returning, keep returning until well inside the leash.
    // Re-engaging the moment the animal steps back inside the boundary made
    // predators ping-pong across the leash line while chasing a player.
    if (blackboard.instance.aiState.intent.mode === 'return') {
      return (
        distanceToAnchor >
        blackboard.species.aggro.leashDistanceGrid *
          DEFINING_WILDLIFE_LEASH_RETURN_EXIT_FRACTION
      );
    }

    return distanceToAnchor > blackboard.species.aggro.leashDistanceGrid;
  },
  shouldTerritoryWarn: checkingWildlifeShouldTerritoryWarn,
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

export function computingWildlifeSelectedProximityPreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  return (
    resolvingNearestHuntablePreyWithinRadius(
      blackboard,
      resolvingWildlifePreyProximityAttackRadiusGrid(blackboard.species)
    )?.instanceId ?? null
  );
}

export function resolvingWildlifeProximityPreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  return blackboard.selectedProximityPreyInstanceId;
}

export function computingWildlifeSelectedGroundFoodItemId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  if (
    !checkingWildlifeIsMotivatedToForageGroundFood(
      blackboard.species,
      blackboard.instance.hungerState.driveLevel
    )
  ) {
    return null;
  }

  return (
    resolvingWildlifeNearestEdibleGroundFood(
      blackboard.instance.position,
      blackboard.species,
      listingWildlifeGroundFoodItems()
    )?.id ?? null
  );
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
    blackboard.instance.aggroState.activeTargetId === blackboard.playerUserId,
    blackboard.instance.aggressionLevel
  );
}
