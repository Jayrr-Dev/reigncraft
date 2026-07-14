/**
 * Module-level store for herbarium sighted flora and per-species study counts.
 *
 * LocalStorage-only for now; no cloud save mirror.
 *
 * @module components/world/domains/managingWorldPlazaHerbariumDiscoveryStore
 */

import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { readingWorldPlazaHerbariumDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaHerbariumDiscoveryFromStorage';
import { writingWorldPlazaHerbariumDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaHerbariumDiscoveryToStorage';
import type { WorldFlowerSpeciesId } from '../../../shared/worldFlowerRarity';

const managingWorldPlazaHerbariumDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_SNAPSHOT: readonly WorldFlowerSpeciesId[] =
  [];

const MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_SNAPSHOT: readonly DefiningWorldPlazaTreeVariantKind[] =
  [];

const MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_STUDY_COUNTS: Readonly<
  Partial<Record<WorldFlowerSpeciesId, number>>
> = {};

const MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_STUDY_COUNTS: Readonly<
  Partial<Record<DefiningWorldPlazaTreeVariantKind, number>>
> = {};

let managingWorldPlazaHerbariumDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds =
  new Set<WorldFlowerSpeciesId>();
let managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId = new Map<
  WorldFlowerSpeciesId,
  number
>();
let managingWorldPlazaHerbariumDiscoverySightedTreeVariants =
  new Set<DefiningWorldPlazaTreeVariantKind>();
let managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant = new Map<
  DefiningWorldPlazaTreeVariantKind,
  number
>();

let managingWorldPlazaHerbariumDiscoverySightedFlowerSnapshotCache: readonly WorldFlowerSpeciesId[] =
  MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_SNAPSHOT;
let managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsSnapshotCache: Readonly<
  Partial<Record<WorldFlowerSpeciesId, number>>
> = MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_STUDY_COUNTS;
let managingWorldPlazaHerbariumDiscoverySightedTreeSnapshotCache: readonly DefiningWorldPlazaTreeVariantKind[] =
  MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_SNAPSHOT;
let managingWorldPlazaHerbariumDiscoveryTreeStudyCountsSnapshotCache: Readonly<
  Partial<Record<DefiningWorldPlazaTreeVariantKind, number>>
> = MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_STUDY_COUNTS;

function refreshingWorldPlazaHerbariumDiscoverySnapshotCaches(): void {
  managingWorldPlazaHerbariumDiscoverySightedFlowerSnapshotCache =
    managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds.size === 0
      ? MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_SNAPSHOT
      : [...managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds].sort();

  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsSnapshotCache =
    managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.size === 0
      ? MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_FLOWER_STUDY_COUNTS
      : Object.fromEntries([
          ...managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.entries(),
        ]);

  managingWorldPlazaHerbariumDiscoverySightedTreeSnapshotCache =
    managingWorldPlazaHerbariumDiscoverySightedTreeVariants.size === 0
      ? MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_SNAPSHOT
      : [...managingWorldPlazaHerbariumDiscoverySightedTreeVariants].sort();

  managingWorldPlazaHerbariumDiscoveryTreeStudyCountsSnapshotCache =
    managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant.size === 0
      ? MANAGING_WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_TREE_STUDY_COUNTS
      : Object.fromEntries([
          ...managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant.entries(),
        ]);
}

function notifyingWorldPlazaHerbariumDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaHerbariumDiscoverySubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaHerbariumDiscovery(): void {
  refreshingWorldPlazaHerbariumDiscoverySnapshotCaches();
  writingWorldPlazaHerbariumDiscoveryToStorage(
    managingWorldPlazaHerbariumDiscoveryStorageOwnerId,
    managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds,
    managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId,
    managingWorldPlazaHerbariumDiscoverySightedTreeVariants,
    managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant
  );
}

/**
 * Hydrates herbarium discovery from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaHerbariumDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaHerbariumDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaHerbariumDiscoveryStorageOwnerId = storageOwnerId;
  const snapshot =
    readingWorldPlazaHerbariumDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds = new Set(
    snapshot.sightedFlowerSpeciesIds
  );
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId = new Map(
    snapshot.flowerStudyCountsBySpeciesId
  );
  managingWorldPlazaHerbariumDiscoverySightedTreeVariants = new Set(
    snapshot.sightedTreeVariants
  );
  managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant = new Map(
    snapshot.treeStudyCountsByVariant
  );
  refreshingWorldPlazaHerbariumDiscoverySnapshotCaches();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/** Returns a stable snapshot of sighted flower species ids for React subscriptions. */
export function gettingWorldPlazaHerbariumSightedFlowerSpeciesSnapshot(): readonly WorldFlowerSpeciesId[] {
  return managingWorldPlazaHerbariumDiscoverySightedFlowerSnapshotCache;
}

/** Returns per-flower-species study totals for tiered herbarium detail. */
export function gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot(): Readonly<
  Partial<Record<WorldFlowerSpeciesId, number>>
> {
  return managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsSnapshotCache;
}

/** Returns a stable snapshot of sighted tree variants for React subscriptions. */
export function gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot(): readonly DefiningWorldPlazaTreeVariantKind[] {
  return managingWorldPlazaHerbariumDiscoverySightedTreeSnapshotCache;
}

/** Returns per-tree-variant study totals for tiered herbarium detail. */
export function gettingWorldPlazaHerbariumTreeStudyCountsSnapshot(): Readonly<
  Partial<Record<DefiningWorldPlazaTreeVariantKind, number>>
> {
  return managingWorldPlazaHerbariumDiscoveryTreeStudyCountsSnapshotCache;
}

/**
 * Records one flower species as sighted if the player has not logged it yet.
 *
 * @param speciesId - Flower species encountered nearby.
 */
export function recordingWorldPlazaHerbariumFlowerSighted(
  speciesId: WorldFlowerSpeciesId
): void {
  if (
    managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds.has(speciesId)
  ) {
    return;
  }

  managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds = new Set([
    ...managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds,
    speciesId,
  ]);
  persistingWorldPlazaHerbariumDiscovery();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/**
 * Records Study progress for a flower species and ensures it is sighted.
 *
 * @param speciesId - Flower species the local player picked.
 * @param studyPoints - Points awarded for this Study (default 1).
 */
export function recordingWorldPlazaHerbariumFlowerStudied(
  speciesId: WorldFlowerSpeciesId,
  studyPoints = 1
): void {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const nextStudyCount =
    (managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.get(
      speciesId
    ) ?? 0) + awardedStudyPoints;

  managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds = new Set([
    ...managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds,
    speciesId,
  ]);
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId = new Map(
    managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId
  );
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.set(
    speciesId,
    nextStudyCount
  );

  persistingWorldPlazaHerbariumDiscovery();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/**
 * Raises flower study progress to at least `minimumStudyCount` without lowering.
 * Used when backfilling from inventory holdings or already-picked tiles.
 *
 * @param speciesId - Flower species already gathered.
 * @param minimumStudyCount - Floor for study progress (minimum 1).
 */
export function ensuringWorldPlazaHerbariumFlowerStudyAtLeast(
  speciesId: WorldFlowerSpeciesId,
  minimumStudyCount: number
): void {
  const studyFloor = Math.max(1, Math.floor(minimumStudyCount));
  const currentStudyCount =
    managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.get(
      speciesId
    ) ?? 0;

  if (
    currentStudyCount >= studyFloor &&
    managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds.has(speciesId)
  ) {
    return;
  }

  managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds = new Set([
    ...managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds,
    speciesId,
  ]);
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId = new Map(
    managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId
  );
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId.set(
    speciesId,
    Math.max(currentStudyCount, studyFloor)
  );

  persistingWorldPlazaHerbariumDiscovery();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/**
 * Records one tree variant as sighted if the player has not logged it yet.
 *
 * @param variant - Tree silhouette encountered nearby.
 */
export function recordingWorldPlazaHerbariumTreeSighted(
  variant: DefiningWorldPlazaTreeVariantKind
): void {
  if (managingWorldPlazaHerbariumDiscoverySightedTreeVariants.has(variant)) {
    return;
  }

  managingWorldPlazaHerbariumDiscoverySightedTreeVariants = new Set([
    ...managingWorldPlazaHerbariumDiscoverySightedTreeVariants,
    variant,
  ]);
  persistingWorldPlazaHerbariumDiscovery();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/**
 * Records Study progress for a tree variant and ensures it is sighted.
 *
 * @param variant - Tree silhouette the local player finished chopping a layer on.
 * @param studyPoints - Points awarded for this Study (default 1).
 */
export function recordingWorldPlazaHerbariumTreeStudied(
  variant: DefiningWorldPlazaTreeVariantKind,
  studyPoints = 1
): void {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const nextStudyCount =
    (managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant.get(
      variant
    ) ?? 0) + awardedStudyPoints;

  managingWorldPlazaHerbariumDiscoverySightedTreeVariants = new Set([
    ...managingWorldPlazaHerbariumDiscoverySightedTreeVariants,
    variant,
  ]);
  managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant = new Map(
    managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant
  );
  managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant.set(
    variant,
    nextStudyCount
  );

  persistingWorldPlazaHerbariumDiscovery();
  notifyingWorldPlazaHerbariumDiscoverySubscribers();
}

/**
 * Subscribes to herbarium discovery changes.
 *
 * @param onStoreChange - Callback invoked when discovery state changes.
 */
export function subscribingWorldPlazaHerbariumDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaHerbariumDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaHerbariumDiscoverySubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaHerbariumDiscoveryStoreForTests(): void {
  managingWorldPlazaHerbariumDiscoveryStorageOwnerId = null;
  managingWorldPlazaHerbariumDiscoverySightedFlowerSpeciesIds = new Set();
  managingWorldPlazaHerbariumDiscoveryFlowerStudyCountsBySpeciesId = new Map();
  managingWorldPlazaHerbariumDiscoverySightedTreeVariants = new Set();
  managingWorldPlazaHerbariumDiscoveryTreeStudyCountsByVariant = new Map();
  refreshingWorldPlazaHerbariumDiscoverySnapshotCaches();
  managingWorldPlazaHerbariumDiscoverySubscribers.clear();
}
