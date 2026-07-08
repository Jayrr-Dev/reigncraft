/**
 * Applies a pack-wide flee or enrage response to stalking hunters.
 *
 * @module components/world/wildlife/domains/applyingWildlifeStalkPackDamageResponse
 */

import { releasingWildlifeAggroOnTarget } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPackResponseKind,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeAggroLastAggroedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeStalkPackDamageResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackDamageResponse';

export type ApplyingWildlifeStalkPackDamageResponseParams = {
  store: ManagingWildlifeInstanceStore;
  damagedInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function applyingWildlifeStalkPackResponseToInstance(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  preyTargetId: string,
  response: DefiningWildlifeStalkPackResponseKind,
  nowMs: number
): DefiningWildlifeInstance {
  if (response === 'flee') {
    const releasedAggro = releasingWildlifeAggroOnTarget(
      instance.aggroState,
      preyTargetId,
      species.aggro.targetSwitchMargin,
      nowMs
    );

    return {
      ...instance,
      aggroState: {
        ...releasedAggro,
        stalkPackResponse: 'flee',
        stalkingPreySinceMs: null,
        stalkAttackingPreySinceMs: null,
      },
      aiState: {
        ...instance.aiState,
        intent: { mode: 'idle' },
        fleeTargetPoint: null,
        chargeWindupStartedAtMs: null,
        steeringCache: null,
      },
    };
  }

  const nextThreats = [
    ...instance.aggroState.threats.filter(
      (entry) => entry.targetId !== preyTargetId
    ),
    {
      targetId: preyTargetId,
      threat: Math.max(
        DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
        ...instance.aggroState.threats.map((entry) => entry.threat),
        0
      ),
      lastUpdatedAtMs: nowMs,
    },
  ];

  return {
    ...instance,
    aggroState: {
      ...instance.aggroState,
      threats: nextThreats,
      activeTargetId: preyTargetId,
      lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
        instance.aggroState.lastAggroedAtMs,
        preyTargetId,
        nowMs
      ),
      stalkPackResponse: 'enrage',
      stalkAttackingPreySinceMs: null,
      stalkingPreySinceMs: instance.aggroState.stalkingPreySinceMs ?? nowMs,
    },
  };
}

/**
 * Rolls once per pack and applies flee or full attack to every hunting stalker.
 */
export function applyingWildlifeStalkPackDamageResponse({
  store,
  damagedInstance,
  species,
  preyTargetId,
  nearbyInstances,
  nowMs,
  resolveSpecies,
}: ApplyingWildlifeStalkPackDamageResponseParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: damagedInstance,
    nearbyInstances,
    preyTargetId,
  });

  if (packmates.length === 0) {
    return;
  }

  const existingResponse = packmates.find(
    (packmate) => packmate.aggroState.stalkPackResponse
  )?.aggroState.stalkPackResponse;
  const response =
    existingResponse ?? resolvingWildlifeStalkPackDamageResponse(packmates);

  for (const packmate of packmates) {
    const packmateSpecies = resolveSpecies(packmate.speciesId);

    if (!packmateSpecies) {
      continue;
    }

    const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkPackResponseToInstance(
        livePackmate,
        packmateSpecies,
        preyTargetId,
        response,
        nowMs
      )
    );
  }

  for (const instance of listingWildlifeInstances(store)) {
    if (
      instance.isDead ||
      instance.speciesId !== damagedInstance.speciesId ||
      instance.aggroState.activeTargetId !== preyTargetId ||
      instance.aggroState.stalkPackResponse
    ) {
      continue;
    }

    if (
      packmates.some((packmate) => packmate.instanceId === instance.instanceId)
    ) {
      continue;
    }

    const distantSpecies = resolveSpecies(instance.speciesId);

    if (!distantSpecies) {
      continue;
    }

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkPackResponseToInstance(
        instance,
        distantSpecies,
        preyTargetId,
        response,
        nowMs
      )
    );
  }
}
