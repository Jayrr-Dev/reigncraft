'use client';

import {
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_ACTIONS_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_ORIGIN_LABEL,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REMAKE_LABEL,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { usingWorldPlazaEntityDeathScreenTitleFit } from '@/components/world/health/hooks/usingWorldPlazaEntityDeathScreenTitleFit';
import { useEffect, useRef, useState } from 'react';

export type DefiningWorldPlazaEntityDeathScreenPhase =
  | 'hidden'
  | 'entering'
  | 'held'
  | 'waking';

export type DefiningWorldPlazaEntityDeathRespawnChoice = 'remake' | 'origin';

export type DefiningWorldPlazaEntityDeathScreenMode =
  | 'standard'
  | 'perma-death';

export type RenderingWorldPlazaEntityDeathScreenOverlayProps = {
  /** When true, the player is dead and the death sequence should run. */
  isPlayerDead: boolean;
  /** Damage-type-specific death title, e.g. `YOU DIED` or `YOU FELL`. */
  deathTitle: string;
  /** Standard runs offer Remake / Origin; Perma Death only offers Return Home. */
  deathMode?: DefiningWorldPlazaEntityDeathScreenMode;
  /** Optional flavor line override under the title. */
  flavorText?: string;
  /** Called when the player picks Remake or Origin. */
  onChoosingRespawn?: (
    choice: DefiningWorldPlazaEntityDeathRespawnChoice
  ) => void;
  /** Called when the player ends a Perma Death run from the death screen. */
  onReturnHome?: () => void;
  /** Label for the Perma Death return action. */
  returnHomeLabel?: string;
};

/**
 * Full-screen death overlay with a Dark Souls-style title entrance and respawn choices.
 */
export function RenderingWorldPlazaEntityDeathScreenOverlay({
  isPlayerDead,
  deathTitle,
  deathMode = 'standard',
  flavorText = DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT,
  onChoosingRespawn,
  onReturnHome,
  returnHomeLabel,
}: RenderingWorldPlazaEntityDeathScreenOverlayProps): React.JSX.Element | null {
  const [phase, setPhase] =
    useState<DefiningWorldPlazaEntityDeathScreenPhase>('hidden');
  const [hasChosenRespawn, setHasChosenRespawn] = useState(false);
  const lockedDeathTitleRef = useRef(deathTitle);
  const wasPlayerDeadRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const lockedDeathTitle = lockedDeathTitleRef.current;
  const titleFontSizePx = usingWorldPlazaEntityDeathScreenTitleFit(
    titleRef,
    overlayRef,
    lockedDeathTitle,
    phase !== 'hidden'
  );

  useEffect(() => {
    if (isPlayerDead) {
      if (!wasPlayerDeadRef.current) {
        lockedDeathTitleRef.current = deathTitle;
        setHasChosenRespawn(false);
        setPhase('entering');
      }

      wasPlayerDeadRef.current = true;
      return;
    }

    if (wasPlayerDeadRef.current) {
      wasPlayerDeadRef.current = false;
      setPhase('waking');
    }
  }, [deathTitle, isPlayerDead]);

  useEffect(() => {
    if (phase !== 'entering') {
      return;
    }

    const holdTimeoutId = window.setTimeout(() => {
      setPhase('held');
    }, 3400);

    return () => {
      window.clearTimeout(holdTimeoutId);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'waking') {
      return;
    }

    const hideTimeoutId = window.setTimeout(() => {
      setPhase('hidden');
      setHasChosenRespawn(false);
    }, DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS);

    return () => {
      window.clearTimeout(hideTimeoutId);
    };
  }, [phase]);

  if (phase === 'hidden') {
    return null;
  }

  const overlayPhaseClassName =
    phase === 'entering'
      ? 'plaza-death-screen-overlay--entering'
      : phase === 'waking'
        ? 'plaza-death-screen-overlay--waking'
        : 'plaza-death-screen-overlay--held';

  const stackPhaseClassName =
    phase === 'entering'
      ? 'plaza-death-screen-stack--entering'
      : 'plaza-death-screen-stack--visible';

  const shouldShowRespawnChoices = phase === 'held' && !hasChosenRespawn;
  const isPermaDeathMode = deathMode === 'perma-death';

  const choosingRespawn = (
    choice: DefiningWorldPlazaEntityDeathRespawnChoice
  ): void => {
    if (hasChosenRespawn || !onChoosingRespawn) {
      return;
    }

    setHasChosenRespawn(true);
    onChoosingRespawn(choice);
  };

  const returningHome = (): void => {
    if (hasChosenRespawn || !onReturnHome) {
      return;
    }

    setHasChosenRespawn(true);
    onReturnHome();
  };

  return (
    <div
      ref={overlayRef}
      className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME} plaza-death-screen-overlay ${overlayPhaseClassName}`}
      role="status"
      aria-live="assertive"
      aria-label={`${lockedDeathTitle}. ${flavorText}`}
    >
      <div
        className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME} ${stackPhaseClassName}`}
      >
        <p
          ref={titleRef}
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME}
          style={{ fontSize: `${titleFontSizePx}px` }}
        >
          {lockedDeathTitle}
        </p>
        <p
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_CLASS_NAME}
        >
          {flavorText}
        </p>
        {shouldShowRespawnChoices ? (
          <div
            className={
              DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_ACTIONS_CLASS_NAME
            }
            role="group"
            aria-label={
              isPermaDeathMode
                ? 'End Perma Death run'
                : 'Choose where to respawn'
            }
          >
            {isPermaDeathMode ? (
              <button
                type="button"
                className={
                  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_BUTTON_CLASS_NAME
                }
                onClick={returningHome}
              >
                {returnHomeLabel ?? 'Return Home'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={
                    DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_BUTTON_CLASS_NAME
                  }
                  onClick={() => {
                    choosingRespawn('remake');
                  }}
                >
                  {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REMAKE_LABEL}
                </button>
                <button
                  type="button"
                  className={
                    DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_BUTTON_CLASS_NAME
                  }
                  onClick={() => {
                    choosingRespawn('origin');
                  }}
                >
                  {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_ORIGIN_LABEL}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
