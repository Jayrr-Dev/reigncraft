/**
 * Makes surviving packmates flee when their alpha is killed, then regroup.
 *
 * @module components/world/wildlife/domains/applyingWildlifePackAlphaDeathScatter
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { applyingWildlifeStalkEventToInstance } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackEvent';
import {
  DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_PACK_ALPHA_DEATH_REGROUP_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ApplyingWildlifePackAlphaDeathScatterParams = {
  store: ManagingWildlifeInstanceStore;
  deadInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  threatPoint: DefiningWorldPlazaWorldPoint | null;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  nowMs: number;
};

function resolvingWildlifePackAlphaDeathRegroupAnchor(
  survivors: readonly DefiningWildlifeInstance[]
): DefiningWorldPlazaWorldPoint | null {
  if (survivors.length === 0) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;
  let layer = survivors[0]?.position.layer ?? 1;

  for (const survivor of survivors) {
    sumX += survivor.position.x;
    sumY += survivor.position.y;
    layer = survivor.position.layer;
  }

  return {
    x: sumX / survivors.length,
    y: sumY / survivors.length,
    layer,
  };
}

function applyingWildlifePackmateAlphaDeathScatter({
  instance,
  species,
  threatPoint,
  hazardSampling,
  nearbyInstances,
  nowMs,
  resolveSpecies,
  sharedFleeTargetPoint,
  scatterUntilMs,
}: {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  threatPoint: DefiningWorldPlazaWorldPoint | null;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  sharedFleeTargetPoint: DefiningWorldPlazaWorldPoint | null;
  scatterUntilMs: number;
}): DefiningWildlifeInstance {
  const fleeIntent: DefiningWildlifeBehaviorIntent =
    sharedFleeTargetPoint !== null
      ? {
          mode: 'flee',
          targetPoint: sharedFleeTargetPoint,
        }
      : threatPoint !== null
        ? resolvingWildlifeFleeFromThreatPointIntent({
            position: instance.position,
            threatPoint,
            fleeDistanceGrid:
              DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID,
            species,
            hazardSampling,
          })
        : { mode: 'idle' };

  const scattered =
    species.temperamentId === 'stalker'
      ? applyingWildlifeStalkEventToInstance({
          instance,
          species,
          nearbyInstances,
          eventKind: 'ALPHA_DIED',
          nowMs,
          resolveSpecies,
          playerUserId: instance.aggroState.activeTargetId,
          playerPosition: threatPoint,
        })
      : {
          ...instance,
          aggroState: {
            threats: [],
            activeTargetId: null,
            lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
            stalkingPreySinceMs: null,
            stalkConfidentSinceMs: null,
            stalkAttackingPreySinceMs: null,
          },
        };

  return {
    ...scattered,
    packAlphaInstanceId: null,
    packAlphaDeathScatterUntilMs: scatterUntilMs,
    aiState: {
      ...scattered.aiState,
      intent: fleeIntent,
      fleeTargetPoint:
        fleeIntent.mode === 'flee' ? (fleeIntent.targetPoint ?? null) : null,
      chargeWindupStartedAtMs: null,
      steeringCache: null,
    },
  };
}

/**
 * True when the corpse was the sticky or size-elected pack alpha.
 */
function checkingWildlifeDeadInstanceWasSpawnPackAlpha({
  deadInstance,
  packWithDead,
  resolveSpecies,
}: {
  deadInstance: DefiningWildlifeInstance;
  packWithDead: readonly DefiningWildlifeInstance[];
  resolveSpecies: ApplyingWildlifePackAlphaDeathScatterParams['resolveSpecies'];
}): boolean {
  if (deadInstance.packAlphaInstanceId === deadInstance.instanceId) {
    return true;
  }

  for (const packmate of packWithDead) {
    if (packmate.packAlphaInstanceId === deadInstance.instanceId) {
      return true;
    }
  }

  // Unlocked packs: elect as if the corpse were still alive.
  const electedAlphaId = resolvingWildlifePackAlphaInstanceId({
    packmates: packWithDead.map((packmate) =>
      packmate.instanceId === deadInstance.instanceId
        ? { ...packmate, isDead: false, packAlphaInstanceId: null }
        : { ...packmate, packAlphaInstanceId: null }
    ),
    resolveSpecies,
  });

  return electedAlphaId === deadInstance.instanceId;
}

/**
 * If the dead instance was the pack alpha, survivors drop aggro, flee to a
 * shared regroup point, and wait before electing a replacement alpha.
 */
export function applyingWildlifePackAlphaDeathScatter({
  store,
  deadInstance,
  species,
  threatPoint,
  hazardSampling,
  resolveSpecies,
  nowMs,
}: ApplyingWildlifePackAlphaDeathScatterParams): boolean {
  const allInstances = listingWildlifeInstances(store);
  const packWithDead = listingWildlifeNearbyPackmates({
    instance: deadInstance,
    instances: allInstances,
    includeDead: true,
  });

  if (
    !checkingWildlifeDeadInstanceWasSpawnPackAlpha({
      deadInstance,
      packWithDead,
      resolveSpecies,
    })
  ) {
    return false;
  }

  const survivors = listingWildlifeNearbyPackmates({
    instance: deadInstance,
    instances: allInstances,
    includeDead: false,
  }).filter((packmate) => packmate.instanceId !== deadInstance.instanceId);

  if (survivors.length === 0) {
    return false;
  }

  const regroupAnchor = resolvingWildlifePackAlphaDeathRegroupAnchor(survivors);
  const scatterUntilMs =
    nowMs + DEFINING_WILDLIFE_PACK_ALPHA_DEATH_REGROUP_DURATION_MS;
  const sharedFleeIntent =
    regroupAnchor && threatPoint
      ? resolvingWildlifeFleeFromThreatPointIntent({
          position: regroupAnchor,
          threatPoint,
          fleeDistanceGrid:
            DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID,
          species,
          hazardSampling,
        })
      : null;
  const sharedFleeTargetPoint =
    sharedFleeIntent?.mode === 'flee'
      ? (sharedFleeIntent.targetPoint ?? null)
      : null;

  for (const survivor of survivors) {
    const survivorSpecies = resolveSpecies(survivor.speciesId);

    if (!survivorSpecies) {
      continue;
    }

    const liveSurvivor = store.instances.get(survivor.instanceId) ?? survivor;

    replacingWildlifeInstance(
      store,
      applyingWildlifePackmateAlphaDeathScatter({
        instance: liveSurvivor,
        species: survivorSpecies,
        threatPoint,
        hazardSampling,
        nearbyInstances: allInstances,
        nowMs,
        resolveSpecies,
        sharedFleeTargetPoint,
        scatterUntilMs,
      })
    );
  }

  return true;
}
