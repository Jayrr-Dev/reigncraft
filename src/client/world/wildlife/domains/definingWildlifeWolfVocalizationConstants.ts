/**
 * Grey wolf howl timing and attack combo tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants
 */

/** How long the howl one-shot clip locks movement (ms). */
export const DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS = 1_800;

/** Minimum gap between howls on one wolf (ms). */
export const DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS = 14_000;

/** Combo resets if this long passes between bites (ms). */
export const DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS = 3_200;

/** Hold time for the second bite clip (ms). */
export const DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS = 480;

/** Hold time for the lunge finisher clip (ms). */
export const DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS = 650;

/** Damage multiplier for the quick snap bite. */
export const DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER = 1.15;

/** Damage multiplier for the lunging finisher. */
export const DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER = 1.4;
