import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_BORDER_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_FILL_COLOR,
} from '@/components/world/building/domains/definingWorldBuildingPlotClaimConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { clearingWorldPlazaMiniMapCanvasOnContext } from '@/components/world/domains/clearingWorldPlazaMiniMapCanvasOnContext';
import { computingWorldPlazaMiniMapCanvasPointFromGridPoint } from '@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint';
import type { ComputingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import {
  checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport,
  computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles,
} from '@/components/world/domains/computingWorldPlazaMiniMapSquareViewportMetrics';
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_TEXT_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_X_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_Y_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_STROKE_COLOR,
} from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { drawingWorldPlazaMiniMapSquarePanelOnCanvas } from '@/components/world/domains/drawingWorldPlazaMiniMapSquarePanelOnCanvas';
import {
  drawingWorldPlazaMiniMapTerrainAlignedTileBatchFillOnCanvas,
  drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas,
  drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas,
} from '@/components/world/domains/drawingWorldPlazaMiniMapTerrainAlignedTileOnCanvas';
import { formattingWorldPlazaMiniMapCoordinatesLabel } from '@/components/world/domains/formattingWorldPlazaMiniMapStatusLabel';
import { resolvingWorldPlazaMiniMapTileFillColor } from '@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor';

/** One player marker on the minimap. */
export interface DrawingWorldPlazaMiniMapPlayerMarker {
  /** Grid-space position. */
  position: DefiningWorldPlazaWorldPoint;
  /** True for the signed-in user. */
  isLocal: boolean;
}

/** Biome and coordinate labels drawn on the minimap canvas. */
export interface DrawingWorldPlazaMiniMapLabelOverlay {
  /** Player-facing biome name. */
  biomeDisplayName: string;
  /** Rounded tile coordinates. */
  displayPosition: DefiningWorldPlazaWorldPoint;
  /** Optional debug lines rendered below coordinates. */
  debugLines?: readonly string[];
}

/** Minimap dash length for owned plot tile borders. */
const DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_DASH_LENGTH_PX =
  2 as const;

/** Minimap gap length for owned plot tile borders. */
const DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_GAP_LENGTH_PX = 2 as const;

/** Inputs for one minimap frame. */
export interface DrawingWorldPlazaMiniMapOnCanvasInput {
  /** 2D canvas context sized to {@link DrawingWorldPlazaMiniMapOnCanvasInput.layout}. */
  context: CanvasRenderingContext2D;
  /** Scaled minimap layout for the active viewport mode. */
  layout: ComputingWorldPlazaMiniMapLayout;
  /** Live local player position in grid space. */
  centerPosition: DefiningWorldPlazaWorldPoint;
  /** Other players and the local marker to draw on top of terrain. */
  playerMarkers: readonly DrawingWorldPlazaMiniMapPlayerMarker[];
  /** Owned build plot tiles to highlight in orange. */
  ownedPlotTilePositions: readonly DefiningWorldBuildingTilePosition[];
  /** Labels painted on the bottom of the minimap canvas. */
  labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay;
}

/**
 * Draws one owned plot tile on the minimap with an orange fill and dashed border.
 *
 * @param context - Canvas 2D context.
 * @param tilePosition - Plot tile indices.
 * @param centerPosition - Player position used as the minimap center.
 * @param layout - Active minimap layout.
 */
function drawingWorldPlazaMiniMapOwnedPlotTileOnCanvas(
  context: CanvasRenderingContext2D,
  tilePosition: DefiningWorldBuildingTilePosition,
  centerPosition: DefiningWorldPlazaWorldPoint,
  layout: ComputingWorldPlazaMiniMapLayout
): void {
  const tileCenter = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
    gridPoint: { x: tilePosition.tileX, y: tilePosition.tileY },
    centerPosition,
    layout,
  });

  drawingWorldPlazaMiniMapTerrainAlignedTileFillOnCanvas({
    context,
    layout,
    center: tileCenter,
    fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_FILL_COLOR,
  });
  drawingWorldPlazaMiniMapTerrainAlignedTileStrokeOnCanvas({
    context,
    layout,
    center: tileCenter,
    strokeColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_BORDER_COLOR,
    dashPattern: [
      DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_DASH_LENGTH_PX,
      DRAWING_WORLD_PLAZA_MINI_MAP_OWNED_PLOT_BORDER_GAP_LENGTH_PX,
    ],
  });
}

