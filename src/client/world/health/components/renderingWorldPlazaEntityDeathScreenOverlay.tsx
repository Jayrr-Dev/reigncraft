'use client';

import {
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { useEffect, useRef, useState } from 'react';

export type DefiningWorldPlazaEntityDeathScreenPhase =
  | 'hidden'
  | 'entering'
  | 'held'
  | 'waking';

export type RenderingWorldPlazaEntityDeathScreenOverlayProps = {
  /** When true, the player is dead and the death sequence should run. */
  isPlayerDead: boolean;
  /** Damage-type-specific death title, e.g. `YOU DIED` or `YOU FELL`. */
  deathTitle: string;
};

/**
 * Full-screen death overlay with a Dark Souls-style title entrance and slow wake fade.
 */
export function RenderingWorldPlazaEntityDeathScreenOverlay({
  isPlayerDead,
  deathTitle,
}: RenderingWorldPlazaEntityDeathScreenOverlayProps): React.JSX.Element | null {
  const [phase, setPhase] =
    useState<DefiningWorldPlazaEntityDeathScreenPhase>('hidden');
  const lockedDeathTitleRef = useRef(deathTitle);
  const wasPlayerDeadRef = useRef(false);

  useEffect(() => {
    if (isPlayerDead) {
      if (!wasPlayerDeadRef.current) {
        lockedDeathTitleRef.current = deathTitle;
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

  const titlePhaseClassName =
    phase === 'entering'
      ? 'plaza-death-screen-title--entering'
      : 'plaza-death-screen-title--visible';

  return (
    <div
      className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME} plaza-death-screen-overlay ${overlayPhaseClassName}`}
      role="status"
      aria-live="assertive"
      aria-label={lockedDeathTitleRef.current}
    >
      <p
        className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME} ${titlePhaseClassName}`}
      >
        {lockedDeathTitleRef.current}
      </p>
    </div>
  );
}
