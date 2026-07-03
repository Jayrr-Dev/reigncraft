import { DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/**
 * Character turn-in-place controls for the plaza avatar.
 *
 * @module components/world/domains/definingWorldPlazaCharacterFacingRotationConstants
 */

/** Secondary (right) mouse button for hold-to-face-the-pointer. */
export const DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTON =
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON;

/** Right-button bit in {@link PointerEvent.buttons}. */
export const DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTONS_MASK =
  2 as const;

/** Minimum interval between facing sync messages while turning (ms). */
export const DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_NETWORK_INTERVAL_MS =
  150;
