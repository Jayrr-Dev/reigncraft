/** Redis hash mapping user ids to serialized player snapshots for one room. */
export function buildingPlazaDevvitOnlineRosterRedisKey(roomScope: string): string {
  return `plaza:online:roster:${roomScope}`;
}

/** Per-player snapshot string with its own TTL. */
export function buildingPlazaDevvitOnlinePlayerRedisKey(
  roomScope: string,
  userId: string,
): string {
  return `plaza:online:player:${roomScope}:${userId}`;
}

/** Ephemeral chat message list for one room scope. */
export function buildingPlazaDevvitOnlineChatRedisKey(roomScope: string): string {
  return `plaza:online:chat:${roomScope}`;
}

/** Ephemeral typing indicators for one room scope. */
export function buildingPlazaDevvitOnlineTypingRedisKey(
  roomScope: string,
): string {
  return `plaza:online:typing:${roomScope}`;
}
