import '@/components/world/domains/bootingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard';
import './index.css';

import { RenderingPlazaHomeScreenCloudSky } from '@/components/home/components/renderingPlazaHomeScreenCloudSky';
import { RenderingPlazaHomeScreenPlayerBadge } from '@/components/home/components/renderingPlazaHomeScreenPlayerBadge';
import { DEFINING_PLAZA_HOME_SCREEN_BACKGROUND_IMAGE_URL } from '@/components/home/domains/definingPlazaHomeScreenBackgroundConstants';
import { DEFINING_APP_VERSION } from '@/lib/definingAppVersion';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Splash vista: painted forest/mountain BG plus drifting clouds in front.
 */
const SplashScenery = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-8 right-0 bottom-0 left-0"
    >
      <img
        src={DEFINING_PLAZA_HOME_SCREEN_BACKGROUND_IMAGE_URL}
        alt=""
        className="absolute inset-0 size-full select-none object-cover object-center"
        draggable={false}
        decoding="async"
      />

      {/* Paper grain vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(28,25,18,0.4)_100%)]" />

      <RenderingPlazaHomeScreenCloudSky />
    </div>
  );
};

export const Splash = () => {
  const username = context.username;
  const avatarUrl = context.snoovatar ?? null;

  return (
    <div
      className="plaza-home-screen relative flex h-full min-h-full flex-col items-center justify-center px-4 pt-4 pb-8 font-body"
      style={
        {
          '--plaza-cloud-sky-top': '0%',
          '--plaza-cloud-sky-bleed': 'clamp(3rem, 10vw, 6rem)',
          /* Keep drifting clouds in the upper sky above the painted forest. */
          '--plaza-cloud-sky-bottom': '48%',
        } as CSSProperties
      }
    >
      <SplashScenery />

      {/* Poster paper frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 z-20 rounded-sm border-4 border-parchment/90 sm:inset-3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 z-20 rounded-sm border border-parchment/50 sm:inset-5"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <span aria-hidden className="plaza-title-rule" />
            <span aria-hidden className="size-1.5 rotate-45 bg-poster-gold" />
            <span aria-hidden className="plaza-title-rule" />
          </div>
          <div className="plaza-title-block">
            <h1 className="plaza-title-text text-4xl sm:text-5xl">
              <span className="plaza-title-reign" data-text="REIGN">
                REIGN
              </span>
              <span className="plaza-title-craft" data-text="CRAFT">
                CRAFT
              </span>
            </h1>
            <p className="plaza-title-tagline">CLAIM, TAME, AND CONQUER</p>
          </div>
          {username ? (
            <RenderingPlazaHomeScreenPlayerBadge
              avatarUrl={avatarUrl}
              username={username}
              welcomeBack
            />
          ) : null}
        </div>

        <button
          className="plaza-btn-3d flex cursor-pointer items-center justify-center rounded-lg border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-10 py-3 font-display text-lg font-bold tracking-wide text-parchment shadow-[0_5px_0_0_#6d2c12,0_12px_20px_rgba(0,0,0,0.4)] [--plaza-edge:#6d2c12] [text-shadow:0_2px_0_rgba(80,32,12,0.8)]"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Enter Game
        </button>
      </div>

      <footer className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
        <p className="text-[0.8em] font-semibold text-parchment/60">
          v{DEFINING_APP_VERSION}
        </p>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
