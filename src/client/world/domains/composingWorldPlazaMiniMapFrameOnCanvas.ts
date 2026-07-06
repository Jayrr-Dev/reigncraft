import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { clearingWorldPlazaMiniMapCanvasOnContext } from '@/components/world/domains/clearingWorldPlazaMiniMapCanvasOnContext';
import type { ComputingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import {
  computingWorldPlazaMiniMapTerrainPanSourceOriginPx,
  type ComputingWorldPlazaMiniMapTerrainScrollMetrics,
} from '@/components/world/domains/computingWorldPlazaMiniMapTerrainScrollMetrics';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  drawingWorldPlazaMiniMapChromeLayerOnCanvas,
  drawingWorldPlazaMiniMapPlayerMarkersOnCanvas,
} from '@/components/world/domains/drawingWorldPlazaMiniMapDynamicLayerOnCanvas';
import type {
  DrawingWorldPlazaMiniMapLabelOverlay,
  DrawingWorldPlazaMiniMapPlayerMarker,
} from '@/components/world/domains/drawingWorldPlazaMiniMapOnCanvas';
import { drawingWorldPlazaMiniMapSquarePanelOnCanvas } from '@/components/world/domains/drawingWorldPlazaMiniMapSquarePanelOnCanvas';
import { drawingWorldPlazaMiniMapTerrainLayerOnCanvas } from '@/components/world/domains/drawingWorldPlazaMiniMapTerrainLayerOnCanvas';
import { snappingWorldPlazaMiniMapCenterTileIndex } from '@/components/world/domains/snappingWorldPlazaMiniMapCenterTileIndex';

/**
 * Minimum squared grid delta before marker positions are refreshed.
 * Walk speed is ~0.04 grid units per frame at 60 fps; keep this below that
 * so the local player dot updates every animation frame while moving.
 */
const COMPOSING_WORLD_PLAZA_MINI_MAP_OVERLAY_POSITION_EPSILON_SQUARED = 0.000025;

/** Input for {@link composingWorldPlazaMiniMapFrameOnCanvas}. */
export interface ComposingWorldPlazaMiniMapFrameOnCanvasInput {
  readonly visibleContext: CanvasRenderingContext2D;
  readonly terrainContext: CanvasRenderingContext2D;
  readonly terrainCanvas: HTMLCanvasElement;
  readonly chromeContext: CanvasRenderingContext2D;
  readonly chromeCanvas: HTMLCanvasElement;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly liveCenterPosition: DefiningWorldPlazaWorldPoint;
  readonly terrainCenterPosition: DefiningWorldPlazaWorldPoint;
  readonly terrainScrollMetrics: ComputingWorldPlazaMiniMapTerrainScrollMetrics;
  readonly shouldRebuildTerrainLayer: boolean;
  readonly shouldRebuildChromeLayer: boolean;
  /** When true, defers outer border and corner radius to the HUD card wrapper. */
  readonly isStackedInUnifiedCard?: boolean;
  readonly playerMarkers: readonly DrawingWorldPlazaMiniMapPlayerMarker[];
  readonly ownedPlotTilePositions: readonly DefiningWorldBuildingTilePosition[];
  readonly labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay;
}

/** Result from {@link composingWorldPlazaMiniMapFrameOnCanvas}. */
export interface ComposingWorldPlazaMiniMapFrameOnCanvasResult {
  readonly didRebuildTerrainLayer: boolean;
  readonly didRebuildChromeLayer: boolean;
  readonly didRedrawOverlay: boolean;
}

/**
 * Returns true when the live center moved enough to refresh marker positions.
 *
 * @param previousCenterPosition - Last overlay center, if any.
 * @param nextCenterPosition - Current live player position.
 */
export function checkingWorldPlazaMiniMapOverlayShouldRefreshForCenterPosition(
  previousCenterPosition: DefiningWorldPlazaWorldPoint | null,
  nextCenterPosition: DefiningWorldPlazaWorldPoint
): boolean {
  if (!previousCenterPosition) {
    return true;
  }

  const deltaX = nextCenterPosition.x - previousCenterPosition.x;
  const deltaY = nextCenterPosition.y - previousCenterPosition.y;

  return (
    deltaX * deltaX + deltaY * deltaY >=
    COMPOSING_WORLD_PLAZA_MINI_MAP_OVERLAY_POSITION_EPSILON_SQUARED
  );
}

