import { DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  applyingWorldPlazaGenerationFeatureSessionOverride,
  checkingWorldPlazaGenerationFeatureEnabled,
  resettingWorldPlazaGenerationFeatureStoreForTests,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { enablingWildlifeDevCombatFeatures } from '@/components/world/wildlife/domains/enablingWildlifeDevCombatFeatures';
import { beforeEach, describe, expect, it } from 'vitest';

describe('enablingWildlifeDevCombatFeatures', () => {
  beforeEach(() => {
    resettingWorldPlazaGenerationFeatureStoreForTests();
  });

  it('turns on wildlife and wildlife AI from a blank-slate override', () => {
    applyingWorldPlazaGenerationFeatureSessionOverride(
      DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE
    );

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI
      )
    ).toBe(false);

    enablingWildlifeDevCombatFeatures();

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI
      )
    ).toBe(true);
  });
});
