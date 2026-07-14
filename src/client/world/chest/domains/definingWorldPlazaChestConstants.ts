/**
 * Display, interact, preload, and label constants for world chest props.
 *
 * @module components/world/chest/domains/definingWorldPlazaChestConstants
 */

import type {
  DefiningWorldPlazaChestFacing,
  DefiningWorldPlazaChestVariant,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { formattingWorldPlazaChestSpriteUrl } from '@/components/world/chest/domains/formattingWorldPlazaChestSpriteUrl';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';

/** Default display scale relative to one isometric tile width. */
export const DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE = 1;

/** Default circle collision radius in grid units. */
export const DEFINING_WORLD_PLAZA_CHEST_COLLISION_RADIUS_GRID = 0.35;

/** Max Euclidean distance from player to chest for Open. */
export const DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID = 2;

/** Pointer hit radius around the chest foot (tiles). */
export const DEFINING_WORLD_PLAZA_CHEST_POINTER_HIT_RADIUS_TILES = 0.85;

/** localStorage key prefix for opened chest ids. */
export const DEFINING_WORLD_PLAZA_OPENED_CHESTS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-opened-chests' as const;

/** Player-facing Open action label. */
export const LABELING_WORLD_PLAZA_CHEST_OPEN_ACTION = 'Open' as const;

/** Player-facing Locked action label (disabled). */
export const LABELING_WORLD_PLAZA_CHEST_LOCKED_ACTION = 'Locked' as const;

/** Clickable Open button chrome (campfire outlined text). */
export const DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME;

/** Greyed Locked button chrome. */
export const DEFINING_WORLD_PLAZA_CHEST_INTERACTION_LABEL_DISABLED_BUTTON_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME} opacity-45 cursor-not-allowed` as const;

const DEFINING_WORLD_PLAZA_CHEST_VARIANTS: readonly DefiningWorldPlazaChestVariant[] =
  ['a', 'b'];

const DEFINING_WORLD_PLAZA_CHEST_FACINGS: readonly DefiningWorldPlazaChestFacing[] =
  ['n', 'e', 's', 'w'];

/** All shipped chest sprite URLs (16): variant × facing × closed/open. */
export const DEFINING_WORLD_PLAZA_CHEST_SPRITE_URLS: readonly string[] =
  DEFINING_WORLD_PLAZA_CHEST_VARIANTS.flatMap((variant) =>
    DEFINING_WORLD_PLAZA_CHEST_FACINGS.flatMap((facing) => [
      formattingWorldPlazaChestSpriteUrl(variant, facing, 'closed'),
      formattingWorldPlazaChestSpriteUrl(variant, facing, 'open'),
    ])
  );
