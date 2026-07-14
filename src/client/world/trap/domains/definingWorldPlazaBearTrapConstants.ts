/**
 * Display, interact, trigger, and label constants for world bear traps.
 *
 * @module components/world/trap/domains/definingWorldPlazaBearTrapConstants
 */

import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';

/** Default display scale relative to one isometric tile width. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_DISPLAY_SCALE = 1;

/** Max Euclidean distance from player to trap for Arm / Disarm / Pick up. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACT_REACH_GRID = 2;

/** Pointer hit radius around the trap foot (tiles). */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_POINTER_HIT_RADIUS_TILES = 0.5;

/** Walk-over trigger radius in grid tiles from the trap center. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_TRIGGER_RADIUS_GRID = 0.45;

/** Closing snap animation duration (frame 0 -> 1 -> 2 -> 3) in ms. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_SNAP_DURATION_MS = 280;

/** Public URL for the shipped 4x1 @ 32px bear trap sprite sheet. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL =
  '/environment/sprites/props/trap/bear-trap-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_ROW_COUNT = 1;
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_CELL_PX = 32;

/**
 * Sprite sheet frame indices:
 * 0 open/armed, 1 early snap, 2 mid snap, 3 closed.
 */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX = {
  OPEN: 0,
  SNAP_EARLY: 1,
  SNAP_MID: 2,
  CLOSED: 3,
} as const;

/** Flat bleed damage applied to the player on trigger ("bleeding" severity). */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_PLAYER_BLEED_FLAT_DAMAGE = 12;

/** Flat bleed damage applied to wildlife on trigger. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_WILDLIFE_BLEED_FLAT_DAMAGE = 12;

/** Buff id refreshed on the player when a trap snares them. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_IMMOBILIZE_BUFF_ID =
  'immobilized-debuff' as const;

/** Bleed severity applied on trigger. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_BLEED_SEVERITY = 'bleeding' as const;

/** localStorage key prefix for placed bear traps. */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-bear-traps' as const;

/** Player-facing action labels. */
export const LABELING_WORLD_PLAZA_BEAR_TRAP_ARM_ACTION = 'Arm' as const;
export const LABELING_WORLD_PLAZA_BEAR_TRAP_DISARM_ACTION = 'Disarm' as const;
export const LABELING_WORLD_PLAZA_BEAR_TRAP_PICK_UP_ACTION = 'Pick up' as const;

/** Clickable action button chrome (campfire outlined text). */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME;

/** Vertical stack of trap actions (Arm / Disarm / Pick up). */
export const DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center justify-center gap-1.5' as const;
