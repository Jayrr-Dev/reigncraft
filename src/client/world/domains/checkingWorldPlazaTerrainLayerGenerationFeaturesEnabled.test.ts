import { checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled } from '@/components/world/domains/checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  resettingWorldPlazaGenerationFeatureStoreForTests,
  settingWorldPlazaGenerationFeatureEnabled,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  resettingWorldPlazaGenerationFeatureStoreForTests();
});

describe('checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled', () => {
  it('allows layers with no generation feature gate', () => {
    expect(
      checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled(undefined)
    ).toBe(true);
    expect(checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled([])).toBe(
      true
    );
  });

  it('requires at least one listed feature to be on', () => {
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
      false
    );
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
      false
    );

    expect(
      checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled([
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
      ])
    ).toBe(false);

    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
      true
    );

    expect(
      checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled([
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
      ])
    ).toBe(true);
  });
});
