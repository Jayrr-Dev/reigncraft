/**
 * Permanent species passives applied to wildlife health at spawn.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Turtle shell: defender roll skew toward blocked (same units as tower-shield). */
export const DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS = 1;

/** Stable damage-roll modifier id for turtle shell block bias. */
export const DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID =
  'wildlife-turtle-shell-incoming-block-bias';

/**
 * Obese turtles render and collide at this multiple of same-tier non-obese size.
 * Also multiplies the shared obese health boost (so fat turtles get 10x HP gain).
 */
export const DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER = 10;

/** True when this species uses the oversized obese-turtle presentation. */
export function checkingWildlifeSpeciesHasObeseTurtleBoost(
  speciesId: DefiningWildlifeSpeciesId
): boolean {
  return speciesId === 'turtle';
}
