/** Shared chopped-tree hash for one persistence scope. */
export function buildingWorldHarvestChoppedTreesRedisKey(
  scope: string
): string {
  return `world-harvest:chopped-trees:${scope}`;
}

/** Shared mined-rock hash for one persistence scope. */
export function buildingWorldHarvestMinedRocksRedisKey(scope: string): string {
  return `world-harvest:mined-rocks:${scope}`;
}

/** Shared picked-pebble hash for one persistence scope. */
export function buildingWorldHarvestPickedPebblesRedisKey(
  scope: string
): string {
  return `world-harvest:picked-pebbles:${scope}`;
}

/** Shared picked-flower hash for one persistence scope. */
export function buildingWorldHarvestPickedFlowersRedisKey(
  scope: string
): string {
  return `world-harvest:picked-flowers:${scope}`;
}
