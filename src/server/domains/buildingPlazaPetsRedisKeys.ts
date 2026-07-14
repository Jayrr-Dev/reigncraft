/** Redis key holding the multiplayer companion roster for one Reddit user. */
export function buildingPlazaPetsMultiplayerRosterRedisKey(
  userId: string
): string {
  return `plaza:pets:mp:${userId}`;
}
