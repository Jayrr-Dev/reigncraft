import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  checkingWorldPlazaGenerationFeatureEnabled,
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
});
