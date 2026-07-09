/**
 * Variable-size named realms (kingdoms / marches / reaches) that span biomes.
 *
 * Realms are independent of biome kind: one realm can cover plains, forest, and
 * more. Size varies by center weight so some realms are a few biome cells and
 * others cover large landmasses.
 *
 * @module components/world/domains/definingWorldPlazaNamedRealmConstants
 */

/** Lattice spacing in biome-region cells between candidate realm centers. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_LATTICE_BIOME_REGIONS = 6;

/** Chance a lattice cell places a realm center (0..1). */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_CENTER_SPAWN_CHANCE = 0.62;

/**
 * Neighbor lattice radius searched when assigning a point to the nearest center.
 * Larger = smoother borders, more work per lookup.
 */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SEARCH_LATTICE_RADIUS = 3;

/** Minimum size weight (small realms claim less area in weighted Voronoi). */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN = 0.55;

/** Maximum size weight (large realms claim more area). */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX = 2.4;

/** Seed salt for center spawn rolls. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SPAWN_SEED_SALT = 0x4e414d45;

/** Seed salt for size weight. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_SEED_SALT = 0x53495a45;

/** Seed salt for title kind pick. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_SEED_SALT = 0x5449544c;

/** Seed salt for village-name index. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_NAME_SEED_SALT = 0x4e414d45 ^ 0x11;

/** Seed salt for center jitter inside a lattice cell. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_JITTER_SEED_SALT = 0x4a495452;

/** localStorage key prefix for discovered named realms. */
export const DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_STORAGE_KEY_PREFIX =
  'world-plaza-discovered-named-realms' as const;

/** Poll cadence for recording newly entered named realms (ms). */
export const DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_POLL_INTERVAL_MS =
  1_000;

/**
 * Resolves the localStorage key for discovered named realms.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaDiscoveredNamedRealmsStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_DISCOVERED_NAMED_REALMS_STORAGE_KEY_PREFIX;
}
