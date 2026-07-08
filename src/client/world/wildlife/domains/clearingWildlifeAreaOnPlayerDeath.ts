/**
 * Despawns nearby wildlife and releases player aggro on death.
 *
 * @module components/world/wildlife/domains/clearingWildlifeAreaOnPlayerDeath
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { releasingWildlifeInstancePlayerAggro } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_SIM_RADIUS_GRID,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ClearingWildlifeAreaOnPlayerDeathParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  playerUserId: string | null;
  nowMs: number;
  clearRadiusGrid?: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function checkingWildlifePointWithinRadius(
  point: DefiningWorldPlazaWorldPoint,
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number
): boolean {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;

  return deltaX * deltaX + deltaY * deltaY <= radiusGrid * radiusGrid;
}

/**
 * Removes wildlife inside the clear radius and drops player threat elsewhere.
 */
export function clearingWildlifeAreaOnPlayerDeath({
  store,
  center,
  playerUserId,
  nowMs,
  clearRadiusGrid = DEFINING_WILDLIFE_SIM_RADIUS_GRID,
  resolveSpecies,
}: ClearingWildlifeAreaOnPlayerDeathParams): void {
  const instanceIdsToRemove: string[] = [];

  for (const [instanceId, instance] of store.instances) {
    if (
      checkingWildlifePointWithinRadius(
        instance.position,
        center,
        clearRadiusGrid
      )
    ) {
      instanceIdsToRemove.push(instanceId);
      continue;
    }

    if (!playerUserId) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species) {
      continue;
    }

    store.instances.set(
      instanceId,
      releasingWildlifeInstancePlayerAggro(
        instance,
        playerUserId,
        species.aggro.targetSwitchMargin,
        nowMs
      )
    );
  }

  for (const instanceId of instanceIdsToRemove) {
    store.instances.delete(instanceId);
    store.knownAnchorIds.delete(instanceId);
  }
}
