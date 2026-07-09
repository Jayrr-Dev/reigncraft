/**
 * Startles nearby sleeping animals of the same species when a sleeper is attacked.
 *
 * @module components/world/wildlife/domains/wakingWildlifeNearbySleepersFromHit
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_CHANCE,
  DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';

export type WakingWildlifeNearbySleepersFromHitParams = {
  store: ManagingWildlifeInstanceStore;
  hitInstanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  species: DefiningWildlifeSpeciesDefinition;
  centerPoint: DefiningWorldPlazaWorldPoint;
  threatPoint: DefiningWorldPlazaWorldPoint;
  threatTargetId: string | null;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
  roll?: () => number;
};

/**
 * Rolls wake chance for each nearby sleeping same-species neighbor of a struck sleeper.
 */
export function wakingWildlifeNearbySleepersFromHit({
  store,
  hitInstanceId,
  speciesId,
  species,
  centerPoint,
  threatPoint,
  threatTargetId,
  hazardSampling,
  nowMs,
  roll = Math.random,
}: WakingWildlifeNearbySleepersFromHitParams): void {
  const liveInstances = listingWildlifeInstances(store).filter(
    (entry) => !entry.isDead
  );
  const spatialGrid = buildingWildlifeSpatialGrid(liveInstances);
  const neighbors = queryingWildlifeInstancesNearPoint({
    grid: spatialGrid,
    point: centerPoint,
    radiusGrid: DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_RADIUS_GRID,
    excludeInstanceId: hitInstanceId,
  });

  for (const neighbor of neighbors) {
    if (neighbor.speciesId !== speciesId) {
      continue;
    }

    if (!neighbor.aiState.isSleeping) {
      continue;
    }

    if (
      !checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
        neighbor.healthState,
        nowMs
      )
    ) {
      continue;
    }

    if (roll() >= DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_CHANCE) {
      continue;
    }

    replacingWildlifeInstance(
      store,
      wakingWildlifeFromSleepHit({
        instance: neighbor,
        species,
        threatPoint,
        threatTargetId,
        hazardSampling,
        nowMs,
      })
    );
  }
}
