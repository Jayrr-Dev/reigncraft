/**
 * Redis keys for named multiplayer room registry metadata.
 *
 * @module server/domains/buildingPlazaDevvitOnlineRoomRegistryRedisKeys
 */

/** Hash of roomId → "1" for all rooms under a post/base scope. */
export function buildingPlazaDevvitOnlineRoomIndexRedisKey(
  baseScope: string
): string {
  return `plaza:rooms:index:${baseScope}`;
}

/** JSON meta blob for one named room. */
export function buildingPlazaDevvitOnlineRoomMetaRedisKey(
  baseScope: string,
  roomId: string
): string {
  return `plaza:rooms:meta:${baseScope}:${roomId}`;
}

/** Maps normalized display name → roomId for uniqueness. */
export function buildingPlazaDevvitOnlineRoomByNameRedisKey(
  baseScope: string,
  normalizedName: string
): string {
  return `plaza:rooms:by-name:${baseScope}:${normalizedName}`;
}

/** Hash of userId → "1" for players who have synced into the room. */
export function buildingPlazaDevvitOnlineRoomAlumniRedisKey(
  baseScope: string,
  roomId: string
): string {
  return `plaza:rooms:alumni:${baseScope}:${roomId}`;
}

/** Hash of roomId → "1" for worlds the user can Continue. */
export function buildingPlazaDevvitOnlineUserRoomsRedisKey(
  baseScope: string,
  userId: string
): string {
  return `plaza:rooms:mine:${baseScope}:${userId}`;
}

/** Maps host userId → roomId (one created world per user). */
export function buildingPlazaDevvitOnlineHostedRoomRedisKey(
  baseScope: string,
  userId: string
): string {
  return `plaza:rooms:host:${baseScope}:${userId}`;
}

/** Hash of kicked userId → "1" for a named room. */
export function buildingPlazaDevvitOnlineRoomKickedRedisKey(
  baseScope: string,
  roomId: string
): string {
  return `plaza:rooms:kicked:${baseScope}:${roomId}`;
}
