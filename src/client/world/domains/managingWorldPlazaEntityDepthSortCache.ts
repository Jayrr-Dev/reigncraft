/**
 * Per-entity avatar body sort-key cache to skip repeated footprint scans.
 *
 * @module components/world/domains/managingWorldPlazaEntityDepthSortCache
 */

import { DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_CACHE_FOOT_SUM_QUANTIZATION } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
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
  lastFootSumBucket: number;
  lastStandingLayer: number;
  lastAvatarFootOffsetBelowGridAnchorPx: number;
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
    lastFootSumBucket: Number.NaN,
    lastStandingLayer: Number.NaN,
    lastAvatarFootOffsetBelowGridAnchorPx: Number.NaN,
    lastPlacedBlocksRevision: -1,
    lastSortKey: 0,
  };
}

/**
 * Buckets continuous foot depth so within-tile south/north walks invalidate cache.
 */
export function computingWorldPlazaAvatarBodySortCacheFootSumBucket(
  gridPoint: DefiningWorldPlazaWorldPoint
): number {
  return Math.round(
    (gridPoint.x + gridPoint.y) *
      DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_CACHE_FOOT_SUM_QUANTIZATION
  );
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
 * Resolves avatar body sort key, reusing the prior scan when foot depth is unchanged.
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
  const avatarFootOffsetBelowGridAnchorPx =
    context.avatarFootOffsetBelowGridAnchorPx ?? 0;
  const footSumBucket =
    computingWorldPlazaAvatarBodySortCacheFootSumBucket(gridPoint);

  if (
    cache.lastCenterTileX === centerTileX &&
    cache.lastCenterTileY === centerTileY &&
    cache.lastFootSumBucket === footSumBucket &&
    cache.lastStandingLayer === standingLayer &&
    cache.lastAvatarFootOffsetBelowGridAnchorPx ===
      avatarFootOffsetBelowGridAnchorPx &&
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
  cache.lastFootSumBucket = footSumBucket;
  cache.lastStandingLayer = standingLayer;
  cache.lastAvatarFootOffsetBelowGridAnchorPx =
    avatarFootOffsetBelowGridAnchorPx;
  cache.lastPlacedBlocksRevision = placedBlocksRevision;
  cache.lastSortKey = sortKey;
  return sortKey;
}

/**
 * Assigns zIndex only when the sort key changed (avoids parent re-sort).
 * When it does change, marks the parent dirty and sorts immediately so avatar
 * ↔ placed-block order updates this frame (Pixi also sorts on collect, but
 * other systems in this repo call sortChildren after imperative zIndex writes).
 */
export function applyingWorldPlazaCachedDisplayObjectZIndex(
  displayObject: {
    zIndex: number;
    parent?: { sortableChildren?: boolean; sortChildren?: () => void } | null;
  },
  sortKey: number,
  previousSortKeyRef: { current: number }
): boolean {
  if (previousSortKeyRef.current === sortKey) {
    return false;
  }

  previousSortKeyRef.current = sortKey;
  displayObject.zIndex = sortKey;

  const parent = displayObject.parent;
  if (parent?.sortableChildren && typeof parent.sortChildren === 'function') {
    parent.sortChildren();
  }

  return true;
}
