/**
 * Pulls nearby same-species adults into combat when a baby is hurt.
 *
 * @module components/world/wildlife/domains/applyingWildlifeDefendYoungDamageResponse
 */

import { sharingWildlifePackThreat } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { checkingWildlifeInstanceMayDefendYoung } from '@/components/world/wildlife/domains/checkingWildlifeInstanceMayDefendYoung';
import { checkingWildlifeStalkPhaseIsFleeing } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { DEFINING_WILDLIFE_DEFEND_YOUNG_THREAT_SHARE_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeDefendYoungConstants';
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

export type ApplyingWildlifeDefendYoungDamageResponseParams = {
  store: ManagingWildlifeInstanceStore;
  damagedInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  attackerTargetId: string;
  sharedThreat: number;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function resolvingWildlifeDefendYoungAllies({
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
    excludeInstanceId: damagedInstance.instanceId,
  });

  return nearbyInstances.filter(
    (neighbor) => neighbor.speciesId === damagedInstance.speciesId
  );
}

/**
 * Shares boosted threat with nearby adults so they chase/attack the baby-hurter.
 * Returns how many adults joined the defense.
 */
export function applyingWildlifeDefendYoungDamageResponse({
  store,
  damagedInstance,
  species,
  attackerTargetId,
  sharedThreat,
  nowMs,
  resolveSpecies,
}: ApplyingWildlifeDefendYoungDamageResponseParams): number {
  const allies = resolvingWildlifeDefendYoungAllies({
    store,
    damagedInstance,
    species,
  });
  const defendThreat =
    sharedThreat * DEFINING_WILDLIFE_DEFEND_YOUNG_THREAT_SHARE_MULTIPLIER;
  let affectedCount = 0;

  for (const ally of allies) {
    const allySpecies = resolveSpecies(ally.speciesId);

    if (
      !allySpecies ||
      !checkingWildlifeInstanceMayDefendYoung({
        instance: ally,
        species: allySpecies,
        victimInstanceId: damagedInstance.instanceId,
        victimSpeciesId: damagedInstance.speciesId,
      })
    ) {
      continue;
    }

    if (
      (allySpecies.temperamentId === 'pack_hunter' ||
        allySpecies.temperamentId === 'stalker') &&
      checkingWildlifeStalkPhaseIsFleeing(ally.aggroState)
    ) {
      continue;
    }

    const liveAlly = store.instances.get(ally.instanceId) ?? ally;
    const withThreat = sharingWildlifePackThreat(
      liveAlly,
      species,
      attackerTargetId,
      defendThreat,
      nowMs
    );

    const clearedFleeIntent =
      withThreat.aiState.intent.mode === 'flee'
        ? ({ mode: 'idle' } as const)
        : withThreat.aiState.intent;

    replacingWildlifeInstance(store, {
      ...withThreat,
      aggroState: {
        ...withThreat.aggroState,
        defendingYoungUntilMs: nowMs,
      },
      aiState: {
        ...withThreat.aiState,
        fleeTargetPoint: null,
        startledUntilMs: null,
        chargeWindupStartedAtMs: null,
        steeringCache: null,
        intent: clearedFleeIntent,
      },
    });
    affectedCount += 1;
  }

  return affectedCount;
}
