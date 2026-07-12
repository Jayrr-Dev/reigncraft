/**
 * Session-scoped store for the single-player "This a dev load" QA world.
 *
 * When enabled: flat plains blank slate, generation features off (session
 * override; audio stays on), frozen wildlife AI / no aggro if animals are
 * spawned manually. Night lighting stays mounted so torch/fairy lights still
 * punch holes when Features re-enables animals. Re-enable layers via Features
 * debug controls while profiling.
 *
 * @module components/world/domains/managingWorldPlazaDevQaLoadStore
 */

import { DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE } from '@/components/world/domains/definingWorldPlazaDevQaLoadConstants';
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
 * Ensures Dev QA session override has every known feature id.
 *
 * Safe on React remounts / HMR: only fills *missing* keys. Does not wipe
 * Perf Flags toggles the player already flipped on.
 */
export function syncingWorldPlazaDevQaGenerationFeatureBlankSlateIfEnabled(): void {
  if (!managingWorldPlazaDevQaLoadState.isEnabled) {
    return;
  }

  mergingWorldPlazaGenerationFeatureSessionOverrideMissingKeys(
    DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE
  );
}

/**
 * Enables the QA blank-slate world for the current session.
 *
 * First enable applies the full blank-slate map. Repeat calls only fill
 * missing feature ids so open Perf Flags toggles stay put.
 */
export function enablingWorldPlazaDevQaLoad(): void {
  const wasEnabled = managingWorldPlazaDevQaLoadState.isEnabled;

  managingWorldPlazaDevQaLoadState.isEnabled = true;

  if (!wasEnabled) {
    managingWorldPlazaDevQaLoadState.revision += 1;
    applyingWorldPlazaGenerationFeatureSessionOverride(
      DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE
    );
    invalidatingWorldPlazaProceduralGenerationCachesDeferred();
    notifyingWorldPlazaDevQaLoadSubscribers();
    return;
  }

  mergingWorldPlazaGenerationFeatureSessionOverrideMissingKeys(
    DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE
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
