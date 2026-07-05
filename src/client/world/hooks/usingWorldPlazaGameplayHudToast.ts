'use client';

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS,
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_VISIBLE_DURATION_MS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudToastConstants';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UsingWorldPlazaGameplayHudToastSnapshot = {
  readonly message: string | null;
  readonly isVisible: boolean;
};

export type UsingWorldPlazaGameplayHudToastResult = {
  readonly snapshot: UsingWorldPlazaGameplayHudToastSnapshot;
  readonly showingGameplayHudToast: (message: string) => void;
};

/**
 * Transient in-game HUD toast for gameplay feedback (errors, hints).
 *
 * Replaces Devvit `showToast` for world interactions.
 */
export function usingWorldPlazaGameplayHudToast(): UsingWorldPlazaGameplayHudToastResult {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const clearingTimers = useCallback((): void => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const showingGameplayHudToast = useCallback(
    (nextMessage: string): void => {
      clearingTimers();
      setMessage(nextMessage);
      setIsVisible(true);

      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
        hideTimerRef.current = null;

        fadeTimerRef.current = window.setTimeout(() => {
          setMessage(null);
          fadeTimerRef.current = null;
        }, DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS);
      }, DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_VISIBLE_DURATION_MS);
    },
    [clearingTimers]
  );

  useEffect(() => {
    return () => {
      clearingTimers();
    };
  }, [clearingTimers]);

  return {
    snapshot: { message, isVisible },
    showingGameplayHudToast,
  };
}
