/**
 * CSS cursor values for plaza viewport hover over clickable world targets.
 *
 * @module components/world/interaction/domains/definingWorldPlazaInteractablePointerCursorConstants
 */

/** Cursor while the pointer is over a choppable tree or campfire. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_HOVER_CURSOR =
  'pointer' as const;

/**
 * Cursor while hovering a wildlife corpse (study / inspect).
 * Native `help` (pointer / arrow with ?) — custom SVG cursors can vanish
 * in the Devvit iframe.
 */
export const DEFINING_WORLD_PLAZA_CORPSE_POINTER_HOVER_CURSOR = 'help' as const;

/** Default viewport cursor when not over an interactable hover target. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR =
  '' as const;
