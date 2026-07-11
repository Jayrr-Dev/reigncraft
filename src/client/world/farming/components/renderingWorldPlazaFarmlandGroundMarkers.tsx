'use client';

import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { advancingWorldPlazaFarmlandGrowthPhases } from '@/components/world/farming/domains/advancingWorldPlazaFarmlandGrowthPhases';
import {
  DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_BY_PHASE,
  DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_WIDTH_PX,
} from '@/components/world/farming/domains/definingWorldPlazaFarmlandGroundMarkerPresentation';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export type RenderingWorldPlazaFarmlandGroundMarkersProps = {
  readonly farmlandByTileKeyRef: React.RefObject<
    ReadonlyMap<string, DefiningWorldPlazaFarmlandTileState>
  >;
  readonly revision?: number;
};

function parsingFarmlandTileKey(
  tileKey: string
): { tileX: number; tileY: number } | null {
  const [tileXRaw, tileYRaw] = tileKey.split(',');

  if (!tileXRaw || !tileYRaw) {
    return null;
  }

  const tileX = Number(tileXRaw);
  const tileY = Number(tileYRaw);

  if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) {
    return null;
  }

  return { tileX, tileY };
}

function drawingFarmlandDiamondOnGraphics(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  presentation: (typeof DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_BY_PHASE)[keyof typeof DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_BY_PHASE]
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_HALF_HEIGHT_PX;
  const liftY = -presentation.heightPx;

  graphics.moveTo(centerX, centerY + liftY - halfHeight);
  graphics.lineTo(centerX + halfWidth, centerY + liftY);
  graphics.lineTo(centerX, centerY + liftY + halfHeight);
  graphics.lineTo(centerX - halfWidth, centerY + liftY);
  graphics.closePath();
  graphics.fill({
    color: presentation.fillColor,
    alpha: presentation.fillAlpha,
  });
  graphics.stroke({
    color: presentation.outlineColor,
    alpha: presentation.outlineAlpha,
    width: 1,
  });
}

/**
 * Simple isometric ground markers for tilled soil and crop growth stages.
 */
export function RenderingWorldPlazaFarmlandGroundMarkers({
  farmlandByTileKeyRef,
  revision = 0,
}: RenderingWorldPlazaFarmlandGroundMarkersProps): React.JSX.Element {
  const graphicsRef = useRef<Graphics | null>(null);
  const lastRenderedRevisionRef = useRef(-1);

  const drawingFarmlandMarkers = useCallback((graphics: Graphics): void => {
    graphicsRef.current = graphics;
  }, []);

  usingWorldPlazaSafeTick(() => {
    const graphics = graphicsRef.current;
    const farmlandByTileKey = farmlandByTileKeyRef.current;

    if (!graphics || lastRenderedRevisionRef.current === revision) {
      return;
    }

    lastRenderedRevisionRef.current = revision;
    graphics.clear();

    if (!farmlandByTileKey || farmlandByTileKey.size === 0) {
      return;
    }

    const nowMs = performance.now();

    for (const [tileKey, storedState] of farmlandByTileKey.entries()) {
      const tileCoords = parsingFarmlandTileKey(tileKey);

      if (!tileCoords) {
        continue;
      }

      const tileState = advancingWorldPlazaFarmlandGrowthPhases(
        storedState,
        nowMs
      );
      const presentation =
        DEFINING_WORLD_PLAZA_FARMLAND_GROUND_MARKER_BY_PHASE[tileState.phase];
      const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: tileCoords.tileX + 0.5,
        y: tileCoords.tileY + 0.5,
      });

      drawingFarmlandDiamondOnGraphics(
        graphics,
        screenPoint.x,
        screenPoint.y,
        presentation
      );
    }
  }, 'tick:farmland-markers');

  return <pixiGraphics draw={drawingFarmlandMarkers} eventMode="none" />;
}
