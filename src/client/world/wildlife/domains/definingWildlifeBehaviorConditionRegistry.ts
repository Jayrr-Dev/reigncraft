/**
 * Behavior tree blackboard and condition evaluation.
 *
 * @module components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWildlifeShouldCompleteBluffReturn } from '@/components/world/wildlife/domains/advancingWildlifeBluffCharge';
import { checkingWildlifeAggressiveHerbivoreMayFight } from '@/components/world/wildlife/domains/checkingWildlifeAggressiveHerbivoreMayFight';
import { checkingWildlifeAlwaysFollowPlayerWithinRange } from '@/components/world/wildlife/domains/checkingWildlifeAlwaysFollowPlayerWithinRange';
import { checkingWildlifeDocileFollowIsActive } from '@/components/world/wildlife/domains/checkingWildlifeDocileFollowIsActive';
import { checkingWildlifeHasSeekPack } from '@/components/world/wildlife/domains/checkingWildlifeHasSeekPack';
import { checkingWildlifeHasSeparationAnxiety } from '@/components/world/wildlife/domains/checkingWildlifeHasSeparationAnxiety';
import { checkingWildlifeHerbivoreIgnoresPlayerNearFood } from '@/components/world/wildlife/domains/checkingWildlifeHerbivoreIgnoresPlayerNearFood';
import { checkingWildlifeInstanceHasProvokedWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro';
import { checkingWildlifeInstanceIsDefendingYoung } from '@/components/world/wildlife/domains/checkingWildlifeInstanceMayDefendYoung';
import {
  checkingWildlifeIsMotivatedToForageGroundFood,
  checkingWildlifeIsMotivatedToHunt,
} from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { checkingWildlifePlayerOccludedByColumnRock } from '@/components/world/wildlife/domains/checkingWildlifePlayerOccludedByColumnRock';
import { checkingWildlifePlayerStartlesWildlife } from '@/components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife';
import { checkingWildlifeSelectedGroundFoodIsFavorite } from '@/components/world/wildlife/domains/checkingWildlifeSelectedGroundFoodIsFavorite';
import { checkingWildlifeShouldDocileApproachReact } from '@/components/world/wildlife/domains/checkingWildlifeShouldDocileApproachReact';
import { checkingWildlifeSocialHunterMayHunt } from '@/components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt';
import { checkingWildlifeSpeciesFavoriteFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesFavoriteFood';
import { checkingWildlifeSpeciesIsImmortal } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal';
import { checkingWildlifeIsStalkHuntTemperament } from '@/components/world/wildlife/domains/checkingWildlifeIsStalkHuntTemperament';
import { checkingWildlifeStalkPackmateMayAttackPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkPackmateMayAttackPrey';
import {
  checkingWildlifeStalkPhaseIsAttacking,
  checkingWildlifeStalkPhaseIsFleeing,
  checkingWildlifeStalkPhaseIsFormingUp,
  checkingWildlifeStalkPhaseIsRegrouping,
  checkingWildlifeStalkPhaseIsShadowing,
  checkingWildlifeStalkPhaseIsSurrounding,
  checkingWildlifeStalkPhaseKillWindowOpen,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { checkingWildlifeShouldTerritoryWarn } from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import {
  DEFINING_WILDLIFE_FLEE_ENTRY_RADIUS_MULTIPLIER,
  DEFINING_WILDLIFE_FLEE_EXIT_RADIUS_MULTIPLIER,
  DEFINING_WILDLIFE_LEASH_RETURN_EXIT_FRACTION,
} from '@/components/world/wildlife/domains/definingWildlifeBehaviorHysteresisConstants';
import type { DefiningWildlifeBehaviorConditionId } from '@/components/world/wildlife/domains/definingWildlifeBehaviorTreeTypes';
import {
  DEFINING_WILDLIFE_FAVORITE_FOOD_DISTANCE_BIAS,
  DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID,
} from '@/components/world/wildlife/domains/definingWildlifeFavoriteFoodConstants';
import {
  checkingWildlifePredatorMayAttackPlayer,
  checkingWildlifePredatorMayHuntPrey,
} from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import {
  DEFINING_WILDLIFE_GROUND_SHRUB_FLORA_DISTANCE_BIAS,
  DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import type {
  DefiningWildlifeHungerDriveLevel,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeNearestEdibleGroundFlower } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFlower';
import { resolvingWildlifeNearestEdibleGroundGrass } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundGrass';
import { resolvingWildlifeNearestEdibleGroundShrub } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundShrub';
import { resolvingWildlifeNearestEdibleGroundFood } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import { resolvingWildlifeSpeciesAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesAggroRadiusGrid';
import { resolvingWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyContext';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type DefiningWildlifeBehaviorBlackboard = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  isPlayerWalking: boolean;
  isPlayerRunning: boolean;
  isPlayerJumping: boolean;
  nowMs: number;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  selectedPreyInstanceId: string | null;
  selectedProximityPreyInstanceId: string | null;
  selectedGroundFoodItemId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  /**
   * True during the shared night window (sunset → sunrise). Always-follow
   * companions only trail while this is true. Defaults to night when omitted
   * (unit-test blackboards).
   */
  isNightCyclePhase?: boolean;
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
          : 'hungry',
        {
          preyHasProvokedWildlifeAggro:
            checkingWildlifeInstanceHasProvokedWildlifeAggro(
              candidate,
              blackboard.nowMs
            ),
        }
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

