import './index.css';

import { context } from '@devvit/web/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RenderingWorldPlazaPixiScene } from '@/components/world/components/renderingWorldPlazaPixiScene';
import '@/components/world/domains/registeringWorldPixiElements';

const queryClient = new QueryClient();

export const App = () => {
  const displayName = context.username ?? 'Traveler';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-dvh min-h-0 w-full flex-col bg-gray-950">
        <div className="shrink-0 px-2 py-2 text-center">
          <h1 className="text-lg font-bold text-white">Reigncraft Plaza</h1>
          <p className="text-sm text-gray-400">
            Click to walk · WASD or arrows to move · Shift to run · Space to jump
          </p>
        </div>
        <div className="relative min-h-0 flex-1 px-2 pb-2">
          <RenderingWorldPlazaPixiScene
            hostLayout="fill"
            onlineUserId={null}
            onlineDisplayName={displayName}
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
