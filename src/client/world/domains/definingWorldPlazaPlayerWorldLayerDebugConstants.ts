/**
 * Left-side player world layer debug label tuning.
 *
 * @module components/world/domains/definingWorldPlazaPlayerWorldLayerDebugConstants
 */

/** DOM refresh interval for the player layer debug label. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_REDRAW_INTERVAL_MS =
  100 as const;

/** Anchor when the stamina bar is visible above this label. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_WITH_STAMINA_CLASS_NAME =
  "pointer-events-none absolute left-3 top-[4.75rem] z-20 flex select-none flex-col gap-0.5" as const;

/** Anchor when no stamina bar is rendered. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute left-3 top-7 z-20 flex select-none flex-col gap-0.5" as const;

/** White label text with a dark shadow for plaza overlays. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_TEXT_CLASS_NAME =
  "text-xs font-semibold tabular-nums leading-none text-white drop-shadow-[0_1px_1px_#000,0_0_6px_#000]" as const;

/** Player standing layer label prefix. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_PLAYER_LABEL_PREFIX =
  "Player layer" as const;

/** Build placement layer label prefix. */
export const DEFINING_WORLD_PLAZA_PLAYER_WORLD_LAYER_DEBUG_BUILD_LABEL_PREFIX =
  "Build layer" as const;
