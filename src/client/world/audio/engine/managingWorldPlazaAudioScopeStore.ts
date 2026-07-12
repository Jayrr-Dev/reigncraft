/**
 * Ref-counted lifecycle scopes for plaza audio manifests.
 *
 * Scopes describe ownership (home, biome, nearby species, equipped tool).
 * Manifest-key dedupe and Howl lifetime remain inside the audio engine.
 *
 * @module components/world/audio/engine/managingWorldPlazaAudioScopeStore
 */

import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  evictingWorldPlazaUnusedAudioAssets,
  releasingWorldPlazaAudioManifest,
  retainingWorldPlazaAudioManifest,
} from '@/components/world/domains/managingWorldPlazaStarAudio';

type ManagingWorldPlazaAudioScope = {
  readonly scopeId: string;
  manifest: Manifest;
  manifestKey: string;
  referenceCount: number;
  generation: number;
  retained: boolean;
  retainingPromise: Promise<void> | null;
};

const managingWorldPlazaAudioScopes = new Map<
  string,
  ManagingWorldPlazaAudioScope
>();

function buildingWorldPlazaAudioManifestKey(manifest: Manifest): string {
  return Object.keys(manifest).sort().join('|');
}

function releasingWorldPlazaAudioScopeManifest(
  scope: ManagingWorldPlazaAudioScope
): void {
  scope.generation += 1;

  if (scope.retained) {
    releasingWorldPlazaAudioManifest(scope.manifest);
    scope.retained = false;
  }
}

async function retainingWorldPlazaAudioScopeManifest(
  scope: ManagingWorldPlazaAudioScope
): Promise<void> {
  if (scope.retainingPromise) {
    return scope.retainingPromise;
  }

  const generation = scope.generation;
  const manifest = scope.manifest;
  const retainingPromise = retainingWorldPlazaAudioManifest(manifest)
    .then(() => {
      if (
        scope.generation !== generation ||
        scope.referenceCount <= 0 ||
        scope.manifest !== manifest
      ) {
        releasingWorldPlazaAudioManifest(manifest);
        return;
      }

      scope.retained = true;
    })
    .finally(() => {
      if (scope.retainingPromise === retainingPromise) {
        scope.retainingPromise = null;
      }
    });
  scope.retainingPromise = retainingPromise;
  return retainingPromise;
}

/**
 * Acquires a named scope and begins its deduped preload.
 */
export function acquiringWorldPlazaAudioScope(
  scopeId: string,
  manifest: Manifest
): Promise<void> {
  const manifestKey = buildingWorldPlazaAudioManifestKey(manifest);
  const existing = managingWorldPlazaAudioScopes.get(scopeId);

  if (existing && existing.manifestKey === manifestKey) {
    existing.referenceCount += 1;

    if (existing.retained) {
      return Promise.resolve();
    }

    return retainingWorldPlazaAudioScopeManifest(existing);
  }

  if (existing) {
    releasingWorldPlazaAudioScopeManifest(existing);
  }

  const scope: ManagingWorldPlazaAudioScope = {
    scopeId,
    manifest,
    manifestKey,
    referenceCount: 1,
    generation: 1,
    retained: false,
    retainingPromise: null,
  };
  managingWorldPlazaAudioScopes.set(scopeId, scope);
  return retainingWorldPlazaAudioScopeManifest(scope);
}

/**
 * Replaces a scope's desired manifest without increasing ownership.
 */
export function settingWorldPlazaAudioScope(
  scopeId: string,
  manifest: Manifest | null
): Promise<void> {
  const existing = managingWorldPlazaAudioScopes.get(scopeId);

  if (!manifest) {
    if (existing) {
      releasingWorldPlazaAudioScopeManifest(existing);
      managingWorldPlazaAudioScopes.delete(scopeId);
      evictingWorldPlazaUnusedAudioAssets();
    }

    return Promise.resolve();
  }

  const manifestKey = buildingWorldPlazaAudioManifestKey(manifest);

  if (existing?.manifestKey === manifestKey) {
    return existing.retained
      ? Promise.resolve()
      : retainingWorldPlazaAudioScopeManifest(existing);
  }

  if (existing) {
    releasingWorldPlazaAudioScopeManifest(existing);
    existing.manifest = manifest;
    existing.manifestKey = manifestKey;
    existing.referenceCount = Math.max(1, existing.referenceCount);
    existing.generation += 1;
    return retainingWorldPlazaAudioScopeManifest(existing);
  }

  const scope: ManagingWorldPlazaAudioScope = {
    scopeId,
    manifest,
    manifestKey,
    referenceCount: 1,
    generation: 1,
    retained: false,
    retainingPromise: null,
  };
  managingWorldPlazaAudioScopes.set(scopeId, scope);
  return retainingWorldPlazaAudioScopeManifest(scope);
}

/** Releases one owner of a named scope. */
export function releasingWorldPlazaAudioScope(scopeId: string): void {
  const scope = managingWorldPlazaAudioScopes.get(scopeId);

  if (!scope) {
    return;
  }

  scope.referenceCount = Math.max(0, scope.referenceCount - 1);

  if (scope.referenceCount > 0) {
    return;
  }

  releasingWorldPlazaAudioScopeManifest(scope);
  managingWorldPlazaAudioScopes.delete(scopeId);
  evictingWorldPlazaUnusedAudioAssets();
}

/** Releases all scopes matching a lifecycle prefix such as `world:`. */
export function releasingWorldPlazaAudioScopesByPrefix(prefix: string): void {
  let releasedAnyScope = false;

  for (const [scopeId, scope] of managingWorldPlazaAudioScopes) {
    if (!scopeId.startsWith(prefix)) {
      continue;
    }

    releasingWorldPlazaAudioScopeManifest(scope);
    managingWorldPlazaAudioScopes.delete(scopeId);
    releasedAnyScope = true;
  }

  if (releasedAnyScope) {
    evictingWorldPlazaUnusedAudioAssets();
  }
}

/** Returns active scope ids for diagnostics and tests. */
export function listingWorldPlazaActiveAudioScopeIds(): readonly string[] {
  return [...managingWorldPlazaAudioScopes.keys()].sort();
}
