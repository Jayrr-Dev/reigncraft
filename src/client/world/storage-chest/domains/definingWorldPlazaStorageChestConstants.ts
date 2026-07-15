/**
 * Layout and persistence constants for craftable player storage chests.
 *
 * @module components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants
 */

import { DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';

/** Slot grid columns for one storage chest. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS = 6;

/** Slot grid rows for one storage chest. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS = 6;

/** Total slots (6×6). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY =
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS *
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS;

/** localStorage key prefix: `world-plaza-storage-chest:{ownerId}`. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-storage-chest' as const;

/** Player-facing panel title. */
export const LABELING_WORLD_PLAZA_STORAGE_CHEST_PANEL = 'Chest' as const;

/** Player-facing Open action label. */
export const LABELING_WORLD_PLAZA_STORAGE_CHEST_OPEN_ACTION = 'Open' as const;

/** Clickable Open button chrome (campfire outlined text). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_INTERACTION_LABEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME;

/** Display scale for placed storage chest sprites (player footlocker size). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_DISPLAY_SCALE =
  DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE;

/** Closed lid sprite for placed storage chests. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_CLOSED =
  '/environment/sprites/props/chest/chest-a-s-closed.webp' as const;

/** Open lid sprite while the storage UI is open. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_OPEN =
  '/environment/sprites/props/chest/chest-a-s-open.webp' as const;