function resolvingWildlifeStalkPreyFromBlackboard(
  blackboard: DefiningWildlifeBehaviorBlackboard
): DefiningWildlifeStalkPreyContext | null {
  return resolvingWildlifeStalkPreyContext({
    activeTargetId: blackboard.instance.aggroState.activeTargetId,
    nearbyInstances: blackboard.nearbyInstances,
    playerUserId: blackboard.playerUserId,
    playerPosition: blackboard.playerPosition,
    playerHealthRatio: blackboard.playerHealthRatio,
    playerStaminaRatio: blackboard.playerStaminaRatio,
    playerStaminaIsDepleted: blackboard.playerStaminaIsDepleted,
    playerStillDurationMs: blackboard.playerStillDurationMs,
  });
}

function checkingWildlifeBlackboardStalkKillWindowOpen(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  if (
    !checkingWildlifeIsStalkHuntTemperament(blackboard.species.temperamentId)
  ) {
    return false;
  }

  return checkingWildlifeStalkPhaseKillWindowOpen(
    blackboard.instance.aggroState
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

    if (
      checkingWildlifePlayerOccludedByColumnRock(
        blackboard.instance.position,
        blackboard.playerPosition
      )
    ) {
      return false;
    }

    return (
      resolvingDistanceGrid(
        blackboard.instance.position,
        blackboard.playerPosition
      ) <= resolvingWildlifeSpeciesAggroRadiusGrid(blackboard.species)
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
    ) &&
    checkingWildlifeSocialHunterMayHunt({
      instance: blackboard.instance,
      species: blackboard.species,
      nearbyInstances: blackboard.nearbyInstances,
    }),
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
  hasFavoriteGroundFoodNearby: (blackboard) =>
    checkingWildlifeSelectedGroundFoodIsFavorite(
      blackboard.species,
      blackboard.selectedGroundFoodItemId,
      blackboard.nowMs
    ),
  isWillingToForageSelectedGroundFood: (blackboard) => {
    if (blackboard.selectedGroundFoodItemId === null) {
      return false;
    }

    if (
      checkingWildlifeDriveIsAtLeastHungry(
        blackboard.instance.hungerState.driveLevel
      )
    ) {
      return true;
    }

    if (
      checkingWildlifeSelectedGroundFoodIsFavorite(
        blackboard.species,
        blackboard.selectedGroundFoodItemId,
        blackboard.nowMs
      )
    ) {
      return true;
    }

    // Peckish plant-eaters finish flora / stacks they already locked onto.
    return (
      checkingWildlifeDriveIsAtLeastPeckish(
        blackboard.instance.hungerState.driveLevel
      ) &&
      (blackboard.species.diet === 'herbivore' ||
        blackboard.species.diet === 'omnivore')
    );
  },
  isHealthBelowFleeThreshold: (blackboard) => {
    if (checkingWildlifeSpeciesIsImmortal(blackboard.species)) {
      return false;
    }

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
      blackboard.instance.aiState.startledUntilMs !== null &&
      blackboard.instance.aiState.startledUntilMs > blackboard.nowMs
    ) {
      return true;
    }

    if (
      blackboard.species.diet === 'herbivore' &&
      blackboard.instance.aggressionLevel === 'aggressive'
    ) {
      return false;
    }

    // Plant-eaters sometimes stay on berries / dropped food when the player
    // sprints through. Favorites always hold; other edibles are ~50/50 sticky.
    // Bump startle above still flees.
    if (
      checkingWildlifeHerbivoreIgnoresPlayerNearFood({
        species: blackboard.species,
        instanceId: blackboard.instance.instanceId,
        selectedGroundFoodItemId: blackboard.selectedGroundFoodItemId,
        isFavoriteFood: checkingWildlifeSelectedGroundFoodIsFavorite(
          blackboard.species,
          blackboard.selectedGroundFoodItemId,
          blackboard.nowMs
        ),
      })
    ) {
      return false;
    }

    const fleeRadiusMultiplier = resolvingWildlifeAggressionLevelProfile(
      blackboard.instance.aggressionLevel
    ).fleeRadiusMultiplier;
    const fleeEntryRadiusGrid =
      resolvingWildlifeSpeciesAggroRadiusGrid(blackboard.species) *
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
  isDefendingYoung: (blackboard) =>
    checkingWildlifeInstanceIsDefendingYoung(blackboard.instance),
  hasSeparationAnxiety: checkingWildlifeHasSeparationAnxiety,
  hasSeekPack: checkingWildlifeHasSeekPack,
  isDocileFollowingPlayer: (blackboard) => {
    if (
      checkingWildlifeAlwaysFollowPlayerWithinRange(
        blackboard.species,
        blackboard.instance.position,
        blackboard.playerPosition
      )
    ) {
      return (
        blackboard.isNightCyclePhase !== false &&
        blackboard.instance.softDepartureStartedAtMs == null
      );
    }

    return checkingWildlifeDocileFollowIsActive(
      blackboard.instance,
      blackboard.nowMs
    );
  },
  shouldDocileApproachReact: checkingWildlifeShouldDocileApproachReact,
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
  isCompletingBluffReturn: (blackboard) =>
    checkingWildlifeShouldCompleteBluffReturn(blackboard.instance),
  shouldTerritoryWarn: checkingWildlifeShouldTerritoryWarn,
  isStalkKillWindowOpen: checkingWildlifeBlackboardStalkKillWindowOpen,
  isStalkingPrey: (blackboard) => {
    const prey = resolvingWildlifeStalkPreyFromBlackboard(blackboard);

    return (
      checkingWildlifeIsStalkHuntTemperament(
        blackboard.species.temperamentId
      ) &&
      prey !== null &&
      blackboard.instance.aggroState.activeTargetId === prey.targetId &&
      checkingWildlifeStalkPhaseIsShadowing(blackboard.instance.aggroState)
    );
  },
  isStalkPackmateMayAttackPrey: (blackboard) => {
    if (blackboard.species.temperamentId !== 'pack_hunter') {
      return true;
    }

    const prey = resolvingWildlifeStalkPreyFromBlackboard(blackboard);

    if (!prey) {
      return true;
    }

    return checkingWildlifeStalkPackmateMayAttackPrey({
      instance: blackboard.instance,
      nearbyInstances: blackboard.nearbyInstances,
      prey,
      resolveSpecies: blackboard.resolveSpecies,
    });
  },
  isStalkPackFleeing: (blackboard) =>
    checkingWildlifeIsStalkHuntTemperament(
      blackboard.species.temperamentId
    ) &&
    ((blackboard.instance.packAlphaDeathScatterUntilMs !== null &&
      blackboard.instance.packAlphaDeathScatterUntilMs !== undefined &&
      blackboard.nowMs < blackboard.instance.packAlphaDeathScatterUntilMs) ||
      checkingWildlifeStalkPhaseIsFleeing(blackboard.instance.aggroState) ||
      checkingWildlifeStalkPhaseIsRegrouping(blackboard.instance.aggroState)),
  isStalkPackSurroundCommit: (blackboard) => {
    if (blackboard.species.temperamentId !== 'pack_hunter') {
      return false;
    }

    return (
      checkingWildlifeStalkPhaseIsSurrounding(blackboard.instance.aggroState) ||
      checkingWildlifeStalkPhaseIsAttacking(blackboard.instance.aggroState)
    );
  },
  isStalkConfidentFormingUp: (blackboard) =>
    blackboard.species.temperamentId === 'pack_hunter' &&
    checkingWildlifeStalkPhaseIsFormingUp(blackboard.instance.aggroState),
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
  if (
    !checkingWildlifeSocialHunterMayHunt({
      instance: blackboard.instance,
      species: blackboard.species,
      nearbyInstances: blackboard.nearbyInstances,
    })
  ) {
    return null;
  }

  return resolvingNearestHuntablePrey(blackboard)?.instanceId ?? null;
}

export function computingWildlifeSelectedProximityPreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  if (
    !checkingWildlifeSocialHunterMayHunt({
      instance: blackboard.instance,
      species: blackboard.species,
      nearbyInstances: blackboard.nearbyInstances,
    })
  ) {
    return null;
  }

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

function checkingWildlifeDriveIsAtLeastHungry(
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  return driveLevel === 'hungry' || driveLevel === 'starving';
}

function checkingWildlifeDriveIsAtLeastPeckish(
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  return (
    driveLevel === 'peckish' ||
    driveLevel === 'hungry' ||
    driveLevel === 'starving'
  );
}

function checkingWildlifeSpeciesMayForageGroundFlowers(
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  return species.diet === 'herbivore' || species.diet === 'omnivore';
}

function checkingWildlifeSpeciesMayForageGroundGrass(
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  return species.diet === 'herbivore' || species.diet === 'omnivore';
}

function checkingWildlifeSpeciesMayForageGroundShrubs(
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  return species.diet === 'herbivore' || species.diet === 'omnivore';
}

function applyingWildlifeGroundFoodFavoriteDistanceBias(
  species: DefiningWildlifeSpeciesDefinition,
  itemTypeId: string,
  distanceGrid: number
): number {
  if (!checkingWildlifeSpeciesFavoriteFood(species, itemTypeId)) {
    return distanceGrid;
  }

  return distanceGrid * DEFINING_WILDLIFE_FAVORITE_FOOD_DISTANCE_BIAS;
}

function checkingWildlifeMayNoticeGroundFlora(
  species: DefiningWildlifeSpeciesDefinition,
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  if (checkingWildlifeDriveIsAtLeastHungry(driveLevel)) {
    return true;
  }

  // Peckish plant-eaters still notice flora so they chew grass / shrubs instead
  // of only abstract-grazing. Favorites keep the stronger distance bias.
  return (
    checkingWildlifeDriveIsAtLeastPeckish(driveLevel) &&
    (species.diet === 'herbivore' || species.diet === 'omnivore')
  );
}

function resolvingWildlifeNearestGroundFloraTarget(
  blackboard: DefiningWildlifeBehaviorBlackboard
): { readonly groundItemId: string; readonly distanceGrid: number } | null {
  const driveLevel = blackboard.instance.hungerState.driveLevel;
  const mayForagePlant = checkingWildlifeSpeciesMayForageGroundFlowers(
    blackboard.species
  );
  const nearestFlower = mayForagePlant
    ? resolvingWildlifeNearestEdibleGroundFlower(blackboard.instance.position)
    : null;

  const mayForageGrass = checkingWildlifeSpeciesMayForageGroundGrass(
    blackboard.species
  );
  const nearestGrass = mayForageGrass
    ? resolvingWildlifeNearestEdibleGroundGrass(blackboard.instance.position)
    : null;

  const mayForageShrub = checkingWildlifeSpeciesMayForageGroundShrubs(
    blackboard.species
  );
  const nearestShrub = mayForageShrub
    ? resolvingWildlifeNearestEdibleGroundShrub(blackboard.instance.position)
    : null;

  type GroundFloraCandidate = {
    readonly groundItemId: string;
    readonly distanceGrid: number;
  };

  const candidates: GroundFloraCandidate[] = [];

  if (
    nearestFlower &&
    checkingWildlifeMayNoticeGroundFlora(blackboard.species, driveLevel)
  ) {
    candidates.push({
      groundItemId: nearestFlower.groundItemId,
      distanceGrid: applyingWildlifeGroundFoodFavoriteDistanceBias(
        blackboard.species,
        nearestFlower.itemTypeId,
        nearestFlower.distanceGrid
      ),
    });
  }

  if (
    nearestGrass &&
    checkingWildlifeMayNoticeGroundFlora(blackboard.species, driveLevel)
  ) {
    candidates.push({
      groundItemId: nearestGrass.groundItemId,
      distanceGrid: applyingWildlifeGroundFoodFavoriteDistanceBias(
        blackboard.species,
        DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID,
        nearestGrass.distanceGrid
      ),
    });
  }

  if (
    nearestShrub &&
    checkingWildlifeMayNoticeGroundFlora(blackboard.species, driveLevel)
  ) {
    candidates.push({
      groundItemId: nearestShrub.groundItemId,
      distanceGrid: applyingWildlifeGroundFoodFavoriteDistanceBias(
        blackboard.species,
        nearestShrub.itemTypeId,
        nearestShrub.distanceGrid *
          DEFINING_WILDLIFE_GROUND_SHRUB_FLORA_DISTANCE_BIAS
      ),
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  let nearest = candidates[0];

  for (let index = 1; index < candidates.length; index += 1) {
    const candidate = candidates[index];

    if (candidate.distanceGrid < nearest.distanceGrid) {
      nearest = candidate;
    }
  }

  return nearest;
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

  const nearestStack = resolvingWildlifeNearestEdibleGroundFood(
    blackboard.instance.position,
    blackboard.species,
    listingWildlifeGroundFoodItems(blackboard.nowMs)
  );

  const nearestFlora = resolvingWildlifeNearestGroundFloraTarget(blackboard);

  type GroundFoodCandidate = {
    readonly groundItemId: string;
    readonly distanceGrid: number;
  };

  const candidates: GroundFoodCandidate[] = [];

  if (nearestStack) {
    const stackDistance = Math.hypot(
      blackboard.instance.position.x - (nearestStack.gridX + 0.5),
      blackboard.instance.position.y - (nearestStack.gridY + 0.5)
    );

    candidates.push({
      groundItemId: nearestStack.id,
      distanceGrid: applyingWildlifeGroundFoodFavoriteDistanceBias(
        blackboard.species,
        nearestStack.itemTypeId,
        stackDistance
      ),
    });
  }

  if (nearestFlora) {
    candidates.push({
      groundItemId: nearestFlora.groundItemId,
      distanceGrid: nearestFlora.distanceGrid,
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  let nearest = candidates[0];

  for (let index = 1; index < candidates.length; index += 1) {
    const candidate = candidates[index];

    if (candidate.distanceGrid < nearest.distanceGrid) {
      nearest = candidate;
    }
  }

  return nearest.groundItemId;
}

export function resolvingWildlifeNearestHuntablePreyInstanceId(
  blackboard: DefiningWildlifeBehaviorBlackboard
): string | null {
  return blackboard.selectedPreyInstanceId;
}

export function checkingWildlifeMayTargetPlayer(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  if (
    checkingWildlifeIsStalkHuntTemperament(blackboard.species.temperamentId)
  ) {
    return checkingWildlifeBlackboardStalkKillWindowOpen(blackboard);
  }

  return checkingWildlifePredatorMayAttackPlayer(
    blackboard.species,
    blackboard.instance.hungerState.driveLevel,
    blackboard.instance.aggroState.activeTargetId === blackboard.playerUserId,
    blackboard.instance.aggressionLevel
  );
}
