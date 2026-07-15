import { DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumMushroomGuideConstants';
import { resolvingPlazaHerbariumGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import { DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_FULL_COUNT } from '@/components/home/domains/resolvingPlazaHerbariumMushroomStudyTier';
import { DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaHerbariumGuideDisplayEntries mushrooms', () => {
  it('includes every catalog mushroom species as locked by default', () => {
    const entries = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(),
      new Set(),
      0,
      new Set(),
      {},
      new Set(),
      {}
    );
    const mushroomEntries = entries.filter(
      (entry) => entry.kind === 'mushroom'
    );

    expect(mushroomEntries).toHaveLength(
      DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS.length
    );
    expect(DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES).toHaveLength(
      DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS.length
    );
    expect(mushroomEntries.every((entry) => !entry.isSighted)).toBe(true);
    expect(
      mushroomEntries.every((entry) => entry.discoveryState === 'locked')
    ).toBe(true);
  });

  it('marks a picked mushroom as sighted and studied after familiarity', () => {
    const entries = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(),
      new Set(),
      0,
      new Set(),
      {},
      new Set(['golden-chanter']),
      { 'golden-chanter': 1 }
    );
    const goldenChanter = entries.find(
      (entry) =>
        entry.kind === 'mushroom' && entry.speciesId === 'golden-chanter'
    );

    expect(goldenChanter).toBeDefined();
    if (!goldenChanter || goldenChanter.kind !== 'mushroom') {
      throw new Error('expected golden-chanter mushroom entry');
    }

    expect(goldenChanter.isSighted).toBe(true);
    expect(goldenChanter.displayName).toBe('Golden Cap');
    expect(goldenChanter.rarity).toBe('uncommon');
    expect(goldenChanter.isStudied).toBe(true);
    expect(goldenChanter.propertiesSummary).toBeNull();
    expect(goldenChanter.preparationNotes).toBeNull();
    expect(goldenChanter.eatEffectStatRows).toBeNull();
  });

  it('reveals the true mushroom name only after proficiency (50 studies)', () => {
    const beforeTrueName = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(),
      new Set(),
      0,
      new Set(),
      {},
      new Set(['golden-chanter']),
      { 'golden-chanter': 49 }
    ).find(
      (entry) =>
        entry.kind === 'mushroom' && entry.speciesId === 'golden-chanter'
    );
    const afterTrueName = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(),
      new Set(),
      0,
      new Set(),
      {},
      new Set(['golden-chanter']),
      { 'golden-chanter': 50 }
    ).find(
      (entry) =>
        entry.kind === 'mushroom' && entry.speciesId === 'golden-chanter'
    );

    expect(beforeTrueName?.displayName).toBe('Golden Cap');
    expect(afterTrueName?.displayName).toBe('Golden Chanter');
  });

  it('unlocks properties, habitats, expertise rows, and mastery flavor by study count', () => {
    const entries = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(['forest']),
      new Set(),
      0,
      new Set(),
      {},
      new Set(['golden-chanter']),
      { 'golden-chanter': DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_FULL_COUNT }
    );
    const goldenChanter = entries.find(
      (entry) =>
        entry.kind === 'mushroom' && entry.speciesId === 'golden-chanter'
    );

    expect(goldenChanter).toBeDefined();
    if (!goldenChanter || goldenChanter.kind !== 'mushroom') {
      throw new Error('expected golden-chanter mushroom entry');
    }

    expect(goldenChanter.isFullyStudied).toBe(true);
    expect(goldenChanter.displayName).toBe('Golden Chanter');
    expect(goldenChanter.propertiesSummary).toContain('fills hunger');
    expect(goldenChanter.preparationNotes).toContain('Heat deepens');
    expect(goldenChanter.biomeChips.length).toBeGreaterThan(0);
    expect(goldenChanter.eatEffectStatRows?.length).toBeGreaterThan(0);
    expect(goldenChanter.apostleFlavor).toContain('Rockless Fellus');
  });

  it('counts mushrooms toward ALL progress totals', () => {
    const entries = resolvingPlazaHerbariumGuideDisplayEntries(
      {},
      new Set(),
      {},
      new Set(),
      new Set(),
      0,
      new Set(),
      {},
      new Set(['golden-chanter', 'false-lantern']),
      { 'golden-chanter': 1 }
    );
    const mushroomSighted = entries.filter(
      (entry) => entry.kind === 'mushroom' && entry.isSighted
    ).length;
    const mushroomStudied = entries.filter(
      (entry) => entry.kind === 'mushroom' && entry.isStudied
    ).length;

    expect(mushroomSighted).toBe(2);
    expect(mushroomStudied).toBe(1);
    expect(entries.filter((entry) => entry.isSighted).length).toBe(2);
  });
});
