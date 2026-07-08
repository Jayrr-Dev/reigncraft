/**
 * Stalker-specific aggro: pack join, hunt timer, and timeout release.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { releasingWildlifeAggroOnTarget } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { checkingWildlifeShareSpawnPack } from '@/components/world/wildlife/domains/checkingWildlifeShareSpawnPack';
import { checkingWildlifeStalkAttackPhaseExpired } from '@/components/world/wildlife/domains/checkingWildlifeStalkAttackPhaseExpired';
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
  DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID,
  DEFINING_WILDLIFE_STALK_PACK_JOIN_THREAT_PER_SECOND,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
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

/**
 * Applies stalker pack join threat, starts the hunt timer, and times out idle stalks.
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
}: AdvancingWildlifeStalkAggroTickParams): DefiningWildlifeAggroState {
  if (species.temperamentId !== 'stalker') {
    return aggroState;
  }

  let nextAggroState = aggroState;
  const packJoinPreyTargetId = resolvingWildlifeStalkPackJoinPreyTargetId({
    instance,
    nearbyInstances,
    resolveSpecies,
  });

  if (packJoinPreyTargetId) {
    nextAggroState = {
      ...nextAggroState,
      stalkLockedPreyTargetId:
        nextAggroState.stalkLockedPreyTargetId ?? packJoinPreyTargetId,
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
      ...nextAggroState,
      stalkingPreySinceMs: null,
      stalkConfidentSinceMs: null,
      stalkLockedPreyTargetId: null,
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
    return {
      ...nextAggroState,
      stalkingPreySinceMs: null,
      stalkConfidentSinceMs: null,
    };
  }

  const stalkingElapsedMs =
    instance.aggroState.stalkingPreySinceMs === null ||
    instance.aggroState.stalkingPreySinceMs === undefined
      ? 0
      : Math.max(0, nowMs - instance.aggroState.stalkingPreySinceMs);
  const weaknessParams =
    resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey(prey);
  const packIsConfident = checkingWildlifeStalkPackIsConfident(
    countingWildlifeStalkPackmatesTargetingPrey({
      instance,
      nearbyInstances,
      preyTargetId: prey.targetId,
    })
  );
  const killWindowOpen =
    checkingWildlifeStalkKillConditions({
      ...weaknessParams,
      stalkingElapsedMs,
    }) ||
    checkingWildlifeStalkConfidentAssaultReady({
      stalkConfidentSinceMs: nextAggroState.stalkConfidentSinceMs,
      preyTargetId: prey.targetId,
      nowMs,
    });

  if (nextAggroState.activeTargetId === prey.targetId) {
    // Confidence timer: starts when the pack first hits 5+ hunters on this
    // prey, clears if the pack thins back out before the assault.
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
    } else if ((nextAggroState.stalkConfidentSinceMs ?? null) !== null) {
      nextAggroState = {
        ...nextAggroState,
        stalkConfidentSinceMs: null,
      };
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
    }

    if (
      checkingWildlifeStalkAttackPhaseExpired({
        stalkAttackingPreySinceMs: nextAggroState.stalkAttackingPreySinceMs,
        nowMs,
      })
    ) {
      nextAggroState = {
        ...nextAggroState,
        stalkAttackingPreySinceMs: null,
        stalkingPreySinceMs: nowMs,
      };
    }

    if (
      nextAggroState.stalkPackResponse === 'flee' &&
      resolvingDistanceGrid(instance.position, prey.position) >=
        DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID
    ) {
      nextAggroState = {
        ...nextAggroState,
        stalkPackResponse: null,
      };
    }

    if (
      nextAggroState.stalkPackResponse === 'regroup' &&
      resolvingDistanceGrid(instance.position, prey.position) >=
        DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID
    ) {
      nextAggroState = {
        ...nextAggroState,
        stalkPackResponse: null,
      };
    }

    const resolvedStalkingStartedAtMs =
      nextAggroState.stalkingPreySinceMs ?? nowMs;

    if (
      !killWindowOpen &&
      nowMs - resolvedStalkingStartedAtMs >=
        DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS
    ) {
      return {
        ...releasingWildlifeAggroOnTarget(
          nextAggroState,
          prey.targetId,
          species.aggro.targetSwitchMargin,
          nowMs
        ),
        stalkingPreySinceMs: null,
        stalkConfidentSinceMs: null,
        stalkAttackingPreySinceMs: null,
        stalkPackResponse: null,
        stalkLockedPreyTargetId: null,
      };
    }

    return nextAggroState;
  }

  return {
    ...nextAggroState,
    stalkingPreySinceMs: null,
    stalkConfidentSinceMs: null,
  };
}
