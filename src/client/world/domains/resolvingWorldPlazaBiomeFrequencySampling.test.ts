import { listingPlazaBiomesGuideRarityWorldFrequencyMismatches } from '@/components/world/domains/checkingPlazaBiomesGuideRarityAgainstWorldFrequencies';
import {
  computingWorldPlazaBiomeFrequencySample,
  listingWorldPlazaBiomeFrequencyPercents,
} from '@/components/world/domains/computingWorldPlazaBiomeFrequencySample';
import {
  DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_COUNT,
  DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_RADIUS,
} from '@/components/world/domains/definingWorldPlazaBiomeFrequencySamplingConstants';
import { describe, expect, it } from 'vitest';

/**
 * Reusable guardrail for codex biome rarity vs procedural world coverage.
 *
 * When world-gen changes, run:
 * `pnpm exec vitest run src/client/world/domains/resolvingWorldPlazaBiomeFrequencySampling.test.ts`
 *
 * Related code:
 * - `computingWorldPlazaBiomeFrequencySample.ts` (sampler)
 * - `checkingPlazaBiomesGuideRarityAgainstWorldFrequencies.ts` (rules)
 * - `definingPlazaBiomesGuideConstants.ts` (codex rarity data)
 */
describe('world biome frequency sampling', () => {
  it('keeps codex rarity tiers aligned with procedural coverage', () => {
    const sample = computingWorldPlazaBiomeFrequencySample(
      DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_COUNT,
      DEFINING_WORLD_PLAZA_BIOME_FREQUENCY_SAMPLE_RADIUS
    );
    const percentRows = listingWorldPlazaBiomeFrequencyPercents(sample);

    // eslint-disable-next-line no-console
    console.table(
      percentRows.map((row) => ({
        biome: row.kind,
        percent: `${row.percent.toFixed(2)}%`,
        tiles: row.count,
      }))
    );

    const mismatches =
      listingPlazaBiomesGuideRarityWorldFrequencyMismatches(sample);

    expect(mismatches, mismatches.join('\n')).toEqual([]);
  });
});
