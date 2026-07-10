import { definingWorldPlazaBiomeWorldNoiseFrequency } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { DEFINING_WORLD_PLAZA_OCEAN_SHORE_MAX_WIDTH_BLOCKS } from '@/components/world/domains/definingWorldPlazaOceanShoreConstants';

/**
 * Procedural ocean biome climate thresholds.
 *
 * @module components/world/domains/definingWorldPlazaOceanBiomeConstants
 */

/**
 * Euclidean tile radius around the plaza origin where open ocean cannot spawn.
 * Sized past the widest sandy beach ring so coastline does not hug spawn.
 */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_GRID =
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_MAX_WIDTH_BLOCKS + 20;

/** Squared ocean spawn clearing radius (avoids sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_GRID;

/** Minimum humidity for open ocean regions. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_HUMIDITY_MIN = 0.84;

/** Minimum temperature for open ocean regions. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MIN = 0.38;

/** Maximum temperature for open ocean regions. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_TEMPERATURE_MAX = 0.72;

/** Seed for the low-frequency ocean body field. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_SEED = 9127;

/** Frequency for ocean body noise; lower values yield larger seas. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(220);

/** Octaves for ocean body noise. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_OCTAVES = 3;

/** Unit noise at or above which a humid tile becomes open ocean. */
export const DEFINING_WORLD_PLAZA_OCEAN_BIOME_BODY_NOISE_THRESHOLD = 0.56;
