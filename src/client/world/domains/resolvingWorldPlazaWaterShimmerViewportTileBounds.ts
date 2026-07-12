import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_VIEWPORT_PADDING_TILES } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';

/**
 * Clamps the animated water shimmer redraw window to the on-screen viewport.
 *
 * Floor redraw bounds include large prefetch rings so chunk baking stays ahead
 * of the camera, but shimmer re-strokes every few frames. Animating the whole
 * prefetch window wastes per-frame Pixi path work on tiles the player cannot
 * see, which is what made river-heavy regions stutter.
 *
 * @module components/world/domains/resolvingWorldPlazaWaterShimmerViewportTileBounds
 */

/** Input for {@link resolvingWorldPlazaWaterShimmerViewportTileBounds}. */
export interface ResolvingWorldPlazaWaterShimmerViewportTileBoundsInput {
  /** Player grid X. */
  readonly playerGridX: number;
  /** Player grid Y. */
  readonly playerGridY: number;
  /** Canvas width in pixels. */
  readonly viewportWidthPx: number;
  /** Canvas height in pixels. */
  readonly viewportHeightPx: number;
  /** Effective world-container zoom. */
  readonly worldZoom: number;
  /** Floor redraw bounds that cap the shimmer window. */
  readonly floorBounds: DefiningWorldPlazaVisibleTileBounds;
}

/**
 * Returns the intersection of the on-screen viewport tile window (plus a small
 * pad) with the floor redraw bounds.
 *
 * @param input - Player position, viewport size, zoom, and floor bounds.
 */
export function resolvingWorldPlazaWaterShimmerViewportTileBounds(
  input: ResolvingWorldPlazaWaterShimmerViewportTileBoundsInput
): DefiningWorldPlazaVisibleTileBounds {
  const viewportBounds = resolvingWorldPlazaVisibleIsometricTileBounds(
    input.playerGridX,
    input.playerGridY,
    input.viewportWidthPx,
    input.viewportHeightPx,
    DEFINING_WORLD_PLAZA_WATER_SHIMMER_VIEWPORT_PADDING_TILES,
    1,
    input.worldZoom
  );

  return {
    minTileX: Math.max(viewportBounds.minTileX, input.floorBounds.minTileX),
    maxTileX: Math.min(viewportBounds.maxTileX, input.floorBounds.maxTileX),
    minTileY: Math.max(viewportBounds.minTileY, input.floorBounds.minTileY),
    maxTileY: Math.min(viewportBounds.maxTileY, input.floorBounds.maxTileY),
  };
}
