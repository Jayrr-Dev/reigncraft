'use client';

import {
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_RULE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_SHOW_DELAY_MS,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { usingWorldPlazaEntityDeathScreenTitleFit } from '@/components/world/health/hooks/usingWorldPlazaEntityDeathScreenTitleFit';
import { useEffect, useRef, useState } from 'react';

export type DefiningWorldPlazaEntityDeathScreenPhase =
  | 'hidden'
  | 'held'
  | 'waking';

export type RenderingWorldPlazaEntityDeathScreenOverlayProps = {
  /** When true, the player is dead and the death sequence should run. */
  isPlayerDead: boolean;
  /** Damage-type-specific death title, e.g. `YOU DIED` or `YOU FELL`. */
  deathTitle: string;
};

/**
 * Full-screen death overlay: delayed reveal, static centered title, slow wake fade.
 */
export function RenderingWorldPlazaEntityDeathScreenOverlay({
  isPlayerDead,
  deathTitle,
}: RenderingWorldPlazaEntityDeathScreenOverlayProps): React.JSX.Element | null {
  const [phase, setPhase] =
    useState<DefiningWorldPlazaEntityDeathScreenPhase>('hidden');
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
        wasPlayerDeadRef.current = true;
        setPhase('hidden');
      }
      return;
    }

    if (wasPlayerDeadRef.current) {
      wasPlayerDeadRef.current = false;
      setPhase((currentPhase) =>
        currentPhase === 'hidden' ? 'hidden' : 'waking'
      );
    }
  }, [deathTitle, isPlayerDead]);

  useEffect(() => {
    if (!isPlayerDead) {
      return;
    }

    const showTimeoutId = window.setTimeout(() => {
      setPhase('held');
    }, DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(showTimeoutId);
    };
  }, [isPlayerDead]);

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
    phase === 'waking'
      ? 'plaza-death-screen-overlay--waking'
      : 'plaza-death-screen-overlay--held';

  return (
    <div
      ref={overlayRef}
      className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME} plaza-death-screen-overlay ${overlayPhaseClassName}`}
      role="status"
      aria-live="assertive"
      aria-label={`${lockedDeathTitle}. ${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT}`}
    >
      <div
        className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME}
      >
        <div
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_RULE_CLASS_NAME}
          aria-hidden="true"
        />
        <p
          ref={titleRef}
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME}
          style={{ fontSize: `${titleFontSizePx}px` }}
        >
          {lockedDeathTitle}
        </p>
        <div
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_RULE_CLASS_NAME}
          aria-hidden="true"
        />
        <p
          className={DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_CLASS_NAME}
        >
          {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT}
        </p>
      </div>
    </div>
  );
}
