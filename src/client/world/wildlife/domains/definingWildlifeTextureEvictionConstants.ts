/**
 * Tuning for wildlife species texture LRU eviction after biome leave.
 *
 * Despawn already removes instances beyond the sim ring, but GPU textures and
 * animation clips stayed resident forever. Eviction frees them after a grace
 * window so backtracking does not thrash reloads.
 *
 * @module components/world/wildlife/domains/definingWildlifeTextureEvictionConstants
 */

/** How long a species may stay unloaded-from-view before textures are freed. */
export const DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS = 45_000;

/** Shorter grace on mobile viewports to cap GPU texture residency. */
export const DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS_MOBILE = 20_000;

/** Max resolved wildlife species textures retained on mobile viewports. */
export const DEFINING_WILDLIFE_TEXTURE_EVICTION_MAX_CACHED_SPECIES_MOBILE = 6;

/** How often the wildlife layer scans for eviction candidates. */
export const DEFINING_WILDLIFE_TEXTURE_EVICTION_CHECK_INTERVAL_MS = 5_000;
