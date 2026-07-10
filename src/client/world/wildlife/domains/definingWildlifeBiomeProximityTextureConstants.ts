/**
 * Wildlife texture residency tuned to biomes near the player.
 *
 * @module components/world/wildlife/domains/definingWildlifeBiomeProximityTextureConstants
 */

/** Tile radius for discovering biome kinds around the player (desktop pin union). */
export const DEFINING_WILDLIFE_BIOME_PROXIMITY_SEARCH_RADIUS_TILES = 48;

/**
 * How long a resolved species may stay cached after leaving every nearby biome's
 * spawn table.
 */
export const DEFINING_WILDLIFE_BIOME_PROXIMITY_OUT_OF_RANGE_GRACE_MS = 5_000;

/** Boot warm-up caps on mobile so spawn does not decode the full plains roster. */
export const DEFINING_WILDLIFE_BOOT_PRELOAD_MAX_SPECIES_MOBILE = 4;

/**
 * Tile offsets sampled from the player anchor when building the nearby-biome
 * union. Center tile is always included.
 */
export const DEFINING_WILDLIFE_BIOME_PROXIMITY_SAMPLE_TILE_OFFSETS: readonly {
  readonly tileX: number;
  readonly tileY: number;
}[] = (() => {
  const radius = DEFINING_WILDLIFE_BIOME_PROXIMITY_SEARCH_RADIUS_TILES;

  return [
    { tileX: 0, tileY: 0 },
    { tileX: radius, tileY: 0 },
    { tileX: -radius, tileY: 0 },
    { tileX: 0, tileY: radius },
    { tileX: 0, tileY: -radius },
    { tileX: radius, tileY: radius },
    { tileX: -radius, tileY: radius },
    { tileX: radius, tileY: -radius },
    { tileX: -radius, tileY: -radius },
    { tileX: Math.floor(radius * 0.5), tileY: 0 },
    { tileX: -Math.floor(radius * 0.5), tileY: 0 },
    { tileX: 0, tileY: Math.floor(radius * 0.5) },
    { tileX: 0, tileY: -Math.floor(radius * 0.5) },
  ] as const;
})();
