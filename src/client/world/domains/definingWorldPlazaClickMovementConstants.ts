/**
 * Click-to-move tuning for the plaza avatar.
 *
 * @module components/world/domains/definingWorldPlazaClickMovementConstants
 */

/** Screen-space distance (px) at which the avatar snaps to the click target. */
export const DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_ARRIVAL_THRESHOLD_PX = 4;

/** Minimum interval between Colyseus move messages during click walks (ms). */
export const DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_NETWORK_INTERVAL_MS = 250;

/** Data attribute for HUD controls that must not trigger walk clicks. */
export const DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE = 'data-plaza-ui' as const;

/** Selector for plaza HUD elements that block walk clicks. */
export const DEFINING_WORLD_PLAZA_UI_SELECTOR = '[data-plaza-ui]' as const;

/**
 * Minimum interval between held-pointer steer target refreshes (ms).
 * Each refresh clamps the projected target to walkable ground with a
 * binary-search collision scan, which is too costly to run every frame
 * on mobile. The destination sits well ahead of the avatar, so 10Hz
 * re-aiming is indistinguishable from per-frame updates.
 */
export const DEFINING_WORLD_PLAZA_HELD_POINTER_STEER_INTERVAL_MS = 100;

/** Primary (left) mouse button for click-to-move. */
export const DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON = 0;

/** Secondary (right) mouse button; reserved for turn-in-place on the plaza. */
export const DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON = 2;
