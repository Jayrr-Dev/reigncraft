import { computingWorldPlazaCameraZoomedViewportWorldLocalSizePx } from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { resolvingWorldPlazaCameraVisibleTileBoundsWorldZoom } from '@/components/world/domains/resolvingWorldPlazaCameraVisibleTileBoundsWorldZoom';

/**
 * Estimates visible tile indices around a grid center for an isometric viewport.
 *
 * @param centerGridX - Player grid X.
 * @param centerGridY - Player grid Y.
 * @param viewportWidthPx - Canvas width (pixels).
 * @param viewportHeightPx - Canvas height (pixels).
 * @param paddingTiles - Extra tile rings beyond the viewport edge.
 * @param boundsCenterSnapTiles - Quantizes the bounds center so sync runs in
 *   steps while the player moves (matches floor chunk size in practice).
 * @param worldZoom - Effective world-container zoom for bounds estimation.
 */
export function resolvingWorldPlazaVisibleIsometricTileBounds(
  centerGridX: number,
  centerGridY: number,
  viewportWidthPx: number,
  viewportHeightPx: number,
  paddingTiles: number,
  boundsCenterSnapTiles = 1,
  worldZoom = DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM
): DefiningWorldPlazaVisibleTileBounds {
  const snapTiles = Math.max(1, Math.floor(boundsCenterSnapTiles));
  const anchorTileX = Math.floor(centerGridX / snapTiles) * snapTiles;
  const anchorTileY = Math.floor(centerGridY / snapTiles) * snapTiles;
  const boundsCenterX = anchorTileX + snapTiles / 2;
  const boundsCenterY = anchorTileY + snapTiles / 2;
  const boundsWorldZoom =
    resolvingWorldPlazaCameraVisibleTileBoundsWorldZoom(worldZoom);

  const worldLocalViewportWidthPx =
    computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(
      viewportWidthPx,
      boundsWorldZoom
    );
  const worldLocalViewportHeightPx =
    computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(
      viewportHeightPx,
      boundsWorldZoom
    );
  const horizontalTiles = Math.ceil(
    worldLocalViewportWidthPx /
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX
  );
  const verticalTiles = Math.ceil(
    worldLocalViewportHeightPx /
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX
  );
  // Snap shifts the bounds center up to snapTiles/2 away from the live player.
  // Without compensating, that side of the screen loses cover and shows the
  // jagged chunk edge against the void (especially tall mobile viewports).
  const snapCenterDriftTiles = Math.floor(snapTiles / 2);
  const gridRadius =
    Math.ceil((horizontalTiles + verticalTiles) / 2) +
    Math.max(0, paddingTiles) +
    snapCenterDriftTiles;

  return {
    minTileX: Math.floor(boundsCenterX) - gridRadius,
    maxTileX: Math.ceil(boundsCenterX) + gridRadius,
    minTileY: Math.floor(boundsCenterY) - gridRadius,
    maxTileY: Math.ceil(boundsCenterY) + gridRadius,
  };
}
