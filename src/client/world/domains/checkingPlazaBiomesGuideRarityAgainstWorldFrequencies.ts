import {
  DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES,
  DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS,
  DEFINING_PLAZA_BIOMES_MYTHIC_KIND,
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
import {
  DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MIN,
} from '@/components/world/domains/definingWorldPlazaFlowerForestBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MAX,
  DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MIN,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';

const PLAZA_BIOMES_RARITY_ORDER: readonly PlazaBiomesRarityId[] = [
  'common',
  'uncommon',
  'rare',
  'mythic',
  'legendary',
] as const;

const PLAZA_BIOMES_LEGENDARY_KIND_SET = new Set<DefiningWorldPlazaBiomeKind>(
  DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS
);

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
  const mythicEntries = guideEntries.filter(
    (entry) => entry.rarity === 'mythic'
  );

  if (mythicEntries.length !== 1) {
    mismatches.push(
      `Expected exactly one mythic codex biome, found ${mythicEntries.length}.`
    );
  }

  if (mythicEntries[0]?.kind !== DEFINING_PLAZA_BIOMES_MYTHIC_KIND) {
    mismatches.push(
      `Mythic codex biome must be ${DEFINING_PLAZA_BIOMES_MYTHIC_KIND}.`
    );
  }

  const legendaryEntries = guideEntries.filter(
    (entry) => entry.rarity === 'legendary'
  );

  if (legendaryEntries.length !== DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS.length) {
    mismatches.push(
      `Expected exactly ${DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS.length} legendary codex biomes, found ${legendaryEntries.length}.`
    );
  }

  const legendaryKinds = new Set(legendaryEntries.map((entry) => entry.kind));
  for (const expectedKind of DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS) {
    if (!legendaryKinds.has(expectedKind)) {
      mismatches.push(
        `Legendary codex biomes must include ${expectedKind}.`
      );
    }
  }

  const rarestRow = percentRows.at(-1);
  if (
    rarestRow === undefined ||
    !PLAZA_BIOMES_LEGENDARY_KIND_SET.has(rarestRow.kind)
  ) {
    mismatches.push(
      `Expected a legendary biome (firelands or frostsink) to be the rarest sampled biome, but got ${rarestRow?.kind ?? 'none'}.`
    );
  }

  const flowerForestPercent = percentsByKind.get(
    DEFINING_PLAZA_BIOMES_MYTHIC_KIND
  );
  if (flowerForestPercent === undefined) {
    mismatches.push('Flower forest was missing from the frequency sample.');
  } else if (
    flowerForestPercent <
      DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MIN ||
    flowerForestPercent >
      DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MAX
  ) {
    mismatches.push(
      `Flower forest coverage ${flowerForestPercent.toFixed(2)}% is outside ${DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MIN}% to ${DEFINING_WORLD_PLAZA_FLOWER_FOREST_COVERAGE_PERCENT_MAX}%.`
    );
  }

  const firelandsPercent = percentsByKind.get('firelands');
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

  const frostsinkPercent = percentsByKind.get('frostsink');
  if (frostsinkPercent === undefined) {
    mismatches.push('Frostsink was missing from the frequency sample.');
  } else if (
    frostsinkPercent < DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MIN ||
    frostsinkPercent > DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MAX
  ) {
    mismatches.push(
      `Frostsink coverage ${frostsinkPercent.toFixed(2)}% is outside ${DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MIN}% to ${DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MAX}%.`
    );
  }

  if (flowerForestPercent !== undefined) {
    if (
      firelandsPercent !== undefined &&
      flowerForestPercent <= firelandsPercent
    ) {
      mismatches.push(
        `Expected mythic flower forest coverage (${flowerForestPercent.toFixed(2)}%) to exceed legendary Firelands (${firelandsPercent.toFixed(2)}%).`
      );
    }

    if (
      frostsinkPercent !== undefined &&
      flowerForestPercent <= frostsinkPercent
    ) {
      mismatches.push(
        `Expected mythic flower forest coverage (${flowerForestPercent.toFixed(2)}%) to exceed legendary Frostsink (${frostsinkPercent.toFixed(2)}%).`
      );
    }
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
