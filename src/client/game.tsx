import '@/components/home/domains/preloadingPlazaHomeScreenMusic';
import '@/components/world/domains/bootingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard';
import { DEFINING_PUBLIC_ASSET_REVISION } from '@/lib/definingPublicAssetRevision';
import './index.css';

import { RenderingPlazaBookSfx } from '@/components/home/components/renderingPlazaBookSfx';
import { RenderingPlazaHomeScreen } from '@/components/home/components/renderingPlazaHomeScreen';
import { RenderingPlazaHomeScreenButtonSfx } from '@/components/home/components/renderingPlazaHomeScreenButtonSfx';
import { RenderingPlazaHomeScreenMusic } from '@/components/home/components/renderingPlazaHomeScreenMusic';
import { usingPlazaSinglePlayerSaveHydration } from '@/components/home/hooks/usingPlazaSinglePlayerSaveHydration';
import { DEFINING_REIGNCRAFT_TOASTER_ID } from '@/components/ui/domains/definingReigncraftToastConstants';
import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { RenderingReigncraftToaster } from '@/components/ui/sonner';
import { resolvingWorldPlazaOnlineRoomDisplayName } from '@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName';
import { usingWorldPlazaClientErrorCapture } from '@/components/world/hooks/usingWorldPlazaClientErrorCapture';
import { RenderingWorldPlazaWorldLoadingScreen } from '@/components/world/loading/components/renderingWorldPlazaWorldLoadingScreen';
import { usingWorldPlazaWorldLoadingProgress } from '@/components/world/loading/hooks/usingWorldPlazaWorldLoadingProgress';
import { usingWorldPlazaWorldLoadingWarmStart } from '@/components/world/loading/hooks/usingWorldPlazaWorldLoadingWarmStart';
import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Component,
  lazy,
  StrictMode,
  Suspense,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { createRoot } from 'react-dom/client';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../shared/plazaDevvitOnline';
import type { PlazaGameSession } from '../shared/plazaGameSession';
import { resolvingPlazaSinglePlayerSessionOwnerId } from '../shared/plazaGameSession';

// Keeps public asset sync revisions in the watched game bundle.
void DEFINING_PUBLIC_ASSET_REVISION;

const RenderingWorldPlazaPixiScene = lazy(async () => {
  // Assets + scene module are already warmed by the game-code loading step
  // when warm-start ran on the home screen; module cache dedupes the fetch.
  const pixiSceneModule =
    await import('@/components/world/components/renderingWorldPlazaPixiScene');

  return { default: pixiSceneModule.RenderingWorldPlazaPixiScene };
});

const queryClient = new QueryClient();

/**
 * Holds the themed loading screen until every world boot step (game code,
 * terrain, avatar, wildlife, and fire sprites) plus save hydration is done.
 */
function PlazaWorldBootGate({
  isHydratingSave,
  children,
}: {
  isHydratingSave: boolean;
  children: ReactNode;
}): ReactNode {
  const worldLoading = usingWorldPlazaWorldLoadingProgress();

  if (worldLoading.status !== 'complete' || isHydratingSave) {
    return (
      <RenderingWorldPlazaWorldLoadingScreen
        percentLoaded={worldLoading.percentLoaded}
        errorMessage={worldLoading.errorMessage}
      />
    );
  }

  return children;
}

type PlazaWorldErrorBoundaryErrorDetails = {
  name: string;
  message: string;
  stack: string | null;
  componentStack: string | null;
};

type PlazaWorldErrorBoundaryState = {
  errorDetails: PlazaWorldErrorBoundaryErrorDetails | null;
};

function formattingPlazaWorldErrorBoundaryCopyText(
  details: PlazaWorldErrorBoundaryErrorDetails
): string {
  const sections = [
    'World failed to load',
    '',
    `Error: ${details.name}`,
    `Message: ${details.message}`,
  ];

  if (details.stack) {
    sections.push('', 'Stack trace:', details.stack);
  }

  if (details.componentStack) {
    sections.push('', 'Component stack:', details.componentStack.trim());
  }

  return sections.join('\n');
}

class PlazaWorldErrorBoundary extends Component<
  { children: ReactNode },
  PlazaWorldErrorBoundaryState
