/**
 * Tracks which wildlife species were recently visible so textures can be
 * evicted after a grace period outside the despawn ring.
 *
 * @module components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const wildlifeSpeciesTextureLastSeenAtMs = new Map<
  DefiningWildlifeSpeciesId,
  number
>();

/**
 * Marks every species in `speciesIds` as seen at `nowMs`.
 */
export function recordingWildlifeSpeciesTextureResidence(
  speciesIds: readonly DefiningWildlifeSpeciesId[],
  nowMs: number
): void {
  for (const speciesId of speciesIds) {
    wildlifeSpeciesTextureLastSeenAtMs.set(speciesId, nowMs);
  }
}

/**
 * Returns last-seen time for one species, or null when never recorded.
 */
export function peekingWildlifeSpeciesTextureLastSeenAtMs(
  speciesId: DefiningWildlifeSpeciesId
): number | null {
  return wildlifeSpeciesTextureLastSeenAtMs.get(speciesId) ?? null;
}

/**
 * Lists every species id that currently has a residence timestamp.
 */
export function listingWildlifeSpeciesTextureResidenceIds(): readonly DefiningWildlifeSpeciesId[] {
  return [...wildlifeSpeciesTextureLastSeenAtMs.keys()];
}

/**
 * Clears residence for one species after eviction.
 */
export function clearingWildlifeSpeciesTextureResidence(
  speciesId: DefiningWildlifeSpeciesId
): void {
  wildlifeSpeciesTextureLastSeenAtMs.delete(speciesId);
}

/** Clears all residence timestamps (tests only). */
export function clearingWildlifeSpeciesTextureResidenceForTests(): void {
  wildlifeSpeciesTextureLastSeenAtMs.clear();
}
