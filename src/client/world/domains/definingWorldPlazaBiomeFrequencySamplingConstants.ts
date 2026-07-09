import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Defaults for procedural biome coverage sampling.
 *
 * Used by {@link computingWorldPlazaBiomeFrequencySample} and
 * {@link resolvingWorldPlazaBiomeFrequencySampling.test.ts}.
 *
 * @module components/world/domains/definingWorldPlazaBiomeFrequencySamplingConstants
 */

/** Tile samples per frequency run. */
export const DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_COUNT = 300_000;

/** Random tile coordinate radius around world origin. */
export const DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_RADIUS = 3000;

/** Expected world coverage band for Firelands (percent). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MIN = 0.5;

/** Expected world coverage band for Firelands (percent). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MAX = 3;

/** Biome kinds included in coverage sampling. */
export const DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_KINDS: readonly DefiningWorldPlazaBiomeKind[] =
  [
    'plains',
    'forest',
    'flower_forest',
    'jungle',
    'desert',
    'snowy_plains',
    'swamp',
    'savanna',
    'badlands',
    'beach',
    'ocean',
    'rocky',
    'firelands',
  ] as const;
