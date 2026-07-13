/** Redis hash of plot id to serialized plot JSON for one post scope. */
export function buildingWorldBuildingPlotsRosterRedisKey(roomScope: string): string {
  return `world-building:plots:${roomScope}`;
}

/** Redis hash of block id to serialized block JSON for one plot. */
export function buildingWorldBuildingPlotBlocksRedisKey(
  roomScope: string,
  plotId: string,
): string {
  return `world-building:plot-blocks:${roomScope}:${plotId}`;
}

/** Redis hash mapping block id to plot id for fast block deletion. */
export function buildingWorldBuildingBlockIndexRedisKey(roomScope: string): string {
  return `world-building:block-index:${roomScope}`;
}

/** Redis hash of session block id to serialized block JSON for one room scope. */
export function buildingWorldBuildingSessionBlocksRedisKey(
  roomScope: string,
): string {
  return `world-building:session-blocks:${roomScope}`;
}