/**
 * Draws one player dot on the minimap.
 *
 * @param context - Canvas 2D context.
 * @param marker - Player marker to render.
 * @param centerPosition - Player position used as the minimap center.
 * @param layout - Active minimap layout.
 */
function drawingWorldPlazaMiniMapPlayerDotOnCanvas(
  context: CanvasRenderingContext2D,
  marker: DrawingWorldPlazaMiniMapPlayerMarker,
  centerPosition: DefiningWorldPlazaWorldPoint,
  layout: ComputingWorldPlazaMiniMapLayout
): void {
  const canvasPoint = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
    gridPoint: marker.position,
    centerPosition,
    layout,
  });

  context.beginPath();
  context.arc(
    canvasPoint.x,
    canvasPoint.y,
    layout.playerDotRadiusPx,
    0,
    Math.PI * 2
  );
  context.fillStyle = marker.isLocal
    ? DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR
    : DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR;
  context.fill();
  context.lineWidth = layout.playerDotStrokeWidthPx;
  context.strokeStyle = marker.isLocal
    ? DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_STROKE_COLOR
    : DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_STROKE_COLOR;
  context.stroke();
}

/**
 * Applies a readable drop shadow to minimap label text.
 *
 * @param context - Canvas 2D context.
 * @param layout - Active minimap layout.
 */
function applyingWorldPlazaMiniMapLabelTextShadow(
  context: CanvasRenderingContext2D,
  layout: ComputingWorldPlazaMiniMapLayout
): void {
  context.shadowColor = DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_COLOR;
  context.shadowBlur = layout.labelTextShadowBlurPx;
  context.shadowOffsetX =
    DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_X_PX;
  context.shadowOffsetY =
    DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_Y_PX;
}

/**
 * Clears canvas text shadow after minimap labels are drawn.
 *
 * @param context - Canvas 2D context.
 */
function clearingWorldPlazaMiniMapLabelTextShadow(
  context: CanvasRenderingContext2D
): void {
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
}

/**
 * Paints biome and coordinate labels at the top of the minimap canvas.
 *
 * @param context - Canvas 2D context.
 * @param layout - Active minimap layout.
 * @param labelOverlay - Biome, coordinates, and optional debug lines.
 */
function drawingWorldPlazaMiniMapLabelOverlayOnCanvas(
  context: CanvasRenderingContext2D,
  layout: ComputingWorldPlazaMiniMapLayout,
  labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay
): void {
  context.textBaseline = 'alphabetic';
  applyingWorldPlazaMiniMapLabelTextShadow(context, layout);

  context.font = layout.labelFont;
  context.fillStyle = DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR;
  context.textAlign = 'center';
  context.fillText(
    labelOverlay.biomeDisplayName,
    layout.canvasSizePx / 2,
    layout.labelBiomeBaselineYPx
  );
  context.textAlign = 'left';
  context.fillText(
    formattingWorldPlazaMiniMapCoordinatesLabel(labelOverlay.displayPosition),
    layout.labelPaddingXPx,
    layout.labelCoordinatesBaselineYPx
  );

  if (labelOverlay.debugLines?.length) {
    context.fillStyle = DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_TEXT_COLOR;

    labelOverlay.debugLines.forEach((debugLine, debugLineIndex) => {
      context.fillText(
        debugLine,
        layout.labelPaddingXPx,
        layout.labelCoordinatesBaselineYPx -
          (debugLineIndex + 1) * layout.labelDebugExtraHeightPx
      );
    });
  }

  clearingWorldPlazaMiniMapLabelTextShadow(context);
}

