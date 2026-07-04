// Devvit webviews disallow `unsafe-eval`; Pixi needs this polyfill before init.
import 'pixi.js/unsafe-eval';

import './index.css';

import { RenderingPlazaHomeScreen } from '@/components/home/components/renderingPlazaHomeScreen';
import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RenderingWorldPlazaPixiScene } from '@/components/world/components/renderingWorldPlazaPixiScene';
import { resolvingWorldPlazaOnlineRoomDisplayName } from '@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName';
import type { PlazaGameSession } from '../shared/plazaGameSession';
import { resolvingPlazaSinglePlayerSessionOwnerId } from '../shared/plazaGameSession';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../shared/plazaDevvitOnline';
import '@/components/world/domains/registeringWorldPixiElements';
import { usingWorldPlazaClientErrorCapture } from '@/components/world/hooks/usingWorldPlazaClientErrorCapture';

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
    null,
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
          gameSession.saveSlotIndex,
        ),
        onlineRoomIndex: 1,
        sessionLabel: `Single Player · Slot ${gameSession.saveSlotIndex}`,
      };
    }

    return {
      onlineUserId: redditOnlineUserId,
      localPersistenceOwnerId: redditOnlineUserId,
      onlineRoomIndex: gameSession.roomIndex,
      sessionLabel: `Multiplayer · Room ${gameSession.roomIndex}`,
    };
  }, [gameSession, redditOnlineUserId]);

  if (!gameSession || !sessionConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        <RenderingPlazaHomeScreen onStartSession={setGameSession} />
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
            onlineDisplayName={onlineDisplayName}
            onlineAvatarUrl={onlineAvatarUrl}
            onlineMaxPlayers={PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}
            onlineRoomIndex={sessionConfig.onlineRoomIndex}
            sessionLabel={sessionConfig.sessionLabel}
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
  </StrictMode>,
);
