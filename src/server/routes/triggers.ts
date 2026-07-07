import { context } from '@devvit/web/server';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { Hono } from 'hono';
import { createPost } from '../core/post';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  const input = await c.req.json<OnAppInstallRequest>();

  try {
    const post = await createPost({ subredditName: input.subreddit?.name });

    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Post created in subreddit ${input.subreddit?.name ?? context.subredditName} with id ${post.id} (trigger: ${input.type})`,
      },
      200
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Error creating post: ${detail}`);
    // Do not fail install when Reddit's post API is down; mods can use the menu action later.
    return c.json<TriggerResponse>(
      {
        status: 'success',
        message: `Install ok; auto post skipped (${detail})`,
      },
      200
    );
  }
});
