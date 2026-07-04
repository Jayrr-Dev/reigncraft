import { context } from '@devvit/web/server';

/**
 * Resolves the base plaza scope (post or playtest subreddit) before room sharding.
 */
function resolvingPlazaDevvitOnlineBaseScope(): string {
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
 * Scopes plaza multiplayer to a Reddit post room shard.
 *
 * Each shard holds up to {@link PLAZA_DEVVIT_ONLINE_MAX_PLAYERS} players.
 *
 * @param roomIndex - One-based room shard index (defaults to 1).
 */
export function resolvingPlazaDevvitOnlineRoomScope(roomIndex = 1): string {
  const normalizedRoomIndex =
    Number.isInteger(roomIndex) && roomIndex >= 1 ? roomIndex : 1;

  return `${resolvingPlazaDevvitOnlineBaseScope()}:room-${normalizedRoomIndex}`;
}
