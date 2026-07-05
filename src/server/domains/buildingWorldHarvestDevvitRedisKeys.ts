/** Shared chopped-tree hash for one persistence scope. */
export function buildingWorldHarvestChoppedTreesRedisKey(scope: string): string {
  return `world-harvest:chopped-trees:${scope}`;
}
