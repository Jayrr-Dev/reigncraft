// Devvit webviews disallow `unsafe-eval`; Pixi needs this polyfill before init.
import 'pixi.js/unsafe-eval';

import './index.css';

import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RenderingWorldPlazaPixiScene } from '@/components/world/components/renderingWorldPlazaPixiScene';
import { resolvingWorldPlazaOnlineRoomDisplayName } from '@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../shared/plazaDevvitOnline';
import '@/components/world/domains/registeringWorldPixiElements';
import { usingWorldPlazaClientErrorCapture } from '@/components/world/hooks/usingWorldPlazaClientErrorCapture';

const queryClient = new QueryClient();

export const App = () => {
  usingWorldPlazaClientErrorCapture();
  const displayName = resolvingWorldPlazaOnlineRoomDisplayName(
    context.username,
    null,
    null,
  );
  const onlineUserId = context.username
    ? `reddit:${context.username}`
    : null;
  const onlineAvatarUrl = context.snoovatar ?? null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-dvh min-h-0 w-full flex-col bg-gray-950">
        <div className="relative min-h-0 flex-1 p-2">
          <RenderingWorldPlazaPixiScene
            hostLayout="fill"
            onlineUserId={onlineUserId}
            onlineDisplayName={displayName}
            onlineAvatarUrl={onlineAvatarUrl}
            onlineMaxPlayers={PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
