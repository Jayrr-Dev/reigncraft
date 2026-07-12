/**
 * Terrain Pixi cache prune burst thresholds.
 *
 * Budgeted prune on floor chunks / tree trunks / canopies can fall behind
 * continuous movement. When stale Graphics outpace the base prune budget,
 * burst prune (and optionally defer builds) so child counts cannot climb
 * unboundedly while the player runs.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCachePruneConstants
 */

/** Stale entries that trigger a multiplied prune budget for this sync call. */
export const DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_COUNT = 8;

/** Multiply base prune budget when stale count hits the burst threshold. */
export const DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MULTIPLIER = 4;

/**
 * Hard ceiling on prunes per sync call during a burst.
 * Keeps destroy cost from monopolizing a single frame.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_MAX = 48;

/**
 * When stale exceeds this many entries, skip new builds this call so prune
 * can catch up before more Graphics are added.
 *
 * Floor chunks pass `shouldDeferBuildsOnStaleBacklog: false` so running into
 * new tiles cannot open see-through holes while trailing stale is pruned.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_DEFER_BUILDS_STALE_COUNT = 16;

/**
 * Extra tile ring kept around the floor visible bounds before a built chunk
 * is destroyed. Prevents snap/directional bounds wobble from destroy/rebuild
 * thrash that leaves diamond holes while running.
 */
export const DEFINING_WORLD_PLAZA_FLOOR_CHUNK_RETENTION_MARGIN_TILES =
  16 as const;

/**
 * Relative backlog: stale / needed above this ratio also triggers burst prune
 * even when absolute stale count is below the burst threshold.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_CACHE_PRUNE_BURST_STALE_RATIO = 0.25;
