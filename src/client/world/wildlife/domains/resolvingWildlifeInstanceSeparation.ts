/**
 * Hard circle push-out between live wildlife instances.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceSeparation
 */

import {
  DEFINING_WILDLIFE_INSTANCE_SEPARATION_GAP_GRID,
  DEFINING_WILDLIFE_INSTANCE_SEPARATION_PASS_COUNT,
  DEFINING_WILDLIFE_INSTANCE_SEPARATION_QUERY_RADIUS_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeCollisionConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
  type ManagingWildlifeSpatialGrid,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';

export type ResolvingWildlifeInstanceSeparationParams = {
  instances: Map<string, DefiningWildlifeInstance>;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function listingWildlifeSeparationCandidates(
  instances: Map<string, DefiningWildlifeInstance>
): DefiningWildlifeInstance[] {
  const candidates: DefiningWildlifeInstance[] = [];

  for (const instance of instances.values()) {
    if (instance.isDead || instance.aiState.jumpState) {
      continue;
    }

    candidates.push(instance);
  }

  return candidates;
}

function resolvingWildlifeSeparationDirection(
  deltaX: number,
  deltaY: number,
  leftInstanceId: string,
  rightInstanceId: string
): { x: number; y: number } {
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > 0.0001) {
    return { x: deltaX / distance, y: deltaY / distance };
  }

  if (leftInstanceId < rightInstanceId) {
    return { x: 1, y: 0 };
  }

  return { x: -1, y: 0 };
}

function applyingWildlifeInstanceSeparationPass({
  instances,
  spatialGrid,
  resolveSpecies,
}: {
  instances: Map<string, DefiningWildlifeInstance>;
  spatialGrid: ManagingWildlifeSpatialGrid;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
}): void {
  const candidates = listingWildlifeSeparationCandidates(instances);

  for (const instance of candidates) {
    const species = resolveSpecies(instance.speciesId);

    if (!species) {
      continue;
    }

    const liveInstance = instances.get(instance.instanceId) ?? instance;
    const neighbors = queryingWildlifeInstancesNearPoint({
      grid: spatialGrid,
      point: liveInstance.position,
      radiusGrid: DEFINING_WILDLIFE_INSTANCE_SEPARATION_QUERY_RADIUS_GRID,
      excludeInstanceId: liveInstance.instanceId,
    });

    for (const neighbor of neighbors) {
      if (neighbor.instanceId <= liveInstance.instanceId) {
        continue;
      }

      if (neighbor.isDead || neighbor.aiState.jumpState) {
        continue;
      }

      const neighborSpecies = resolveSpecies(neighbor.speciesId);

      if (!neighborSpecies) {
        continue;
      }

      const liveNeighbor = instances.get(neighbor.instanceId) ?? neighbor;
      const minSeparation =
        species.collisionRadiusGrid +
        neighborSpecies.collisionRadiusGrid +
        DEFINING_WILDLIFE_INSTANCE_SEPARATION_GAP_GRID;
      const deltaX = liveNeighbor.position.x - liveInstance.position.x;
      const deltaY = liveNeighbor.position.y - liveInstance.position.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance >= minSeparation) {
        continue;
      }

      const overlap = minSeparation - distance;
      const direction = resolvingWildlifeSeparationDirection(
        deltaX,
        deltaY,
        liveInstance.instanceId,
        liveNeighbor.instanceId
      );
      const halfPush = overlap * 0.5;

      instances.set(liveInstance.instanceId, {
        ...liveInstance,
        position: {
          x: liveInstance.position.x - direction.x * halfPush,
          y: liveInstance.position.y - direction.y * halfPush,
          layer: liveInstance.position.layer,
        },
      });
      instances.set(liveNeighbor.instanceId, {
        ...liveNeighbor,
        position: {
          x: liveNeighbor.position.x + direction.x * halfPush,
          y: liveNeighbor.position.y + direction.y * halfPush,
          layer: liveNeighbor.position.layer,
        },
      });
    }
  }
}

/**
 * Pushes overlapping animals apart so they cannot stack on the same spot.
 */
export function resolvingWildlifeInstanceSeparation({
  instances,
  resolveSpecies,
}: ResolvingWildlifeInstanceSeparationParams): void {
  for (
    let pass = 0;
    pass < DEFINING_WILDLIFE_INSTANCE_SEPARATION_PASS_COUNT;
    pass += 1
  ) {
    const spatialGrid = buildingWildlifeSpatialGrid(
      listingWildlifeSeparationCandidates(instances)
    );

    applyingWildlifeInstanceSeparationPass({
      instances,
      spatialGrid,
      resolveSpecies,
    });
  }
}
