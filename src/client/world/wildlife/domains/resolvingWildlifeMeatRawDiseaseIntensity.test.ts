import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { resolvingWildlifeMeatRawDiseaseIntensity } from '@/components/world/wildlife/domains/resolvingWildlifeMeatRawDiseaseIntensity';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeMeatRawDiseaseIntensity', () => {
  it('scales omega-wolf symptoms higher than chicken', () => {
    const chicken = DEFINING_WILDLIFE_MEAT_CATALOG.find(
      (entry) => entry.speciesId === 'chicken'
    );
    const omegaWolf = DEFINING_WILDLIFE_MEAT_CATALOG.find(
      (entry) => entry.speciesId === 'omega-wolf'
    );

    if (!chicken || !omegaWolf) {
      throw new Error('Expected chicken and omega-wolf meat entries');
    }

    const chickenIntensity = resolvingWildlifeMeatRawDiseaseIntensity(chicken);
    const omegaIntensity = resolvingWildlifeMeatRawDiseaseIntensity(omegaWolf);

    expect(omegaIntensity.symptomIntensity).toBeGreaterThan(
      chickenIntensity.symptomIntensity
    );
  });
});

describe('applyingWorldPlazaEntityDisease meat intensity scales', () => {
  const nowMs = 1_000_000;

  it('applies symptomStrengthScale and durationScaleFromMeat at contract', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const mild = applyingWorldPlazaEntityDisease(
      state,
      'trichinellosis',
      nowMs,
      () => 0.5,
      { symptomStrengthScale: 0.8, durationScaleFromMeat: 0.9 }
    );
    const harsh = applyingWorldPlazaEntityDisease(
      state,
      'trichinellosis',
      nowMs,
      () => 0.5,
      { symptomStrengthScale: 1.35, durationScaleFromMeat: 1.2 }
    );

    expect(harsh.diseaseEffects[0]?.symptomStrengthMultiplier).toBeGreaterThan(
      mild.diseaseEffects[0]?.symptomStrengthMultiplier ?? 0
    );
    expect(harsh.diseaseEffects[0]?.durationMultiplier).toBeGreaterThan(
      mild.diseaseEffects[0]?.durationMultiplier ?? 0
    );
  });
});
