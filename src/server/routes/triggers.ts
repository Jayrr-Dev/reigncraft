import { context } from '@devvit/web/server';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { Hono } from 'hono';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  // Keep install fast and side-effect free. Reddit review installs fail when
  // onAppInstall hangs on submitCustomPost / post lookup retries. Mods create
  // the first post via the "Create a new post" menu action after install.
  const input = await c.req.json<OnAppInstallRequest>();
  const subredditName =
    input.subreddit?.name ?? context.subredditName ?? 'unknown';

  return c.json<TriggerResponse>(
    {
      status: 'ok',
      message: `Installed on r/${subredditName}. Use Create a new post to open Reigncraft.`,
    },
    200
  );
});
