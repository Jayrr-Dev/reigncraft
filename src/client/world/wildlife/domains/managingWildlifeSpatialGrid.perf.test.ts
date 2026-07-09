import { expectingPerformanceWithinBudget } from '@/components/world/testing/domains/measuringPerformanceBudget';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { describe, it } from 'vitest';

const DEFINING_WILDLIFE_SPATIAL_GRID_PERF_INSTANCE_COUNT = 300;
const DEFINING_WILDLIFE_SPATIAL_GRID_PERF_QUERY_RADIUS_GRID = 8;
const DEFINING_WILDLIFE_SPATIAL_GRID_PERF_QUERIES_PER_SAMPLE = 50;

function buildingSpatialGridPerfInstances(
  count: number
): DefiningWildlifeInstance[] {
  const instances: DefiningWildlifeInstance[] = [];
  const side = Math.ceil(Math.sqrt(count));

  for (let index = 0; index < count; index += 1) {
    const x = (index % side) * 2;
    const y = Math.floor(index / side) * 2;
    const instanceId = `perf-${index}`;
    instances.push(
      creatingWildlifeTestInstance({
        instanceId,
        anchorId: instanceId,
        speciesId: 'deer',
        spawnAnchor: { x, y, layer: 1 },
        position: { x, y, layer: 1 },
      })
    );
  }

  return instances;
}

describe('managingWildlifeSpatialGrid performance', () => {
  const instances = buildingSpatialGridPerfInstances(
    DEFINING_WILDLIFE_SPATIAL_GRID_PERF_INSTANCE_COUNT
  );

  it('builds a 300-instance grid within budget', () => {
    expectingPerformanceWithinBudget(
      {
        name: 'buildingWildlifeSpatialGrid(300)',
        warmupIterations: 20,
        sampleIterations: 80,
        medianBudgetMs: 2,
        percentile95BudgetMs: 5,
      },
      () => {
        buildingWildlifeSpatialGrid(instances);
      }
    );
  });

  it('queries near-point batches within budget', () => {
    const grid = buildingWildlifeSpatialGrid(instances);

    expectingPerformanceWithinBudget(
      {
        name: 'queryingWildlifeInstancesNearPoint×50',
        warmupIterations: 20,
        sampleIterations: 80,
        medianBudgetMs: 2,
        percentile95BudgetMs: 5,
      },
      () => {
        for (
          let queryIndex = 0;
          queryIndex < DEFINING_WILDLIFE_SPATIAL_GRID_PERF_QUERIES_PER_SAMPLE;
          queryIndex += 1
        ) {
          queryingWildlifeInstancesNearPoint({
            grid,
            point: {
              x: (queryIndex * 3) % 40,
              y: (queryIndex * 5) % 40,
            },
            radiusGrid: DEFINING_WILDLIFE_SPATIAL_GRID_PERF_QUERY_RADIUS_GRID,
          });
        }
      }
    );
  });
});
