import { applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery } from '@/components/world/health/domains/applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery';
import {
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR,
  DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY,
} from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery', () => {
  it('boosts immune system factor when a disease clears', () => {
    const result = applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      () => 1
    );

    expect(result.state.immuneSystemFactor).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR
    );
    expect(result.didAcquireDiseaseImmunity).toBe(false);
    expect(result.state.diseaseImmunityIds).toHaveLength(0);
  });

  it('grants per-disease immunity and extra boost on a successful roll', () => {
    const result = applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      () => 0
    );

    expect(result.didAcquireDiseaseImmunity).toBe(true);
    expect(result.state.diseaseImmunityIds).toContain('trichinellosis');
    expect(result.state.immuneSystemFactor).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR +
        DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY
    );
  });
});
