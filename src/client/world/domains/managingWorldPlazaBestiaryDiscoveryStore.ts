/**
 * Module-level store for bestiary sighted species and per-species kill counts.
 *
 * @module components/world/domains/managingWorldPlazaBestiaryDiscoveryStore
 */

import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';
import { writingWorldPlazaBestiaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaBestiaryDiscoveryToStorage';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const managingWorldPlazaBestiaryDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWildlifeSpeciesId[] =
  [];

const MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_KILL_COUNTS: Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> = {};

let managingWorldPlazaBestiaryDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaBestiaryDiscoverySightedSpeciesIds =
  new Set<DefiningWildlifeSpeciesId>();
let managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId = new Map<
  DefiningWildlifeSpeciesId,
  number
>();
let managingWorldPlazaBestiaryDiscoverySightedSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaBestiaryDiscoveryKillCountsSnapshotCache: Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> = MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_KILL_COUNTS;

function refreshingWorldPlazaBestiaryDiscoverySnapshotCaches(): void {
  managingWorldPlazaBestiaryDiscoverySightedSnapshotCache =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds].sort();

  const studiedSpeciesIds = [
    ...managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId.entries(),
  ]
    .filter(([, killCount]) => killCount > 0)
    .map(([speciesId]) => speciesId)
    .sort();

  managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache =
    studiedSpeciesIds.length === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : studiedSpeciesIds;

  managingWorldPlazaBestiaryDiscoveryKillCountsSnapshotCache =
    managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_KILL_COUNTS
      : Object.fromEntries([
          ...managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId.entries(),
        ]);
}

function notifyingWorldPlazaBestiaryDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaBestiaryDiscoverySubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaBestiaryDiscovery(): void {
  writingWorldPlazaBestiaryDiscoveryToStorage(
    managingWorldPlazaBestiaryDiscoveryStorageOwnerId,
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
    managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId
  );
}

/**
 * Hydrates bestiary discovery from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaBestiaryDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaBestiaryDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaBestiaryDiscoveryStorageOwnerId = storageOwnerId;
  const snapshot =
    readingWorldPlazaBestiaryDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set(
    snapshot.sightedSpeciesIds
  );
  managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId = new Map(
    snapshot.killCountsBySpeciesId
  );
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/** Returns a stable snapshot of sighted species ids for React subscriptions. */
export function gettingWorldPlazaBestiarySightedSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoverySightedSnapshotCache;
}

/** Returns studied species ids (kill count ≥ 1) for progress counts. */
export function gettingWorldPlazaBestiaryKilledSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache;
}

/** Returns per-species kill totals for tiered bestiary detail. */
export function gettingWorldPlazaBestiaryKillCountsSnapshot(): Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> {
  return managingWorldPlazaBestiaryDiscoveryKillCountsSnapshotCache;
}

/**
 * Records one species as sighted if the player has not logged it yet.
 *
 * @param speciesId - Wildlife species encountered nearby.
 */
export function recordingWorldPlazaBestiarySpeciesSighted(
  speciesId: DefiningWildlifeSpeciesId
): void {
  if (managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.has(speciesId)) {
    return;
  }

  managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
    ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
    speciesId,
  ]);
  persistingWorldPlazaBestiaryDiscovery();
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/**
 * Records one kill for a species and ensures it is sighted.
 *
 * @param speciesId - Wildlife species the local player killed.
 */
export function recordingWorldPlazaBestiarySpeciesKilled(
  speciesId: DefiningWildlifeSpeciesId
): void {
  const nextKillCount =
    (managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId.get(speciesId) ??
      0) + 1;
  const hadSighted =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.has(speciesId);

  if (!hadSighted) {
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
      ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
      speciesId,
    ]);
  }

  managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId = new Map(
    managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId
  );
  managingWorldPlazaBestiaryDiscoveryKillCountsBySpeciesId.set(
    speciesId,
    nextKillCount
  );

  persistingWorldPlazaBestiaryDiscovery();
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/**
 * Subscribes to bestiary discovery changes.
 *
 * @param onStoreChange - Callback invoked when discovery state changes.
 */
export function subscribingWorldPlazaBestiaryDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaBestiaryDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaBestiaryDiscoverySubscribers.delete(onStoreChange);
  };
}
