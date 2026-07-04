import './index.css';

import { navigateTo, requestExpandedMode } from '@devvit/web/client';
import { context } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-gradient-to-b from-sky-900 via-sky-800 to-emerald-900">
      <div className="flex flex-col items-center gap-2 px-4">
        <h1 className="text-2xl font-bold text-center text-white">
          Reigncraft
        </h1>
        <p className="text-base text-center text-sky-100/90">
          Explore the isometric world plaza — walk, run, and jump across
          procedural terrain.
        </p>
        <p className="text-sm text-center text-sky-200/70">
          Hey {context.username ?? 'traveler'} 👋
        </p>
      </div>
      <div className="flex items-center justify-center mt-2">
        <button
          className="flex items-center justify-center bg-orange-600 text-white w-auto h-10 rounded-full cursor-pointer transition-colors px-6 hover:bg-orange-700 font-medium"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Enter Game
        </button>
      </div>
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-sky-200/60">
        <button
          className="cursor-pointer hover:text-white transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>,
);
