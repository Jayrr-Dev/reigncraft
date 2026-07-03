"use client";

/**
 * Local open/close state for the plaza friends dropdown panel.
 *
 * @module components/world/hooks/usingWorldPlazaFriendsPanelVisibleState
 */

import { useCallback, useState } from "react";

/** Result from {@link usingWorldPlazaFriendsPanelVisibleState}. */
export interface UsingWorldPlazaFriendsPanelVisibleStateResult {
  isFriendsPanelOpen: boolean;
  openingFriendsPanel: () => void;
  closingFriendsPanel: () => void;
  togglingFriendsPanel: () => void;
}

/**
 * Tracks whether the friends dropdown is open above the plaza viewport.
 */
export function usingWorldPlazaFriendsPanelVisibleState(): UsingWorldPlazaFriendsPanelVisibleStateResult {
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);

  const openingFriendsPanel = useCallback((): void => {
    setIsFriendsPanelOpen(true);
  }, []);

  const closingFriendsPanel = useCallback((): void => {
    setIsFriendsPanelOpen(false);
  }, []);

  const togglingFriendsPanel = useCallback((): void => {
    setIsFriendsPanelOpen((isOpen) => !isOpen);
  }, []);

  return {
    isFriendsPanelOpen,
    openingFriendsPanel,
    closingFriendsPanel,
    togglingFriendsPanel,
  };
}
