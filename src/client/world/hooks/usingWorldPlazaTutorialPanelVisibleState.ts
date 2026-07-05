'use client';

import { useCallback, useState } from 'react';

/** Result from {@link usingWorldPlazaTutorialPanelVisibleState}. */
export type UsingWorldPlazaTutorialPanelVisibleStateResult = {
  isTutorialPanelOpen: boolean;
  closingTutorialPanel: () => void;
  togglingTutorialPanel: () => void;
};

/**
 * Tracks whether the how-to-play tutorial overlay is open in the plaza.
 */
export function usingWorldPlazaTutorialPanelVisibleState(): UsingWorldPlazaTutorialPanelVisibleStateResult {
  const [isTutorialPanelOpen, setIsTutorialPanelOpen] = useState(false);

  const closingTutorialPanel = useCallback((): void => {
    setIsTutorialPanelOpen(false);
  }, []);

  const togglingTutorialPanel = useCallback((): void => {
    setIsTutorialPanelOpen((isOpen) => !isOpen);
  }, []);

  return {
    isTutorialPanelOpen,
    closingTutorialPanel,
    togglingTutorialPanel,
  };
}
