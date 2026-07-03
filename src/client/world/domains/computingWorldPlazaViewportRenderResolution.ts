/**
 * Renderer resolution for sharp plaza canvas output on HiDPI displays.
 *
 * @param devicePixelRatio - Current window device pixel ratio.
 * @param renderResolutionMax - Tier cap from the performance profile.
 */
export function computingWorldPlazaViewportRenderResolution(
  devicePixelRatio: number,
  renderResolutionMax: number,
): number {
  return Math.min(
    renderResolutionMax,
    Math.max(1, devicePixelRatio),
  );
}
