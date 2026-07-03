import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT } from "@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants";

/**
 * Progress exponent for fall displacement (distance ∝ progress^exp).
 * Values above 2 increase terminal speed and late-fall acceleration.
 */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_GRAVITY_PROGRESS_EXPONENT = 2.75;

/** Minimum fall duration regardless of drop height (ms). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_DURATION_MS = 110;

/** Extra fall time added per world layer descended (ms). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_DURATION_MS_PER_LAYER = 62;

/** Fall animation frames per second (loops until landing). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_ANIMATION_FPS = 14;

/**
 * Minimum layer drop before the fall strip plays. Single-layer steps use normal
 * walk-down collision instead of a dedicated fall animation.
 */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_LAYER_DELTA = 2;

/** Sprite direction strip used while falling. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_SPRITE_DIRECTION = "Down" as const;

/** Jump sheet reused for the fall strip. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MOTION_SHEET_LAYOUT =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT;
