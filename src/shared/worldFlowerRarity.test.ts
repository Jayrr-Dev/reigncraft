import { describe, expect, it } from 'vitest';
import {
  resolvingWorldFlowerSpeciesAtTileIndex,
  WORLD_FLOWER_SPECIES_RARITY_REGISTRY,
  WORLD_FLOWER_SPECIES_RARITY_TOTAL_WEIGHT,
} from './worldFlowerRarity';

describe('worldFlowerRarity', () => {
  it('sums rarity weights to 234', () => {
    expect(WORLD_FLOWER_SPECIES_RARITY_TOTAL_WEIGHT).toBe(234);
    expect(
      WORLD_FLOWER_SPECIES_RARITY_REGISTRY.reduce(
        (sum, entry) => sum + entry.weight,
        0
      )
    ).toBe(234);
  });

  it('returns a stable species for one tile', () => {
    const first = resolvingWorldFlowerSpeciesAtTileIndex(12, 34);
    const second = resolvingWorldFlowerSpeciesAtTileIndex(12, 34);

    expect(first).toBe(second);
    expect(
      WORLD_FLOWER_SPECIES_RARITY_REGISTRY.some(
        (entry) => entry.speciesId === first
      )
    ).toBe(true);
  });

  it('histogram smoke covers every species over a tile grid', () => {
    const counts = new Map<string, number>();

    for (let tileX = 0; tileX < 200; tileX += 1) {
      for (let tileY = 0; tileY < 200; tileY += 1) {
        const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(tileX, tileY);
        counts.set(speciesId, (counts.get(speciesId) ?? 0) + 1);
      }
    }

    for (const entry of WORLD_FLOWER_SPECIES_RARITY_REGISTRY) {
      expect(counts.get(entry.speciesId) ?? 0).toBeGreaterThan(0);
    }
  });

  it('keeps variety on flower-placement tiles (placement hash remainder 0)', () => {
    const counts = new Map<string, number>();
    const placementHashX = 31;
    const placementHashY = 17;
    const flowerTileModulus = 23;

    for (let tileX = -120; tileX <= 120; tileX += 1) {
      for (let tileY = -120; tileY <= 120; tileY += 1) {
        if (
          Math.abs(tileX * placementHashX + tileY * placementHashY) %
            flowerTileModulus !==
          0
        ) {
          continue;
        }

        const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(tileX, tileY);
        counts.set(speciesId, (counts.get(speciesId) ?? 0) + 1);
      }
    }

    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    expect(total).toBeGreaterThan(500);

    for (const entry of WORLD_FLOWER_SPECIES_RARITY_REGISTRY) {
      expect(counts.get(entry.speciesId) ?? 0).toBeGreaterThan(0);
    }

    const calendulaShare = (counts.get('calendula') ?? 0) / total;
    expect(calendulaShare).toBeLessThan(0.25);
  });
});
