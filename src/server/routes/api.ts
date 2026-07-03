import { Hono } from 'hono';
import { context, reddit } from '@devvit/web/server';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
} from '../../shared/api';
import { convexMutation, convexQuery } from '../core/convex';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      convexQuery<number>('counters:get', { postId }),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  try {
    const count = await convexMutation<number>('counters:adjust', {
      postId,
      delta: 1,
    });
    return c.json<IncrementResponse>({
      count,
      postId,
      type: 'increment',
    });
  } catch (error) {
    console.error(`API Increment Error for post ${postId}:`, error);
    const message =
      error instanceof Error ? error.message : 'Failed to increment counter';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});

api.post('/decrement', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  try {
    const count = await convexMutation<number>('counters:adjust', {
      postId,
      delta: -1,
    });
    return c.json<DecrementResponse>({
      count,
      postId,
      type: 'decrement',
    });
  } catch (error) {
    console.error(`API Decrement Error for post ${postId}:`, error);
    const message =
      error instanceof Error ? error.message : 'Failed to decrement counter';
    return c.json<ErrorResponse>({ status: 'error', message }, 400);
  }
});
