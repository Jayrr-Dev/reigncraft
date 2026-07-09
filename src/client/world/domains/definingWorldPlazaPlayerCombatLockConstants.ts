/**
 * Player combat lock-on chase and auto-melee tuning.
 *
 * @module components/world/domains/definingWorldPlazaPlayerCombatLockConstants
 */

import { DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/** Grid reach that ends chase and allows auto-melee (same as click melee). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_MELEE_REACH_GRID =
  DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID;

/** Minimum interval between chase path replans while locked (ms). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_INTERVAL_MS = 120;

/** Max distance the locked target may move before a chase replan (grid). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CHASE_REPLAN_MOVE_GRID = 0.35;

/** Outer ring radius for the lock-on crosshair (screen px). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_RING_RADIUS_PX = 6;

/** Half-length of each crosshair tick arm (screen px). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_LENGTH_PX = 3;

/** Gap from center to the start of each tick arm (screen px). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_ARM_GAP_PX = 2;

/** Stroke width for the lock-on crosshair (screen px). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_WIDTH_PX = 1.25;

/** Crosshair stroke color (warm amber, readable on most biomes). */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_STROKE_COLOR = 0xf0c040;

/** Soft fill inside the ring. */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_COLOR = 0xf0c040;

/** Soft fill alpha inside the ring. */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_FILL_ALPHA = 0.12;

/**
 * Lift above the wildlife grid anchor toward chest height, scaled by size.
 * Tuned against default ~84px frames with 0.72 anchor.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_CHEST_LIFT_PX = 16;

/**
 * CSS cursor while hovering a live animal that can be attack-locked.
 * Native `crosshair` only: custom SVG data-URI cursors can render invisible
 * in the Devvit iframe / Chromium cursor path.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_HOVER_CURSOR =
  'crosshair' as const;
