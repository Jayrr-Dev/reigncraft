import { context, reddit } from '@devvit/web/server';

/** Resolves the authenticated Reddit user id for Devvit server routes. */
export async function resolvingDevvitRedditUserId(): Promise<string | null> {
  const username = context.username ?? (await reddit.getCurrentUsername());

  if (username) {
    return `reddit:${username}`;
  }

  if (context.userId) {
    return context.userId;
  }

  return null;
}
