import { DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import {
  resolvingWildlifeInstanceStrengthIndex,
  resolvingWildlifeSpeciesStrengthIndex,
} from '@/components/world/strength/domains/resolvingWildlifeStrengthProfile';
import { resolvingWorldPlazaCharacterStrengthIndex } from '@/components/world/strength/domains/resolvingWorldPlazaCharacterStrengthProfile';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaCharacterStrengthIndex', () => {
  it('scores the default player at the baseline index', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );

    expect(resolvingWorldPlazaCharacterStrengthIndex(girl).strengthIndex).toBe(
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX
    );
  });

  it('ranks the grizzly tank above the penguin at mature parity', () => {
    const grizzlyDefinition = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const penguinDefinition = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN
    );
    const grizzly = resolvingWorldPlazaCharacterStrengthIndex({
      ...grizzlyDefinition,
      scaling: {
        ...grizzlyDefinition.scaling,
        level:
          DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
      },
    });
    const penguin = resolvingWorldPlazaCharacterStrengthIndex({
      ...penguinDefinition,
      scaling: {
        ...penguinDefinition.scaling,
        level:
          DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
      },
    });

    expect(grizzly.strengthIndex).toBeGreaterThan(penguin.strengthIndex);
  });

  it('grows the index with character level', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const levelTen = {
      ...girl,
      scaling: { ...girl.scaling, level: 10 },
    };

    expect(
      resolvingWorldPlazaCharacterStrengthIndex(levelTen).strengthIndex
    ).toBeGreaterThan(
      resolvingWorldPlazaCharacterStrengthIndex(girl).strengthIndex
    );
  });
});

describe('resolvingWildlifeSpeciesStrengthIndex', () => {
  it('orders the roster by combat threat, chicken to lion', () => {
    const chicken = resolvingWildlifeSpeciesStrengthIndex(
      DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken
    );
    const wolf = resolvingWildlifeSpeciesStrengthIndex(
      DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf']
    );
    const bear = resolvingWildlifeSpeciesStrengthIndex(
      DEFINING_WILDLIFE_SPECIES_REGISTRY['brown-bear']
    );
    const lion = resolvingWildlifeSpeciesStrengthIndex(
      DEFINING_WILDLIFE_SPECIES_REGISTRY.lion
    );

    expect(chicken.strengthIndex).toBeLessThan(wolf.strengthIndex);
    expect(wolf.strengthIndex).toBeLessThan(bear.strengthIndex);
    expect(bear.strengthIndex).toBeLessThan(lion.strengthIndex);
  });
});

describe('resolvingWildlifeInstanceStrengthIndex', () => {
  const buildingInstance = (
    overrides: Partial<{
      speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY;
      aggressionLevel: 'aggressive' | 'normal' | 'tame';
      sizeScaleSample: number;
      largeSizeFrame: null;
    }> = {}
  ) => ({
    instanceId: 'test-instance',
    speciesId: 'chicken' as const,
    aggressionLevel: 'normal' as const,
    sizeScaleSample: 0,
    largeSizeFrame: null,
    ...overrides,
  });

  it('scores a mean-roll instance close to the species baseline', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const speciesIndex = resolvingWildlifeSpeciesStrengthIndex(species);
    const instanceIndex = resolvingWildlifeInstanceStrengthIndex(
      species,
      buildingInstance()
    );

    const relativeGap =
      Math.abs(instanceIndex.strengthIndex - speciesIndex.strengthIndex) /
      Math.max(1, speciesIndex.strengthIndex);

    expect(relativeGap).toBeLessThan(0.1);
  });

  it('scores larger size rolls above smaller ones', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const runt = resolvingWildlifeInstanceStrengthIndex(
      species,
      buildingInstance({ speciesId: 'grey-wolf', sizeScaleSample: -2 })
    );
    const alpha = resolvingWildlifeInstanceStrengthIndex(
      species,
      buildingInstance({ speciesId: 'grey-wolf', sizeScaleSample: 2 })
    );

    expect(alpha.strengthIndex).toBeGreaterThan(runt.strengthIndex);
  });

  it('boosts aggressive chickens far beyond normal chickens', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const normal = resolvingWildlifeInstanceStrengthIndex(
      species,
      buildingInstance()
    );
    const crazy = resolvingWildlifeInstanceStrengthIndex(
      species,
      buildingInstance({ aggressionLevel: 'aggressive' })
    );

    expect(crazy.strengthIndex).toBeGreaterThan(normal.strengthIndex * 5);
    expect(
      crazy.breakdown.appliedModifiers.some(
        (modifier) => modifier.id === 'aggressive-chicken-attack'
      )
    ).toBe(true);
  });
});
