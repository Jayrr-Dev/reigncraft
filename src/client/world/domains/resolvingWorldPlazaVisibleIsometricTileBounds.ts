import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { computingWorldPlazaCameraZoomedViewportWorldLocalSizePx } from "@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";

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
 */
export function resolvingWorldPlazaVisibleIsometricTileBounds(
  centerGridX: number,
  centerGridY: number,
  viewportWidthPx: number,
  viewportHeightPx: number,
  paddingTiles: number,
  boundsCenterSnapTiles = 1,
): DefiningWorldPlazaVisibleTileBounds {
  const snapTiles = Math.max(1, Math.floor(boundsCenterSnapTiles));
  const anchorTileX = Math.floor(centerGridX / snapTiles) * snapTiles;
  const anchorTileY = Math.floor(centerGridY / snapTiles) * snapTiles;
  const boundsCenterX = anchorTileX + snapTiles / 2;
  const boundsCenterY = anchorTileY + snapTiles / 2;

  const worldLocalViewportWidthPx =
    computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(viewportWidthPx);
  const worldLocalViewportHeightPx =
    computingWorldPlazaCameraZoomedViewportWorldLocalSizePx(viewportHeightPx);
  const horizontalTiles = Math.ceil(
    worldLocalViewportWidthPx / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  );
  const verticalTiles = Math.ceil(
    worldLocalViewportHeightPx / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  );
  const gridRadius =
    Math.ceil((horizontalTiles + verticalTiles) / 2) + paddingTiles;

  return {
    minTileX: Math.floor(boundsCenterX) - gridRadius,
    maxTileX: Math.ceil(boundsCenterX) + gridRadius,
    minTileY: Math.floor(boundsCenterY) - gridRadius,
    maxTileY: Math.ceil(boundsCenterY) + gridRadius,
  };
}
