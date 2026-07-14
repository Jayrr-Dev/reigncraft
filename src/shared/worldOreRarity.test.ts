import { describe, expect, it } from 'vitest';
import {
  checkingWorldOreVeinAtTileIndex,
  resolvingWorldOreSpeciesAtTileIndex,
  resolvingWorldOreSpeciesFromWeightedEntries,
  resolvingWorldOreSpeciesIfVeinAtTileIndex,
  resolvingWorldOreSpeciesRarity,
  WORLD_ORE_SPECIES_RARITY_REGISTRY,
  WORLD_ORE_SPECIES_RARITY_TOTAL_WEIGHT,
} from './worldOreRarity';

describe('worldOreRarity', () => {
  it('sums rarity weights to 199', () => {
    expect(WORLD_ORE_SPECIES_RARITY_TOTAL_WEIGHT).toBe(199);
    expect(
      WORLD_ORE_SPECIES_RARITY_REGISTRY.reduce(
        (sum, entry) => sum + entry.weight,
        0
      )
    ).toBe(199);
  });

  it('assigns each species a rarity tier on the ladder', () => {
    expect(resolvingWorldOreSpeciesRarity('clay')).toBe('basic');
    expect(resolvingWorldOreSpeciesRarity('coal')).toBe('basic');
    expect(resolvingWorldOreSpeciesRarity('iron')).toBe('common');
    expect(resolvingWorldOreSpeciesRarity('copper')).toBe('common');
    expect(resolvingWorldOreSpeciesRarity('lead')).toBe('uncommon');
    expect(resolvingWorldOreSpeciesRarity('niter')).toBe('uncommon');
    expect(resolvingWorldOreSpeciesRarity('silver')).toBe('rare');
    expect(resolvingWorldOreSpeciesRarity('scarlet')).toBe('rare');
    expect(resolvingWorldOreSpeciesRarity('gold')).toBe('epic');
    expect(resolvingWorldOreSpeciesRarity('sulfur')).toBe('epic');

    for (const entry of WORLD_ORE_SPECIES_RARITY_REGISTRY) {
      expect(resolvingWorldOreSpeciesRarity(entry.speciesId)).toBe(
        entry.rarity
      );
    }
  });

  it('returns a stable species for one tile', () => {
    const first = resolvingWorldOreSpeciesAtTileIndex(12, 34);
    const second = resolvingWorldOreSpeciesAtTileIndex(12, 34);

    expect(first).toBe(second);
    expect(
      WORLD_ORE_SPECIES_RARITY_REGISTRY.some(
        (entry) => entry.speciesId === first
      )
    ).toBe(true);
  });

  it('weighted table helper prefers high-weight clay on shore tables', () => {
    const shoreTable = [
      { speciesId: 'clay' as const, rarity: 'basic' as const, weight: 100 },
      { speciesId: 'iron' as const, rarity: 'common' as const, weight: 5 },
    ];
    const counts = { clay: 0, iron: 0 };

    for (let tileX = 0; tileX < 80; tileX += 1) {
      for (let tileY = 0; tileY < 80; tileY += 1) {
        const speciesId = resolvingWorldOreSpeciesFromWeightedEntries(
          tileX,
          tileY,
          shoreTable
        );

        if (speciesId === 'clay') {
          counts.clay += 1;
        } else if (speciesId === 'iron') {
          counts.iron += 1;
        }
      }
    }

    expect(counts.clay).toBeGreaterThan(counts.iron * 8);
  });

  it('histogram smoke covers every species over a tile grid', () => {
    const counts = new Map<string, number>();

    for (let tileX = 0; tileX < 200; tileX += 1) {
      for (let tileY = 0; tileY < 200; tileY += 1) {
        const speciesId = resolvingWorldOreSpeciesAtTileIndex(tileX, tileY);
        counts.set(speciesId, (counts.get(speciesId) ?? 0) + 1);
      }
    }

    for (const entry of WORLD_ORE_SPECIES_RARITY_REGISTRY) {
      expect(counts.get(entry.speciesId) ?? 0).toBeGreaterThan(0);
    }

    const clayCount = counts.get('clay') ?? 0;
    const goldCount = counts.get('gold') ?? 0;
    expect(clayCoun