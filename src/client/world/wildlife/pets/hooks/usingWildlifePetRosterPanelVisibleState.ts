'use client';

/**
 * Local open/close state for the companions roster panel.
 *
 * @module components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelVisibleState
 */

import { useCallback, useState } from 'react';

export type UsingWildlifePetRosterPanelVisibleStateResult = {
  isPetRosterPanelOpen: boolean;
  openingPetRosterPanel: () => void;
  closingPetRosterPanel: () => void;
  togglingPetRosterPanel: () => void;
};

/** Tracks whether the companions roster panel is open above the plaza. */
export function usingWildlifePetRosterPanelVisibleState(): UsingWildlifePetRosterPanelVisibleStateResult {
  const [isPetRosterPanelOpen, setIsPetRosterPanelOpen] = useState(false);

  const openingPetRosterPanel = useCallback((): void => {
    setIsPetRosterPanelOpen(true);
  }, []);

  const closingPetRosterPanel = useCallback((): void => {
    setIsPetRosterPanelOpen(false);
  }, []);

  const togglingPetRosterPanel = useCallback((): void => {
    setIsPetRosterPanelOpen((isOpen) => !isOpen);
  }, []);

  return {
    isPetRosterPanelOpen,
    openingPetRosterPanel,
    closingPetRosterPanel,
    togglingPetRosterPanel,
  };
}
