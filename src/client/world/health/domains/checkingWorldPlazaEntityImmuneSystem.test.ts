import {
  checkingWorldPlazaEntityCanContractDisease,
  checkingWorldPlazaEntityIsImmuneToDisease,
  resolvingWorldPlazaEntityDiseaseContractionChance,
} from '@/components/world/health/domains/checkingWorldPlazaEntityImmuneSystem';
import { DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaEntityImmuneSystem', () => {
  it('reduces contraction chance as immune system factor rises', () => {
    const lowFactorState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      immuneSystemFactor: 0,
    };
    const highFactorState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      immuneSystemFactor: DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
    };

    expect(
      resolvingWorldPlazaEntityDiseaseContractionChance(lowFactorState, 0.5)
    ).toBe(0.5);
    expect(
      resolvingWorldPlazaEntityDiseaseContractionChance(highFactorState, 0.5)
    ).toBeCloseTo(0.125);
  });

  it('blocks contraction for acquired per-disease immunities', () => {
    const immuneState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      diseaseImmunityIds: ['salmonellosis'] as const,
    };

    expect(
      checkingWorldPlazaEntityIsImmuneToDisease(immuneState, 'salmonellosis')
    ).toBe(true);
    expect(
      checkingWorldPlazaEntityCanContractDisease(
        immuneState,
        'salmonellosis',
        1_000
      )
    ).toBe(false);
  });
});