/**
 * Redraws the plaza minimap: terrain fills the canvas, labels sit on top,
 * remote players are blue dots, and the local player is a yellow dot.
 *
 * @param input - Canvas context, layout, center position, player markers, and labels.
 */
export function drawingWorldPlazaMiniMapOnCanvas(
  input: DrawingWorldPlazaMiniMapOnCanvasInput
): void {
  const {
    context,
    layout,
    centerPosition,
    playerMarkers,
    ownedPlotTilePositions,
    labelOverlay,
  } = input;
  const canvasSize = layout.canvasSizePx;
  const viewportHalfSizePx = canvasSize / 2;
  const buildRadiusTiles =
    computingWorldPlazaMiniMapSquareViewportBuildRadiusTiles(
      layout,
      viewportHalfSizePx
    );
  const centerTileX = Math.floor(centerPosition.x);
  const centerTileY = Math.floor(centerPosition.y);
  const tileCentersByFillColor = new Map<string, { x: number; y: number }[]>();

  clearingWorldPlazaMiniMapCanvasOnContext(context, canvasSize);
  drawingWorldPlazaMiniMapSquarePanelOnCanvas(context, layout);

  for (
    let tileOffsetY = -buildRadiusTiles;
    tileOffsetY <= buildRadiusTiles;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -buildRadiusTiles;
      tileOffsetX <= buildRadiusTiles;
      tileOffsetX += 1
    ) {
      if (
        !checkingWorldPlazaMiniMapTileOffsetIsInsideSquareViewport(
          tileOffsetX,
          tileOffsetY,
          layout,
          viewportHalfSizePx
        )
      ) {
        continue;
      }

      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const tileCenter = computingWorldPlazaMiniMapCanvasPointFromGridPoint({
        gridPoint: { x: tileX, y: tileY },
        centerPosition,
        layout,
      });
      const fillColor = resolvingWorldPlazaMiniMapTileFillColor(tileX, tileY);
      const tileCenters = tileCentersByFillColor.get(fillColor) ?? [];

      tileCenters.push(tileCenter);
      tileCentersByFillColor.set(fillColor, tileCenters);
    }
  }

  for (const [fillColor, tileCenters] of tileCentersByFillColor) {
    drawingWorldPlazaMiniMapTerrainAlignedTileBatchFillOnCanvas(
      context,
      layout,
      tileCenters,
      fillColor
    );
  }

  for (const ownedPlotTilePosition of ownedPlotTilePositions) {
    drawingWorldPlazaMiniMapOwnedPlotTileOnCanvas(
      context,
      ownedPlotTilePosition,
      centerPosition,
      layout
    );
  }

  for (const marker of playerMarkers) {
    if (!marker.isLocal) {
      drawingWorldPlazaMiniMapPlayerDotOnCanvas(
        context,
        marker,
        centerPosition,
        layout
      );
    }
  }

  const canvasCenter = canvasSize / 2;

  context.beginPath();
  context.arc(
    canvasCenter,
    canvasCenter,
    layout.centerReticleRadiusPx,
    0,
    Math.PI * 2
  );
  context.strokeStyle =
    DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_STROKE_COLOR;
  context.lineWidth = 1;
  context.stroke();

  const localMarker = playerMarkers.find((marker) => marker.isLocal);

  if (localMarker) {
    drawingWorldPlazaMiniMapPlayerDotOnCanvas(
      context,
      localMarker,
      centerPosition,
      layout
    );
  }

  context.strokeStyle = DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_COLOR;
  context.lineWidth = layout.borderWidthPx;
  context.strokeRect(
    layout.borderWidthPx / 2,
    layout.borderWidthPx / 2,
    canvasSize - layout.borderWidthPx,
    canvasSize - layout.borderWidthPx
  );

  drawingWorldPlazaMiniMapLabelOverlayOnCanvas(context, layout, labelOverlay);
}
