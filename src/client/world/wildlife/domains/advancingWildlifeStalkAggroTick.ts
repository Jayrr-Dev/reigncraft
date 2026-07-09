/**
 * Stalker-specific aggro: pack join, hunt timer, and timeout release.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeShareSpawnPack } from '@/components/world/wildlife/domains/checkingWildlifeShareSpawnPack';
import {
  checkingWildlifeStalkConfidentAssaultReady,
  checkingWildlifeStalkPackIsConfident,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkConfidentPack';
import {
  checkingWildlifeStalkKillConditions,
  resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS,
  DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID,
  DEFINING_WILDLIFE_STALK_PACK_JOIN_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeStalkEventKind } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
  DefiningWildlifeThreatEntry,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import { countingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';
import {
  resolvingWildlifeSpawnPackAlphaConfidentSinceMs,
  resolvingWildlifeSpawnPackAlphaStalkingSinceMs,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaStalkingSinceMs';
import { resolvingWildlifeStalkPackJoinPreyTargetId } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackJoinPreyTargetId';
import { resolvingWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyContext';

function updatingThreatEntry(
  threats: readonly DefiningWildlifeThreatEntry[],
  targetId: string,
  addedThreat: number,
  nowMs: number
): DefiningWildlifeThreatEntry[] {
  const existing = threats.find((entry) => entry.targetId === targetId);
  const nextThreat = (existing?.threat ?? 0) + addedThreat;
  const withoutTarget = threats.filter((entry) => entry.targetId !== targetId);

  if (nextThreat <= 0) {
    return withoutTarget;
  }

  return [
    ...withoutTarget,
    { targetId, threat: nextThreat, lastUpdatedAtMs: nowMs },
  ];
}

export type AdvancingWildlifeStalkAggroTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  deltaSeconds: number;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  aggroState: DefiningWildlifeAggroState;
};

export type AdvancingWildlifeStalkAggroTickResult = {
  aggroState: DefiningWildlifeAggroState;
  events: readonly DefiningWildlifeStalkEventKind[];
};

function resolvingDistanceGrid(
  left: DefiningWorldPlazaWorldPoint,
  right: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function listingWildlifeNearbyAndSelf(
  instance: DefiningWildlifeInstance,
  nearbyInstances: readonly DefiningWildlifeInstance[]
): DefiningWildlifeInstance[] {
  const byId = new Map<string, DefiningWildlifeInstance>();
  byId.set(instance.instanceId, instance);

  for (const neighbor of nearbyInstances) {
    byId.set(neighbor.instanceId, neighbor);
  }

  return [...byId.values()];
}

function joiningWildlifeStalkPackThreat(
  instance: DefiningWildlifeInstance,
  nearbyInstances: readonly DefiningWildlifeInstance[],
  preyTargetId: string,
  threats: DefiningWildlifeAggroState['threats'],
  deltaSeconds: number,
  nowMs: number,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null
): DefiningWildlifeAggroState['threats'] {
  const allInstances = listingWildlifeNearbyAndSelf(instance, nearbyInstances);
  const spawnPack = listingWildlifeSpawnPackmates({
    instance,
    instances: allInstances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: spawnPack,
    resolveSpecies,
  });
  let nextThreats = threats;

  for (const neighbor of nearbyInstances) {
    if (neighbor.isDead || neighbor.speciesId !== instance.speciesId) {
      continue;
    }

    if (neighbor.aggroState.activeTargetId !== preyTargetId) {
      continue;
    }

    if (!checkingWildlifeShareSpawnPack(instance, neighbor)) {
      continue;
    }

    if (alphaInstanceId && neighbor.instanceId !== alphaInstanceId) {
      continue;
    }

    if (
      resolvingDistanceGrid(instance.position, neighbor.position) >
      DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID
    ) {
      continue;
    }

    nextThreats = updatingThreatEntry(
      nextThreats,
      preyTargetId,
      DEFINING_WILDLIFE_STALK_PACK_JOIN_THREAT_PER_SECOND * deltaSeconds,
      nowMs
    );
  }

  return nextThreats;
}

function pushingUniqueEvent(
  events: DefiningWildlifeStalkEventKind[],
  eventKind: DefiningWildlifeStalkEventKind
): void {
  if (!events.includes(eventKind)) {
    events.push(eventKind);
  }
}

/**
 * Applies stalker pack join threat, starts hunt timers, and emits phase events.
 */
