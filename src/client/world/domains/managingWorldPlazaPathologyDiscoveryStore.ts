/**
 * Module-level store for Pathology obtained diseases and linked creature studies.
 *
 * LocalStorage-only for now; no cloud save mirror.
 *
 * Study formula: each Bestiary Study on a carrier species adds its study points
 * to every disease that species can cause. Pathology points =
 * floor(linkedCreatureStudies / 3) (see computingPlazaPathologyStudyPoints).
 *
 * @module components/world/domains/managingWorldPlazaPathologyDiscoveryStore
 */

import { listingPlazaPathologyDiseaseIdsCausedBySpecies } from '@/components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks';
import { resolvingWorldPlazaPathologyDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaPathologyDiscoveryConstants';
import { readingWorldPlazaPathologyDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaPathologyDiscoveryFromStorage';
import { writingWorldPlazaPathologyDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaPathologyDiscoveryToStorage';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const managingWorldPlazaPathologyDiscoverySubscribers = new Set<() => void>();

const MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT: readonly DefiningWorldPlazaEntityDiseaseId[] =
  [];

const MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_LINKED_STUDIES: Readonly<
  Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
> = {};

let managingWorldPlazaPathologyDiscoveryStorageOwnerId: string | null = null;
let managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds =
  new Set<DefiningWorldPlazaEntityDiseaseId>();
let managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId =
  new Map<DefiningWorldPlazaEntityDiseaseId, number>();

let managingWorldPlazaPathologyDiscoveryObtainedSnapshotCache: readonly DefiningWorldPlazaEntityDiseaseId[] =
  MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT;
let managingWorldPlazaPathologyDiscoveryLinkedStudiesSnapshotCache: Readonly<
  Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
> = MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_LINKED_STUDIES;

function refreshingWorldPlazaPathologyDiscoverySnapshotCaches(): void {
  managingWorldPlazaPathologyDiscoveryObtainedSnapshotCache =
    managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds.size === 0
      ? MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_SNAPSHOT
      : [...managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds].sort();

  managingWorldPlazaPathologyDiscoveryLinkedStudiesSnapshotCache =
    managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId.size ===
    0
      ? MANAGING_WORLD_PLAZA_PATHOLOGY_DISCOVERY_EMPTY_LINKED_STUDIES
      : Object.fromEntries([
          ...managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId.entries(),
        ]);
}

function notifyingWorldPlazaPathologyDiscoverySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPathologyDiscoverySubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaPathologyDiscovery(): void {
  refreshingWorldPlazaPathologyDiscoverySnapshotCaches();
  writingWorldPlazaPathologyDiscoveryToStorage(
    managingWorldPlazaPathologyDiscoveryStorageOwnerId,
    managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds,
    managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId
  );
}

/**
 * Hydrates Pathology discovery from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaPathologyDiscoveryStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaPathologyDiscoveryStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaPathologyDiscoveryStorageOwnerId = storageOwnerId;
  const snapshot =
    readingWorldPlazaPathologyDiscoveryFromStorage(storageOwnerId);
  managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds = new Set(
    snapshot.obtainedDiseaseIds
  );
  managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId =
    new Map(snapshot.linkedCreatureStudiesByDiseaseId);
  refreshingWorldPlazaPathologyDiscoverySnapshotCaches();
  notifyingWorldPlazaPathologyDiscoverySubscribers();
}

/** Returns a stable snapshot of obtained disease ids for React subscriptions. */
export function gettingWorldPlazaPathologyObtainedDiseasesSnapshot(): readonly DefiningWorldPlazaEntityDiseaseId[] {
  return managingWorldPlazaPathologyDiscoveryObtainedSnapshotCache;
}

/** Returns per-disease linked creature Study totals. */
export function gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot(): Readonly<
  Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
> {
  return managingWorldPlazaPathologyDiscoveryLinkedStudiesSnapshotCache;
}

/**
 * Records that the player contracted a disease at least once.
 *
 * @param diseaseId - Disease successfully applied to the local player.
 */
export function recordingWorldPlazaPathologyDiseaseObtained(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): void {
  if (managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds.has(diseaseId)) {
    return;
  }

  managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds = new Set([
    ...managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds,
    diseaseId,
  ]);
  persistingWorldPlazaPathologyDiscovery();
  notifyingWorldPlazaPathologyDiscoverySubscribers();
}

/**
 * Credits Pathology linked-creature study totals from a Bestiary Study.
 *
 * Adds `studyPoints` to every disease the species can cause. Pathology UI
 * study points are floor(linked / 3) and only display once the disease is
 * obtained.
 *
 * @param speciesId - Wildlife species studied on a corpse.
 * @param studyPoints - Bestiary study points awarded for this Study.
 */
export function creditingWorldPlazaPathologyFromWildlifeSpeciesStudy(
  speciesId: DefiningWildlifeSpeciesId,
  studyPoints = 1
): void {
  const awardedStudyPoints = Math.max(1, Math.floor(studyPoints));
  const diseaseIds =
    listingPlazaPathologyDiseaseIdsCausedBySpecies(speciesId);

  if (diseaseIds.length === 0) {
    return;
  }

  managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId =
    new Map(
      managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId
    );

  for (const diseaseId of diseaseIds) {
    const nextLinkedCount =
      (managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId.get(
        diseaseId
      ) ?? 0) + awardedStudyPoints;
    managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId.set(
      diseaseId,
      nextLinkedCount
    );
  }

  persistingWorldPlazaPathologyDiscovery();
  notifyingWorldPlazaPathologyDiscoverySubscribers();
}

/**
 * Subscribes to Pathology discovery changes.
 *
 * @param onStoreChange - Callback invoked when discovery state changes.
 */
export function subscribingWorldPlazaPathologyDiscovery(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPathologyDiscoverySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaPathologyDiscoverySubscribers.delete(onStoreChange);
  };
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaPathologyDiscoveryStoreForTests(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(
        resolvingWorldPlazaPathologyDiscoveryStorageKey(
          managingWorldPlazaPathologyDiscoveryStorageOwnerId
        )
      );
    } catch {
      // Ignore storage failures in non-browser test hosts.
    }
  }

  managingWorldPlazaPathologyDiscoveryStorageOwnerId = null;
  managingWorldPlazaPathologyDiscoveryObtainedDiseaseIds = new Set();
  managingWorldPlazaPathologyDiscoveryLinkedCreatureStudiesByDiseaseId =
    new Map();
  refreshingWorldPlazaPathologyDiscoverySnapshotCaches();
  managingWorldPlazaPathologyDiscoverySubscribers.clear();
}
