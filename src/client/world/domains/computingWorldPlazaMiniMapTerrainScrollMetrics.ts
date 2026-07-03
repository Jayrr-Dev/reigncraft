import { computingWorldPlazaMiniMapCanvasDeltaFromGridDelta } from "@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint";
import { computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles } from "@/components/world/domains/computingWorldPlazaMiniMapSquareViewportMetrics";
import type { ComputingWorldPlazaMiniMapLayout } from "@/components/world/domains/computingWorldPlazaMiniMapLayout";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Extra tile ring beyond max pan so terrain never exposes the backdrop edge. */
const COMPUTING_WORLD_PLAZA_MINI_MAP_TERRAIN_SCROLL_PADDING_EXTRA_TILES = 1;

/** Metrics for a padded minimap terrain buffer and smooth scroll blit. */
export interface ComputingWorldPlazaMiniMapTerrainScrollMetrics {
  /** Width and height of the offscreen terrain canvas in CSS pixels. */
  readonly terrainCanvasSizePx: number;
  /** Inset from the terrain canvas edge to the visible viewport origin. */
  readonly visibleCanvasInsetPx: number;
  /** Tile radius used when rebuilding the cached terrain layer. */
  readonly buildViewRadiusTiles: number;
  /** Maximum grid offset between live and snapped terrain centers. */
  readonly maxPanGridUnits: number;
}

/**
 * Resolves terrain buffer size and build radius for smooth minimap scrolling.
 *
 * @param layout - Active minimap layout.
 * @param minimapTerrainSnapTiles - Terrain rebuild snap size in tiles.
 */
export function computingWorldPlazaMiniMapTerrainScrollMetrics(
  layout: ComputingWorldPlazaMiniMapLayout,
  minimapTerrainSnapTiles: number,
): ComputingWorldPlazaMiniMapTerrainScrollMetrics {
  const resolvedSnapTiles = Math.max(1, Math.floor(minimapTerrainSnapTiles));
  const maxPanGridUnits = resolvedSnapTiles / 2;
  const panPaddingTiles =
    Math.ceil(maxPanGridUnits) +
    COMPUTING_WORLD_PLAZA_MINI_MAP_TERRAIN_SCROLL_PADDING_EXTRA_TILES;
  const visibleCanvasInsetPx = panPaddingTiles * layout.pixelsPerTile;
  const visibleSquareBuildRadiusTiles =
    computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles(
      layout,
      layout.canvasSizePx / 2,
    );

  return {
    terrainCanvasSizePx: layout.canvasSizePx + visibleCanvasInsetPx * 2,
    visibleCanvasInsetPx,
    buildViewRadiusTiles: visibleSquareBuildRadiusTiles + panPaddingTiles,
    maxPanGridUnits,
  };
}

/**
 * Resolves the source origin for blitting the visible minimap viewport from
 * the padded terrain cache while the player moves between terrain rebuilds.
 *
 * @param liveCenterPosition - Live player position in grid space.
 * @param terrainCenterPosition - Snapped terrain anchor in grid space.
 * @param layout - Active minimap layout.
 * @param visibleCanvasInsetPx - Padding inset on the terrain canvas.
 */
export function computingWorldPlazaMiniMapTerrainPanSourceOriginPx(
  liveCenterPosition: DefiningWorldPlazaWorldPoint,
  terrainCenterPosition: DefiningWorldPlazaWorldPoint,
  layout: ComputingWorldPlazaMiniMapLayout,
  visibleCanvasInsetPx: number,
): DefiningWorldPlazaWorldPoint {
  const centerDelta = computingWorldPlazaMiniMapCanvasDeltaFromGridDelta(
    liveCenterPosition.x - terrainCenterPosition.x,
    liveCenterPosition.y - terrainCenterPosition.y,
    layout.pixelsPerTile,
  );

  return {
    x: visibleCanvasInsetPx + centerDelta.x,
    y: visibleCanvasInsetPx + centerDelta.y,
  };
}
