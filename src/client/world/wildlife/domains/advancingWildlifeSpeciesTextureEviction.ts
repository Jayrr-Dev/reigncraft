/**
 * Scans cached wildlife species and evicts textures past the grace window.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction
 */

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { evictingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/evictingWildlifeSpeciesTextures';
import {
  checkingWildlifeSpeciesTexturesAreResolved,
  listingWildlifeSpeciesTexturesCacheIds,
} from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { peekingWildlifeSpeciesTextureLastSeenAtMs } from '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence';
import { listingWildlifeBootPreloadSpeciesIds } from '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures';
import { resolvingWildlifeTextureEvictionProfile } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';

export type AdvancingWildlifeSpeciesTextureEvictionParams = {
  readonly nowMs: number;
  /** Species ids with at least one live instance this frame. */
  readonly liveSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>;
  /** Called after a species is successfully evicted (e.g. shrink loadedSpeciesRef). */
  readonly onEvictedSpeciesId?: (speciesId: DefiningWildlifeSpeciesId) => void;
};

let pinnedBootSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId> | null = null;

function resolvingWildlifePinnedBootSpeciesIds(): ReadonlySet<DefiningWildlifeSpeciesId> {
  if (!pinnedBootSpeciesIds) {
    pinnedBootSpeciesIds = new Set(listingWildlifeBootPreloadSpeciesIds());
  }

  return pinnedBootSpeciesIds;
}

async function evictingWildlifeSpeciesIfPossible(
  speciesId: DefiningWildlifeSpeciesId,
  onEvictedSpeciesId?: (speciesId: DefiningWildlifeSpeciesId) => void
): Promise<boolean> {
  const species = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!species) {
    return false;
  }

  const didEvict = await evictingWildlifeSpeciesTextures(species);

  if (didEvict) {
    onEvictedSpeciesId?.(speciesId);
  }

  return didEvict;
}

function listingWildlifeEvictableCachedSpeciesIds(
  liveSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  pinnedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): DefiningWildlifeSpeciesId[] {
  const evictableSpeciesIds: DefiningWildlifeSpeciesId[] = [];

  for (const speciesId of listingWildlifeSpeciesTexturesCacheIds()) {
    if (
      pinnedSpeciesIds.has(speciesId) ||
      liveSpeciesIds.has(speciesId) ||
      !checkingWildlifeSpeciesTexturesAreResolved(speciesId)
    ) {
      continue;
    }

    evictableSpeciesIds.push(speciesId);
  }

  return evictableSpeciesIds;
}

async function evictingWildlifeSpeciesPastGraceWindow(
  params: AdvancingWildlifeSpeciesTextureEvictionParams,
  graceMs: number
): Promise<readonly DefiningWildlifeSpeciesId[]> {
  const { nowMs, liveSpeciesIds, onEvictedSpeciesId } = params;
  const pinnedSpeciesIds = resolvingWildlifePinnedBootSpeciesIds();
  const evictedSpeciesIds: DefiningWildlifeSpeciesId[] = [];

  for (const speciesId of listingWildlifeSpeciesTexturesCacheIds()) {
    if (pinnedSpeciesIds.has(speciesId) || liveSpeciesIds.has(speciesId)) {
      continue;
    }

    if (!checkingWildlifeSpeciesTexturesAreResolved(speciesId)) {
      continue;
    }

    const lastSeenAtMs = peekingWildlifeSpeciesTextureLastSeenAtMs(speciesId);

    if (lastSeenAtMs !== null && nowMs - lastSeenAtMs < graceMs) {
      continue;
    }

    if (lastSeenAtMs === null) {
      continue;
    }

    const didEvict = await evictingWildlifeSpeciesIfPossible(
      speciesId,
      onEvictedSpeciesId
    );

    if (didEvict) {
      evictedSpeciesIds.push(speciesId);
    }
  }

  return evictedSpeciesIds;
}

async function evictingWildlifeSpeciesOverMobileCacheCap(
  params: AdvancingWildlifeSpeciesTextureEvictionParams,
  maxCachedSpecies: number
): Promise<readonly DefiningWildlifeSpeciesId[]> {
  const { liveSpeciesIds, onEvictedSpeciesId } = params;
  const pinnedSpeciesIds = resolvingWildlifePinnedBootSpeciesIds();
  const evictedSpeciesIds: DefiningWildlifeSpeciesId[] = [];
  const evictableSpeciesIds = listingWildlifeEvictableCachedSpeciesIds(
    liveSpeciesIds,
    pinnedSpeciesIds
  ).sort((leftSpeciesId, rightSpeciesId) => {
    const leftLastSeenAtMs =
      peekingWildlifeSpeciesTextureLastSeenAtMs(leftSpeciesId) ?? 0;
    const rightLastSeenAtMs =
      peekingWildlifeSpeciesTextureLastSeenAtMs(rightSpeciesId) ?? 0;

    return leftLastSeenAtMs - rightLastSeenAtMs;
  });

  const resolvedCacheCount = listingWildlifeSpeciesTexturesCacheIds().filter(
    (speciesId) => checkingWildlifeSpeciesTexturesAreResolved(speciesId)
  ).length;
  let remainingOverCap = resolvedCacheCount - maxCachedSpecies;

  for (const speciesId of evictableSpeciesIds) {
    if (remainingOverCap <= 0) {
      break;
    }

    const didEvict = await evictingWildlifeSpeciesIfPossible(
      speciesId,
      onEvictedSpeciesId
    );

    if (didEvict) {
      evictedSpeciesIds.push(speciesId);
      remainingOverCap -= 1;
    }
  }

  return evictedSpeciesIds;
}

/**
 * Evicts resolved species textures that have been unseen longer than grace.
 *
 * @returns species ids that were evicted.
 */
export async function advancingWildlifeSpeciesTextureEviction(
  params: AdvancingWildlifeSpeciesTextureEvictionParams
): Promise<readonly DefiningWildlifeSpeciesId[]> {
  const evictionProfile = resolvingWildlifeTextureEvictionProfile();
  const evictedSpeciesIds = [
    ...(await evictingWildlifeSpeciesPastGraceWindow(
      params,
      evictionProfile.graceMs
    )),
  ];

  if (evictionProfile.maxCachedSpecies !== null) {
    evictedSpeciesIds.push(
      ...(await evictingWildlifeSpeciesOverMobileCacheCap(
        params,
        evictionProfile.maxCachedSpecies
      ))
    );
  }

  return evictedSpeciesIds;
}

/** Resets pinned set cache (tests only). */
export function clearingWildlifePinnedBootSpeciesIdsForTests(): void {
  pinnedBootSpeciesIds = null;
}
