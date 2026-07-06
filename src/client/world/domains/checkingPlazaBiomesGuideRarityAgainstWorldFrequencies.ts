import {
  DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES,
  DEFINING_PLAZA_BIOMES_LEGENDARY_KIND,
  type DefiningPlazaBiomesGuideEntry,
  type PlazaBiomesRarityId,
} from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  listingWorldPlazaBiomeFrequencyPercents,
  type WorldPlazaBiomeFrequencySample,
} from '@/components/world/domains/computingWorldPlazaBiomeFrequencySample';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MAX,
  DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MIN,
} from '@/components/world/domains/definingWorldPlazaBiomeFrequencySamplingConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

const PLAZA_BIOMES_RARITY_ORDER: readonly PlazaBiomesRarityId[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
] as const;

function averagingPlazaBiomesGuideRarityTierPercent(
  guideEntries: readonly DefiningPlazaBiomesGuideEntry[],
  percentsByKind: ReadonlyMap<DefiningWorldPlazaBiomeKind, number>,
  rarity: PlazaBiomesRarityId
): number | null {
  const tierPercents = guideEntries
    .filter((entry) => entry.rarity === rarity)
    .map((entry) => percentsByKind.get(entry.kind) ?? 0);

  if (tierPercents.length === 0) {
    return null;
  }

  return (
    tierPercents.reduce((total, percent) => total + percent, 0) /
    tierPercents.length
  );
}

/**
 * Compares codex rarity tiers against a procedural world frequency sample.
 *
 * Returns human-readable mismatch messages for tests and future tooling.
 *
 * @param sample - Sampled biome hit counts.
 * @param guideEntries - Codex rarity assignments to validate.
 */
export function listingPlazaBiomesGuideRarityWorldFrequencyMismatches(
  sample: WorldPlazaBiomeFrequencySample,
  guideEntries: readonly DefiningPlazaBiomesGuideEntry[] = DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES
): string[] {
  const mismatches: string[] = [];
  const percentRows = listingWorldPlazaBiomeFrequencyPercents(sample);
  const percentsByKind = new Map(
    percentRows.map((row) => [row.kind, row.percent] as const)
  );
  const legendaryEntries = guideEntries.filter(
    (entry) => entry.rarity === 'legendary'
  );

  if (legendaryEntries.length !== 1) {
    mismatches.push(
      `Expected exactly one legendary codex biome, found ${legendaryEntries.length}.`
    );
  }

  if (legendaryEntries[0]?.kind !== DEFINING_PLAZA_BIOMES_LEGENDARY_KIND) {
    mismatches.push(
      `Legendary codex biome must be ${DEFINING_PLAZA_BIOMES_LEGENDARY_KIND}.`
    );
  }

  const rarestRow = percentRows.at(-1);
  if (rarestRow?.kind !== DEFINING_PLAZA_BIOMES_LEGENDARY_KIND) {
    mismatches.push(
      `Expected ${DEFINING_PLAZA_BIOMES_LEGENDARY_KIND} to be the rarest sampled biome, but got ${rarestRow?.kind ?? 'none'}.`
    );
  }

  const firelandsPercent = percentsByKind.get(
    DEFINING_PLAZA_BIOMES_LEGENDARY_KIND
  );
  if (firelandsPercent === undefined) {
    mismatches.push('Firelands was missing from the frequency sample.');
  } else if (
    firelandsPercent < DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MIN ||
    firelandsPercent > DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MAX
  ) {
    mismatches.push(
      `Firelands coverage ${firelandsPercent.toFixed(2)}% is outside ${DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MIN}% to ${DEFINING_WORLD_PLAZA_FIRELANDS_COVERAGE_PERCENT_MAX}%.`
    );
  }

  for (const entry of guideEntries) {
    if ((sample.counts[entry.kind] ?? 0) <= 0) {
      mismatches.push(
        `Biome ${entry.kind} never appeared in the frequency sample.`
      );
    }
  }

  const tierAverages = Object.fromEntries(
    PLAZA_BIOMES_RARITY_ORDER.map((rarity) => [
      rarity,
      averagingPlazaBiomesGuideRarityTierPercent(
        guideEntries,
        percentsByKind,
        rarity
      ),
    ])
  ) as Record<PlazaBiomesRarityId, number | null>;

  for (
    let tierIndex = 0;
    tierIndex < PLAZA_BIOMES_RARITY_ORDER.length - 1;
    tierIndex += 1
  ) {
    const currentRarity = PLAZA_BIOMES_RARITY_ORDER[tierIndex];
    const nextRarity = PLAZA_BIOMES_RARITY_ORDER[tierIndex + 1];
    const currentAverage = tierAverages[currentRarity];
    const nextAverage = tierAverages[nextRarity];

    if (currentAverage === null || nextAverage === null) {
      continue;
    }

    if (currentAverage <= nextAverage) {
      mismatches.push(
        `Expected average ${currentRarity} coverage (${currentAverage.toFixed(2)}%) to exceed ${nextRarity} (${nextAverage.toFixed(2)}%).`
      );
    }
  }

  return mismatches;
}
