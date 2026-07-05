import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { describe, expect, it } from 'vitest';

const BIOME_KINDS: readonly DefiningWorldPlazaBiomeKind[] = [
  'plains',
  'forest',
  'flower_forest',
  'desert',
  'snowy_plains',
  'swamp',
  'savanna',
  'badlands',
  'beach',
  'ocean',
  'rocky',
  'firelands',
];

function samplingBiomeFrequenciesForTest(sampleCount: number, radius: number) {
  const counts = Object.fromEntries(
    BIOME_KINDS.map((kind) => [kind, 0])
  ) as Record<DefiningWorldPlazaBiomeKind, number>;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const tileX = Math.floor(Math.random() * radius * 2) - radius;
    const tileY = Math.floor(Math.random() * radius * 2) - radius;
    const kind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;
    counts[kind] += 1;
  }

  return counts;
}

describe('firelands biome frequency', () => {
  it('targets roughly 1-2% world coverage', () => {
    const counts = samplingBiomeFrequenciesForTest(300_000, 3000);
    const firelandsPercent = (counts.firelands / 300_000) * 100;

    expect(firelandsPercent).toBeGreaterThan(0.5);
    expect(firelandsPercent).toBeLessThan(3);
  });
});
