import { DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_KINDS } from '@/components/world/domains/definingWorldPlazaBiomeFrequencySamplingConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';

/**
 * Result of sampling procedural biome placement across random world tiles.
 *
 * @module components/world/domains/computingWorldPlazaBiomeFrequencySample
 */

export type WorldPlazaBiomeFrequencySample = {
  sampleCount: number;
  radius: number;
  counts: Record<DefiningWorldPlazaBiomeKind, number>;
};

export type WorldPlazaBiomeFrequencyPercentRow = {
  kind: DefiningWorldPlazaBiomeKind;
  count: number;
  percent: number;
};

/**
 * Samples biome kinds at random tile coordinates and returns hit counts.
 *
 * @param sampleCount - Number of random tiles to probe.
 * @param radius - Half-width of the square sampling window around the origin.
 * @param random - Optional RNG for deterministic tests.
 */
export function computingWorldPlazaBiomeFrequencySample(
  sampleCount: number,
  radius: number,
  random: () => number = Math.random
): WorldPlazaBiomeFrequencySample {
  const counts = Object.fromEntries(
    DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_KINDS.map((kind) => [kind, 0])
  ) as Record<DefiningWorldPlazaBiomeKind, number>;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const tileX = Math.floor(random() * radius * 2) - radius;
    const tileY = Math.floor(random() * radius * 2) - radius;
    const kind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;
    counts[kind] += 1;
  }

  return {
    sampleCount,
    radius,
    counts,
  };
}

/**
 * Converts a frequency sample into sorted coverage rows (highest first).
 *
 * @param sample - Sampled biome hit counts.
 */
export function listingWorldPlazaBiomeFrequencyPercents(
  sample: WorldPlazaBiomeFrequencySample
): WorldPlazaBiomeFrequencyPercentRow[] {
  return DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_KINDS.map((kind) => ({
    kind,
    count: sample.counts[kind],
    percent: (sample.counts[kind] / sample.sampleCount) * 100,
  })).sort((left, right) => right.percent - left.percent);
}
