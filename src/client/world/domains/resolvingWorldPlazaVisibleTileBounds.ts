import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";

/**
 * Resolves which tile indices should be drawn around the player viewport.
 *
 * @param centerWorldX - Player world X (pixels).
 * @param centerWorldY - Player world Y (pixels).
 * @param viewportWidthPx - Canvas width (pixels).
 * @param viewportHeightPx - Canvas height (pixels).
 * @param paddingTiles - Extra tiles beyond the viewport edge.
 * @param tileSizePx - Tile edge length (pixels).
 */
export function resolvingWorldPlazaVisibleTileBounds(
  centerWorldX: number,
  centerWorldY: number,
  viewportWidthPx: number,
  viewportHeightPx: number,
  paddingTiles: number,
  tileSizePx: number,
): DefiningWorldPlazaVisibleTileBounds {
  const minTileX =
    Math.floor((centerWorldX - viewportWidthPx / 2) / tileSizePx) -
    paddingTiles;
  const maxTileX =
    Math.ceil((centerWorldX + viewportWidthPx / 2) / tileSizePx) +
    paddingTiles;
  const minTileY =
    Math.floor((centerWorldY - viewportHeightPx / 2) / tileSizePx) -
    paddingTiles;
  const maxTileY =
    Math.ceil((centerWorldY + viewportHeightPx / 2) / tileSizePx) +
    paddingTiles;

  return {
    minTileX,
    maxTileX,
    minTileY,
    maxTileY,
  };
}