/**
 * Composites cached terrain, cached chrome, and live markers.
 * Terrain scrolls via sub-pixel blit offset; the local player stays centered.
 *
 * @param input - Visible canvas, layer caches, layout, and draw payload.
 */
export function composingWorldPlazaMiniMapFrameOnCanvas(
  input: ComposingWorldPlazaMiniMapFrameOnCanvasInput
): ComposingWorldPlazaMiniMapFrameOnCanvasResult {
  if (input.shouldRebuildTerrainLayer) {
    drawingWorldPlazaMiniMapTerrainLayerOnCanvas({
      context: input.terrainContext,
      layout: input.layout,
      terrainCenterPosition: input.terrainCenterPosition,
      ownedPlotTilePositions: input.ownedPlotTilePositions,
      terrainCanvasSizePx: input.terrainScrollMetrics.terrainCanvasSizePx,
      buildViewRadiusTiles: input.terrainScrollMetrics.buildViewRadiusTiles,
    });
  }

  if (input.shouldRebuildChromeLayer) {
    drawingWorldPlazaMiniMapChromeLayerOnCanvas({
      context: input.chromeContext,
      layout: input.layout,
      labelOverlay: input.labelOverlay,
      isOuterBorderVisible: !input.isStackedInUnifiedCard,
    });
  }

  const canvasSize = input.layout.canvasSizePx;
  const terrainPanSourceOrigin =
    computingWorldPlazaMiniMapTerrainPanSourceOriginPx(
      input.liveCenterPosition,
      input.terrainCenterPosition,
      input.layout,
      input.terrainScrollMetrics.visibleCanvasInsetPx
    );

  clearingWorldPlazaMiniMapCanvasOnContext(input.visibleContext, canvasSize);
  drawingWorldPlazaMiniMapSquarePanelOnCanvas(
    input.visibleContext,
    input.layout,
    { useSquareCorners: input.isStackedInUnifiedCard === true }
  );
  input.visibleContext.drawImage(
    input.terrainCanvas,
    terrainPanSourceOrigin.x,
    terrainPanSourceOrigin.y,
    canvasSize,
    canvasSize,
    0,
    0,
    canvasSize,
    canvasSize
  );
  input.visibleContext.drawImage(input.chromeCanvas, 0, 0);
  drawingWorldPlazaMiniMapPlayerMarkersOnCanvas({
    context: input.visibleContext,
    layout: input.layout,
    centerPosition: input.liveCenterPosition,
    playerMarkers: input.playerMarkers,
  });

  return {
    didRebuildTerrainLayer: input.shouldRebuildTerrainLayer,
    didRebuildChromeLayer: input.shouldRebuildChromeLayer,
    didRedrawOverlay: true,
  };
}

/**
 * Builds the snapped terrain anchor at the center of a snap cell.
 *
 * @param liveCenterPosition - Live player position in grid space.
 * @param snapTiles - Terrain rebuild snap size in tiles.
 */
export function resolvingWorldPlazaMiniMapTerrainCenterPosition(
  liveCenterPosition: DefiningWorldPlazaWorldPoint,
  snapTiles: number
): DefiningWorldPlazaWorldPoint {
  const resolvedSnapTiles = Math.max(1, Math.floor(snapTiles));
  const snapTileX = snappingWorldPlazaMiniMapCenterTileIndex(
    liveCenterPosition.x,
    resolvedSnapTiles
  );
  const snapTileY = snappingWorldPlazaMiniMapCenterTileIndex(
    liveCenterPosition.y,
    resolvedSnapTiles
  );

  return {
    x: snapTileX + resolvedSnapTiles / 2,
    y: snapTileY + resolvedSnapTiles / 2,
  };
}

/**
 * Builds a stable cache key for one snapped terrain anchor.
 *
 * @param terrainCenterPosition - Snapped terrain anchor in grid space.
 */
export function formattingWorldPlazaMiniMapTerrainCenterCacheKey(
  terrainCenterPosition: DefiningWorldPlazaWorldPoint
): string {
  return `${terrainCenterPosition.x}:${terrainCenterPosition.y}`;
}

/**
 * Builds a stable cache key for chrome label content.
 *
 * @param labelOverlay - Label payload drawn on the chrome layer.
 */
export function formattingWorldPlazaMiniMapChromeLayerCacheKey(
  labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay
): string {
  const debugKey = labelOverlay.debugLines?.join('|') ?? '';

  return `${labelOverlay.biomeDisplayName}:${labelOverlay.displayPosition.x}:${labelOverlay.displayPosition.y}:${debugKey}`;
}
