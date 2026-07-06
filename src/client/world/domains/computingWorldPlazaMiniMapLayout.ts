import {
  DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_WIDTH_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_RADIUS_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_DESKTOP_CANVAS_SCALE,
  DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_FULLSCREEN_CANVAS_SIZE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_BIOME_BASELINE_Y_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_COORDINATES_BOTTOM_INSET_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_EXTRA_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_FAMILY,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_SIZE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_WEIGHT,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_OVERLAY_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_PADDING_X_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_BLUR_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_EMBEDDED_CANVAS_SIZE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_VIEW_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_STROKE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_VIEW_RADIUS_TILES,
} from '@/components/world/domains/definingWorldPlazaMiniMapConstants';

/** Scaled layout values for one minimap render pass. */
export interface ComputingWorldPlazaMiniMapLayout {
  /** Canvas width and height in CSS pixels. */
  canvasSizePx: number;
  /** Pixels per grid tile on the minimap canvas. */
  pixelsPerTile: number;
  /** Player dot radius in CSS pixels. */
  playerDotRadiusPx: number;
  /** Player dot outline width in CSS pixels. */
  playerDotStrokeWidthPx: number;
  /** Center reticle ring radius in CSS pixels. */
  centerReticleRadiusPx: number;
  /** Top label block height in CSS pixels. */
  labelOverlayHeightPx: number;
  /** Extra label strip height per debug line in CSS pixels. */
  labelDebugExtraHeightPx: number;
  /** Left padding for label text in CSS pixels. */
  labelPaddingXPx: number;
  /** Biome label baseline centered at the top of the minimap in CSS pixels. */
  labelBiomeBaselineYPx: number;
  /** Coordinate label baseline anchored near the bottom-left in CSS pixels. */
  labelCoordinatesBaselineYPx: number;
  /** Canvas font for the minimap status label. */
  labelFont: string;
  /** Drop shadow blur behind minimap labels in CSS pixels. */
  labelTextShadowBlurPx: number;
  /** Border width around the minimap canvas in CSS pixels. */
  borderWidthPx: number;
  /** Half-width of the visible tile window around the player. */
  viewRadiusTiles: number;
}

/**
 * Scales a CSS pixel metric from the embedded minimap baseline.
 *
 * @param embeddedValuePx - Value at the embedded minimap size.
 * @param scale - Ratio of the active canvas size to the embedded size.
 */
function computingWorldPlazaMiniMapScaledMetricPx(
  embeddedValuePx: number,
  scale: number
): number {
  return embeddedValuePx * scale;
}

/**
 * Resolves the minimap label font for one viewport profile.
 *
 * @param isFullscreen - True while the plaza host is in native fullscreen.
 * @param isMobile - True on narrow viewports where the embedded minimap shrinks.
 */
function computingWorldPlazaMiniMapLabelFont(
  isFullscreen: boolean,
  isMobile: boolean
): string {
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';
  const baseFontSizePx =
    DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_SIZE_PX[viewportMode][platform];
  const fontSizePx = isMobile
    ? baseFontSizePx
    : Math.round(
        baseFontSizePx * DEFINING_WORLD_PLAZA_MINI_MAP_DESKTOP_CANVAS_SCALE
      );

  return `${DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_WEIGHT} ${fontSizePx}px ${DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT_FAMILY}`;
}

/**
 * Resolves the minimap canvas edge length for one viewport profile.
 *
 * @param isFullscreen - True while the plaza host is in native fullscreen.
 * @param isMobile - True on narrow viewports where the embedded minimap shrinks.
 */
function computingWorldPlazaMiniMapCanvasSizePx(
  isFullscreen: boolean,
  isMobile: boolean
): number {
  const baseCanvasSizePx = isFullscreen
    ? DEFINING_WORLD_PLAZA_MINI_MAP_FULLSCREEN_CANVAS_SIZE_PX
    : isMobile
      ? DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_EMBEDDED_CANVAS_SIZE_PX
      : DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX;

  if (isMobile) {
    return baseCanvasSizePx;
  }

  return Math.round(
    baseCanvasSizePx * DEFINING_WORLD_PLAZA_MINI_MAP_DESKTOP_CANVAS_SCALE
  );
}

/**
 * Resolves minimap layout for embedded or fullscreen plaza viewports.
 *
 * @param isFullscreen - True while the plaza host is in native fullscreen.
 * @param isMobile - True on narrow viewports where the embedded minimap shrinks.
 * @param viewRadiusTilesOverride - Optional profile override for visible tile radius.
 */
export function computingWorldPlazaMiniMapLayout(
  isFullscreen: boolean,
  isMobile = false,
  viewRadiusTilesOverride?: number
): ComputingWorldPlazaMiniMapLayout {
  const canvasSizePx = computingWorldPlazaMiniMapCanvasSizePx(
    isFullscreen,
    isMobile
  );
  const defaultViewRadiusTiles =
    isMobile && !isFullscreen
      ? DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_VIEW_RADIUS_TILES
      : DEFINING_WORLD_PLAZA_MINI_MAP_VIEW_RADIUS_TILES;
  const viewRadiusTiles = Math.max(
    4,
    Math.floor(viewRadiusTilesOverride ?? defaultViewRadiusTiles)
  );
  const scale =
    canvasSizePx / DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX;
  const pixelsPerTile = canvasSizePx / (viewRadiusTiles * 2 + 1);

  return {
    canvasSizePx,
    pixelsPerTile,
    playerDotRadiusPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_RADIUS_PX,
      scale
    ),
    playerDotStrokeWidthPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_STROKE_WIDTH_PX,
      scale
    ),
    centerReticleRadiusPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_RADIUS_PX,
      scale
    ),
    labelOverlayHeightPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_OVERLAY_HEIGHT_PX,
      scale
    ),
    labelDebugExtraHeightPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_EXTRA_HEIGHT_PX,
      scale
    ),
    labelPaddingXPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_PADDING_X_PX,
      scale
    ),
    labelBiomeBaselineYPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_BIOME_BASELINE_Y_PX,
      scale
    ),
    labelCoordinatesBaselineYPx:
      canvasSizePx -
      computingWorldPlazaMiniMapScaledMetricPx(
        DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_COORDINATES_BOTTOM_INSET_PX,
        scale
      ),
    labelFont: computingWorldPlazaMiniMapLabelFont(isFullscreen, isMobile),
    labelTextShadowBlurPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_BLUR_PX,
      scale
    ),
    borderWidthPx: computingWorldPlazaMiniMapScaledMetricPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_WIDTH_PX,
      scale
    ),
    viewRadiusTiles,
  };
}
