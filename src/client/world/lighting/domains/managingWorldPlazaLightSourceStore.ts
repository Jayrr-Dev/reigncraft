import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';

/**
 * Module-level registry of active world light sources.
 *
 * Publishers (fire layer, future lamps) sync lights by owner key; the
 * lighting renderer reads the merged snapshot every tick. No React state is
 * involved so 60fps reads stay allocation-free apart from snapshot rebuilds
 * on change.
 *
 * @module components/world/lighting/domains/managingWorldPlazaLightSourceStore
 */

const lightSourcesByOwner = new Map<
  string,
  ReadonlyMap<string, DefiningWorldPlazaLightSource>
>();

let mergedSnapshot: readonly DefiningWorldPlazaLightSource[] = [];
let isSnapshotStale = false;
let lightSourcesRevision = 0;

function rebuildingMergedSnapshotIfStale(): void {
  if (!isSnapshotStale) {
    return;
  }

  const merged: DefiningWorldPlazaLightSource[] = [];

  for (const ownerLights of lightSourcesByOwner.values()) {
    for (const light of ownerLights.values()) {
      merged.push(light);
    }
  }

  mergedSnapshot = merged;
  isSnapshotStale = false;
  lightSourcesRevision += 1;
}

/**
 * Replaces every light owned by one publisher in a single call.
 *
 * @param ownerKey - Publisher namespace, e.g. `"fire"`.
 * @param lights - Full current light list for that publisher.
 */
export function syncingWorldPlazaLightSourcesForOwner(
  ownerKey: string,
  lights: readonly DefiningWorldPlazaLightSource[]
): void {
  const ownerLights = new Map<string, DefiningWorldPlazaLightSource>();

  for (const light of lights) {
    ownerLights.set(light.id, light);
  }

  lightSourcesByOwner.set(ownerKey, ownerLights);
  isSnapshotStale = true;
}

/**
 * Removes every light owned by one publisher (e.g. on unmount).
 *
 * @param ownerKey - Publisher namespace.
 */
export function clearingWorldPlazaLightSourcesForOwner(ownerKey: string): void {
  if (lightSourcesByOwner.delete(ownerKey)) {
    isSnapshotStale = true;
  }
}

/**
 * Lists every active light source across all publishers.
 */
export function listingWorldPlazaLightSources(): readonly DefiningWorldPlazaLightSource[] {
  rebuildingMergedSnapshotIfStale();
  return mergedSnapshot;
}

/**
 * Monotonic revision bumped whenever the merged light snapshot rebuilds.
 * Lighting can skip RTT when this is unchanged and camera/player are still.
 */
export function peekingWorldPlazaLightSourcesRevision(): number {
  rebuildingMergedSnapshotIfStale();
  return lightSourcesRevision;
}
