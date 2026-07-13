import { context } from '@devvit/web/server';

/**
 * Resolves the base plaza scope (post or playtest subreddit) before room sharding.
 */
export function resolvingPlazaDevvitOnlineBaseScope(): string {
  const { postId, subredditName } = context;

  if (postId) {
    return postId;
  }

  if (subredditName) {
    return `subreddit:${subredditName}`;
  }

  return 'global';
}

/**
 * Scopes plaza multiplayer / world Redis keys to one named room.
 *
 * @param roomId - Named room id slug (required for multiplayer isolation).
 */
export function resolvingPlazaDevvitOnlineRoomScope(roomId: string): string {
  const trimmedRoomId = roomId.trim();

  if (!trimmedRoomId) {
    throw new Error('Plaza room id is required.');
  }

  return `${resolvingPlazaDevvitOnlineBaseScope()}:room:${trimmedRoomId}`;
}

/**
 * Parses a room id from a `?room=` query value.
 *
 * @param rawRoomId - Raw query string value.
 */
export function parsingPlazaDevvitOnlineRoomIdFromQuery(
  rawRoomId: string | undefined
): string | null {
  if (!rawRoomId) {
    return null;
  }

  const trimmedRoomId = rawRoomId.trim();

  if (!trimmedRoomId || trimmedRoomId.length > 64) {
    return null;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedRoomId)) {
    return null;
  }

  return trimmedRoomId;
}
