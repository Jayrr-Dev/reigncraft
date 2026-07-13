/**
 * Action-bar world-layer orb: fill color, labels, and shell classes.
 *
 * @module components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants
 */

/** Accessible name for the world-layer orb. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER =
  'World layer' as const;

/** Hint shown when the orb toggles the minimap. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT =
  'Open minimap' as const;

/** Solid fill for the layer orb disc (muted stone-green). */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_COLOR =
  '#5c7a68' as const;

/** How often the orb re-reads the player's standing layer from the position ref. */
export const DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_REFRESH_INTERVAL_MS =
  100 as const;

/** Wrapper anchoring the world-layer orb in the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** CSS class for the world-layer orb shell (bronze ring). */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME =
  'plaza-world-layer-orb relative flex shrink-0 items-center justify-center rounded-full' as const;

/** CSS class for the clipped fill disc inside the world-layer orb. */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_DISC_CLASS_NAME =
  'absolute inset-[3px] overflow-hidden rounded-full' as const;

/** CSS class for the centered layer readout. */
export const STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_VALUE_CLASS_NAME =
  'relative z-10 shrink-0 px-0.5 text-center font-bold leading-none tabular-nums tracking-tight text-white' as const;
