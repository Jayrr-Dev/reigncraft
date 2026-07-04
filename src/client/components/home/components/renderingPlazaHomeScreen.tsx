'use client';

import { RenderingPlazaHomeScreenCloudSky } from '@/components/home/components/renderingPlazaHomeScreenCloudSky';
import { RenderingPlazaHomeScreenMountainRange } from '@/components/home/components/renderingPlazaHomeScreenMountainRange';
import { RenderingPlazaMultiplayerRoomBrowserPanel } from '@/components/home/components/renderingPlazaMultiplayerRoomBrowserPanel';
import { RenderingPlazaSinglePlayerSaveSlotsPanel } from '@/components/home/components/renderingPlazaSinglePlayerSaveSlotsPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { resolvingWorldPlazaPlayerNameLabelAvatarInitial } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelAvatarInitial';
import { context } from '@devvit/web/client';
import { useEffect, useRef, useState } from 'react';
import type {
  PlazaGameSession,
  PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

type PlazaHomeScreenStep = 'mode-select' | 'single-player' | 'multiplayer';

type RenderingPlazaHomeScreenPlayerBadgeProps = {
  avatarUrl: string | null;
  username: string;
};

function RenderingPlazaHomeScreenMouseFollowingCompass(): React.JSX.Element {
  const compassRef = useRef<HTMLSpanElement>(null);
  const [rotationDeg, setRotationDeg] = useState(0);

  useEffect(() => {
    const updatingRotationFromPointer = (event: PointerEvent): void => {
      const element = compassRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angleRad = Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX
      );

      setRotationDeg((angleRad * 180) / Math.PI + 90);
    };

    window.addEventListener('pointermove', updatingRotationFromPointer, {
      passive: true,
    });

    return () => {
      window.removeEventListener('pointermove', updatingRotationFromPointer);
    };
  }, []);

  return (
    <span
      ref={compassRef}
      className="flex size-14 shrink-0 items-center justify-center rounded-full border border-parchment/40 bg-ink/25 text-parchment"
    >
      <Icon
        icon="mdi:compass"
        className="size-8 drop-shadow transition-transform duration-100 ease-out"
        style={{ transform: `rotate(${rotationDeg}deg)` }}
        aria-hidden
      />
    </span>
  );
}

function RenderingPlazaHomeScreenPlayerBadge({
  avatarUrl,
  username,
}: RenderingPlazaHomeScreenPlayerBadgeProps): React.JSX.Element {
  const [hasImageError, setHasImageError] = useState(false);
  const showsImage = Boolean(avatarUrl) && !hasImageError;
  const avatarInitial =
    resolvingWorldPlazaPlayerNameLabelAvatarInitial(username);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-poster-gold/60 bg-ink/40 py-1 pl-1 pr-3 font-body text-sm font-bold text-parchment [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">
      <Avatar className="size-6 ring-1 ring-poster-gold/70">
        {showsImage ? (
          <AvatarImage
            src={avatarUrl ?? undefined}
            alt=""
            aria-hidden
            onError={() => {
              setHasImageError(true);
            }}
          />
        ) : null}
        <AvatarFallback className="bg-poster-teal text-[10px] font-semibold uppercase text-parchment">
          {avatarInitial}
        </AvatarFallback>
      </Avatar>
      {username}
    </span>
  );
}

export type RenderingPlazaHomeScreenProps = {
  onStartSession: (session: PlazaGameSession) => void;
};

/**
 * Home screen for choosing single-player or multiplayer plaza sessions.
 */
