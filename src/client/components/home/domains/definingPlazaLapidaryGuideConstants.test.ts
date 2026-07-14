import { DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import { WORLD_ORE_SPECIES_RARITY_REGISTRY } from '../../../../shared/worldOreRarity';
import { describe, expect, it } from 'vitest';

describe('definingPlazaLapidaryGuideConstants', () => {
  it('lists every ore species including sulfur', () => {
    const guideSpeciesIds = new Set(
      DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.map((entry) => entry.speciesId)
    );

    expect(guideSpeciesIds.size).toBe(WORLD_ORE_SPECIES_RARITY_REGISTRY.length);
    expect(guideSpeciesIds.has('sulfur')).toBe(true);

    for (const entry of WORLD_ORE_SPECIES_RARITY_REGISTRY) {
      expect(guideSpeciesIds.has(entry.speciesId)).toBe(true);
    }
  });
});
