import './index.css';

import { RenderingPlazaHomeScreen } from '@/components/home/components/renderingPlazaHomeScreen';
import { usingPlazaSinglePlayerSaveHydration } from '@/components/home/hooks/usingPlazaSinglePlayerSaveHydration';
import { resolvingWorldPlazaOnlineRoomDisplayName } from '@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName';
import { usingWorldPlazaClientErrorCapture } from '@/components/world/hooks/usingWorldPlazaClientErrorCapture';
import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Component,
  lazy,
  StrictMode,
  Suspense,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createRoot } from 'react-dom/client';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../shared/plazaDevvitOnline';
import type { PlazaGameSession } from '../shared/plazaGameSession';
import { resolvingPlazaSinglePlayerSessionOwnerId } from '../shared/plazaGameSession';

const RenderingWorldPlazaPixiScene = lazy(async () => {
  const pixiSceneModule =
    await import('@/components/world/components/renderingWorldPlazaPixiScene');

  return { default: pixiSceneModule.RenderingWorldPlazaPixiScene };
});

const queryClient = new QueryClient();

type PlazaWorldErrorBoundaryState = {
  errorMessage: string | null;
};

class PlazaWorldErrorBoundary extends Component<
  { children: ReactNode },
  PlazaWorldErrorBoundaryState
> {
  state: PlazaWorldErrorBoundaryState = { errorMessage: null };

  static getDerivedStateFromError(error: Error): PlazaWorldErrorBoundaryState {
    return { errorMessage: error.message || 'World failed to load.' };
  }

  render(): ReactNode {
    if (this.state.errorMessage) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-gray-950 px-4 text-center text-sm text-red-200">
          <p className="font-semibold">World failed to load</p>
          <p className="max-w-md font-mono text-xs text-red-100/90">
            {this.state.errorMessage}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

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
          <PlazaWorldErrorBoundary>
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm font-semibold text-sky-100">
                  Loading world…
                </div>
              }
            >
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
            </Suspense>
          </PlazaWorldErrorBoundary>
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
