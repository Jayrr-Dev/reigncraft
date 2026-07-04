'use client';

import { RenderingPlazaMultiplayerRoomBrowserPanel } from '@/components/home/components/renderingPlazaMultiplayerRoomBrowserPanel';
import { RenderingPlazaSinglePlayerSaveSlotsPanel } from '@/components/home/components/renderingPlazaSinglePlayerSaveSlotsPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { resolvingWorldPlazaPlayerNameLabelAvatarInitial } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelAvatarInitial';
import { context } from '@devvit/web/client';
import { useState } from 'react';
import type {
  PlazaGameSession,
  PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

type PlazaHomeScreenStep = 'mode-select' | 'single-player' | 'multiplayer';

type RenderingPlazaHomeScreenPlayerBadgeProps = {
  avatarUrl: string | null;
  username: string;
};

function RenderingPlazaHomeScreenPlayerBadge({
  avatarUrl,
  username,
}: RenderingPlazaHomeScreenPlayerBadgeProps): React.JSX.Element {
  const [hasImageError, setHasImageError] = useState(false);
  const showsImage = Boolean(avatarUrl) && !hasImageError;
  const avatarInitial =
    resolvingWorldPlazaPlayerNameLabelAvatarInitial(username);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 py-1 pl-1 pr-3 text-sm font-bold text-amber-100 [text-shadow:0_1px_1px_rgba(0,0,0,0.3)]">
      <Avatar className="size-6 ring-1 ring-amber-200/60">
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
        <AvatarFallback className="bg-[#415a77] text-[10px] font-semibold uppercase text-white">
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
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-500 via-sky-600 to-emerald-800 px-4 py-10">
      {/* Sky glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,236,170,0.35),transparent_55%)]" />

      {/* Floating cloud blobs */}
      <div
        aria-hidden
        className="plaza-float pointer-events-none absolute left-[8%] top-[12%] h-10 w-28 rounded-full bg-white/25 blur-sm"
      />
      <div
        aria-hidden
        className="plaza-float pointer-events-none absolute right-[10%] top-[22%] h-8 w-20 rounded-full bg-white/20 blur-sm [animation-delay:-1.5s]"
      />
      <div
        aria-hidden
        className="plaza-float pointer-events-none absolute left-[20%] top-[32%] h-6 w-16 rounded-full bg-white/15 blur-sm [animation-delay:-3s]"
      />

      {/* Grass hills at the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
      >
        <div className="absolute -left-1/4 bottom-[-4rem] h-40 w-3/4 rounded-[100%] bg-emerald-700/80" />
        <div className="absolute -right-1/4 bottom-[-5rem] h-44 w-3/4 rounded-[100%] bg-emerald-600/70" />
        <div className="absolute inset-x-0 bottom-[-6rem] h-40 rounded-[100%] bg-emerald-900/60" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        {step === 'mode-select' ? (
          <div className="flex w-full max-w-md flex-col items-center gap-8">
            <div className="plaza-title-bounce flex flex-col items-center gap-3 text-center">
              <h1 className="plaza-title-text text-5xl sm:text-6xl">
                REIGNCRAFT
              </h1>
              <p className="max-w-xs text-base font-semibold text-sky-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                Explore the isometric world plaza with friends or on your own.
              </p>
              {username ? (
                <RenderingPlazaHomeScreenPlayerBadge
                  avatarUrl={avatarUrl}
                  username={username}
                />
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-3 py-1 text-sm font-semibold text-amber-100">
                  Multiplayer requires a Reddit sign-in
                </span>
              )}
            </div>

            <div className="flex w-full flex-col gap-5">
              <button
                type="button"
                onClick={handlingSelectSinglePlayer}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 border-orange-300/60 bg-gradient-to-b from-orange-400 to-orange-600 px-5 py-4 text-left shadow-[0_5px_0_0_#9a3412,0_12px_20px_rgba(0,0,0,0.35)] [--plaza-edge:#9a3412] [animation-delay:120ms]"
              >
                <span className="plaza-mode-icon plaza-mode-icon--single flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                  <Icon
                    icon="solar:gamepad-bold"
                    className="plaza-mode-icon-glyph size-8 drop-shadow"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl text-white [text-shadow:0_2px_0_rgba(154,52,18,0.8)]">
                    Single Player
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-orange-50/95">
                    Play offline with 3 save slots
                  </span>
                </span>
                <Icon
                  icon="mdi:chevron-right"
                  className="size-6 shrink-0 text-white/80"
                  aria-hidden
                />
              </button>

              <button
                type="button"
                onClick={handlingSelectMultiplayer}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 border-emerald-300/60 bg-gradient-to-b from-emerald-400 to-emerald-600 px-5 py-4 text-left shadow-[0_5px_0_0_#065f46,0_12px_20px_rgba(0,0,0,0.35)] [--plaza-edge:#065f46] [animation-delay:220ms]"
              >
                <span className="plaza-mode-icon plaza-mode-icon--multi flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                  <Icon
                    icon="ph:users-three-fill"
                    className="plaza-mode-icon-glyph size-8 drop-shadow"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl text-white [text-shadow:0_2px_0_rgba(6,95,70,0.8)]">
                    Multiplayer
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-emerald-50/95">
                    Join a room with up to 3 players
                  </span>
                </span>
                <Icon
                  icon="mdi:chevron-right"
                  className="size-6 shrink-0 text-white/80"
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
