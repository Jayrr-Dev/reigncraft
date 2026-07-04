'use client';

import { DEFINING_WORLD_PLAZA_KEYBOARD_RUN_KEY } from '@/components/world/domains/definingWorldPlazaKeyboardInputConstants';
import {
  DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
  checkingWorldPlazaMovementDirectionIsActive,
  type DefiningWorldPlazaMovementDirection,
} from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaSandboxMovementKey } from '@/components/world/domains/definingWorldPlazaSandboxConstants';
import { normalizingWorldPlazaMovementKey } from '@/components/world/domains/normalizingWorldPlazaMovementKey';
import { useEffect, useRef } from 'react';

export interface TrackingWorldPlazaArrowKeyInputParams {
  /** When false, movement keys are ignored and direction resets to idle. */
  isEnabled: boolean;
  /** Element that must be focused (or contain focus) for movement keys to apply. */
  focusContainerRef: React.RefObject<HTMLElement | null>;
  /** When true, movement and run keys are ignored. */
  isChatOpenRef?: React.RefObject<boolean>;
  /** When true (claim mode), movement and run keys are ignored. */
  isClaimModeActiveRef?: React.RefObject<boolean>;
  /** When true, movement and run keys are ignored. */
  isPlayerDeadRef?: React.RefObject<boolean>;
  /** Clears a pending inventory ground drop when keyboard movement starts. */
  cancellingPlayerMovementIntentRef?: React.RefObject<(() => void) | null>;
}

export interface TrackingWorldPlazaArrowKeyInputResult {
  /** Latest normalized direction; updated on key events without re-rendering. */
  directionRef: React.RefObject<DefiningWorldPlazaMovementDirection>;
  /** True while Shift is held for keyboard running. */
  isRunKeyHeldRef: React.RefObject<boolean>;
}

/**
 * Tracks held arrow keys and WASD for plaza walk input.
 * Prevents default browser actions while the plaza container is focused.
 *
 * @param params - Enable flag and focus container ref.
 */
export function trackingWorldPlazaArrowKeyInput({
  isEnabled,
  focusContainerRef,
  isChatOpenRef,
  isClaimModeActiveRef,
  isPlayerDeadRef,
  cancellingPlayerMovementIntentRef,
}: TrackingWorldPlazaArrowKeyInputParams): TrackingWorldPlazaArrowKeyInputResult {
  const directionRef = useRef<DefiningWorldPlazaMovementDirection>({
    ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
  });
  const isRunKeyHeldRef = useRef(false);
  const pressedKeysRef = useRef<Set<DefiningWorldPlazaSandboxMovementKey>>(
    new Set()
  );

  useEffect(() => {
    if (!isEnabled) {
      pressedKeysRef.current.clear();
      isRunKeyHeldRef.current = false;
      directionRef.current = {
        ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
      };
      return;
    }

    const resolvingDirectionFromPressedKeys =
      (): DefiningWorldPlazaMovementDirection => {
        const pressedKeys = pressedKeysRef.current;
        let axisX = 0;
        let axisY = 0;

        if (pressedKeys.has('ArrowLeft') || pressedKeys.has('a')) {
          axisX -= 1;
        }
        if (pressedKeys.has('ArrowRight') || pressedKeys.has('d')) {
          axisX += 1;
        }
        if (pressedKeys.has('ArrowUp') || pressedKeys.has('w')) {
          axisY -= 1;
        }
        if (pressedKeys.has('ArrowDown') || pressedKeys.has('s')) {
          axisY += 1;
        }

        if (axisX === 0 && axisY === 0) {
          return { ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE };
        }

        if (axisX !== 0 && axisY !== 0) {
          const diagonalScale = 1 / Math.sqrt(2);
          return {
            x: axisX * diagonalScale,
            y: axisY * diagonalScale,
          };
        }

        return { x: axisX, y: axisY };
      };

    const checkingKeyboardInputIsAllowed = (): boolean => {
      if (isChatOpenRef?.current) {
        return false;
      }

      if (isClaimModeActiveRef?.current) {
        return false;
      }

      if (isPlayerDeadRef?.current) {
        return false;
      }

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
      if (!checkingKeyboardInputIsAllowed()) {
        return;
      }

      if (event.key === DEFINING_WORLD_PLAZA_KEYBOARD_RUN_KEY) {
        event.preventDefault();
        isRunKeyHeldRef.current = true;
        return;
      }

      const movementKey = normalizingWorldPlazaMovementKey(event.key);

      if (!movementKey) {
        return;
      }

      event.preventDefault();
      pressedKeysRef.current.add(movementKey);
      const nextDirection = resolvingDirectionFromPressedKeys();
      const hadActiveDirection = checkingWorldPlazaMovementDirectionIsActive(
        directionRef.current
      );
      const hasActiveDirection =
        checkingWorldPlazaMovementDirectionIsActive(nextDirection);

      directionRef.current = nextDirection;

      if (!hadActiveDirection && hasActiveDirection) {
        cancellingPlayerMovementIntentRef?.current?.();
      }
    };

    const handlingKeyUp = (event: KeyboardEvent): void => {
      if (event.key === DEFINING_WORLD_PLAZA_KEYBOARD_RUN_KEY) {
        event.preventDefault();
        isRunKeyHeldRef.current = false;
        return;
      }

      const movementKey = normalizingWorldPlazaMovementKey(event.key);

      if (!movementKey) {
        return;
      }

      if (!checkingKeyboardInputIsAllowed()) {
        pressedKeysRef.current.delete(movementKey);
        directionRef.current = resolvingDirectionFromPressedKeys();
        return;
      }

      event.preventDefault();
      pressedKeysRef.current.delete(movementKey);
      directionRef.current = resolvingDirectionFromPressedKeys();
    };

    const handlingWindowBlur = (): void => {
      pressedKeysRef.current.clear();
      isRunKeyHeldRef.current = false;
      directionRef.current = {
        ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
      };
    };

    window.addEventListener('keydown', handlingKeyDown);
    window.addEventListener('keyup', handlingKeyUp);
    window.addEventListener('blur', handlingWindowBlur);

    return () => {
      window.removeEventListener('keydown', handlingKeyDown);
      window.removeEventListener('keyup', handlingKeyUp);
      window.removeEventListener('blur', handlingWindowBlur);
      pressedKeysRef.current.clear();
      isRunKeyHeldRef.current = false;
      directionRef.current = {
        ...DEFINING_WORLD_PLAZA_MOVEMENT_DIRECTION_IDLE,
      };
    };
  }, [
    cancellingPlayerMovementIntentRef,
    focusContainerRef,
    isClaimModeActiveRef,
    isChatOpenRef,
    isEnabled,
    isPlayerDeadRef,
  ]);

  return { directionRef, isRunKeyHeldRef };
}
