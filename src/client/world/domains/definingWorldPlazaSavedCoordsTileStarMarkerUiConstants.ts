/**
 * UI styling for floating star markers on saved plaza coordinate tiles.
 *
 * @module components/world/domains/definingWorldPlazaSavedCoordsTileStarMarkerUiConstants
 */

/** Vertical lift above the tile center before the star anchor (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_OFFSET_ABOVE_TILE_PX = 14;

/** Wrapper classes for camera-tracked saved-coords star markers. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_WRAPPER_CLASS_NAME =
  "pointer-events-none absolute left-0 top-0 z-[35] will-change-transform select-none" as const;

/** Inner bobbing wrapper around each saved-coords star icon. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_INNER_CLASS_NAME =
  "celestial-float flex items-center justify-center" as const;

/** Bob distance for saved-coords star markers (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DISTANCE_PX =
  "3px" as const;

/** Bob duration for saved-coords star markers. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DURATION =
  "2.8s" as const;

/** Lucide star classes for the tracked saved coordinate tile marker. */
export const STYLING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_TRACKED_ICON_CLASS_NAME =
  "size-3.5 shrink-0 fill-[#facc15] text-[#facc15] drop-shadow-[0_0_6px_rgba(250,204,21,0.85)]" as const;
