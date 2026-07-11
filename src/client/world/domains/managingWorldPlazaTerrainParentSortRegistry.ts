/**
 * Tracks terrain parent containers that need one batched sort per tick.
 *
 * @module components/world/domains/managingWorldPlazaTerrainParentSortRegistry
 */

import type { Container } from 'pixi.js';

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/** Parents marked dirty during one terrain tick. */
export type ManagingWorldPlazaTerrainParentSortRegistry = {
  readonly dirtyParents: Set<Container>;
};

/**
 * Creates an empty parent-sort registry for one terrain tick.
 */
export function creatingWorldPlazaTerrainParentSortRegistry(): ManagingWorldPlazaTerrainParentSortRegistry {
  return {
    dirtyParents: new Set<Container>(),
  };
}

/**
 * Marks one parent container for a deferred sort at tick end.
 *
 * @param registry - Active tick registry.
 * @param parentContainer - Pixi parent with sortable children.
 */
export function markingWorldPlazaTerrainParentSortDirty(
  registry: ManagingWorldPlazaTerrainParentSortRegistry,
  parentContainer: Container
): void {
  if (!parentContainer.sortableChildren) {
    return;
  }

  registry.dirtyParents.add(parentContainer);
}

/**
 * Sorts each dirty parent at most once and clears the registry.
 *
 * @param registry - Active tick registry.
 */
export function flushingWorldPlazaTerrainParentSortRegistry(
  registry: ManagingWorldPlazaTerrainParentSortRegistry
): void {
  if (registry.dirtyParents.size === 0) {
    return;
  }

  const finishSortSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_PARENT_SORT
  );

  for (const parentContainer of registry.dirtyParents) {
    if (parentContainer.sortableChildren) {
      parentContainer.sortChildren();
    }
  }

  registry.dirtyParents.clear();
  finishSortSample();
}
