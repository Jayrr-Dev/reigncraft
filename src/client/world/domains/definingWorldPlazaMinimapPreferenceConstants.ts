/**
 * Minimap visibility preference for the plaza HUD.
 *
 * @module components/world/domains/definingWorldPlazaMinimapPreferenceConstants
 */

/** localStorage key for the minimap visibility preference. */
export const DEFINING_WORLD_PLAZA_MINIMAP_PREFERENCE_STORAGE_KEY =
  'world-plaza-minimap-enabled' as const;

/**
 * When no saved preference exists, minimap stays off until the player opens it
 * from the action-bar layer orb (or Settings), unless a prior localStorage
 * choice exists.
 */
export const DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE =
  false as const;

/** Desktop default when the player has not chosen yet. */
export const DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP =
  false as const;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_MINIMAP_TOGGLE = 'Minimap' as const;

/** Checkbox row styling inside the settings mixer panel. */
export const STYLING_WORLD_PLAZA_MINIMAP_TOGGLE_ROW_CLASS_NAME =
  'flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink' as const;

/** Checkbox input styling for the minimap toggle. */
export const STYLING_WORLD_PLAZA_MINIMAP_CHECKBOX_CLASS_NAME =
  'size-3.5 shrink-0 cursor-pointer rounded border border-poster-teal/40 bg-white/80 accent-poster-gold' as const;
