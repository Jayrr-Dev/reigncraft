/**
 * Module-level store for lapidary sighted ores and per-species study counts.
 *
 * LocalStorage-only for now; no cloud save mirror.
 *
 * @module components/world/domains/managingWorldPlazaLapidaryDiscoveryStore
 */

import { readingWorldPlazaLapidaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaLapidaryDiscoveryFromStorage';
import { writingWorldPlazaLapidaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaLapidaryDiscoveryToStorage';
import type { WorldOreSpeciesId } from '../../../shared/worldOreRarity';

const managingWorldPlazaLapidaryDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_SNAPSHOT: readonly WorldOreSpeciesId[] =
  [];

const MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_STUDY_COUNTS: Readonly<
  Partial<Record<WorldOreSpeciesId, number>>
> = {};

let managingWorldPlazaLapidaryDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds =
  new Set<WorldOreSpeciesId>();
let managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId = new Map<
  WorldOreSpeciesId,
  number
>();

let managingWorldPlazaLapidaryDiscoverySightedOreSnapshotCache: readonly WorldOreSpeciesId[] =
  MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_SNAPSHOT;
let managingWorldPlazaLapidaryDiscoveryOreStudyCountsSnapshotCache: Readonly<
  Partial<Record<WorldOreSpeciesId, number>>
> = MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_STUDY_COUNTS;

function refreshingWorldPlazaLapidaryDiscoverySnapshotCaches(): void {
  managingWorldPlazaLapidaryDiscoverySightedOreSnapshotCache =
    managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_SNAPSHOT
      : [...managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds].sort();

  managingWorldPlazaLapidaryDiscoveryOreStudyCountsSnapshotCache =
    managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.size === 0
      ? MANAGING_WORLD_PLAZA_LAPIDARY_DISCOVERY_EMPTY_ORE_STUDY_COUNTS
      : Object.fromEntries([
          ...managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.entries(),
        ]);
}

function notifyingWorldPlazaLapidaryDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaLapidaryDiscoverySubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaLapidaryDiscovery(): void {
  refreshingWorldPlazaLapidaryDiscoverySnapshotCaches();
  writingWorldPlazaLapidaryDiscoveryToStorage(
    managingWorldPlazaLapidaryDiscoveryStorageOwnerId,
    managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds,
    managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId
  );
}

/**
 * Hydrates lapidary discovery from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaLapidaryDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaLapidaryDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaLapidaryDiscoveryStorageOwnerId = storageOwnerId;
  const snapshot =
    readingWorldPlazaLapidaryDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds = new Set(
    snapshot.sightedOreSpeciesIds
  );
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId = new Map(
    snapshot.oreStudyCountsBySpeciesId
  );
  refreshingWorldPlazaLapidaryDiscoverySnapshotCaches();
  notifyingWorldPlazaLapidaryDiscoverySubscribers();
}

/** Returns a stable snapshot of sighted ore species ids for React subscriptions. */
export function gettingWorldPlazaLapidarySightedOreSpeciesSnapshot(): readonly WorldOreSpeciesId[] {
  return managingWorldPlazaLapidaryDiscoverySightedOreSnapshotCache;
}

/** Returns per-ore-species study totals for tiered lapidary detail. */
export function gettingWorldPlazaLapidaryOreStudyCountsSnapshot(): Readonly<
  Partial<Record<WorldOreSpeciesId, number>>
> {
  return managingWorldPlazaLapidaryDiscoveryOreStudyCountsSnapshotCache;
}

/**
 * Records one ore species as sighted if the player has not logged it yet.
 *
 * @param speciesId - Ore species encountered nearby.
 */
export function recordingWorldPlazaLapidaryOreSighted(
  speciesId: WorldOreSpeciesId
): void {
  if (managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds.has(speciesId)) {
    return;
  }

  managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds = new Set([
    ...managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds,
    speciesId,
  ]);
  persistingWorldPlazaLapidaryDiscovery();
  notifyingWorldPlazaLapidaryDiscoverySubscribers();
}

/**
 * Records Study progress for an ore species and ensures it is sighted.
 *
 * @param speciesId - Ore species the local player mined or studied.
 * @param studyPoints - Points awarded for this Study (default 1).
 */
export function recordingWorldPlazaLapidaryOreStudied(
  speciesId: WorldOreSpeciesId,
  studyPoints = 1
): void {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const nextStudyCount =
    (managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.get(
      speciesId
    ) ?? 0) + awardedStudyPoints;

  managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds = new Set([
    ...managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds,
    speciesId,
  ]);
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId = new Map(
    managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId
  );
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.set(
    speciesId,
    nextStudyCount
  );

  persistingWorldPlazaLapidaryDiscovery();
  notifyingWorldPlazaLapidaryDiscoverySubscribers();
}

/**
 * Raises ore study progress to at least `minimumStudyCount` without lowering.
 * Used when backfilling from inventory holdings or already-mined ore tiles.
 *
 * @param speciesId - Ore species already gathered.
 * @param minimumStudyCount - Floor for study progress (minimum 1).
 */
export function ensuringWorldPlazaLapidaryOreStudyAtLeast(
  speciesId: WorldOreSpeciesId,
  minimumStudyCount: number
): void {
  const studyFloor = Math.max(1, Math.floor(minimumStudyCount));
  const currentStudyCount =
    managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.get(
      speciesId
    ) ?? 0;

  if (
    currentStudyCount >= studyFloor &&
    managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds.has(speciesId)
  ) {
    return;
  }

  managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds = new Set([
    ...managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds,
    speciesId,
  ]);
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId = new Map(
    managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId
  );
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId.set(
    speciesId,
    Math.max(currentStudyCount, studyFloor)
  );

  persistingWorldPlazaLapidaryDiscovery();
  notifyingWorldPlazaLapidaryDiscoverySubscribers();
}

/**
 * Subscribes to lapidary discovery changes.
 *
 * @param onStoreChange - Callback invoked when discovery state changes.
 */
export function subscribingWorldPlazaLapidaryDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaLapidaryDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaLapidaryDiscoverySubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaLapidaryDiscoveryStoreForTests(): void {
  managingWorldPlazaLapidaryDiscoveryStorageOwnerId = null;
  managingWorldPlazaLapidaryDiscoverySightedOreSpeciesIds = new Set();
  managingWorldPlazaLapidaryDiscoveryOreStudyCountsBySpeciesId = new Map();
  refreshingWorldPlazaLapidaryDiscoverySnapshotCaches();
  managingWorldPlazaLapidaryDiscoverySubscribers.clear();
}
