/**
 * Night brightness tuning for self-lit world features (lava, campfires).
 *
 * These sources publish light holes in the darkness layer and get a sprite
 * alpha boost so they stay readable under the CSS sky tint at midnight.
 *
 * @module components/world/domains/definingWorldPlazaEmissiveNightBoostConstants
 */

/** Lava lightmap hole brightness (0..1, renderer caps at 1). */
export const DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BRIGHTNESS = 1;

/** Lava glow footprint for a single-tile pool (1 ≈ player torch). */
export const DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BASE_RADIUS_SCALE = 1.7;

/** Max lava glow footprint for very large pools. */
export const DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_MAX_RADIUS_SCALE = 4.5;

/** Lava texture alpha multiplier at deepest midnight (1 = daytime baseline). */
export const DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_SPRITE_ALPHA_BOOST_AT_MIDNIGHT = 1.4;

/** Campfire flame alpha multiplier at deepest midnight. */
export const DEFINING_WORLD_PLAZA_EMISSIVE_CAMPFIRE_FLAME_ALPHA_BOOST_AT_MIDNIGHT = 1.45;
