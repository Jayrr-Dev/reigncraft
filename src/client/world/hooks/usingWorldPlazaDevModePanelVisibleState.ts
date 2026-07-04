'use client';

import { DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_OPEN_STORAGE_KEY } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { useCallback, useEffect, useState } from 'react';

/** Result from {@link usingWorldPlazaDevModePanelVisibleState}. */
export interface UsingWorldPlazaDevModePanelVisibleStateResult {
  /** True when the consolidated dev panel is expanded. */
  isDevModePanelOpen: boolean;
  /** Flips dev panel visibility. */
  togglingDevModePanel: () => void;
  /** Collapses the dev panel without toggling. */
  closingDevModePanel: () => void;
}

/**
 * Reads the persisted dev panel open flag from session storage.
 */
function readingWorldPlazaDevModePanelOpenFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.sessionStorage.getItem(
      DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_OPEN_STORAGE_KEY
    ) === 'true'
  );
}

/**
 * Persists the dev panel open flag to session storage.
 *
 * @param isOpen - True when the dev panel should stay expanded.
 */
function writingWorldPlazaDevModePanelOpenToStorage(isOpen: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_OPEN_STORAGE_KEY,
    String(isOpen)
  );
}

/**
 * Master toggle for the consolidated plaza dev tools panel.
 *
 * @param isDevEnvironment - When false, the panel stays closed.
 */
export function usingWorldPlazaDevModePanelVisibleState(
  isDevEnvironment: boolean
): UsingWorldPlazaDevModePanelVisibleStateResult {
  const [isDevModePanelOpen, setIsDevModePanelOpen] = useState(false);

  useEffect(() => {
    if (!isDevEnvironment) {
      setIsDevModePanelOpen(false);
      return;
    }

    setIsDevModePanelOpen(readingWorldPlazaDevModePanelOpenFromStorage());
  }, [isDevEnvironment]);

  const settingDevModePanelOpen = useCallback((isOpen: boolean): void => {
    setIsDevModePanelOpen(isOpen);
    writingWorldPlazaDevModePanelOpenToStorage(isOpen);
  }, []);

  const togglingDevModePanel = useCallback((): void => {
    setIsDevModePanelOpen((isOpen) => {
      const nextIsOpen = !isOpen;
      writingWorldPlazaDevModePanelOpenToStorage(nextIsOpen);
      return nextIsOpen;
    });
  }, []);

  const closingDevModePanel = useCallback((): void => {
    settingDevModePanelOpen(false);
  }, [settingDevModePanelOpen]);

  return {
    isDevModePanelOpen,
    togglingDevModePanel,
    closingDevModePanel,
  };
}
