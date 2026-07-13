/**
 * Settings preference: hide proximity interaction labels (click to show).
 *
 * @module components/world/interaction/domains/definingWorldPlazaHideActionsPreferenceConstants
 */

/** localStorage key for the hide-actions preference. */
export const DEFINING_WORLD_PLAZA_HIDE_ACTIONS_STORAGE_KEY =
  'world-plaza-hide-actions-enabled' as const;

/**
 * Default: off. Proximity still shows Light / Chop / Add Wood within 1 tile
 * until the player opts into click-only labels.
 */
export const DEFINING_WORLD_PLAZA_HIDE_ACTIONS_DEFAULT_ENABLED = false;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_HIDE_ACTIONS_TOGGLE = 'Hide Actions' as const;
