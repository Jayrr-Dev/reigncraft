/**
 * Module-level store for bestiary sighted and killed species.
 *
 * @module components/world/domains/managingWorldPlazaBestiaryDiscoveryStore
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';
import { writingWorldPlazaBestiaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaBestiaryDiscoveryToStorage';

const managingWorldPlazaBestiaryDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWildlifeSpeciesId[] =
  [];

let managingWorldPlazaBestiaryDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaBestiaryDiscoverySightedSpeciesIds =
  new Set<DefiningWildlifeSpeciesId>();
let managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds =
  new Set<DefiningWildlifeSpeciesId>();
let managingWorldPlazaBestiaryDiscoverySightedSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;

function refreshingWorldPlazaBestiaryDiscoverySnapshotCaches(): void {
  managingWorldPlazaBestiaryDiscoverySightedSnapshotCache =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds].sort();
  managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache =
    managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds].sort();
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
    managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds
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
  const snapshot = readingWorldPlazaBestiaryDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set(
    snapshot.sightedSpeciesIds
  );
  managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds = new Set(
    snapshot.killedSpeciesIds
  );
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/** Returns a stable snapshot of sighted species ids for React subscriptions. */
export function gettingWorldPlazaBestiarySightedSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoverySightedSnapshotCache;
}

/** Returns a stable snapshot of killed species ids for React subscriptions. */
export function gettingWorldPlazaBestiaryKilledSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoveryKilledSnapshotCache;
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
 * Records one species as killed and sighted.
 *
 * @param speciesId - Wildlife species the local player killed.
 */
export function recordingWorldPlazaBestiarySpeciesKilled(
  speciesId: DefiningWildlifeSpeciesId
): void {
  const hadSighted =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.has(speciesId);
  const hadKilled =
    managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds.has(speciesId);

  if (hadSighted && hadKilled) {
    return;
  }

  if (!hadSighted) {
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
      ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
      speciesId,
    ]);
  }

  if (!hadKilled) {
    managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds = new Set([
      ...managingWorldPlazaBestiaryDiscoveryKilledSpeciesIds,
      speciesId,
    ]);
  }

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
