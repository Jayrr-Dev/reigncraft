import './index.css';

import { RenderingPlazaHomeScreenCloudSky } from '@/components/home/components/renderingPlazaHomeScreenCloudSky';
import { context, navigateTo, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Lightweight CSS-only sunset vista echoing the home screen poster art.
 * (The full mountain SVG is too heavy for the inline splash view.)
 */
const SplashScenery = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-8 right-0 bottom-0 left-0"
    >
      {/* Sunset sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1c333c_0%,#2c4a52_38%,#6e7f54_66%,#d9a441_100%)]" />

      {/* Golden sun — soft radial glow (restored from plaza-scene-sun) */}
      <div
        aria-hidden
        className="plaza-scene-sun pointer-events-none absolute left-1/2 top-[52%] z-[1] size-40 -translate-x-1/2 opacity-90"
      />

      <RenderingPlazaHomeScreenCloudSky />

      {/* Far mountain range */}
      <div className="absolute inset-x-0 bottom-0 z-[3] h-[38%] bg-[linear-gradient(180deg,#2c4a52_0%,#22383f_100%)] [clip-path:polygon(0_58%,12%_34%,24%_52%,38%_18%,52%_48%,66%_26%,80%_50%,92%_36%,100%_54%,100%_100%,0_100%)]" />

      {/* Near mountain range */}
      <div className="absolute inset-x-0 bottom-0 z-[3] h-[26%] bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] [clip-path:polygon(0_44%,10%_66%,22%_30%,36%_62%,50%_38%,64%_68%,78%_34%,90%_58%,100%_42%,100%_100%,0_100%)]" />

      {/* Foreground hill */}
      <div className="absolute inset-x-0 bottom-0 z-[3] h-[10%] bg-[linear-gradient(180deg,#4d5c38_0%,#3a462b_100%)] [clip-path:ellipse(85%_100%_at_50%_100%)]" />

      {/* Paper grain vignette */}
      <div className="absolute inset-0 z-[4] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(28,25,18,0.4)_100%)]" />
    </div>
  );
};

export const Splash = () => {
  const username = context.username;

  return (
    <div
      className="plaza-home-screen relative flex h-full min-h-full flex-col items-center justify-center px-4 pt-4 pb-8 font-body"
      style={
        {
          '--plaza-cloud-sky-top': '0%',
          '--plaza-cloud-sky-bleed': 'clamp(3rem, 10vw, 6rem)',
          '--plaza-cloud-sky-bottom': '22%',
          '--plaza-mountain-scene-height': '22%',
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
            <span className="inline-flex items-center rounded-full border border-poster-gold/60 bg-ink/40 px-3 py-1 font-body text-sm font-bold text-parchment [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">
              Welcome back, {username}
            </span>
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
        <button
          className="cursor-pointer text-[0.8em] font-semibold text-parchment/60 transition-colors hover:text-parchment"
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
  </StrictMode>
);
