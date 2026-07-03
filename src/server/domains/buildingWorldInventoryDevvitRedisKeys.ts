/** Per-user serialized inventory JSON for one post scope. */
export function buildingWorldInventoryStateRedisKey(
  roomScope: string,
  userId: string,
): string {
  return `world-inventory:state:${roomScope}:${userId}`;
}

/** Shared ground items hash for one post scope. */
export function buildingWorldInventoryGroundItemsRedisKey(roomScope: string): string {
  return `world-inventory:ground-items:${roomScope}`;
}
