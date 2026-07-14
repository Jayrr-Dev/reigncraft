import { definingWorldPlazaBiomeWorldNoiseFrequency } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Procedural flower forest biome climate band and body-noise rarity gate.
 *
 * Mid-humidity tiles without a body-noise hit fall through to plains so
 * flower forest stays mythic (rarer than rare, more common than Firelands).
 *
 * @module components/world/domains/definingWorldPlazaFlowerForestBiomeConstants
 */

/** Stable biome kind id for flower forest. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_BIOME_KIND =
  'flower_forest' as const satisfies DefiningWorldPlazaBiomeKind;

/**
 * Minimum humidity for the flower forest climate pre-filter.
 * Upper bound is the forest humidity floor in biome climate picking.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_HUMIDITY_MIN = 0.48;

/** Seed for the low-frequency flower forest body field. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_BODY_NOISE_SEED = 4729;

/** Frequency for flower forest body noise; lower values yield larger bloom patches. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_BODY_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(220);

/** Octaves for flower forest body noise. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_BODY_NOISE_OCTAVES = 3;

/**
 * Unit noise at or above which a mid-humidity tile becomes flower forest.
 * Tuned so coverage sits between rare biomes and legendary Firelands.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_BODY_NOISE_THRESHOLD = 0.74;

/** Expected world coverage band for flower forest (percent). */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MIN = 1.2;

/** Expected world coverage band for flower forest (percent). */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MAX = 2.5;