export function advancingWildlifeStalkAggroTick({
  instance,
  species,
  nearbyInstances,
  playerPosition,
  playerUserId,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
  deltaSeconds,
  nowMs,
  resolveSpecies,
  aggroState,
}: AdvancingWildlifeStalkAggroTickParams): AdvancingWildlifeStalkAggroTickResult {
  if (species.temperamentId !== 'stalker') {
    return { aggroState, events: [] };
  }

  const previousStalkingSinceMs = aggroState.stalkingPreySinceMs ?? null;
  const previousConfidentSinceMs = aggroState.stalkConfidentSinceMs ?? null;
  let nextAggroState = aggroState;
  const events: DefiningWildlifeStalkEventKind[] = [];
  const packJoinPreyTargetId = resolvingWildlifeStalkPackJoinPreyTargetId({
    instance,
    nearbyInstances,
    resolveSpecies,
  });

  if (packJoinPreyTargetId) {
    nextAggroState = {
      ...nextAggroState,
      stalkLockedPreyTargetId: packJoinPreyTargetId,
      threats: joiningWildlifeStalkPackThreat(
        instance,
        nearbyInstances,
        packJoinPreyTargetId,
        nextAggroState.threats,
        deltaSeconds,
        nowMs,
        resolveSpecies
      ),
    };
  }

  const activeTargetId = nextAggroState.activeTargetId;

  if (!activeTargetId) {
    return {
      aggroState: {
        ...nextAggroState,
        stalkingPreySinceMs: null,
        stalkConfidentSinceMs: null,
        stalkLockedPreyTargetId: packJoinPreyTargetId,
      },
      events,
    };
  }

  const prey = resolvingWildlifeStalkPreyContext({
    activeTargetId,
    nearbyInstances,
    playerUserId,
    playerPosition,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
  });

  if (!prey) {
    pushingUniqueEvent(events, 'TARGET_DEAD_OR_LOST');

    return {
      aggroState: {
        ...nextAggroState,
        stalkingPreySinceMs: null,
        stalkConfidentSinceMs: null,
      },
      events,
    };
  }

  const stalkingElapsedMs =
    previousStalkingSinceMs === null
      ? 0
      : Math.max(0, nowMs - previousStalkingSinceMs);
  const weaknessParams =
    resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey(prey);
  const stalkPackCount = countingWildlifeStalkPackmatesTargetingPrey({
    instance,
    nearbyInstances,
    preyTargetId: prey.targetId,
  });
  const packIsConfident = checkingWildlifeStalkPackIsConfident(stalkPackCount);
  const killWindowOpen =
    checkingWildlifeStalkKillConditions({
      ...weaknessParams,
      stalkingElapsedMs,
      stalkPackCount,
      preyTargetId: prey.targetId,
      stalkingPreySinceMs: nextAggroState.stalkingPreySinceMs,
      nowMs,
    }) ||
    checkingWildlifeStalkConfidentAssaultReady({
      stalkConfidentSinceMs: nextAggroState.stalkConfidentSinceMs,
      preyTargetId: prey.targetId,
      nowMs,
    });

  if (nextAggroState.activeTargetId === prey.targetId) {
    if (packIsConfident) {
      const sharedConfidentSinceMs =
        resolvingWildlifeSpawnPackAlphaConfidentSinceMs({
          instance,
          instances: listingWildlifeNearbyAndSelf(instance, nearbyInstances),
          preyTargetId: prey.targetId,
          resolveSpecies,
        });

      nextAggroState = {
        ...nextAggroState,
        stalkConfidentSinceMs:
          nextAggroState.stalkConfidentSinceMs ??
          sharedConfidentSinceMs ??
          nowMs,
      };

      if (previousConfidentSinceMs === null) {
        pushingUniqueEvent(events, 'PACK_CONFIDENT');
      }
    } else if ((nextAggroState.stalkConfidentSinceMs ?? null) !== null) {
      nextAggroState = {
        ...nextAggroState,
        stalkConfidentSinceMs: null,
      };
      pushingUniqueEvent(events, 'PACK_THINNED');
    }

    const stalkingStartedAtMs = nextAggroState.stalkingPreySinceMs ?? null;

    if (stalkingStartedAtMs === null) {
      const alphaStalkingSinceMs =
        resolvingWildlifeSpawnPackAlphaStalkingSinceMs({
          instance,
          instances: listingWildlifeNearbyAndSelf(instance, nearbyInstances),
          preyTargetId: prey.targetId,
          resolveSpecies,
        });

      nextAggroState = {
        ...nextAggroState,
        stalkingPreySinceMs: alphaStalkingSinceMs ?? nowMs,
      };

      if (previousStalkingSinceMs === null) {
        pushingUniqueEvent(events, 'TARGET_ACQUIRED');
      }
    }

    const resolvedStalkingStartedAtMs =
      nextAggroState.stalkingPreySinceMs ?? nowMs;

    if (
      !killWindowOpen &&
      nowMs - resolvedStalkingStartedAtMs >=
        DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS
    ) {
      pushingUniqueEvent(events, 'STALK_TIMEOUT_2MIN');

      return {
        aggroState: nextAggroState,
        events,
      };
    }

    return { aggroState: nextAggroState, events };
  }

  return {
    aggroState: {
      ...nextAggroState,
      stalkingPreySinceMs: null,
      stalkConfidentSinceMs: null,
    },
    events,
  };
}
