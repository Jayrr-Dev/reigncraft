/**
 * Makes surviving packmates flee when their alpha is killed.
 *
 * @module components/world/wildlife/domains/applyingWildlifePackAlphaDeathScatter
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import { applyingWildlifeStalkEventToInstance } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackEvent';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
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

function applyingWildlifePackmateAlphaDeathScatter({
  instance,
  species,
  threatPoint,
  hazardSampling,
  nearbyInstances,
  nowMs,
  resolveSpecies,
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
}): DefiningWildlifeInstance {
  const fleeIntent =
    threatPoint !== null
      ? resolvingWildlifeFleeFromThreatPointIntent({
          position: instance.position,
          threatPoint,
          fleeDistanceGrid:
            DEFINING_WILDLIFE_PACK_ALPHA_DEATH_FLEE_DISTANCE_GRID,
          species,
          hazardSampling,
        })
      : { mode: 'idle' as const };

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
            stalkPackResponse: null,
          },
        };

  return {
    ...scattered,
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
 * If the dead instance was the pack alpha, survivors drop aggro and flee.
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
  const packWithDead = listingWildlifeSpawnPackmates({
    instance: deadInstance,
    instances: allInstances,
    includeDead: true,
  });
  const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
    packmates: packWithDead,
    resolveSpecies,
  });

  if (!alphaInstanceId || alphaInstanceId !== deadInstance.instanceId) {
    return false;
  }

  const survivors = listingWildlifeSpawnPackmates({
    instance: deadInstance,
    instances: allInstances,
    includeDead: false,
  }).filter((packmate) => packmate.instanceId !== deadInstance.instanceId);

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
      })
    );
  }

  return survivors.length > 0;
}
