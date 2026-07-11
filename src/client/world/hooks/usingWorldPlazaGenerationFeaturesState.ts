'use client';

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  gettingWorldPlazaGenerationFeatureFlagsSnapshot,
  gettingWorldPlazaGenerationFeatureRevision,
  initializingWorldPlazaGenerationFeatureStoreFromStorage,
  settingWorldPlazaGenerationFeatureEnabled,
  subscribingWorldPlazaGenerationFeatures,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  useCallback,
  useLayoutEffect,
  useSyncExternalStore,
} from 'react';

export type UsingWorldPlazaGenerationFeaturesStateResult = {
  readonly flags: Readonly<
    Record<DefiningWorldPlazaGenerationFeatureId, boolean>
  >;
  readonly revision: number;
  readonly settingFeatureEnabled: (
    featureId: DefiningWorldPlazaGenerationFeatureId,
    isEnabled: boolean
  ) => void;
};

/**
 * Subscribes React components to granular generation feature controls.
 */
export function usingWorldPlazaGenerationFeaturesState(): UsingWorldPlazaGenerationFeaturesStateResult {
  useLayoutEffect(() => {
    initializingWorldPlazaGenerationFeatureStoreFromStorage();
  }, []);

  const revision = useSyncExternalStore(
    subscribingWorldPlazaGenerationFeatures,
    gettingWorldPlazaGenerationFeatureRevision,
    () => 0
  );
  const flags = useSyncExternalStore(
    subscribingWorldPlazaGenerationFeatures,
    gettingWorldPlazaGenerationFeatureFlagsSnapshot,
    () => DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS
  );
  const settingFeatureEnabled = useCallback(
    (
      featureId: DefiningWorldPlazaGenerationFeatureId,
      isEnabled: boolean
    ): void => {
      settingWorldPlazaGenerationFeatureEnabled(featureId, isEnabled);
    },
    []
  );

  return {
    flags,
    revision,
    settingFeatureEnabled,
  };
}
