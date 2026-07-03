/**
 * Procedural rocky biome climate thresholds.
 *
 * Shared by biome classification and rocky-centrality scaling so the rocky
 * band used for boulder size matches the band that assigns the rocky biome.
 *
 * @module components/world/domains/definingWorldPlazaBiomeRockyClimateConstants
 */

/** Minimum temperature for rocky stone fields. */
export const DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MIN = 0.36;

/** Maximum temperature for rocky stone fields. */
export const DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MAX = 0.58;

/** Minimum humidity for rocky stone fields. */
export const DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MIN = 0.26;

/** Maximum humidity for rocky stone fields. */
export const DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MAX = 0.44;

/** Climate-space center of the rocky temperature band. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_CENTER =
  (DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MIN +
    DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MAX) /
  2;

/** Half-width of the rocky temperature band. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_HALF_RANGE =
  (DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MAX -
    DEFINING_WORLD_PLAZA_BIOME_ROCKY_TEMPERATURE_MIN) /
  2;

/** Climate-space center of the rocky humidity band. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_CENTER =
  (DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MIN +
    DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MAX) /
  2;

/** Half-width of the rocky humidity band. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_HALF_RANGE =
  (DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MAX -
    DEFINING_WORLD_PLAZA_BIOME_ROCKY_HUMIDITY_MIN) /
  2;
