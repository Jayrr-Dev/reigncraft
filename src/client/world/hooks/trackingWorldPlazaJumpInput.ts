"use client";

import { useEffect, useRef } from "react";

/** Keyboard key that triggers a plaza jump. */
const TRACKING_WORLD_PLAZA_JUMP_INPUT_KEY = " " as const;

export interface TrackingWorldPlazaJumpInputParams {
  /** When false, jump input is ignored. */
  isEnabled: boolean;
  /** When true, space is reserved for chat and jump is blocked. */
  isChatOpenRef: React.RefObject<boolean>;
  /** Element that must be focused (or contain focus) for jump to apply. */
  focusContainerRef: React.RefObject<HTMLElement | null>;
  /** True while a jump animation is in progress. */
  isJumpingRef: React.RefObject<boolean>;
  /** When true, jump input is blocked while asleep. */
  isPlayerAsleepRef?: React.RefObject<boolean>;
  /** When true, jump input is blocked while stunned. */
  isPlayerStunnedRef?: React.RefObject<boolean>;
}

export interface TrackingWorldPlazaJumpInputResult {
  /** Set to true on Space; consumed by the avatar when a jump starts. */
  jumpRequestedRef: React.RefObject<boolean>;
}

/**
 * Listens for Space while the plaza host is focused and queues a jump request.
 *
 * @param params - Enable flag, chat guard, focus container, and jump lock ref.
 */
export function trackingWorldPlazaJumpInput({
  isEnabled,
  isChatOpenRef,
  focusContainerRef,
  isJumpingRef,
  isPlayerAsleepRef,
  isPlayerStunnedRef,
}: TrackingWorldPlazaJumpInputParams): TrackingWorldPlazaJumpInputResult {
  const jumpRequestedRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      jumpRequestedRef.current = false;
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
      if (event.key !== TRACKING_WORLD_PLAZA_JUMP_INPUT_KEY) {
        return;
      }

      if (!checkingFocusContainerIsActive()) {
        return;
      }

      event.preventDefault();

      if (
        event.repeat ||
        isChatOpenRef.current ||
        isJumpingRef.current ||
        isPlayerAsleepRef?.current ||
        isPlayerStunnedRef?.current
      ) {
        return;
      }

      jumpRequestedRef.current = true;
    };

    window.addEventListener("keydown", handlingKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handlingKeyDown, { capture: true });
      jumpRequestedRef.current = false;
    };
  }, [focusContainerRef, isChatOpenRef, isEnabled, isJumpingRef, isPlayerAsleepRef, isPlayerStunnedRef]);

  return { jumpRequestedRef };
}
