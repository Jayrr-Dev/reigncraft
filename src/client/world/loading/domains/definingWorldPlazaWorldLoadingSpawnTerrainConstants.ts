/**
 * Boot-gate timing for the spawn-viewport terrain overlay.
 *
 * @module components/world/loading/domains/definingWorldPlazaWorldLoadingSpawnTerrainConstants
 */

/**
 * If floor chunks have not reported ready by this deadline after the scene
 * mounts under the overlay, drop the overlay anyway so a stuck sync cannot
 * soft-lock the load screen.
 */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_SPAWN_TERRAIN_READY_TIMEOUT_MS = 8_000;
