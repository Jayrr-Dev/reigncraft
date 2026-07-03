/**
 * Surface water variants for the plaza world.
 *
 * @module components/world/domains/definingWorldPlazaWaterKind
 */

/** Large deep still body of water; blocks movement. */
export const DEFINING_WORLD_PLAZA_WATER_KIND_LAKE = "lake" as const;

/** Long fast-flowing channel; blocks movement. */
export const DEFINING_WORLD_PLAZA_WATER_KIND_RIVER = "river" as const;

/** Short narrow trickle; requires a jump to cross. */
export const DEFINING_WORLD_PLAZA_WATER_KIND_STREAM = "stream" as const;

/** Small still pool, lighter and greener than a lake; blocks movement. */
export const DEFINING_WORLD_PLAZA_WATER_KIND_POND = "pond" as const;

/** Murky swamp-colored pool, larger than a pond; blocks movement. */
export const DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND = "swamp_pond" as const;

/** Surface water variant on one tile. */
export type DefiningWorldPlazaWaterKind =
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_LAKE
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_RIVER
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_POND
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND;
