/**
 * Persisted bestiary discovery progress for the plaza codex.
 *
 * @module components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants
 */

import { DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

/** localStorage key prefix for bestiary sighted and killed species ids. */
export const DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_STORAGE_KEY_PREFIX =
  'world-plaza-bestiary-discovery' as const;

/** Poll cadence for recording newly sighted wildlife (ms). */
export const DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_POLL_INTERVAL_MS = 1_500;

/** Grid radius at which a species counts as sighted for the bestiary. */
export const DEFINING_WORLD_PLAZA_BESTIARY_SIGHT_RADIUS_GRID =
  DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID;

/**
 * Resolves the localStorage key for bestiary discovery.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaBestiaryDiscoveryStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_BESTIARY_DISCOVERY_STORAGE_KEY_PREFIX;
}
