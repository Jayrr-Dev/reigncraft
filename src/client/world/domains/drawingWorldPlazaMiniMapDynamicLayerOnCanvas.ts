import { computingWorldPlazaMiniMapCanvasPointFromGridPoint } from '@/components/world/domains/computingWorldPlazaMiniMapCanvasPointFromGridPoint';
import type { ComputingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
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
import type {
  DrawingWorldPlazaMiniMapLabelOverlay,
  DrawingWorldPlazaMiniMapPlayerMarker,
} from '@/components/world/domains/drawingWorldPlazaMiniMapOnCanvas';
import { formattingWorldPlazaMiniMapCoordinatesLabel } from '@/components/world/domains/formattingWorldPlazaMiniMapStatusLabel';

/** Input for {@link drawingWorldPlazaMiniMapChromeLayerOnCanvas}. */
export interface DrawingWorldPlazaMiniMapChromeLayerOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay;
  /** When false, the HUD card wrapper supplies the outer border. */
  readonly isOuterBorderVisible?: boolean;
}

/** Input for {@link drawingWorldPlazaMiniMapPlayerMarkersOnCanvas}. */
export interface DrawingWorldPlazaMiniMapPlayerMarkersOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly centerPosition: DefiningWorldPlazaWorldPoint;
  readonly playerMarkers: readonly DrawingWorldPlazaMiniMapPlayerMarker[];
}

/**
 * Draws one player dot on the minimap marker layer.
 *
 * @param context - Canvas 2D context.
 * @param marker - Player marker to render.
 * @param centerPosition - Live player position in grid space.
 * @param layout - Active minimap layout.
 */
function drawingWorldPlazaMiniMapPlayerDotOnMarkerLayer(
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
 * Draws reticle, border, and labels onto a cached chrome layer.
 *
 * @param input - Canvas context, layout, and label overlay.
 */
export function drawingWorldPlazaMiniMapChromeLayerOnCanvas(
  input: DrawingWorldPlazaMiniMapChromeLayerOnCanvasInput
): void {
  const { context, layout, labelOverlay } = input;
  const canvasSize = layout.canvasSizePx;
  const canvasCenter = canvasSize / 2;

  context.clearRect(0, 0, canvasSize, canvasSize);

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

  if (input.isOuterBorderVisible !== false) {
    context.strokeStyle = DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_COLOR;
    context.lineWidth = layout.borderWidthPx;
    context.strokeRect(
      layout.borderWidthPx / 2,
      layout.borderWidthPx / 2,
      canvasSize - layout.borderWidthPx,
      canvasSize - layout.borderWidthPx
    );
  }

  context.textBaseline = 'alphabetic';
  applyingWorldPlazaMiniMapLabelTextShadow(context, layout);
  context.font = layout.labelFont;
  context.fillStyle = DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR;
  context.textAlign = 'center';
  context.fillText(
    labelOverlay.biomeDisplayName,
    canvasSize / 2,
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
 * Draws player markers on top of cached terrain and chrome layers.
 *
 * @param input - Canvas context, layout, live center, and markers.
 */
export function drawingWorldPlazaMiniMapPlayerMarkersOnCanvas(
  input: DrawingWorldPlazaMiniMapPlayerMarkersOnCanvasInput
): void {
  const { context, layout, centerPosition, playerMarkers } = input;

  for (const marker of playerMarkers) {
    if (!marker.isLocal) {
      drawingWorldPlazaMiniMapPlayerDotOnMarkerLayer(
        context,
        marker,
        centerPosition,
        layout
      );
    }
  }

  const localMarker = playerMarkers.find((marker) => marker.isLocal);

  if (localMarker) {
    drawingWorldPlazaMiniMapPlayerDotOnMarkerLayer(
      context,
      localMarker,
      centerPosition,
      layout
    );
  }
}

/** @deprecated Use chrome + marker layers via {@link composingWorldPlazaMiniMapFrameOnCanvas}. */
export interface DrawingWorldPlazaMiniMapDynamicLayerOnCanvasInput {
  readonly context: CanvasRenderingContext2D;
  readonly layout: ComputingWorldPlazaMiniMapLayout;
  readonly centerPosition: DefiningWorldPlazaWorldPoint;
  readonly playerMarkers: readonly DrawingWorldPlazaMiniMapPlayerMarker[];
  readonly labelOverlay: DrawingWorldPlazaMiniMapLabelOverlay;
}

/**
 * Draws player markers, reticle, border, and labels on the visible minimap.
 *
 * @param input - Canvas context, layout, live center, markers, and labels.
 * @deprecated Prefer {@link composingWorldPlazaMiniMapFrameOnCanvas}.
 */
export function drawingWorldPlazaMiniMapDynamicLayerOnCanvas(
  input: DrawingWorldPlazaMiniMapDynamicLayerOnCanvasInput
): void {
  drawingWorldPlazaMiniMapChromeLayerOnCanvas({
    context: input.context,
    layout: input.layout,
    labelOverlay: input.labelOverlay,
  });
  drawingWorldPlazaMiniMapPlayerMarkersOnCanvas({
    context: input.context,
    layout: input.layout,
    centerPosition: input.centerPosition,
    playerMarkers: input.playerMarkers,
  });
}
