/**
 * Persistent external store for granular procedural-generation debug controls.
 *
 * @module components/world/domains/managingWorldPlazaGenerationFeatureStore
 */

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_STORAGE_KEY,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';

type ManagingWorldPlazaGenerationFeatureState = {
  flags: Record<DefiningWorldPlazaGenerationFeatureId, boolean>;
  revision: number;
};

const managingWorldPlazaGenerationFeatureState: ManagingWorldPlazaGenerationFeatureState =
  {
    flags: { ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS },
    revision: 0,
  };

const managingWorldPlazaGenerationFeatureSubscribers = new Set<() => void>();

function invalidatingWorldPlazaGenerationFeatureCachesDeferred(
  featureId: DefiningWorldPlazaGenerationFeatureId
): void {
  if (featureId === DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE) {
    return;
  }

  void import(
    '@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches'
  ).then((invalidatingModule) => {
    invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
  });
}

function readingWorldPlazaGenerationFeatureFlagsFromStorage(): Record<
  DefiningWorldPlazaGenerationFeatureId,
  boolean
> {
  const flags = { ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS };

  if (typeof window === 'undefined') {
    return flags;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_STORAGE_KEY
  );

  if (!storedValue) {
    return flags;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (
      typeof parsedValue !== 'object' ||
      parsedValue === null ||
      Array.isArray(parsedValue)
    ) {
      return flags;
    }

    for (const definition of DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY) {
      const storedFlag = Reflect.get(parsedValue, definition.featureId);

      if (typeof storedFlag === 'boolean') {
        flags[definition.featureId] = storedFlag;
      }
    }
  } catch {
    return flags;
  }

  return flags;
}

function writingWorldPlazaGenerationFeatureFlagsToStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_STORAGE_KEY,
    JSON.stringify(managingWorldPlazaGenerationFeatureState.flags)
  );
}

function notifyingWorldPlazaGenerationFeatureSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaGenerationFeatureSubscribers) {
    onStoreChange();
  }
}

export function initializingWorldPlazaGenerationFeatureStoreFromStorage(): void {
  const storedFlags = readingWorldPlazaGenerationFeatureFlagsFromStorage();
  const changedFeatureIds =
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.filter(
      (definition) =>
        storedFlags[definition.featureId] !==
        managingWorldPlazaGenerationFeatureState.flags[definition.featureId]
    ).map((definition) => definition.featureId);

  if (changedFeatureIds.length === 0) {
    return;
  }

  managingWorldPlazaGenerationFeatureState.flags = storedFlags;
  managingWorldPlazaGenerationFeatureState.revision += 1;

  for (const featureId of changedFeatureIds) {
    invalidatingWorldPlazaGenerationFeatureCachesDeferred(featureId);
  }

  notifyingWorldPlazaGenerationFeatureSubscribers();
}

export function checkingWorldPlazaGenerationFeatureEnabled(
  featureId: DefiningWorldPlazaGenerationFeatureId
): boolean {
  return managingWorldPlazaGenerationFeatureState.flags[featureId];
}

export function gettingWorldPlazaGenerationFeatureRevision(): number {
  return managingWorldPlazaGenerationFeatureState.revision;
}

export function gettingWorldPlazaGenerationFeatureFlagsSnapshot(): Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> {
  return managingWorldPlazaGenerationFeatureState.flags;
}

export function settingWorldPlazaGenerationFeatureEnabled(
  featureId: DefiningWorldPlazaGenerationFeatureId,
  isEnabled: boolean
): void {
  if (
    managingWorldPlazaGenerationFeatureState.flags[featureId] === isEnabled
  ) {
    return;
  }

  managingWorldPlazaGenerationFeatureState.flags = {
    ...managingWorldPlazaGenerationFeatureState.flags,
    [featureId]: isEnabled,
  };
  managingWorldPlazaGenerationFeatureState.revision += 1;
  writingWorldPlazaGenerationFeatureFlagsToStorage();
  invalidatingWorldPlazaGenerationFeatureCachesDeferred(featureId);
  notifyingWorldPlazaGenerationFeatureSubscribers();
}

export function subscribingWorldPlazaGenerationFeatures(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaGenerationFeatureSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaGenerationFeatureSubscribers.delete(onStoreChange);
  };
}

/** Restores defaults and removes subscribers between unit tests. */
export function resettingWorldPlazaGenerationFeatureStoreForTests(): void {
  managingWorldPlazaGenerationFeatureState.flags = {
    ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
  };
  managingWorldPlazaGenerationFeatureState.revision = 0;
  managingWorldPlazaGenerationFeatureSubscribers.clear();
}
