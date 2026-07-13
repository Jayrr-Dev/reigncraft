/**
 * Action-bar compass orb: opens the minimap dropdown.
 *
 * @module components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants
 */

/** Accessible name for the compass / minimap orb. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER = 'Minimap' as const;

/** Hint shown when the orb toggles the minimap. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT =
  'Open map' as const;

/** Iconify glyph for the compass orb. */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_COMPASS_ICON =
  'roentgen:compass' as const;

/** Solid fill for the compass orb disc (muted map-teal). */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_COLOR =
  '#4a6b62' as const;

/** How often the minimap layer bar re-reads standing layer from the position ref. */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_REFRESH_INTERVAL_MS =
  100 as const;

/** Wrapper anchoring the compass orb in the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** CSS class for the compass orb shell (bronze ring). */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME =
  'plaza-world-layer-orb relative flex shrink-0 items-center justify-center rounded-full' as const;

/** CSS class for the clipped fill disc inside the compass orb. */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_DISC_CLASS_NAME =
  'absolute inset-[3px] overflow-hidden rounded-full' as const;

/** CSS class for the centered compass glyph. */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ICON_CLASS_NAME =
  'relative z-10 shrink-0 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]' as const;
