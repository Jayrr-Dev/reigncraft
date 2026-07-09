/**
 * Module-level store for bestiary sighted species and per-species study counts.
 *
 * @module components/world/domains/managingWorldPlazaBestiaryDiscoveryStore
 */

import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';
import { writingWorldPlazaBestiaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaBestiaryDiscoveryToStorage';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const managingWorldPlazaBestiaryDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWildlifeSpeciesId[] =
  [];

const MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_STUDY_COUNTS: Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> = {};

let managingWorldPlazaBestiaryDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaBestiaryDiscoverySightedSpeciesIds =
  new Set<DefiningWildlifeSpeciesId>();
let managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map<
  DefiningWildlifeSpeciesId,
  number
>();
let managingWorldPlazaBestiaryDiscoverySightedSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaBestiaryDiscoveryStudiedSnapshotCache: readonly DefiningWildlifeSpeciesId[] =
  MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaBestiaryDiscoveryStudyCountsSnapshotCache: Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> = MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_STUDY_COUNTS;

function refreshingWorldPlazaBestiaryDiscoverySnapshotCaches(): void {
  managingWorldPlazaBestiaryDiscoverySightedSnapshotCache =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds].sort();

  const studiedSpeciesIds = [
    ...managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.entries(),
  ]
    .filter(([, studyCount]) => studyCount > 0)
    .map(([speciesId]) => speciesId)
    .sort();

  managingWorldPlazaBestiaryDiscoveryStudiedSnapshotCache =
    studiedSpeciesIds.length === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_SNAPSHOT
      : studiedSpeciesIds;

  managingWorldPlazaBestiaryDiscoveryStudyCountsSnapshotCache =
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.size === 0
      ? MANAGING_WORLD_PLAZA_BESTIARY_DISCOVERY_EMPTY_STUDY_COUNTS
      : Object.fromEntries([
          ...managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.entries(),
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
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId
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
  managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map(
    snapshot.studyCountsBySpeciesId
  );
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/** Returns a stable snapshot of sighted species ids for React subscriptions. */
export function gettingWorldPlazaBestiarySightedSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoverySightedSnapshotCache;
}

/** Returns studied species ids (study count ≥ 1) for progress counts. */
export function gettingWorldPlazaBestiaryKilledSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoveryStudiedSnapshotCache;
}

/** Alias for studied species ids. */
export function gettingWorldPlazaBestiaryStudiedSpeciesSnapshot(): readonly DefiningWildlifeSpeciesId[] {
  return managingWorldPlazaBestiaryDiscoveryStudiedSnapshotCache;
}

/** Returns per-species study totals for tiered bestiary detail. */
export function gettingWorldPlazaBestiaryKillCountsSnapshot(): Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> {
  return managingWorldPlazaBestiaryDiscoveryStudyCountsSnapshotCache;
}

/** Alias for per-species study totals. */
export function gettingWorldPlazaBestiaryStudyCountsSnapshot(): Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> {
  return managingWorldPlazaBestiaryDiscoveryStudyCountsSnapshotCache;
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
 * Records Study progress for a species and ensures it is sighted.
 *
 * @param speciesId - Wildlife species the local player studied on a corpse.
 * @param studyPoints - Points awarded for this Study (default 1; large animals 1–3).
 */
export function recordingWorldPlazaBestiarySpeciesStudied(
  speciesId: DefiningWildlifeSpeciesId,
  studyPoints = 1
): void {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const nextStudyCount =
    (managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.get(speciesId) ??
      0) + awardedStudyPoints;
  const hadSighted =
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds.has(speciesId);

  if (!hadSighted) {
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
      ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
      speciesId,
    ]);
  }

  managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map(
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId
  );
  managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.set(
    speciesId,
    nextStudyCount
  );

  persistingWorldPlazaBestiaryDiscovery();
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/** @deprecated Use {@link recordingWorldPlazaBestiarySpeciesStudied}. */
export function recordingWorldPlazaBestiarySpeciesKilled(
  speciesId: DefiningWildlifeSpeciesId
): void {
  recordingWorldPlazaBestiarySpeciesStudied(speciesId, 1);
}

function applyingWorldPlazaBestiaryDiscoveryMutation(
  mutator: () => void
): void {
  mutator();
  persistingWorldPlazaBestiaryDiscovery();
  refreshingWorldPlazaBestiaryDiscoverySnapshotCaches();
  notifyingWorldPlazaBestiaryDiscoverySubscribers();
}

/**
 * Dev-only: sets study count for one species and ensures it stays sighted when > 0.
 */
export function settingWorldPlazaBestiarySpeciesKillCountForDev(
  speciesId: DefiningWildlifeSpeciesId,
  studyCount: number
): void {
  const normalizedStudyCount = Math.max(0, Math.floor(studyCount));

  applyingWorldPlazaBestiaryDiscoveryMutation(() => {
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map(
      managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId
    );

    if (normalizedStudyCount > 0) {
      managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.set(
        speciesId,
        normalizedStudyCount
      );
      managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
        ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
        speciesId,
      ]);
      return;
    }

    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.delete(speciesId);
  });
}

/**
 * Dev-only: toggles sighted state. Locking also clears study count for that species.
 */
export function settingWorldPlazaBestiarySpeciesSightedForDev(
  speciesId: DefiningWildlifeSpeciesId,
  isSighted: boolean
): void {
  applyingWorldPlazaBestiaryDiscoveryMutation(() => {
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map(
      managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId
    );

    if (isSighted) {
      managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set([
        ...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds,
        speciesId,
      ]);
      return;
    }

    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set(
      [...managingWorldPlazaBestiaryDiscoverySightedSpeciesIds].filter(
        (sightedSpeciesId) => sightedSpeciesId !== speciesId
      )
    );
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId.delete(speciesId);
  });
}

/**
 * Dev-only: sights every catalog species and sets full-study count.
 */
export function unlockingWorldPlazaBestiaryDiscoveryAllForDev(
  speciesIds: readonly DefiningWildlifeSpeciesId[],
  fullUnlockStudyCount: number
): void {
  applyingWorldPlazaBestiaryDiscoveryMutation(() => {
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set(speciesIds);
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map(
      speciesIds.map((speciesId) => [speciesId, fullUnlockStudyCount])
    );
  });
}

/**
 * Dev-only: clears all bestiary sight and study progress.
 */
export function lockingWorldPlazaBestiaryDiscoveryAllForDev(): void {
  applyingWorldPlazaBestiaryDiscoveryMutation(() => {
    managingWorldPlazaBestiaryDiscoverySightedSpeciesIds = new Set();
    managingWorldPlazaBestiaryDiscoveryStudyCountsBySpeciesId = new Map();
  });
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
