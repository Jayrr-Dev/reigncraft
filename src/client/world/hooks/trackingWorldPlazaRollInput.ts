'use client';

import { useEffect, useRef } from 'react';

/** Keyboard key that triggers a plaza roll dodge. */
const TRACKING_WORLD_PLAZA_ROLL_INPUT_KEY = 'r' as const;

export interface TrackingWorldPlazaRollInputParams {
  /** When false, roll input is ignored. */
  isEnabled: boolean;
  /** When true, R is reserved for chat and roll is blocked. */
  isChatOpenRef: React.RefObject<boolean>;
  /** Element that must be focused (or contain focus) for roll to apply. */
  focusContainerRef: React.RefObject<HTMLElement | null>;
  /** When true, roll input is blocked while dead. */
  isPlayerDeadRef?: React.RefObject<boolean>;
  /** When true, roll input is blocked while asleep. */
  isPlayerAsleepRef?: React.RefObject<boolean>;
  /** When true, roll input is blocked while stunned. */
  isPlayerStunnedRef?: React.RefObject<boolean>;
}

export interface TrackingWorldPlazaRollInputResult {
  /** Set to true on R; consumed by the avatar when a roll starts. */
  rollRequestedRef: React.RefObject<boolean>;
}

/**
 * Listens for R while the plaza host is focused and queues a roll request.
 */
export function trackingWorldPlazaRollInput({
  isEnabled,
  isChatOpenRef,
  focusContainerRef,
  isPlayerDeadRef,
  isPlayerAsleepRef,
  isPlayerStunnedRef,
}: TrackingWorldPlazaRollInputParams): TrackingWorldPlazaRollInputResult {
  const rollRequestedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      rollRequestedRef.current = false;
      return;
    }

    const checkingFocusContainerIsActive = (): boolean => {
      const focusContainer = focusContainerRef.current;

      if (!focusContainer) {
        return false;
      }

      const activeElement = document.activeElement;

      if (!activeElement) {
        return false;
      }

      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        return false;
      }

      return (
        focusContainer === activeElement ||
        focusContainer.contains(activeElement)
      );
    };

    const handlingKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== TRACKING_WORLD_PLAZA_ROLL_INPUT_KEY) {
        return;
      }

      if (!checkingFocusContainerIsActive()) {
        return;
      }

      event.preventDefault();

      if (
        event.repeat ||
        isChatOpenRef.current ||
        isPlayerDeadRef?.current ||
        isPlayerAsleepRef?.current ||
        isPlayerStunnedRef?.current
      ) {
        return;
      }

      rollRequestedRef.current = true;
    };

    window.addEventListener('keydown', handlingKeyDown);

    return () => {
      window.removeEventListener('keydown', handlingKeyDown);
    };
  }, [
    focusContainerRef,
    isChatOpenRef,
    isEnabled,
    isPlayerDeadRef,
    isPlayerAsleepRef,
    isPlayerStunnedRef,
  ]);

  return { rollRequestedRef };
}
