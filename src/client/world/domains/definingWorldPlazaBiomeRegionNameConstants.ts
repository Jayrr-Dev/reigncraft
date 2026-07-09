/**
 * Deterministic unique names for biome region cells.
 *
 * Each 32×32 tile region gets one permanent display name derived from its
 * coordinates and biome kind. Same world layout always yields the same name.
 *
 * @module components/world/domains/definingWorldPlazaBiomeRegionNameConstants
 */

/** Seed salt mixed into region name hashes (stable across sessions). */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SEED_SALT = 0x52e61a0d;

/** Extra salt for adjective index selection. */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_ADJECTIVE_SALT = 17;

/** Extra salt for noun index selection. */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_NOUN_SALT = 41;

/** Extra salt for optional connector / pattern pick. */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_PATTERN_SALT = 73;
