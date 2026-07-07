import type { UiResponse } from '@devvit/web/shared';
import { Hono } from 'hono';
import {
  createPost,
  matchingSubmitLookupRacePostId,
  resolvingCreatePostSubredditName,
} from '../core/post';

export const menu = new Hono();

menu.post('/post-create', async (c) => {
  try {
    const post = await createPost({ runAs: 'USER' });

    return c.json<UiResponse>(
      {
        navigateTo: `https://reddit.com/r/${resolvingCreatePostSubredditName()}/comments/${post.id}`,
      },
      200
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Error creating post: ${detail}`);

    const postId = matchingSubmitLookupRacePostId(error);
    if (postId) {
      return c.json<UiResponse>(
        {
          navigateTo: `https://reddit.com/r/${resolvingCreatePostSubredditName()}/comments/${postId}`,
        },
        200
      );
    }

    return c.json<UiResponse>(
      {
        showToast: 'Failed to create post',
      },
      400
    );
  }
});
