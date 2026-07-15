'use client';

import { RenderingPlazaHomeScreenBackground } from '@/components/home/components/renderingPlazaHomeScreenBackground';
import { RenderingPlazaHomeScreenCloudSky } from '@/components/home/components/renderingPlazaHomeScreenCloudSky';
import { RenderingPlazaHomeScreenPlayerBadge } from '@/components/home/components/renderingPlazaHomeScreenPlayerBadge';
import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { notifyingPlazaHomeScreenButtonClicked } from '@/components/home/domains/notifyingPlazaHomeScreenButtonClicked';
import { Icon } from '@/components/ui/icon';
import { context } from '@devvit/web/client';
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_MIN_PLAYERS,
} from '../../../../shared/plazaDevvitOnline';
import {
  PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
  PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX,
  type PlazaGameSession,
  type PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

// Sub-panels stay out of the initial home bundle; the tutorial demo library
// alone is ~70 KB of source and only needed after a menu choice.
const RenderingPlazaSinglePlayerSaveSlotsPanel = lazy(async () => {
  const panelModule =
    await import('@/components/home/components/renderingPlazaSinglePlayerSaveSlotsPanel');

  return { default: panelModule.RenderingPlazaSinglePlayerSaveSlotsPanel };
});

const RenderingPlazaMultiplayerRoomBrowserPanel = lazy(async () => {
  const panelModule =
    await import('@/components/home/components/renderingPlazaMultiplayerRoomBrowserPanel');

  return { default: panelModule.RenderingPlazaMultiplayerRoomBrowserPanel };
});

const RenderingPlazaTutorialPanel = lazy(async () => {
  const panelModule =
    await import('@/components/home/components/renderingPlazaTutorialPanel');

  return { default: panelModule.RenderingPlazaTutorialPanel };
});

const RenderingPlazaPermaDeathCharacterPickerPanel = lazy(async () => {
  const panelModule =
    await import('@/components/home/components/renderingPlazaPermaDeathCharacterPickerPanel');

  return {
    default: panelModule.RenderingPlazaPermaDeathCharacterPickerPanel,
  };
});

type PlazaHomeScreenStep =
  | 'mode-select'
  | 'single-player'
  | 'perma-death-character'
  | 'multiplayer'
  | 'tutorial';

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
    notifyingPlazaHomeScreenButtonClicked();
    setStep('single-player');
  };

  const handlingSelectMultiplayer = (): void => {
    notifyingPlazaHomeScreenButtonClicked();
    setStep('multiplayer');
  };

  const handlingSelectTutorial = (): void => {
    setStep('tutorial');
  };

  const handlingBackToModeSelect = (): void => {
    setStep('mode-select');
  };

  const handlingBackToSinglePlayer = (): void => {
    setStep('single-player');
  };

  const handlingSelectPermaDeathSaveSlot = (options: {
    hasSaveData: boolean;
  }): void => {
    if (options.hasSaveData) {
      onStartSession({
        mode: 'single-player',
        saveSlotIndex: PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
        loadProfile: 'perma-death',
      });
      return;
    }

    setStep('perma-death-character');
  };

  const handlingConfirmPermaDeathCharacter = (
    startingAvatarSkinId: string
  ): void => {
    onStartSession({
      mode: 'single-player',
      saveSlotIndex: PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
      loadProfile: 'perma-death',
      startingAvatarSkinId,
    });
  };

  const handlingSelectSaveSlot = (saveSlotIndex: PlazaSaveSlotIndex): void => {
    if (saveSlotIndex === PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX) {
      onStartSession({
        mode: 'single-player',
        saveSlotIndex,
        loadProfile: 'random-animal',
      });
      return;
    }

    onStartSession({
      mode: 'single-player',
      saveSlotIndex,
    });
  };

  const handlingSelectDevQaLoad = (): void => {
    onStartSession({
      mode: 'single-player',
      saveSlotIndex: 1,
      loadProfile: 'dev-qa',
    });
  };

  const handlingJoinRoom = (roomId: string): void => {
    onStartSession({
      mode: 'multiplayer',
      roomId,
    });
  };

  return (
    <div
      className="plaza-home-screen relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-4 py-8 font-body sm:py-4"
      style={
        {
          '--plaza-cloud-sky-top': '0%',
          '--plaza-cloud-sky-bottom': '48%',
        } as CSSProperties
      }
    >
      <RenderingPlazaHomeScreenBackground />

      {/* Paper grain vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(28,25,18,0.35)_100%)]" />

      <RenderingPlazaHomeScreenCloudSky />

      {/* Poster paper frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 z-20 rounded-sm border-4 border-parchment/90 sm:inset-3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 z-20 rounded-sm border border-parchment/50 sm:inset-5"
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        {step === 'mode-select' ? (
          <div className="flex w-full max-w-md flex-col items-center gap-8 sm:gap-10 lg:gap-12">
            <div className="plaza-title-bounce flex flex-col items-center gap-3 text-center sm:-translate-y-2 sm:gap-4 lg:-translate-y-4">
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

            <div className="flex w-full flex-col gap-4 sm:-translate-y-4 lg:-translate-y-6">
              <button
                type="button"
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.none
                )}
                onClick={handlingSelectSinglePlayer}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-lg border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] px-8 py-4 text-left shadow-[0_5px_0_0_#6d2c12,0_12px_20px_rgba(0,0,0,0.4)] [--plaza-edge:#6d2c12] sm:px-6 [animation-delay:120ms]"
              >
                <RenderingPlazaHomeScreenMouseFollowingCompass />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold tracking-wide text-parchment [text-shadow:0_2px_0_rgba(80,32,12,0.8)]">
                    Single Player
                  </span>
                  <span className="mt-0.5 block text-sm font-medium italic text-parchment/85">
                    A solo expedition.
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
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.none
                )}
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
                    Fellowship of {PLAZA_DEVVIT_ONLINE_MIN_PLAYERS}-
                    {PLAZA_DEVVIT_ONLINE_MAX_PLAYERS} travelers
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
                {...definingPlazaButtonSfxDataAttributes(
                  DEFINING_PLAZA_BUTTON_SFX_KIND.none
                )}
                onClick={handlingSelectTutorial}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-lg border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#5f7046_0%,#4a5c38_100%)] px-8 py-4 text-left shadow-[0_5px_0_0_#3d4a2c,0_12px_20px_rgba(0,0,0,0.4)] [--plaza-edge:#3d4a2c] sm:px-6 [animation-delay:320ms]"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-parchment/40 bg-ink/25 text-parchment">
                  <Icon
                    icon="mdi:book-open-page-variant"
                    className="size-8 drop-shadow"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold tracking-wide text-parchment [text-shadow:0_2px_0_rgba(30,40,20,0.8)]">
                    Tutorial
                  </span>
                  <span className="mt-0.5 block text-sm font-medium italic text-parchment/85">
                    Visual guide to movement, claim, and build
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
          <Suspense fallback={null}>
            <RenderingPlazaSinglePlayerSaveSlotsPanel
              onBack={handlingBackToModeSelect}
              onSelectSaveSlot={handlingSelectSaveSlot}
              onSelectPermaDeathSaveSlot={handlingSelectPermaDeathSaveSlot}
              onSelectDevQaLoad={handlingSelectDevQaLoad}
            />
          </Suspense>
        ) : null}

        {step === 'perma-death-character' ? (
          <Suspense fallback={null}>
            <RenderingPlazaPermaDeathCharacterPickerPanel
              onBack={handlingBackToSinglePlayer}
              onConfirmCharacter={handlingConfirmPermaDeathCharacter}
            />
          </Suspense>
        ) : null}

        {step === 'multiplayer' ? (
          <Suspense fallback={null}>
            <RenderingPlazaMultiplayerRoomBrowserPanel
              onBack={handlingBackToModeSelect}
              onJoinRoom={handlingJoinRoom}
            />
          </Suspense>
        ) : null}

        {step === 'tutorial' ? (
          <Suspense fallback={null}>
            <RenderingPlazaTutorialPanel onBack={handlingBackToModeSelect} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
