import { resolvingWildlifeInstanceNameTagLabel } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceNameTagLabel';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeInstanceSizeTierFromSample', () => {
  it('rounds shifted σ samples into [-2, 2] buckets', () => {
    expect(resolvingWildlifeInstanceSizeTierFromSample(-2.1)).toBe(-2);
    expect(resolvingWildlifeInstanceSizeTierFromSample(-1.4)).toBe(-1);
    expect(resolvingWildlifeInstanceSizeTierFromSample(0.2)).toBe(0);
    expect(resolvingWildlifeInstanceSizeTierFromSample(0.8)).toBe(1);
    expect(resolvingWildlifeInstanceSizeTierFromSample(2.4)).toBe(2);
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

  it('labels baby animals in deep teal', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        customDisplayName: null,
        sizeScaleSample: -2,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
      },
      species
    );

    expect(result).toEqual({
      displayLabel: 'Baby Grey Wolf',
      textColor: '#4c778f',
    });
  });

  it('labels young animals in soft teal', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        customDisplayName: null,
        sizeScaleSample: -1,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
      },
      species
    );

    expect(result).toEqual({
      displayLabel: 'Young Grey Wolf',
      textColor: '#9eb2bf',
    });
  });

  it('labels average animals with the species name in off-white', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        customDisplayName: null,
        sizeScaleSample: 0,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
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
        customDisplayName: null,
        sizeScaleSample: 1,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
      },
      species
    );

    expect(result.textColor).toBe('#eed691');
    expect(result.displayLabel).toMatch(/^(Mature|Big|Killer|Fat) Grey Wolf$/);
  });

  it('labels giant animals with a golden adjective prefix', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        customDisplayName: null,
        sizeScaleSample: 2,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
      },
      species
    );

    expect(result.textColor).toBe('#debe1f');
    expect(result.displayLabel).toMatch(
      /^(Alpha|Deadly|Giant|Lead) Grey Wolf$/
    );
  });

  it('uses a custom player rename while keeping tier color', () => {
    const result = resolvingWildlifeInstanceNameTagLabel(
      {
        customDisplayName: 'Old Yeller',
        sizeScaleSample: 2,
        spawnAnchor: { x: 4, y: 8, layer: 1 },
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
          customDisplayName: null,
          sizeScaleSample: -2,
          spawnAnchor: { x: 4, y: 8, layer: 1 },
        },
        wolfSpecies
      ).displayLabel
    ).toBe('Pup Wolf');

    expect(
      resolvingWildlifeInstanceNameTagLabel(
        {
          customDisplayName: null,
          sizeScaleSample: 2,
          spawnAnchor: { x: 4, y: 8, layer: 1 },
        },
        wolfSpecies
      ).displayLabel
    ).toBe('Alpha Wolf of the North');
  });
});