> {
  override state: PlazaWorldErrorBoundaryState = { errorDetails: null };

  static getDerivedStateFromError(error: Error): PlazaWorldErrorBoundaryState {
    return {
      errorDetails: {
        name: error.name || 'Error',
        message: error.message || 'World failed to load.',
        stack: error.stack ?? null,
        componentStack: null,
      },
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState((previousState) => {
      if (!previousState.errorDetails) {
        return previousState;
      }

      return {
        errorDetails: {
          ...previousState.errorDetails,
          stack: error.stack ?? previousState.errorDetails.stack,
          componentStack: errorInfo.componentStack || null,
        },
      };
    });
  }

  override render(): ReactNode {
    const { errorDetails } = this.state;

    if (errorDetails) {
      const copyText = formattingPlazaWorldErrorBoundaryCopyText(errorDetails);

      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto bg-gray-950 px-4 py-6">
          <p className="text-sm font-semibold text-red-200">
            World failed to load
          </p>
          <div className="flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-red-900/50 bg-gray-900/80 p-4 text-left">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300/70">
                Error
              </p>
              <p className="font-mono text-sm text-red-100">
                {errorDetails.name}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300/70">
                Message
              </p>
              <p className="font-mono text-xs text-red-100/90">
                {errorDetails.message}
              </p>
            </div>
            {errorDetails.stack ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300/70">
                  Stack trace
                </p>
                <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] text-red-100/80">
                  {errorDetails.stack}
                </pre>
              </div>
            ) : null}
            {errorDetails.componentStack ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300/70">
                  Component stack
                </p>
                <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] text-red-100/70">
                  {errorDetails.componentStack.trim()}
                </pre>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-md border border-red-800/60 bg-red-950/80 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-900/80"
            onClick={() => {
              void navigator.clipboard.writeText(copyText).then(() => {
                showingReigncraftToast('Error details copied.', {
                  toasterId: DEFINING_REIGNCRAFT_TOASTER_ID.global,
                });
              });
            }}
          >
            Copy error details
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function PlazaHomeScreenWithWarmStart({
  onStartSession,
}: {
  onStartSession: (session: PlazaGameSession) => void;
}): ReactNode {
  usingWorldPlazaWorldLoadingWarmStart();

  return <RenderingPlazaHomeScreen onStartSession={onStartSession} />;
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
        <RenderingPlazaBookSfx />
        <RenderingPlazaHomeScreenButtonSfx />
        <RenderingPlazaHomeScreenMusic />
        <div className="h-full min-h-0 overflow-hidden">
          <PlazaHomeScreenWithWarmStart onStartSession={setGameSession} />
          <RenderingReigncraftToaster
            toasterId={DEFINING_REIGNCRAFT_TOASTER_ID.global}
            position="bottom-right"
            offset={16}
            mobileOffset={12}
          />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RenderingPlazaBookSfx />
      <div className="flex h-dvh min-h-0 w-full flex-col bg-gray-950">
        <div className="relative min-h-0 flex-1 p-2">
          <PlazaWorldErrorBoundary>
            <PlazaWorldBootGate isHydratingSave={isHydratingSinglePlayerSave}>
              <Suspense
                fallback={
                  <RenderingWorldPlazaWorldLoadingScreen percentLoaded={100} />
                }
              >
                <RenderingWorldPlazaPixiScene
                  hostLayout="fill"
                  onlineUserId={sessionConfig.onlineUserId}
                  localPersistenceOwnerId={
                    sessionConfig.localPersistenceOwnerId
                  }
                  redditUserId={sessionConfig.redditUserId}
                  singlePlayerSaveSlotIndex={sessionConfig.saveSlotIndex}
                  onlineDisplayName={onlineDisplayName}
                  onlineAvatarUrl={onlineAvatarUrl}
                  onlineMaxPlayers={PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}
                  onlineRoomIndex={sessionConfig.onlineRoomIndex}
                  onExitToHome={() => setGameSession(null)}
                />
              </Suspense>
            </PlazaWorldBootGate>
          </PlazaWorldErrorBoundary>
        </div>
        <RenderingReigncraftToaster
          toasterId={DEFINING_REIGNCRAFT_TOASTER_ID.global}
          position="bottom-right"
          offset={16}
          mobileOffset={12}
        />
      </div>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
