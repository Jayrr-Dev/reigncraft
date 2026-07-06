/**
 * Spatial hash for wildlife neighbor queries.
 *
 * @module components/world/wildlife/domains/managingWildlifeSpatialGrid
 */

import { DEFINING_WILDLIFE_SPATIAL_CELL_SIZE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ManagingWildlifeSpatialGrid = {
  cellSize: number;
  cells: Map<string, DefiningWildlifeInstance[]>;
};

function gettingWildlifeSpatialCellKey(
  x: number,
  y: number,
  cellSize: number
): string {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);

  return `${cellX},${cellY}`;
}

/**
 * Builds a spatial grid from live wildlife instances.
 */
export function buildingWildlifeSpatialGrid(
  instances: readonly DefiningWildlifeInstance[],
  cellSize = DEFINING_WILDLIFE_SPATIAL_CELL_SIZE_GRID
): ManagingWildlifeSpatialGrid {
  const cells = new Map<string, DefiningWildlifeInstance[]>();

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    const key = gettingWildlifeSpatialCellKey(
      instance.position.x,
      instance.position.y,
      cellSize
    );
    const bucket = cells.get(key);

    if (bucket) {
      bucket.push(instance);
    } else {
      cells.set(key, [instance]);
    }
  }

  return { cellSize, cells };
}

export type QueryingWildlifeInstancesNearPointParams = {
  grid: ManagingWildlifeSpatialGrid;
  point: { x: number; y: number };
  radiusGrid: number;
  excludeInstanceId?: string;
};

/**
 * Returns live instances within `radiusGrid` of `point`.
 */
export function queryingWildlifeInstancesNearPoint({
  grid,
  point,
  radiusGrid,
  excludeInstanceId,
}: QueryingWildlifeInstancesNearPointParams): DefiningWildlifeInstance[] {
  const { cellSize, cells } = grid;
  const radiusSquared = radiusGrid * radiusGrid;
  const minCellX = Math.floor((point.x - radiusGrid) / cellSize);
  const maxCellX = Math.floor((point.x + radiusGrid) / cellSize);
  const minCellY = Math.floor((point.y - radiusGrid) / cellSize);
  const maxCellY = Math.floor((point.y + radiusGrid) / cellSize);
  const result: DefiningWildlifeInstance[] = [];

  for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
    for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
      const bucket = cells.get(`${cellX},${cellY}`);

      if (!bucket) {
        continue;
      }

      for (const instance of bucket) {
        if (excludeInstanceId && instance.instanceId === excludeInstanceId) {
          continue;
        }

        const deltaX = instance.position.x - point.x;
        const deltaY = instance.position.y - point.y;

        if (deltaX * deltaX + deltaY * deltaY <= radiusSquared) {
          result.push(instance);
        }
      }
    }
  }

  return result;
}
