// Devvit webviews disallow `unsafe-eval`; Pixi needs this polyfill before init.
import 'pixi.js/unsafe-eval';

import './index.css';

import { RenderingPlazaHomeScreen } from '@/components/home/components/renderingPlazaHomeScreen';
import { usingPlazaSinglePlayerSaveHydration } from '@/components/home/hooks/usingPlazaSinglePlayerSaveHydration';
import { RenderingWorldPlazaPixiScene } from '@/components/world/components/renderingWorldPlazaPixiScene';
import '@/components/world/domains/registeringWorldPixiElements';
import { resolvingWorldPlazaOnlineRoomDisplayName } from '@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName';
import { usingWorldPlazaClientErrorCapture } from '@/components/world/hooks/usingWorldPlazaClientErrorCapture';
import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../shared/plazaDevvitOnline';
import type { PlazaGameSession } from '../shared/plazaGameSession';
import { resolvingPlazaSinglePlayerSessionOwnerId } from '../shared/plazaGameSession';

const queryClient = new QueryClient();

export const App = () => {
  usingWorldPlazaClientErrorCapture();
  const [gameSession, setGameSession] = useState<PlazaGameSession | null>(null);

  const redditOnlineUserId = context.username
    ? `reddit:${context.username}`
    : null;
  const onlineDisplayName = resolvingWorldPlazaOnlineRoomDisplayName(
    context.username,
    null,
    null
  );
  const onlineAvatarUrl = context.snoovatar ?? null;

  const sessionConfig = useMemo(() => {
    if (!gameSession) {
      return null;
    }

    if (gameSession.mode === 'single-player') {
      return {
        onlineUserId: null,
        localPersistenceOwnerId: resolvingPlazaSinglePlayerSessionOwnerId(
          gameSession.saveSlotIndex
        ),
        redditUserId: redditOnlineUserId,
        saveSlotIndex: gameSession.saveSlotIndex,
        onlineRoomIndex: 1,
      };
    }

    return {
      onlineUserId: redditOnlineUserId,
      localPersistenceOwnerId: redditOnlineUserId,
      redditUserId: null,
      saveSlotIndex: null,
      onlineRoomIndex: gameSession.roomIndex,
    };
  }, [gameSession, redditOnlineUserId]);

  const isHydratingSinglePlayerSave = usingPlazaSinglePlayerSaveHydration({
    redditUserId: sessionConfig?.redditUserId ?? null,
    saveSlotIndex: sessionConfig?.saveSlotIndex ?? null,
    localPersistenceOwnerId: sessionConfig?.localPersistenceOwnerId ?? null,
  });

  if (!gameSession || !sessionConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        <RenderingPlazaHomeScreen onStartSession={setGameSession} />
      </QueryClientProvider>
    );
  }

  if (isHydratingSinglePlayerSave) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex h-dvh items-center justify-center bg-gray-950 text-sm font-semibold text-sky-100">
          Loading save slot…
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-dvh min-h-0 w-full flex-col bg-gray-950">
        <div className="relative min-h-0 flex-1 p-2">
          <RenderingWorldPlazaPixiScene
            hostLayout="fill"
            onlineUserId={sessionConfig.onlineUserId}
            localPersistenceOwnerId={sessionConfig.localPersistenceOwnerId}
            redditUserId={sessionConfig.redditUserId}
            singlePlayerSaveSlotIndex={sessionConfig.saveSlotIndex}
            onlineDisplayName={onlineDisplayName}
            onlineAvatarUrl={onlineAvatarUrl}
            onlineMaxPlayers={PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}
            onlineRoomIndex={sessionConfig.onlineRoomIndex}
            onExitToHome={() => setGameSession(null)}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
