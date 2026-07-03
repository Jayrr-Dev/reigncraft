/**
 * Tuning for running on ice: slippery momentum while moving, short slide on stop.
 *
 * @module components/world/domains/definingWorldPlazaIceSlideConstants
 */

import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/**
 * Grid run speed on ice (grid units per second on horizontal screen axis).
 *
 * Slower than dry land; ice run trades speed for lower stamina use and a post-stop slide.
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_GRID_RUN_SPEED_PER_SECOND = 2.2;

/** Screen run speed on ice (pixels per second). */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND =
  DEFINING_WORLD_PLAZA_ICE_SLIDE_GRID_RUN_SPEED_PER_SECOND *
  Math.SQRT2 *
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

/**
 * How quickly run velocity catches up to input on ice (per second).
 *
 * Lower values feel slipperier because direction changes lag behind.
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_ACCELERATION_PER_SECOND = 4;

/**
 * Velocity decay while sliding after input stops (per second).
 *
 * Lower values carry the player forward a bit farther.
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_FRICTION_PER_SECOND = 0.95;

/**
 * Slide speed below which movement stops (grid units per second).
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_MIN_SPEED_GRID_PER_SECOND = 0.06;

/** Minimum run animation scale while ice momentum is still building during a run. */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_RUN_ANIMATION_MIN_SCALE = 0.45;

/**
 * Run strip frame used when the slide starts before a live run frame was captured.
 *
 * Mid-stride on the 5-frame GirlSample run strip.
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_FALLBACK_RUN_FRAME_INDEX = 2;

/**
 * Stamina drain multiplier while actively running on frozen water.
 *
 * Values below 1 drain slower than dry-land running.
 */
export const DEFINING_WORLD_PLAZA_ICE_SLIDE_STAMINA_DRAIN_MULTIPLIER = 0.65;
