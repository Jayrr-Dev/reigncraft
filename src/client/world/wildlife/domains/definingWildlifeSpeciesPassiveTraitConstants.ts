/**
 * Permanent species passives (spawn health modifiers and behavior trait knobs).
 *
 * Opt-in trait ids live in `definingWildlifePassiveTraitRegistry.ts`. Tunables
 * that those traits consume (restore ratios, shell bias, etc.) stay here.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants
 */

import { DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifePassiveTraitRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Turtle shell: defender roll skew toward blocked (same units as tower-shield). */
export const DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS = 1;

/** Stable damage-roll modifier id for turtle shell block bias. */
export const DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID =
  'wildlife-turtle-shell-incoming-block-bias';

/**
 * Obese turtles render and collide at this multiple of same-tier non-obese size.
 * Also multiplies the shared obese health boost (so fat turtles get 3x HP gain).
 */
export const DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER = 3;

/**
 * Adrenaline Rush: fraction of instance max stamina restored on flee entry.
 * `1` means a full bar (clears exhaustion).
 */
export const DEFINING_WILDLIFE_ADRENALINE_RUSH_STAMINA_RESTORE_RATIO = 1;

/** Catalog / bestiary label for the flee-stamina restore passive. */
export const DEFINING_WILDLIFE_ADRENALINE_RUSH_TRAIT_NAME =
  DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY['adrenaline-rush'].displayName;

/** Catalog / bestiary label for wildlife that never draw predator aggro. */
export const DEFINING_WILDLIFE_NEVER_TRIGGERS_WILDLIFE_AGGRO_TRAIT_NAME =
  DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY['never-triggers-wildlife-aggro']
    .displayName;

/** Catalog / bestiary label for undying wildlife. */
export const DEFINING_WILDLIFE_IMMORTAL_TRAIT_NAME =
  DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY.immortal.displayName;

/**
 * After an Unnoticed animal lands a hit on wildlife, predators may hunt it
 * until this many ms later.
 */
export const DEFINING_WILDLIFE_UNNOTICED_PROVOKE_DURATION_MS = 45_000;

/** True when this species uses the oversized obese-turtle presentation. */
export function checkingWildlifeSpeciesHasObeseTurtleBoost(
  speciesId: DefiningWildlifeSpeciesId
): boolean {
  return speciesId === 'turtle';
}
