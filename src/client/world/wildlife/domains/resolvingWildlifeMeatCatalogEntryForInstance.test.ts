import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  resolvingWildlifeMeatCatalogEntryForInstance,
  resolvingWildlifeMeatDropRawItemTypeId,
} from '@/components/world/wildlife/domains/resolvingWildlifeMeatCatalogEntryForInstance';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeMeatCatalogEntryForInstance', () => {
  it('resolves Crazy Chicken meat for aggressive chicken spawns', () => {
    const entry = resolvingWildlifeMeatCatalogEntryForInstance({
      speciesId: 'chicken',
      aggressionLevel: 'aggressive',
    });

    expect(entry?.rawDisplayName).toBe('Crazy Chicken Meat');
    expect(entry?.cookedWellFedBuffIds).toEqual([
      'well-fed-cucco-fury-buff',
      'well-fed-cucco-chase-buff',
      'well-fed-cucco-vigor-buff',
    ]);
    expect(entry?.cookedWellFedChance).toBe(1);
  });

  it('always infects with Cucco Rage when raw Crazy Chicken meat is eaten', () => {
    const entry = resolvingWildlifeMeatCatalogEntryForInstance({
      speciesId: 'chicken',
      aggressionLevel: 'aggressive',
    });

    expect(entry?.rawDiseaseId).toBe('cucco-rage');
    expect(entry?.rawDiseaseChance).toBe(1);
  });

  it('keeps normal chicken meat for passive chickens', () => {
    const entry = resolvingWildlifeMeatCatalogEntryForInstance({
      speciesId: 'chicken',
      aggressionLevel: 'normal',
    });

    expect(entry?.rawDisplayName).toBe('Raw Chicken Meat');
  });

  it('drops Crazy Chicken Meat from aggressive chicken corpses', () => {
    const chickenSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;

    expect(
      resolvingWildlifeMeatDropRawItemTypeId(
        { speciesId: 'chicken', aggressionLevel: 'aggressive' },
        chickenSpecies.loot.rawMeatItemTypeId
      )
    ).toBe(DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID);
  });
});
