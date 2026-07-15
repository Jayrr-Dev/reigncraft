/**
 * Session-scoped store for the single-player Creative QA world.
 *
 * When enabled: Dev QA session with every generation feature on (session
 * override). Compact biome grid + frozen wildlife AI / no aggro unless
 * Wildlife AI is left on via Perf Flags. Flip layers off from Features /
 * Perf Flags while profiling.
 *
 * @module components/world/domains/managingWorldPlazaDevQaLoadStore
 */

import { DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_ALL_ON } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
import {
  applyingWorldPlazaGenerationFeatureSessionOverride,
  clearingWorldPlazaGenerationFeatureSessionOverride,
  mergingWorldPlazaGenerationFeatureSessionOverrideMissingKeys,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

/** Mutable QA load state shared across plaza systems. */
const managingWorldPlazaDevQaLoadState: {
  isEnabled: boolean;
  revision: number;
} = {
  isEnabled: false,
  revision: 0,
};

/** React subscribers notified when QA load toggles. */
const managingWorldPlazaDevQaLoadSubscribers = new Set<() => void>();

/**
 * Clears procedural terrain caches without creating a module load cycle.
 */
function invalidatingWorldPlazaProceduralGenerationCachesDeferred(): void {
  void import('@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches').then(
    (invalidatingModule) => {
      invalidatingModule.invalidatingWorldPlazaProceduralGenerationCaches();
    }
  );
}

function notifyingWorldPlazaDevQaLoadSubscribers(): void {
  for (const subscriber of managingWorldPlazaDevQaLoadSubscribers) {
    subscriber();
  }
}

/**
 * Returns true when the compact QA world override is active.
 */
export function checkingWorldPlazaDevQaLoadEnabled(): boolean {
  return managingWorldPlazaDevQaLoadState.isEnabled;
}

/**
 * Returns a monotonic revision bumped whenever QA load toggles.
 */
export function readingWorldPlazaDevQaLoadRevision(): number {
  return managingWorldPlazaDevQaLoadState.revision;
}

/**
 * Ensures Dev QA session override has every known feature id (all on).
 *
 * Safe on React remounts / HMR: only fills *missing* keys. Does not wipe
 * Perf Flags toggles the player already flipped off.
 */
export function syncingWorldPlazaDevQaGenerationFeatureBlankSlateIfEnabled(): void {
  if (!managingWorldPlazaDevQaLoadState.isEnabled) {
    return;
  }

  mergingWorldPlazaGenerationFeatureSessionOverrideMissingKeys(
    DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_ALL_ON
  );
}

/**
 * Enables the QA unlock-all world for the current session.
 *
 * First enable applies the full all-on map. Repeat calls only fill
 * missing feature ids so open Perf Flags toggles stay put.
 */
export function enablingWorldPlazaDevQaLoad(): void {
  const wasEnabled = managingWorldPlazaDevQaLoadState.isEnabled;

  managingWorldPlazaDevQaLoadState.isEnabled = true;

  if (!wasEnabled) {
    managingWorldPlazaDevQaLoadState.revision += 1;
    applyingWorldPlazaGenerationFeatureSessionOverride(
      DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_ALL_ON
    );
    invalidatingWorldPlazaProceduralGenerationCachesDeferred();
    notifyingWorldPlazaDevQaLoadSubscribers();
    return;
  }

  mergingWorldPlazaGenerationFeatureSessionOverrideMissingKeys(
    DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_ALL_ON
  );
}

/**
 * Disables the QA world and restores persisted generation feature flags.
 */
export function disablingWorldPlazaDevQaLoad(): void {
  if (!managingWorldPlazaDevQaLoadState.isEnabled) {
    return;
  }

  managingWorldPlazaDevQaLoadState.isEnabled = false;
  managingWorldPlazaDevQaLoadState.revision += 1;
  clearingWorldPlazaGenerationFeatureSessionOverride();
  invalidatingWorldPlazaProceduralGenerationCachesDeferred();
  notifyingWorldPlazaDevQaLoadSubscribers();
}

/**
 * Subscribes to QA load enable/disable changes.
 *
 * @param subscriber - Callback invoked on each toggle.
 * @returns Unsubscribe function.
 */
export function subscribingWorldPlazaDevQaLoad(
  subscriber: () => void
): () => void {
  managingWorldPlazaDevQaLoadSubscribers.add(subscriber);

  return () => {
    managingWorldPlazaDevQaLoadSubscribers.delete(subscriber);
  };
}
