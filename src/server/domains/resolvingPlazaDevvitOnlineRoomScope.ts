import { context } from '@devvit/web/server';

/**
 * Scopes plaza multiplayer to a Reddit post, or the playtest subreddit when
 * `postId` is unavailable in the Devvit iframe context.
 */
export function resolvingPlazaDevvitOnlineRoomScope(): string {
  const { postId, subredditName } = context;

  if (postId) {
    return postId;
  }

  if (subredditName) {
    return `subreddit:${subredditName}`;
  }

  return 'global';
}
