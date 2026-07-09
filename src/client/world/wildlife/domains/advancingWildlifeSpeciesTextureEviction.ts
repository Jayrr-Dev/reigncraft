/**
 * Scans cached wildlife species and evicts textures past the grace window.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction
 */

import { DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS } from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeBootPreloadSpeciesIds } from '@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures';
import { evictingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/evictingWildlifeSpeciesTextures';
import {
  checkingWildlifeSpeciesTexturesAreResolved,
  listingWildlifeSpeciesTexturesCacheIds,
} from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { peekingWildlifeSpeciesTextureLastSeenAtMs } from '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence';

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

/**
 * Evicts resolved species textures that have been unseen longer than grace.
 *
 * @returns species ids that were evicted.
 */
export async function advancingWildlifeSpeciesTextureEviction(
  params: AdvancingWildlifeSpeciesTextureEvictionParams
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

    if (
      lastSeenAtMs !== null &&
      nowMs - lastSeenAtMs < DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS
    ) {
      continue;
    }

    // Never seen in residence tracker but resolved (boot preload): treat as
    // eligible only when lastSeen is null and not live — still require grace
    // from a synthetic last-seen of 0 only if we recorded residence. Boot
    // plains are pinned above, so null lastSeen here means non-pin species
    // that loaded without residence (should not happen); skip until seen.
    if (lastSeenAtMs === null) {
      continue;
    }

    const species = resolvingWildlifeSpeciesDefinition(speciesId);

    if (!species) {
      continue;
    }

    const didEvict = await evictingWildlifeSpeciesTextures(species);

    if (didEvict) {
      evictedSpeciesIds.push(speciesId);
      onEvictedSpeciesId?.(speciesId);
    }
  }

  return evictedSpeciesIds;
}

/** Resets pinned set cache (tests only). */
export function clearingWildlifePinnedBootSpeciesIdsForTests(): void {
  pinnedBootSpeciesIds = null;
}
