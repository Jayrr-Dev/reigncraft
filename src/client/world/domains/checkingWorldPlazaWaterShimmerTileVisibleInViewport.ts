import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';

/** Live camera viewport used to cull water shimmer tiles. */
export type CheckingWorldPlazaWaterShimmerTileVisibleViewport = {
  readonly cameraOffset: DefiningWorldPlazaCameraOffset;
  readonly widthPx: number;
  readonly heightPx: number;
  readonly worldZoom: number;
};

/**
 * Checks whether any part of an isometric tile intersects the live screen.
 */
export function checkingWorldPlazaWaterShimmerTileVisibleInViewport(
  tileCenterWorldLocalX: number,
  tileCenterWorldLocalY: number,
  viewport: CheckingWorldPlazaWaterShimmerTileVisibleViewport
): boolean {
  const centerViewportX =
    tileCenterWorldLocalX * viewport.worldZoom + viewport.cameraOffset.x;
  const centerViewportY =
    tileCenterWorldLocalY * viewport.worldZoom + viewport.cameraOffset.y;
  const halfTileWidthPx =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX * viewport.worldZoom;
  const halfTileHeightPx =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * viewport.worldZoom;

  return (
    centerViewportX + halfTileWidthPx >= 0 &&
    centerViewportX - halfTileWidthPx <= viewport.widthPx &&
    centerViewportY + halfTileHeightPx >= 0 &&
    centerViewportY - halfTileHeightPx <= viewport.heightPx
  );
}