export function RenderingPlazaHomeScreen({
  onStartSession,
}: RenderingPlazaHomeScreenProps): React.JSX.Element {
  const [step, setStep] = useState<PlazaHomeScreenStep>('mode-select');
  const username = context.username;
  const avatarUrl = context.snoovatar ?? null;

  const handlingSelectSinglePlayer = (): void => {
    setStep('single-player');
  };

  const handlingSelectMultiplayer = (): void => {
    setStep('multiplayer');
  };

  const handlingBackToModeSelect = (): void => {
    setStep('mode-select');
  };

  const handlingSelectSaveSlot = (saveSlotIndex: PlazaSaveSlotIndex): void => {
    onStartSession({
      mode: 'single-player',
      saveSlotIndex,
    });
  };

  const handlingJoinRoom = (roomIndex: number): void => {
    onStartSession({
      mode: 'multiplayer',
      roomIndex,
    });
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#e8b04b_0%,#dd9440_16%,#c1713a_32%,#2c4a52_50%,#1c333c_72%,#14252b_100%)] px-4 py-10 font-body">
      {/* Golden sun */}
      <div
        aria-hidden
        className="plaza-scene-sun pointer-events-none absolute left-1/2 top-[8%] size-40 -translate-x-1/2 opacity-90"
      />

      <RenderingPlazaHomeScreenCloudSky />

      <RenderingPlazaHomeScreenMountainRange />

      {/* Poster paper frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 z-20 rounded-sm border-4 border-parchment/90 sm:inset-3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 z-20 rounded-sm border border-parchment/50 sm:inset-5"
      />

      {/* Paper grain vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(28,25,18,0.35)_100%)]" />

      <div className="relative z-10 flex w-full flex-col items-center">
        {step === 'mode-select' ? (
          <div className="flex w-full max-w-md flex-col items-center gap-8 sm:gap-16 lg:gap-20">
            <div className="plaza-title-bounce flex flex-col items-center gap-3 text-center sm:-translate-y-6 sm:gap-4 lg:-translate-y-10">
              <div className="flex items-center gap-3">
                <span aria-hidden className="plaza-title-rule" />
                <span
                  aria-hidden
                  className="size-1.5 rotate-45 bg-poster-gold"
                />
                <span aria-hidden className="plaza-title-rule" />
              </div>
              <div className="plaza-title-block">
                <h1 className="plaza-title-text text-4xl sm:text-6xl lg:text-7xl">
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
                />
              ) : (
                <span className="inline-flex items-center rounded-full border border-parchment/30 bg-ink/40 px-3 py-1 text-sm font-semibold text-parchment/90">
                  Multiplayer requires a Reddit sign-in
                </span>
              )}
            </div>

            <div className="flex w-full flex-col gap-5 sm:translate-y-6 lg:translate-y-10">
              <button
                type="button"
                onClick={handlingSelectSinglePlayer}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-lg border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-8 py-4 text-left shadow-[0_5px_0_0_#6d2c12,0_12px_20px_rgba(0,0,0,0.4)] [--plaza-edge:#6d2c12] sm:px-6 [animation-delay:120ms]"
              >
                <RenderingPlazaHomeScreenMouseFollowingCompass />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold tracking-wide text-parchment [text-shadow:0_2px_0_rgba(80,32,12,0.8)]">
                    Single Player
                  </span>
                  <span className="mt-0.5 block text-sm font-medium italic text-parchment/85">
                    A solo expedition — 3 save slots
                  </span>
                </span>
                <Icon
                  icon="mdi:chevron-right"
                  className="size-6 shrink-0 text-parchment/80"
                  aria-hidden
                />
              </button>

              <button
                type="button"
                onClick={handlingSelectMultiplayer}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-lg border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] px-8 py-4 text-left shadow-[0_5px_0_0_#14252b,0_12px_20px_rgba(0,0,0,0.4)] [--plaza-edge:#14252b] sm:px-6 [animation-delay:220ms]"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-parchment/40 bg-ink/25 text-parchment">
                  <Icon
                    icon="ph:users-three-fill"
                    className="size-8 drop-shadow"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold tracking-wide text-parchment [text-shadow:0_2px_0_rgba(12,26,30,0.8)]">
                    Multiplayer
                  </span>
                  <span className="mt-0.5 block text-sm font-medium italic text-parchment/85">
                    Fellowship of up to 3 travelers
                  </span>
                </span>
                <Icon
                  icon="mdi:chevron-right"
                  className="size-6 shrink-0 text-parchment/80"
                  aria-hidden
                />
              </button>
            </div>
          </div>
        ) : null}

        {step === 'single-player' ? (
          <RenderingPlazaSinglePlayerSaveSlotsPanel
            onBack={handlingBackToModeSelect}
            onSelectSaveSlot={handlingSelectSaveSlot}
          />
        ) : null}

        {step === 'multiplayer' ? (
          <RenderingPlazaMultiplayerRoomBrowserPanel
            onBack={handlingBackToModeSelect}
            onJoinRoom={handlingJoinRoom}
          />
        ) : null}
      </div>
    </div>
  );
}
