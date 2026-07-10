import { LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { resolvingPlazaBiomesGuideAnimalsDisplay } from '@/components/home/domains/resolvingPlazaBiomesGuideAnimalsDisplay';
import { DEFINING_WILDLIFE_BIOME_SPAWN_TABLE } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaBiomesGuideAnimalsDisplay', () => {
  it('lists every savanna spawn species and masks unsighted names', () => {
    const savannaEntries = DEFINING_WILDLIFE_BIOME_SPAWN_TABLE.savanna?.entries;
    expect(savannaEntries).toBeDefined();

    const display = resolvingPlazaBiomesGuideAnimalsDisplay(
      'savanna',
      new Set(['zebra', 'lion'])
    );

    expect(display).toHaveLength(savannaEntries!.length);
    expect(display.map((tag) => tag.id)).toEqual(
      savannaEntries!.map((entry) => entry.speciesId)
    );

    const zebra = display.find((tag) => tag.id === 'zebra');
    const lion = display.find((tag) => tag.id === 'lion');
    const giraffe = display.find((tag) => tag.id === 'giraffe');

    expect(zebra).toMatchObject({ isSighted: true, label: 'Zebra' });
    expect(lion).toMatchObject({ isSighted: true, label: 'Lion' });
    expect(giraffe).toMatchObject({
      isSighted: false,
      label: LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
    });
  });

  it('returns an empty list for biomes with no spawn table', () => {
    expect(
      resolvingPlazaBiomesGuideAnimalsDisplay('ocean', new Set(['deer']))
    ).toEqual([]);
  });
});
