/**
 * Display, interact, trigger, and label constants for world caltrop traps.
 *
 * @module components/world/trap/domains/definingWorldPlazaCaltropConstants
 */

import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';

/** Default display scale relative to one isometric tile width. */
export const DEFINING_WORLD_PLAZA_CALTROP_DISPLAY_SCALE = 0.55;

/** Max Euclidean distance from player to caltrop for Pick up. */
export const DEFINING_WORLD_PLAZA_CALTROP_INTERACT_REACH_GRID = 2;

/** Walk-over trigger radius in grid tiles from the caltrop center. */
export const DEFINING_WORLD_PLAZA_CALTROP_TRIGGER_RADIUS_GRID = 0.4;

/** Public URL for the shipped 2x1 @ 32px caltrop sprite sheet. */
export const DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL =
  '/environment/sprites/props/trap/caltrop-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_COLUMN_COUNT = 2;
export const DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_ROW_COUNT = 1;
export const DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_CELL_PX = 32;

/** Sprite sheet frame indices: 0 armed, 1 spent (unused after remove). */
export const DEFINING_WORLD_PLAZA_CALTROP_FRAME_INDEX = {
  ARMED: 0,
  SPENT: 1,
} as const;

/** Flat bleed damage applied to the player on trigger. */
export const DEFINING_WORLD_PLAZA_CALTROP_PLAYER_BLEED_FLAT_DAMAGE = 8;

/** Flat bleed damage applied to wildlife on trigger (reserved). */
export const DEFINING_WORLD_PLAZA_CALTROP_WILDLIFE_BLEED_FLAT_DAMAGE = 8;

/** Slow buff applied on trigger (−50% speed). */
export const DEFINING_WORLD_PLAZA_CALTROP_SLOW_BUFF_ID =
  'sluggish-debuff' as const;

/** Bleed severity applied on trigger. */
export const DEFINING_WORLD_PLAZA_CALTROP_BLEED_SEVERITY = 'bleeding' as const;

/** localStorage key prefix for placed caltrops. */
export const DEFINING_WORLD_PLAZA_CALTROP_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-caltrops' as const;

/** Player-facing action labels. */
export const LABELING_WORLD_PLAZA_CALTROP_PICK_UP_ACTION = 'Pick up' as const;

/** Clickable action button chrome. */
export const DEFINING_WORLD_PLAZA_CALTROP_INTERACTION_LABEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME;

/** Vertical stack of caltrop actions. */
export const DEFINING_WORLD_PLAZA_CALTROP_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center justify-center gap-1.5' as const;
