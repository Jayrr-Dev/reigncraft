import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  applyingWorldPlazaGenerationFeatureSessionOverride,
  checkingWorldPlazaGenerationFeatureEnabled,
  clearingWorldPlazaGenerationFeatureSessionOverride,
  gettingWorldPlazaGenerationFeatureRevision,
  resettingWorldPlazaGenerationFeatureStoreForTests,
  settingWorldPlazaGenerationFeatureEnabled,
  subscribingWorldPlazaGenerationFeatures,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

afterEach(() => {
  resettingWorldPlazaGenerationFeatureStoreForTests();
});

describe('managingWorldPlazaGenerationFeatureStore', () => {
  it('toggles one generation layer without changing the others', () => {
    const onStoreChange = vi.fn();
    subscribingWorldPlazaGenerationFeatures(onStoreChange);

    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE,
      false
    );

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS
      )
    ).toBe(true);
    expect(gettingWorldPlazaGenerationFeatureRevision()).toBe(1);
    expect(onStoreChange).toHaveBeenCalledOnce();
  });

  it('does not publish a revision when the requested state is unchanged', () => {
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS,
      true
    );

    expect(gettingWorldPlazaGenerationFeatureRevision()).toBe(0);
  });

  it('applies a session blank-slate override without changing persisted flags', () => {
    applyingWorldPlazaGenerationFeatureSessionOverride(
      DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE
    );

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PROJECTILES
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR
      )
    ).toBe(false);

    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      true
    );

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS
      )
    ).toBe(false);

    clearingWorldPlazaGenerationFeatureSessionOverride();

    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS
      )
    ).toBe(true);
  });
});
