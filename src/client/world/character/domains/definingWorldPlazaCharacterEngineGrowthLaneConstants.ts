/**
 * Growth-lane offsets for unlocked animal transforms.
 *
 * Catalog vitals/stats are mature (parity) numbers. Unlocked animals start
 * `STARTING_LEVEL_OFFSET` levels behind that lane so the player grows the form.
 *
 * @module components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants
 */

/**
 * Level-bonus offset applied to every unlocked animal transform at spawn.
 * At level 1 with offset −20: effective = mature − 20 × perLevel.
 * At level 21: effective matches today's catalog level-1 (parity).
 */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET =
  -20 as const;

/**
 * Character level where an unlocked transform reaches catalog mature stats.
 * Equals `1 + |STARTING_LEVEL_OFFSET|`.
 */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL =
  1 -
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET;

/** Floor for derived max HP while growing from a deep negative lane. */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_EFFECTIVE_MAX_HEALTH = 100;

/** Floor for derived attack power while growing from a deep negative lane. */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_ATTACK_POWER = 1;

/** Floor for derived defense while growing from a deep negative lane. */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GROWTH_LANE_MIN_DEFENSE = 0;
