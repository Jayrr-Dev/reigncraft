/** Redis hash of fire tile key to serialized fire cell JSON for one room scope. */
export function buildingWorldFireDevvitCellsRedisKey(
  roomScope: string
): string {
  return `world-fire:cells:${roomScope}`;
}

/** Redis string storing the last simulated tick index for one room scope. */
export function buildingWorldFireDevvitLastSimulatedTickRedisKey(
  roomScope: string
): string {
  return `world-fire:last-simulated-tick:${roomScope}`;
}

/** Redis set of burnt procedural grass tile keys for one room scope. */
export function buildingWorldFireDevvitBurntGrassRedisKey(
  roomScope: string
): string {
  return `world-fire:burnt-grass:${roomScope}`;
}
