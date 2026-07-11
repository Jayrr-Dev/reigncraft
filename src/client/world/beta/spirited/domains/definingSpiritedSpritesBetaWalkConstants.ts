/**
 * Spirited beta slide-walk tuning and facing map.
 *
 * Pack has one pose per 8 directions (no foot cycle). Walk = glide + facing
 * frame + optional bob so we can judge how bad it looks.
 *
 * @module components/world/beta/spirited/domains/definingSpiritedSpritesBetaWalkConstants
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Grid units per second while wandering. */
export const DEFINING_SPIRITED_SPRITES_BETA_WALK_SPEED_GRID_PER_SEC = 1.35;

/** How far from spawn origin a wander target may land (grid). */
export const DEFINING_SPIRITED_SPRITES_BETA_WANDER_RADIUS_GRID = 5.5;

/** Min / max seconds before picking a new wander target. */
export const DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC = 1.8;
export const DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MAX_SEC = 4.2;

/** Arrive distance before retargeting (grid). */
export const DEFINING_SPIRITED_SPRITES_BETA_WANDER_ARRIVE_GRID = 0.35;

/** Screen-space bob amplitude while moving (px, integer). */
export const DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_AMPLITUDE_PX = 1;

/** Bob cycles per second while moving. */
export const DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_HZ = 2.4;

/**
 * Spirited strip frames 0..7 → plaza walk directions.
 * Assumed clockwise from screen-Right (east-ish side view).
 */
export const DEFINING_SPIRITED_SPRITES_BETA_FACING_FRAME_BY_WALK_DIRECTION: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Right: 0,
  DownRight: 1,
  Down: 2,
  DownLeft: 3,
  Left: 4,
  UpLeft: 5,
  Up: 6,
  UpRight: 7,
};
