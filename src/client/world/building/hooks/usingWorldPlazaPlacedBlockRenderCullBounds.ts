'use client';

import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_RADIUS_TILES,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_SNAP_TILES,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlockRenderCullConstants';
import {
  buildingWorldPlazaVisibleTileBoundsCacheKey,
  type DefiningWorldPlazaVisibleTileBounds,
} from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useRef, useState, type RefObject } from 'react';

/**
 * Snapped Chebyshev cull bounds for placed-block Graphics columns.
 *
 * @module components/world/building/hooks/usingWorldPlazaPlacedBlockRenderCullBounds
 */

function resolvingWorldPlazaPlacedBlockRenderCullBoundsFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint
): DefiningWorldPlazaVisibleTileBounds {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);
  const snap = DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_SNAP_TILES;
  const snappedTileX = Math.round(standingTile.tileX / snap) * snap;
  const snappedTileY = Math.round(standingTile.tileY / snap) * snap;
  const radius = DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_RADIUS_TILES;

  return {
    minTileX: snappedTileX - radius,
    maxTileX: snappedTileX + radius,
    minTileY: snappedTileY - radius,
    maxTileY: snappedTileY + radius,
  };
}

/**
 * Tracks a snapped tile window around the local player for column mount culling.
 */
export function usingWorldPlazaPlacedBlockRenderCullBounds(
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>
): DefiningWorldPlazaVisibleTileBounds {
  const [cullBounds, setCullBounds] = useState(() =>
    resolvingWorldPlazaPlacedBlockRenderCullBoundsFromGridPoint(
      playerPositionRef.current ?? { x: 0, y: 0 }
    )
  );
  const lastBoundsKeyRef = useRef(
    buildingWorldPlazaVisibleTileBoundsCacheKey(cullBounds)
  );

  usingWorldPlazaSafeTick(() => {
    const nextBounds =
      resolvingWorldPlazaPlacedBlockRenderCullBoundsFromGridPoint(
        playerPositionRef.current ?? { x: 0, y: 0 }
      );
    const nextKey = buildingWorldPlazaVisibleTileBoundsCacheKey(nextBounds);

    if (nextKey === lastBoundsKeyRef.current) {
      return;
    }

    lastBoundsKeyRef.current = nextKey;
    setCullBounds(nextBounds);
  }, 'tick:placed-block-render-cull');

  return cullBounds;
}
