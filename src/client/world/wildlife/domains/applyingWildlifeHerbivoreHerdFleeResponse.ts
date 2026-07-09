/**
 * Makes nearby passive herd animals flee in the same direction when one is attacked.
 *
 * @module components/world/wildlife/domains/applyingWildlifeHerbivoreHerdFleeResponse
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { sharingWildlifePackThreat } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { checkingWildlifeStalkPhaseIsFleeing } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { checkingWildlifeInstanceJoinsHerdFlee } from '@/components/world/wildlife/domains/checkingWildlifeHerbivoreHasHerdFleeTemperament';
import { DEFINING_WILDLIFE_HERD_FLEE_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { resolvingWildlifeHerdMemberFleeDirection } from '@/components/world/wildlife/domains/resolvingWildlifeHerdMemberFleeDirection';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ApplyingWildlifeHerbivoreHerdFleeResponseParams = {
  store: ManagingWildlifeInstanceStore;
  damagedInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  attackerTargetId: string;
  threatPoint: DefiningWorldPlazaWorldPoint;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  sharedThreat: number;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function applyingWildlifeHerdMemberFleeResponse(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  threatPoint: DefiningWorldPlazaWorldPoint,
  herdAnchorPosition: DefiningWorldPlazaWorldPoint,
  hazardSampling: ResolvingWildlifeSteeringHazardSampling
): DefiningWildlifeInstance {
  const fleeDirection = resolvingWildlifeHerdMemberFleeDirection({
    memberPosition: instance.position,
    herdAnchorPosition,
    threatPoint,
  });
  const fleeIntent = resolvingWildlifeFleeFromThreatPointIntent({
    position: instance.position,
    threatPoint,
    fleeDistanceGrid: DEFINING_WILDLIFE_HERD_FLEE_DISTANCE_GRID,
    species,
    hazardSampling,
    preferredFleeDirection: fleeDirection,
  });

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      intent: fleeIntent,
      fleeTargetPoint:
        fleeIntent.mode === 'flee' ? (fleeIntent.targetPoint ?? null) : null,
      chargeWindupStartedAtMs: null,
      steeringCache: null,
    },
  };
}

function resolvingWildlifeHerdFleeMembers({
  store,
  damagedInstance,
  species,
}: {
  store: ManagingWildlifeInstanceStore;
  damagedInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
}): DefiningWildlifeInstance[] {
  const liveInstances = listingWildlifeInstances(store).filter(
    (entry) => !entry.isDead
  );
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
  const nearbyInstances = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: damagedInstance.position,
    radiusGrid: species.aggro.packShareRadiusGrid,
  });

  const herdMembers = new Map<string, DefiningWildlifeInstance>();

  herdMembers.set(damagedInstance.instanceId, damagedInstance);

  for (const neighbor of nearbyInstances) {
    if (neighbor.speciesId !== damagedInstance.speciesId) {
      continue;
    }

    herdMembers.set(neighbor.instanceId, neighbor);
  }

  return [...herdMembers.values()];
}

/**
 * Shares threat and sets a loosely aligned flee heading for every nearby herd member.
 */
export function applyingWildlifeHerbivoreHerdFleeResponse({
  store,
  damagedInstance,
  species,
  attackerTargetId,
  threatPoint,
  hazardSampling,
  sharedThreat,
  nowMs,
  resolveSpecies,
}: ApplyingWildlifeHerbivoreHerdFleeResponseParams): number {
  const herdMembers = resolvingWildlifeHerdFleeMembers({
    store,
    damagedInstance,
    species,
  });
  let affectedCount = 0;

  for (const herdMember of herdMembers) {
    const memberSpecies = resolveSpecies(herdMember.speciesId);

    if (
      !memberSpecies ||
      !checkingWildlifeInstanceJoinsHerdFlee(memberSpecies, herdMember)
    ) {
      continue;
    }

    if (
      memberSpecies.temperamentId === 'stalker' &&
      checkingWildlifeStalkPhaseIsFleeing(herdMember.aggroState)
    ) {
      continue;
    }

    const liveMember = store.instances.get(herdMember.instanceId) ?? herdMember;
    const withThreat = sharingWildlifePackThreat(
      liveMember,
      species,
      attackerTargetId,
      sharedThreat,
      nowMs
    );
    const fleeingMember = applyingWildlifeHerdMemberFleeResponse(
      withThreat,
      memberSpecies,
      threatPoint,
      damagedInstance.position,
      hazardSampling
    );

    replacingWildlifeInstance(store, fleeingMember);
    affectedCount += 1;
  }

  return affectedCount;
}
