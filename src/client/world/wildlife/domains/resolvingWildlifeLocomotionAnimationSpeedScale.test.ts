import { checkingWildlifeWalkMotionUsesRunSheet } from '@/components/world/wildlife/domains/checkingWildlifeWalkMotionUsesRunSheet';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeLocomotionAnimationSpeedScale } from '@/components/world/wildlife/domains/resolvingWildlifeLocomotionAnimationSpeedScale';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeLocomotionAnimationSpeedScale', () => {
  it('leaves non-locomotion clips at full speed', () => {
    const species = resolvingWildlifeSpeciesDefinition('chicken');
    expect(species).toBeDefined();
    if (!species) {
      return;
    }

    const instance = creatingWildlifeTestInstance({
      speciesId: 'chicken',
      sizeScaleSample: 0,
    });

    expect(
      resolvingWildlifeLocomotionAnimationSpeedScale(species, instance, 'idle')
    ).toBe(1);
    expect(
      resolvingWildlifeLocomotionAnimationSpeedScale(
        species,
        instance,
        'attack'
      )
    ).toBe(1);
  });

  it('slows turtle walk feet relative to the shared walk reference', () => {
    const species = resolvingWildlifeSpeciesDefinition('turtle');
    expect(species).toBeDefined();
    if (!species) {
      return;
    }

    const instance = creatingWildlifeTestInstance({
      speciesId: 'turtle',
      sizeScaleSample: 0,
    });
    const scale = resolvingWildlifeLocomotionAnimationSpeedScale(
      species,
      instance,
      'walk'
    );

    expect(scale).toBeLessThan(0.4);
    expect(scale).toBeGreaterThanOrEqual(0.15);
  });

  it('slows grey-wolf walk when the clip is a Run sheet fallback', () => {
    expect(checkingWildlifeWalkMotionUsesRunSheet('grey-wolf')).toBe(true);
    expect(checkingWildlifeWalkMotionUsesRunSheet('boar')).toBe(true);
    expect(checkingWildlifeWalkMotionUsesRunSheet('hyena')).toBe(true);
    expect(checkingWildlifeWalkMotionUsesRunSheet('chicken')).toBe(false);

    const species = resolvingWildlifeSpeciesDefinition('grey-wolf');
    expect(species).toBeDefined();
    if (!species) {
      return;
    }

    const instance = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      sizeScaleSample: 0,
    });
    const walkScale = resolvingWildlifeLocomotionAnimationSpeedScale(
      species,
      instance,
      'walk'
    );
    const runScale = resolvingWildlifeLocomotionAnimationSpeedScale(
      species,
      instance,
      'run'
    );

    expect(walkScale).toBeLessThan(runScale);
    expect(walkScale).toBeLessThan(0.6);
  });
});
