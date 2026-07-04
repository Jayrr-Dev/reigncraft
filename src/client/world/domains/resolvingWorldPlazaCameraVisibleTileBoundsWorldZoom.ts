import { DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';

/**
 * Resolves the zoom divisor used when estimating visible tile bounds.
 *
 * When the live camera zooms in past the reference, keep the wider prefetch
 * window so edges do not pop. When zoomed out (mobile), follow the live zoom so
 * bounds do not extend far beyond the frustum.
 *
 * @param worldZoom - Effective world-container zoom for the current viewport.
 */
export function resolvingWorldPlazaCameraVisibleTileBoundsWorldZoom(
  worldZoom: number
): number {
  return Math.min(
    worldZoom,
    DEFINING_WORLD_PLAZA_CAMERA_VISIBLE_TILE_BOUNDS_REFERENCE_ZOOM
  );
}
