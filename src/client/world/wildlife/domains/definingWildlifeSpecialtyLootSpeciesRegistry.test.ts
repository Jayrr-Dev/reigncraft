import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { checkingWildlifeSpecialtyLootItemTypeId } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';
import {
  DEFINING_WILDLIFE_SPECIALTY_LOOT_SPECIES_REGISTRY,
  resolvingWildlifeSpecialtyLootSpeciesEntry,
} from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootSpeciesRegistry';
import { resolvingWildlifeSpecialtyLootRolls } from '@/components/world/wildlife/domains/resolvingWildlifeSpecialtyLootRolls';
import { describe, expect, it } from 'vitest';

describe('definingWildlifeSpecialtyLootSpeciesRegistry', () => {
  it('covers every registered wildlife species', () => {
    const covered = new Set(
      DEFINING_WILDLIFE_SPECIALTY_LOOT_SPECIES_REGISTRY.map(
        (entry) => entry.speciesId
      )
    );

    for (const speciesId of listingWildlifeSpeciesIds()) {
      expect(covered.has(speciesId)).toBe(true);
    }
  });

  it('points common and rare rolls at catalog item ids', () => {
    for (const entry of DEFINING_WILDLIFE_SPECIALTY_LOOT_SPECIES_REGISTRY) {
      expect(checkingWildlifeSpecialtyLootItemTypeId(entry.common.itemTypeId)).toBe(
        true
      );
      expect(checkingWildlifeSpecialtyLootItemTypeId(entry.rare.itemTypeId)).toBe(
        true
      );
      expect(entry.common.dropChance).toBeGreaterThan(0);
      expect(entry.common.dropChance).toBeLessThanOrEqual(1);
      expect(entry.rare.dropChance).toBeGreaterThan(0);
      expect(entry.rare.dropChance).toBeLessThanOrEqual(1);
      expect(entry.rare.dropChance).toBeLessThanOrEqual(entry.common.dropChance);
    }
  });

  it('rolls both drops when random units are inside chance', () => {
    const entry = resolvingWildlifeSpecialtyLootSpeciesEntry('chicken');
    expect(entry).not.toBeNull();

    const drops = resolvingWildlifeSpecialtyLootRolls('chicken', 0, 0);

    expect(drops).toEqual([
      { itemTypeId: entry!.common.itemTypeId, quantity: 1 },
      { itemTypeId: entry!.rare.itemTypeId, quantity: 1 },
    ]);
  });

  it('rolls nothing when random units miss both chances', () => {
    expect(resolvingWildlifeSpecialtyLootRolls('chicken', 0.99, 0.99)).toEqual(
      []
    );
  });
});
