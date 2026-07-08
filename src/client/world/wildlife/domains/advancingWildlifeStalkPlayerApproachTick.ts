/**
 * Detects a closing player during stalk shadowing and rolls pack-wide reactions.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkPlayerApproachTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { applyingWildlifeStalkPlayerApproachResponse } from '@/components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachResponse';
import { applyingWildlifeStalkPlayerApproachState } from '@/components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachState';
import { checkingWildlifePlayerApproachingStalker } from '@/components/world/wildlife/domains/checkingWildlifePlayerApproachingStalker';
import { checkingWildlifeStalkerIsShadowingPlayer } from '@/components/world/wildlife/domains/checkingWildlifeStalkerIsShadowingPlayer';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REACTION_COOLDOWN_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPlayerApproachState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { checkingWildlifeStalkPlayerApproachRetreatComplete } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatIntent';
import { resolvingWildlifeStalkPlayerApproachRetreatRoll } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachRetreatRoll';

export type AdvancingWildlifeStalkPlayerApproachTickParams = {
  store: ManagingWildlifeInstanceStore;
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerPreviousPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string;
  isPlayerWalking: boolean;
  isPlayerRunning: boolean;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

type ResolvingClosestApproachingStalkerResult = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
} | null;

function resolvingClosestApproachingStalker({
  instances,
  playerPosition,
  playerPreviousPosition,
  playerUserId,
  isPlayerWalking,
  isPlayerRunning,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
  nowMs,
  resolveSpecies,
}: {
  instances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerPreviousPosition: DefiningWorldPlazaWorldPoint;
  playerUserId: string;
  isPlayerWalking: boolean;
  isPlayerRunning: boolean;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
}): ResolvingClosestApproachingStalkerResult {
  let closestMatch: {
    instance: DefiningWildlifeInstance;
    species: DefiningWildlifeSpeciesDefinition;
    distanceGrid: number;
  } | null = null;

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species || species.temperamentId !== 'stalker') {
      continue;
    }

    if (instance.aggroState.activeTargetId !== playerUserId) {
      continue;
    }

    if (instance.aggroState.stalkPackResponse) {
      continue;
    }

    const reactedAtMs = instance.aggroState.stalkPlayerApproachReactedAtMs;

    if (
      reactedAtMs !== null &&
      reactedAtMs !== undefined &&
      nowMs - reactedAtMs <
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REACTION_COOLDOWN_MS
    ) {
      continue;
    }

    const stalkingStartedAtMs =
      instance.aggroState.stalkingPreySinceMs ?? nowMs;
    const stalkingElapsedMs = Math.max(0, nowMs - stalkingStartedAtMs);

    if (
      !checkingWildlifeStalkerIsShadowingPlayer({
        species,
        aggroState: instance.aggroState,
        playerUserId,
        playerHealthRatio,
        playerStaminaRatio,
        playerStaminaIsDepleted,
        playerStillDurationMs,
        stalkingElapsedMs,
      })
    ) {
      continue;
    }

    if (
      !checkingWildlifePlayerApproachingStalker({
        playerPosition,
        playerPreviousPosition,
        wolfPosition: instance.position,
        isPlayerWalking,
        isPlayerRunning,
      })
    ) {
      continue;
    }

    const distanceGrid = Math.hypot(
      playerPosition.x - instance.position.x,
      playerPosition.y - instance.position.y
    );

    if (!closestMatch || distanceGrid < closestMatch.distanceGrid) {
      closestMatch = {
        instance,
        species,
        distanceGrid,
      };
    }
  }

  if (!closestMatch) {
    return null;
  }

  return {
    instance: closestMatch.instance,
    species: closestMatch.species,
  };
}

function resolvingPackAnchorInstanceId(
  instance: DefiningWildlifeInstance,
  nearbyInstances: readonly DefiningWildlifeInstance[],
  preyTargetId: string
): string {
  const packmates = [
    instance,
    ...nearbyInstances.filter(
      (neighbor) =>
        !neighbor.isDead &&
        neighbor.speciesId === instance.speciesId &&
        neighbor.aggroState.activeTargetId === preyTargetId
    ),
  ].sort((left, right) => left.instanceId.localeCompare(right.instanceId));

  return packmates[0]?.instanceId ?? instance.instanceId;
}

function advancingWildlifeStalkPlayerApproachStateForPack({
  approachState,
  nowMs,
}: {
  approachState: DefiningWildlifeStalkPlayerApproachState;
  nowMs: number;
}): DefiningWildlifeStalkPlayerApproachState {
  if (approachState.retreatStartedAtMs !== null) {
    return approachState;
  }

  if (nowMs - approachState.noticedAtMs < approachState.noticeDelayMs) {
    return approachState;
  }

  return {
    ...approachState,
    retreatStartedAtMs: nowMs,
  };
}

function clearingWildlifeStalkPlayerApproachStateForHuntingPlayer({
  store,
  playerUserId,
  resolveSpecies,
}: {
  store: ManagingWildlifeInstanceStore;
  playerUserId: string;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
}): void {
  for (const instance of listingWildlifeInstances(store)) {
    if (
      instance.isDead ||
      instance.aggroState.activeTargetId !== playerUserId ||
      !instance.aggroState.stalkPlayerApproachState
    ) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species || species.temperamentId !== 'stalker') {
      continue;
    }

    replacingWildlifeInstance(store, {
      ...instance,
      aggroState: {
        ...instance.aggroState,
        stalkPlayerApproachState: null,
      },
    });
  }
}

/** Manages delayed retreat legs, then rolls a pack reaction if the player keeps closing. */
export function advancingWildlifeStalkPlayerApproachTick({
  store,
  playerPosition,
  playerPreviousPosition,
  playerUserId,
  isPlayerWalking,
  isPlayerRunning,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
  nowMs,
  resolveSpecies,
}: AdvancingWildlifeStalkPlayerApproachTickParams): void {
  if (!playerPreviousPosition) {
    return;
  }

  if (!isPlayerWalking && !isPlayerRunning) {
    clearingWildlifeStalkPlayerApproachStateForHuntingPlayer({
      store,
      playerUserId,
      resolveSpecies,
    });
    return;
  }

  const closestApproachingStalker = resolvingClosestApproachingStalker({
    instances: listingWildlifeInstances(store),
    playerPosition,
    playerPreviousPosition,
    playerUserId,
    isPlayerWalking,
    isPlayerRunning,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    nowMs,
    resolveSpecies,
  });

  if (!closestApproachingStalker) {
    clearingWildlifeStalkPlayerApproachStateForHuntingPlayer({
      store,
      playerUserId,
      resolveSpecies,
    });
    return;
  }

  const spatialGrid = buildingWildlifeSpatialGrid(
    listingWildlifeInstances(store)
  );
  const nearbyInstances = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: closestApproachingStalker.instance.position,
    radiusGrid: closestApproachingStalker.species.aggro.packShareRadiusGrid,
    excludeInstanceId: closestApproachingStalker.instance.instanceId,
  });
  const liveTriggerInstance =
    store.instances.get(closestApproachingStalker.instance.instanceId) ??
    closestApproachingStalker.instance;
  const existingApproachState =
    liveTriggerInstance.aggroState.stalkPlayerApproachState ?? null;
  const playerPace: 'walk' | 'run' = isPlayerRunning ? 'run' : 'walk';
  const packAnchorId = resolvingPackAnchorInstanceId(
    liveTriggerInstance,
    nearbyInstances,
    playerUserId
  );

  if (
    existingApproachState &&
    checkingWildlifeStalkPlayerApproachRetreatComplete({
      position: liveTriggerInstance.position,
      approachState: existingApproachState,
    })
  ) {
    applyingWildlifeStalkPlayerApproachState({
      store,
      anchorInstance: liveTriggerInstance,
      preyTargetId: playerUserId,
      nearbyInstances,
      approachState: null,
    });

    applyingWildlifeStalkPlayerApproachResponse({
      store,
      triggerInstance: liveTriggerInstance,
      species: closestApproachingStalker.species,
      preyTargetId: playerUserId,
      nearbyInstances,
      nowMs,
      resolveSpecies,
    });
    return;
  }

  const nextApproachState = advancingWildlifeStalkPlayerApproachStateForPack({
    approachState:
      existingApproachState ??
      (() => {
        const roll = resolvingWildlifeStalkPlayerApproachRetreatRoll({
          packAnchorId,
          playerPace,
        });

        return {
          noticedAtMs: nowMs,
          noticeDelayMs: roll.noticeDelayMs,
          playerPace,
          retreatDistanceGrid: roll.retreatDistanceGrid,
          retreatStartedAtMs: null,
          retreatFromX: liveTriggerInstance.position.x,
          retreatFromY: liveTriggerInstance.position.y,
        };
      })(),
    nowMs,
  });

  applyingWildlifeStalkPlayerApproachState({
    store,
    anchorInstance: liveTriggerInstance,
    preyTargetId: playerUserId,
    nearbyInstances,
    approachState: nextApproachState,
  });
}
