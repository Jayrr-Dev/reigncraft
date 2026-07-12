'use client';

/**
 * Local open/close state for the plaza character profile panel.
 *
 * @module components/world/hooks/usingWorldPlazaProfilePanelVisibleState
 */

import { useCallback, useState } from 'react';

/** Result from {@link usingWorldPlazaProfilePanelVisibleState}. */
export interface UsingWorldPlazaProfilePanelVisibleStateResult {
  isProfilePanelOpen: boolean;
  openingProfilePanel: () => void;
  closingProfilePanel: () => void;
  togglingProfilePanel: () => void;
}

/**
 * Tracks whether the character profile panel is open above the plaza viewport.
 */
export function usingWorldPlazaProfilePanelVisibleState(): UsingWorldPlazaProfilePanelVisibleStateResult {
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  const openingProfilePanel = useCallback((): void => {
    setIsProfilePanelOpen(true);
  }, []);

  const closingProfilePanel = useCallback((): void => {
    setIsProfilePanelOpen(false);
  }, []);

  const togglingProfilePanel = useCallback((): void => {
    setIsProfilePanelOpen((isOpen) => !isOpen);
  }, []);

  return {
    isProfilePanelOpen,
    openingProfilePanel,
    closingProfilePanel,
    togglingProfilePanel,
  };
}
