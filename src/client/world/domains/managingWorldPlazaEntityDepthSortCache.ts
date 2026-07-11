/**
 * Per-entity avatar body sort-key cache to skip repeated footprint scans.
 *
 * @module components/world/domains/managingWorldPlazaEntityDepthSortCache
 */

import type { DefiningWorldDepthProviderContext } from '@/components/world/depth/domains/definingWorldDepthProvider';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { incrementingWorldPlazaPerformanceDiagnosticsCounter } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/** Mutable cache entry for one moving entity. */
export type ManagingWorldPlazaEntityDepthSortCache = {
  lastCenterTileX: number;
  lastCenterTileY: number;
  lastStandingLayer: number;
  lastPlacedBlocksRevision: number;
  lastSortKey: number;
};

/**
 * Returns a fresh depth-sort cache entry.
 */
export function creatingWorldPlazaEntityDepthSortCache(): ManagingWorldPlazaEntityDepthSortCache {
  return {
    lastCenterTileX: Number.NaN,
    lastCenterTileY: Number.NaN,
    lastStandingLayer: Number.NaN,
    lastPlacedBlocksRevision: -1,
    lastSortKey: 0,
  };
}

/**
 * Cheap fingerprint for placed-block layout changes near occlusion providers.
 */
export function computingWorldPlazaPlacedBlocksDepthRevision(
  placedBlockCount: number,
  lastPlacedBlockId: string | undefined
): number {
  let revision = placedBlockCount;

  if (lastPlacedBlockId) {
    for (let index = 0; index < lastPlacedBlockId.length; index += 1) {
      revision = (revision * 31 + lastPlacedBlockId.charCodeAt(index)) | 0;
    }
  }

  return revision;
}

/**
 * Resolves avatar body sort key, reusing the prior scan when the foot tile is unchanged.
 */
export function resolvingWorldPlazaCachedAvatarBodySortKey(
  gridPoint: DefiningWorldPlazaWorldPoint,
  cache: ManagingWorldPlazaEntityDepthSortCache,
  context: DefiningWorldDepthProviderContext,
  placedBlocksRevision: number
): number {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);

  if (
    cache.lastCenterTileX === centerTileX &&
    cache.lastCenterTileY === centerTileY &&
    cache.lastStandingLayer === standingLayer &&
    cache.lastPlacedBlocksRevision === placedBlocksRevision
  ) {
    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.ENTITY_DEPTH_CACHE_HIT
    );
    return cache.lastSortKey;
  }

  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.ENTITY_DEPTH_CACHE_MISS
  );

  const sortKey = resolvingWorldDepthAvatarBodySortKey(gridPoint, context);
  cache.lastCenterTileX = centerTileX;
  cache.lastCenterTileY = centerTileY;
  cache.lastStandingLayer = standingLayer;
  cache.lastPlacedBlocksRevision = placedBlocksRevision;
  cache.lastSortKey = sortKey;
  return sortKey;
}

/**
 * Assigns zIndex only when the sort key changed (avoids parent re-sort).
 */
export function applyingWorldPlazaCachedDisplayObjectZIndex(
  displayObject: { zIndex: number },
  sortKey: number,
  previousSortKeyRef: { current: number }
): boolean {
  if (previousSortKeyRef.current === sortKey) {
    return false;
  }

  previousSortKeyRef.current = sortKey;
  displayObject.zIndex = sortKey;
  return true;
}
