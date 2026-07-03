import {
  DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MAX_SCALE,
  DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MIN_SCALE,
  DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaViewportHudScaleConstants";

/**
 * Clamps a HUD scale value to plaza viewport bounds.
 *
 * @param scale - Unclamped scale multiplier
 */
function clampingWorldPlazaViewportHudScale(scale: number): number {
  return Math.min(
    DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MAX_SCALE,
    Math.max(DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MIN_SCALE, scale),
  );
}

/**
 * Resolves HUD scale from the live plaza viewport frame size.
 *
 * Uses the tighter of width/height ratios so controls stay proportional in
 * embedded 16:9 frames, fullscreen, and mobile landscape.
 *
 * @param viewportWidthPx - Viewport frame width in CSS pixels
 * @param viewportHeightPx - Viewport frame height in CSS pixels
 */
export function computingWorldPlazaViewportHudScale(
  viewportWidthPx: number,
  viewportHeightPx: number,
): number {
  if (viewportWidthPx <= 0 || viewportHeightPx <= 0) {
    return 1;
  }

  const widthScale =
    viewportWidthPx / DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_WIDTH_PX;
  const heightScale =
    viewportHeightPx / DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_HEIGHT_PX;

  return clampingWorldPlazaViewportHudScale(Math.min(widthScale, heightScale));
}

/**
 * Combines authored HUD design scale with live viewport scale.
 *
 * @param viewportHudScale - Scale from {@link computingWorldPlazaViewportHudScale}
 * @param designScale - Component-specific authored multiplier
 */
export function computingWorldPlazaEffectiveViewportHudScale(
  viewportHudScale: number,
  designScale: number,
): number {
  return viewportHudScale * designScale;
}

/**
 * Scales a HUD base px value for the current viewport (integer px for crisp rendering).
 *
 * @param basePx - Authored design size in CSS pixels
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param designScale - Optional component-specific multiplier (defaults to 1)
 */
export function computingWorldPlazaViewportHudScaledPx(
  basePx: number,
  viewportHudScale: number,
  designScale = 1,
): number {
  return Math.round(
    basePx *
      computingWorldPlazaEffectiveViewportHudScale(viewportHudScale, designScale),
  );
}

/**
 * Inline width/height for a square HUD control at the resolved viewport size.
 *
 * @param basePx - Authored square edge length in CSS pixels
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param designScale - Optional component-specific multiplier (defaults to 1)
 */
export function stylingWorldPlazaViewportHudSquarePx(
  basePx: number,
  viewportHudScale: number,
  designScale = 1,
): { width: number; height: number } {
  const edgePx = computingWorldPlazaViewportHudScaledPx(
    basePx,
    viewportHudScale,
    designScale,
  );

  return { width: edgePx, height: edgePx };
}
