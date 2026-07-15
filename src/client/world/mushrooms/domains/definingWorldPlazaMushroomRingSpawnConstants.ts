/**
 * Declarative fairy-ring mushroom layout sizes (utility only; not wired to spawn).
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants
 */

/** Allowed mushroom counts on one fairy ring. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS = [
  4, 5, 7, 11,
] as const;

export type DefiningWorldPlazaMushroomRingSpawnCount =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS)[number];

/**
 * Default tile radius per ring count.
 * Sized so adjacent rounded tiles stay distinct (chord ≥ ~1 tile).
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_DEFAULT_RADIUS_TILES_BY_COUNT =
  {
    4: 2,
    5: 2,
    7: 3,
    11: 4,
  } as const satisfies Record<
    DefiningWorldPlazaMushroomRingSpawnCount,
    number
  >;

/** Extra radius steps when a rounded tile collides with another ring seat. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_RADIUS_STEP_TILES = 0.5;

/** Max outward nudges when resolving a duplicate tile after rounding. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COLLISION_MAX_ATTEMPTS = 12;
