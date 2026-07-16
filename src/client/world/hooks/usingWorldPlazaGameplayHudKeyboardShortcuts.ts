'use client';

/**
 * Keyboard shortcuts for plaza gameplay HUD chrome visibility.
 *
 * @module components/world/hooks/usingWorldPlazaGameplayHudKeyboardShortcuts
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOGGLE_KEY } from '@/components/world/domains/definingWorldPlazaGameplayHudVisibilityConstants';
import { useEffect } from 'react';

/** Params for {@link usingWorldPlazaGameplayHudKeyboardShortcuts}. */
export type UsingWorldPlazaGameplayHudKeyboardShortcutsParams = {
  /** When false, shortcuts are ignored. */
  isEnabled: boolean;
  /** Flips gameplay HUD chrome visibility. */
  togglingGameplayHudVisible: () => void;
};

/**
 * Binds F1 to toggle gameplay HUD chrome (screenshot / clean viewport).
 */
export function usingWorldPlazaGameplayHudKeyboardShortcuts({
  isEnabled,
  togglingGameplayHudVisible,
}: UsingWorldPlazaGameplayHudKeyboardShortcutsParams): void {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingGameplayHudKeyDown = (event: KeyboardEvent): void => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const activeElement = document.activeElement;
      const isTypingInField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      if (isTypingInField) {
        return;
      }

      if (event.key !== DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOGGLE_KEY) {
        return;
      }

      event.preventDefault();
      togglingGameplayHudVisible();
    };

    window.addEventListener('keydown', handlingGameplayHudKeyDown);

    return () => {
      window.removeEventListener('keydown', handlingGameplayHudKeyDown);
    };
  }, [isEnabled, togglingGameplayHudVisible]);
}
