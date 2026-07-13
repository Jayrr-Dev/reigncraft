/**
 * Detects a closing player during stalk shadowing and rolls pack-wide reactions.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkPlayerApproachTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { applyingWildlifeStalkPackEvent } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackEvent';
import { applyingWildlifeStalkPlayerApproachResponse } from '@/components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachResponse';
import { applyingWildlifeStalkPlayerApproachState } from '@/components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachState';
import { checkingWildlifeStalkInstanceHasCommittedRoll } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackCommittedRoll';
import { checkingWildlifePlayerApproachingPackHunter } from '@/components/world/wildlife/domains/checkingWildlifePlayerApproachingPackHunter';
import { checkingWildlifePackHunterIsShadowingPlayer } from '@/components/world/wildlife/domains/checkingWildlifePackHunterIsShadowingPlayer';
import { checkingWildlifeSameStalkPackSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
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

type ResolvingClosestApproachingPackHunterResult = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
} | null;

function resolvingClosestApproachingPackHunter({
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
}): ResolvingClosestApproachingPackHunterResult {
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

    if (
      !species ||
      (species.temperamentId !== 'pack_hunter' &&
        species.temperamentId !== 'stalker')
    ) {
      continue;
    }

    if (instance.aggroState.activeTargetId !== playerUserId) {
      continue;
    }

    if (checkingWildlifeStalkInstanceHasCommittedRoll(instance)) {
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
      !checkingWildlifePackHunterIsShadowingPlayer({
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
      !checkingWildlifePlayerApproachingPackHunter({
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
        checkingWildlifeSameStalkPackSpecies(
          neighbor.speciesId,
          instance.speciesId
        ) &&
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

    if (
      !species ||
      (species.temperamentId !== 'pack_hunter' &&
        species.temperamentId !== 'stalker')
    ) {
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

  const closestApproachingPackHunter = resolvingClosestApproachingPackHunter({
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

  if (!closestApproachingPackHunter) {
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
    point: closestApproachingPackHunter.instance.position,
    radiusGrid: closestApproachingPackHunter.species.aggro.packShareRadiusGrid,
    excludeInstanceId: closestApproachingPackHunter.instance.instanceId,
  });
  const liveTriggerInstance =
    store.instances.get(closestApproachingPackHunter.instance.instanceId) ??
    closestApproachingPackHunter.instance;
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
      species: closestApproachingPackHunter.species,
      preyTargetId: playerUserId,
      nearbyInstances,
      nowMs,
      resolveSpecies,
      playerUserId,
      playerHealthRatio,
      playerStaminaRatio,
      playerStaminaIsDepleted,
      playerStillDurationMs,
      playerPosition,
    });
    return;
  }

  const isNewApproachNotice = existingApproachState === null;
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

  if (isNewApproachNotice) {
    applyingWildlifeStalkPackEvent({
      store,
      anchorInstance: liveTriggerInstance,
      species: closestApproachingPackHunter.species,
      preyTargetId: playerUserId,
      nearbyInstances,
      eventKind: 'PLAYER_APPROACH_NOTICED',
      nowMs,
      resolveSpecies,
      playerUserId,
      playerHealthRatio,
      playerStaminaRatio,
      playerStaminaIsDepleted,
      playerStillDurationMs,
      playerPosition,
    });
  }
}
