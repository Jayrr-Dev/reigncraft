/**
 * Buff1 pillar VFX played once when the local avatar switches characters.
 *
 * @module components/world/domains/definingWorldPlazaAvatarCharacterSwitchEffectConstants
 */

import { DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION } from '@/components/world/domains/definingPublicSpriteAssetExtension';

/** Horizontal strip frame count for Buff1. */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FRAME_COUNT = 7;

/** Frame size in the packed Buff1 sheet (square cells). */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FRAME_SIZE_PX = 124;

/** Playback rate for the one-shot switch pillar. */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FPS = 12;

/** World-local scale so the 124px pillar sits around a plaza avatar. */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SPRITE_SCALE = 1.15;

/** Anchor at the base of the pillar (feet / ground). */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_X_NORMALIZED = 0.5;
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_Y_NORMALIZED = 1;

/**
 * Extra world-local Y below the avatar foot line so the pillar sits on the ground
 * instead of mid-body (positive = down in screen space).
 */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_GROUND_NUDGE_Y_PX = 10;

/** Draw above the body sprite and held-item overlay. */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_Z_INDEX = 3;

/** Public URL for the packed Buff1 horizontal strip. */
export const DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SHEET_URL =
  `/effects/sprites/buff1/buff1${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}` as const;
