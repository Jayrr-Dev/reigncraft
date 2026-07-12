import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';

/**
 * Viewport-clamped bounds shared by procedural water graphics layers.
 *
 * @module components/world/domains/resolvingWorldPlazaWaterViewportTileBounds
 */

/** Input for {@link resolvingWorldPlazaWaterViewportTileBounds}. */
export type ResolvingWorldPlazaWaterViewportTileBoundsInput = {
  readonly playerGridX: number;
  readonly playerGridY: number;
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
  readonly worldZoom: number;
  readonly viewportPaddingTiles: number;
  readonly floorBounds: DefiningWorldPlazaVisibleTileBounds;
};

/**
 * Intersects a padded live viewport window with available floor bounds.
 */
export function resolvingWorldPlazaWaterViewportTileBounds(
  input: ResolvingWorldPlazaWaterViewportTileBoundsInput
): DefiningWorldPlazaVisibleTileBounds {
  const viewportBounds = resolvingWorldPlazaVisibleIsometricTileBounds(
    input.playerGridX,
    input.playerGridY,
    input.viewportWidthPx,
    input.viewportHeightPx,
    input.viewportPaddingTiles,
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
