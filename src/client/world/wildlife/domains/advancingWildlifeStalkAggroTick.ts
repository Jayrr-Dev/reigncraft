/**
 * PackHunter-specific aggro: pack join, hunt timer, and timeout release.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWildlifeStalkConfidentAssaultReady,
  checkingWildlifeStalkPackIsConfident,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkConfidentPack';
import {
  checkingWildlifeSoloStalkerKillConditions,
  checkingWildlifeStalkKillConditions,
  resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import { checkingWildlifeIsStalkHuntTemperament } from '@/components/world/wildlife/domains/checkingWildlifeIsStalkHuntTemperament';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS,
  DEFINING_WILDLIFE_STALK_PACK_JOIN_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeStalkEventKind } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
  DefiningWildlifeThreatEntry,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
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
  const packmates = listingWildlifeNearbyPackmates({
    instance,
    instances: allInstances,
    includeDead: false,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates,
    resolveSpecies,
  });
  let nextThreats = threats;

  for (const neighbor of packmates) {
    if (neighbor.instanceId === instance.instanceId) {
      continue;
    }

    if (neighbor.aggroState.activeTargetId !== preyTargetId) {
      continue;
    }

    if (alphaInstanceId && neighbor.instanceId !== alphaInstanceId) {
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
 * Applies stalk hunt aggro: pack join (pack_hunter only), hunt timer, timeout.
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
  if (!checkingWildlifeIsStalkHuntTemperament(species.temperamentId)) {
    return { aggroState, events: [] };
  }

  const isPackHunter = species.temperamentId === 'pack_hunter';
  const previousStalkingSinceMs = aggroState.stalkingPreySinceMs ?? null;
  const previousConfidentSinceMs = aggroState.stalkConfidentSinceMs ?? null;
  let nextAggroState = aggroState;
  const events: DefiningWildlifeStalkEventKind[] = [];
  const packJoinPreyTargetId = isPackHunter
    ? resolvingWildlifeStalkPackJoinPreyTargetId({
        instance,
        nearbyInstances,
        resolveSpecies,
      })
    : null;

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
  const stalkPackCount = isPackHunter
    ? countingWildlifeStalkPackmatesTargetingPrey({
        instance,
        nearbyInstances,
        preyTargetId: prey.targetId,
      })
    : 1;
  const packIsConfident =
    isPackHunter && checkingWildlifeStalkPackIsConfident(stalkPackCount);
  const killWindowOpen = isPackHunter
    ? checkingWildlifeStalkKillConditions({
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
      })
    : checkingWildlifeSoloStalkerKillConditions({
        ...weaknessParams,
        stalkingElapsedMs,
        hungerDriveLevel: instance.hungerState.driveLevel,
        aggressionLevel: instance.aggressionLevel,
      });

  if (nextAggroState.activeTargetId === prey.targetId) {
    if (isPackHunter) {
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
    }

    const stalkingStartedAtMs = nextAggroState.stalkingPreySinceMs ?? null;

    if (stalkingStartedAtMs === null) {
      const alphaStalkingSinceMs = isPackHunter
        ? resolvingWildlifeSpawnPackAlphaStalkingSinceMs({
            instance,
            instances: listingWildlifeNearbyAndSelf(instance, nearbyInstances),
            preyTargetId: prey.targetId,
            resolveSpecies,
          })
        : null;

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
