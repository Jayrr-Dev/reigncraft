/**
 * Declarative knobs for the smelting / firing speed-up tap mini-game.
 *
 * @module components/world/crafting/domains/definingWorldPlazaOreSmeltingBoostConstants
 */

/** Fraction of base craft duration removed per successful tap. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_RATIO_OF_BASE = 0.14;

/** Floor for one tap boost so short crafts still feel snappy. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MS_MIN = 2_500;

/** Never finish a craft in the same frame as a tap (ms remaining after boost). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MIN_REMAINING_MS = 250;

/** How long the tappable prompt stays on screen. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_VISIBLE_MS = 1_800;

/** Random delay before the next prompt appears (inclusive min). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_SPAWN_MIN_MS = 2_200;

/** Random delay before the next prompt appears (inclusive max). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_SPAWN_MAX_MS = 5_500;

/** Horizontal spawn band for the tap prompt (percent of bar width). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_LEFT_PERCENT_MIN = 12;

export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_LEFT_PERCENT_MAX = 88;

/** Iconify id for the tappable boost prompt (must be bundled). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT_ICON =
  'mdi:hammer' as const;

export const LABELING_WORLD_PLAZA_ORE_SMELTING_BOOST_PROMPT =
  'Tap to speed up crafting' as const;
