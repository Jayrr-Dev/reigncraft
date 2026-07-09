import { resolvingWildlifeInstanceNameTagLabel } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceNameTagLabel';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeInstanceSizeTierFromSample', () => {
  it('rounds shifted σ samples into [-2, 3] buckets', () => {
    expect(resolvingWildlifeInstanceSizeTierFromSample(-2.1)).toBe(-2);
    expect(resolvingWildlifeInstanceSizeTierFromSample(-1.4)).toBe(-1);
    expect(resolvingWildlifeInstanceSizeTierFromSample(0.2)).toBe(0);
    expect(resolvingWildlifeInstanceSizeTierFromSample(0.8)).toBe(1);
    expect(resolvingWildlifeInstanceSizeTierFromSample(2.4)).toBe(2);
    expect(resolvingWildlifeInstanceSizeTierFromSample(2.6)).toBe(3);
  });

  it('applies species bell-curve mean shift before bucketing', () => {
    expect(
      resolvingWildlifeInstanceSizeTierFromSample(0.2, {
        sizeSpawn: { bellCurveMeanShift: 0.8 },
      })
    ).toBe(1);
  });
});

describe('resolvingWildlifeInstanceNameTagLabel', () => {
  const species = {
    displayName: 'Grey Wolf',
    sizeSpawn: { bellCurveMeanShift: 0 },
  };

  const defaultInstanceFields = {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'grey-wolf',
    customDisplayName: null,
    packAlphaInstanceId: null as string | null,
    aggressionLevel: 'normal' as const,
    largeSizeFrame: null,
    spawnAnchor: { x: 4, y: 8, layer: 1 },
  };

  it('labels baby animals in pastel pink with a cute prefix', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: -2,
      },
      species
    );

    expect(result.textColor).toBe('#f8c8dc');
    expect(result.displayLabel).toMatch(
      /^(Baby|Smoll|Lil|Tiny|Cute|Adorable|Wee|Mini|Pint-Sized|Itty-Bitty|Pocket|Precious|Darling) Grey Wolf$/
    );
  });

  it('labels young animals in azure with a small prefix', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: -1,
      },
      species
    );

    expect(result.textColor).toBe('#F0FFFF');
    expect(result.displayLabel).toMatch(
      /^(Young|Small|Little|Smol|Petite|Runty|Juvenile|Compact|Dainty|Shrimpy|Pint|Teeny) Grey Wolf$/
    );
  });

  it('labels average animals with the species name in off-white', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: 0,
      },
      species
    );

    expect(result).toEqual({
      displayLabel: 'Grey Wolf',
      textColor: '#f1f1f1',
    });
  });

  it('labels large animals with a pale gold adjective prefix', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: 1,
      },
      species
    );

    expect(result.textColor).toBe('#eed691');
    expect(result.displayLabel).toMatch(/^(Mature|Big|Fat|Stocky) Grey Wolf$/);
  });

  it('labels giant animals with a golden adjective prefix', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: 2,
      },
      species
    );

    expect(result.textColor).toBe('#debe1f');
    expect(result.displayLabel).toMatch(/^(Giant|Lead|Prime) Grey Wolf$/);
  });

  it('forces Alpha prefix for the locked pack alpha over size and aggression', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        instanceId: 'wildlife:alpha:0',
        packAlphaInstanceId: 'wildlife:alpha:0',
        aggressionLevel: 'aggressive',
        sizeScaleSample: -2,
      },
      {
        displayName: 'Grey Wolf',
        sizeSpawn: { bellCurveMeanShift: 0 },
        nameTag: {
          name: 'Wolf',
          tiers: {
            [-2]: { namePrefix: 'Pup' },
          },
        },
      }
    );

    expect(result.displayLabel).toBe('Alpha Wolf');
  });

  it('labels +3σ animals with legendary prefixes in ember orange', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        sizeScaleSample: 2.6,
      },
      species
    );

    expect(result.textColor).toBe('#ff6b35');
    expect(result.displayLabel).toMatch(
      /^(Legendary|Gody|Hellish|Demon|Mythical) Grey Wolf$/
    );
  });

  it('uses a custom player rename while keeping tier color', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        customDisplayName: 'Old Yeller',
        sizeScaleSample: 2,
      },
      species
    );

    expect(result).toEqual({
      displayLabel: 'Old Yeller',
      textColor: '#debe1f',
    });
  });

  it('applies species tier overrides for prefix, name, and suffix', () => {
    const wolfSpecies = {
      displayName: 'Grey Wolf',
      sizeSpawn: { bellCurveMeanShift: 0 },
      nameTag: {
        name: 'Wolf',
        tiers: {
          [-2]: { namePrefix: 'Pup' },
          [2]: {
            namePrefix: 'Alpha',
            nameSuffix: ' of the North',
          },
        },
      },
    };

    expect(
      resolvingWildlifeInstanceNameTagLabel(
        {
          ...defaultInstanceFields,
          sizeScaleSample: -2,
        },
        wolfSpecies
      ).displayLabel
    ).toBe('Pup Wolf');

    expect(
      resolvingWildlifeInstanceNameTagLabel(
        {
          ...defaultInstanceFields,
          sizeScaleSample: 2,
        },
        wolfSpecies
      ).displayLabel
    ).toBe('Alpha Wolf of the North');

    expect(
      resolvingWildlifeInstanceNameTagLabel(
        {
          ...defaultInstanceFields,
          instanceId: 'wildlife:alpha:1',
          packAlphaInstanceId: 'wildlife:alpha:1',
          sizeScaleSample: -2,
        },
        wolfSpecies
      ).displayLabel
    ).toBe('Alpha Wolf');
  });

  it('prefixes aggressive animals with a seeded aggression adjective', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        aggressionLevel: 'aggressive',
        sizeScaleSample: 0,
      },
      species
    );

    expect(result.displayLabel).toMatch(
      /^(Killer|Angry|Pissed|Crazy|Deadly|Suicidal|Rash|Manic|Crazed|Wild|Insane|Feral|Vicious|Savage|Ferocious|Unhinged|Bloodthirsty) Grey Wolf$/
    );
  });

  it('always labels aggressive chickens as Crazy Chicken', () => {
    const chickenSpecies = {
      displayName: 'Chicken',
      sizeSpawn: { bellCurveMeanShift: 0 },
    };

    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        speciesId: 'chicken',
        aggressionLevel: 'aggressive',
        sizeScaleSample: 2.6,
      },
      chickenSpecies
    );

    expect(result.displayLabel).toBe('Crazy Chicken');
    expect(result.textColor).toBe('#ff6b35');
  });

  it('prefixes tame animals with a seeded temperament adjective', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        aggressionLevel: 'tame',
        sizeScaleSample: 0,
      },
      species
    );

    expect(result.displayLabel).toMatch(
      /^(Shy|Tame|Kind|Gentle|Friendly|Nice|Timid|Good|Peaceful|Harmless|Calm|Docile|Sweet) Grey Wolf$/
    );
  });

  it('stacks aggression and size prefixes for large aggressive wolves', () => {
    const wolfSpecies = {
      displayName: 'Grey Wolf',
      sizeSpawn: { bellCurveMeanShift: 0 },
      nameTag: {
        name: 'Wolf',
        tiers: {
          [1]: { namePrefix: ['Mature', 'Big', 'Fat', 'Stocky'] },
          [2]: { namePrefix: 'Alpha' },
        },
      },
    };

    const largeResult = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        aggressionLevel: 'aggressive',
        sizeScaleSample: 1,
      },
      wolfSpecies
    );

    expect(largeResult.displayLabel).toMatch(
      /^(Killer|Angry|Pissed|Crazy|Deadly|Suicidal|Rash|Manic|Crazed|Wild|Insane|Feral|Vicious|Savage|Ferocious|Unhinged|Bloodthirsty) (Mature|Big|Fat|Stocky) Wolf$/
    );

    const alphaResult = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        aggressionLevel: 'aggressive',
        sizeScaleSample: 2,
      },
      wolfSpecies
    );

    expect(alphaResult.displayLabel).toMatch(
      /^(Killer|Angry|Pissed|Crazy|Deadly|Suicidal|Rash|Manic|Crazed|Wild|Insane|Feral|Vicious|Savage|Ferocious|Unhinged|Bloodthirsty) Alpha Wolf$/
    );
  });

  it('uses obese and apex frame prefixes for large animals', () => {
    const obeseResult = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        largeSizeFrame: 'obese',
        sizeScaleSample: 1,
      },
      species
    );

    expect(obeseResult.displayLabel).toMatch(
      /^(Fat|Chubby|Plump|Chunky|Tubby|Pudgy|Round|Dumpy) Grey Wolf$/
    );

    const apexResult = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        largeSizeFrame: 'apex',
        sizeScaleSample: 2,
      },
      species
    );

    expect(apexResult.displayLabel).toMatch(
      /^(Leading|Apex|Alpha|Beastly|Powerful|Mighty|Jacked|Scary|Formidable|Fearless|Grim) Grey Wolf$/
    );

    const legendaryApexResult = resolvingWildlifeInstanceNameTagLabel(
      {
        ...defaultInstanceFields,
        largeSizeFrame: 'apex',
        sizeScaleSample: 2.6,
      },
      species
    );

    expect(legendaryApexResult.displayLabel).toMatch(
      /^(Legendary|Gody|Hellish|Demon|Mythical) Grey Wolf$/
    );
  });
});
