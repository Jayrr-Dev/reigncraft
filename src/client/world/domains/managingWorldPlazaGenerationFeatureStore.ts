/**
 * Persistent external store for granular procedural-generation debug controls.
 *
 * Supports a session-only blank-slate override (Dev QA load) that does not
 * write localStorage, so normal-play prefs stay intact.
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
  sessionOverrideFlags: Record<
    DefiningWorldPlazaGenerationFeatureId,
    boolean
  > | null;
  revision: number;
};

const managingWorldPlazaGenerationFeatureState: ManagingWorldPlazaGenerationFeatureState =
  {
    flags: { ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS },
    sessionOverrideFlags: null,
    revision: 0,
  };

const managingWorldPlazaGenerationFeatureSubscribers = new Set<() => void>();

function invalidatingWorldPlazaGenerationFeatureCachesDeferred(
  featureId: DefiningWorldPlazaGenerationFeatureId
): void {
  if (featureId === DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE) {
    return;
  }

  void import('@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches').then(
    (invalidatingModule) => {
      invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
    }
  );
}

function invalidatingWorldPlazaGenerationFeatureCachesForAllDeferred(): void {
  void import('@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches').then(
    (invalidatingModule) => {
      invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
    }
  );
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

function resolvingWorldPlazaGenerationFeatureActiveFlags(): Record<
  DefiningWorldPlazaGenerationFeatureId,
  boolean
> {
  return (
    managingWorldPlazaGenerationFeatureState.sessionOverrideFlags ??
    managingWorldPlazaGenerationFeatureState.flags
  );
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

  if (!managingWorldPlazaGenerationFeatureState.sessionOverrideFlags) {
    for (const featureId of changedFeatureIds) {
      invalidatingWorldPlazaGenerationFeatureCachesDeferred(featureId);
    }
  }

  notifyingWorldPlazaGenerationFeatureSubscribers();
}

export function checkingWorldPlazaGenerationFeatureEnabled(
  featureId: DefiningWorldPlazaGenerationFeatureId
): boolean {
  return resolvingWorldPlazaGenerationFeatureActiveFlags()[featureId];
}

export function gettingWorldPlazaGenerationFeatureRevision(): number {
  return managingWorldPlazaGenerationFeatureState.revision;
}

export function gettingWorldPlazaGenerationFeatureFlagsSnapshot(): Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> {
  return resolvingWorldPlazaGenerationFeatureActiveFlags();
}

/**
 * Applies a session-only flag map (Dev QA blank slate). Does not touch storage.
 */
export function applyingWorldPlazaGenerationFeatureSessionOverride(
  flags: Readonly<Record<DefiningWorldPlazaGenerationFeatureId, boolean>>
): void {
  managingWorldPlazaGenerationFeatureState.sessionOverrideFlags = {
    ...flags,
  };
  managingWorldPlazaGenerationFeatureState.revision += 1;
  invalidatingWorldPlazaGenerationFeatureCachesForAllDeferred();
  notifyingWorldPlazaGenerationFeatureSubscribers();
}

/**
 * Clears the session override and returns to persisted / default flags.
 */
export function clearingWorldPlazaGenerationFeatureSessionOverride(): void {
  if (!managingWorldPlazaGenerationFeatureState.sessionOverrideFlags) {
    return;
  }

  managingWorldPlazaGenerationFeatureState.sessionOverrideFlags = null;
  managingWorldPlazaGenerationFeatureState.revision += 1;
  invalidatingWorldPlazaGenerationFeatureCachesForAllDeferred();
  notifyingWorldPlazaGenerationFeatureSubscribers();
}

export function settingWorldPlazaGenerationFeatureEnabled(
  featureId: DefiningWorldPlazaGenerationFeatureId,
  isEnabled: boolean
): void {
  const sessionOverride =
    managingWorldPlazaGenerationFeatureState.sessionOverrideFlags;

  if (sessionOverride) {
    if (sessionOverride[featureId] === isEnabled) {
      return;
    }

    managingWorldPlazaGenerationFeatureState.sessionOverrideFlags = {
      ...sessionOverride,
      [featureId]: isEnabled,
    };
    managingWorldPlazaGenerationFeatureState.revision += 1;
    invalidatingWorldPlazaGenerationFeatureCachesDeferred(featureId);
    notifyingWorldPlazaGenerationFeatureSubscribers();
    return;
  }

  if (managingWorldPlazaGenerationFeatureState.flags[featureId] === isEnabled) {
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
  managingWorldPlazaGenerationFeatureState.sessionOverrideFlags = null;
  managingWorldPlazaGenerationFeatureState.revision = 0;
  managingWorldPlazaGenerationFeatureSubscribers.clear();
}
