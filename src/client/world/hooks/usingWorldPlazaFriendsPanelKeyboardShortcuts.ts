"use client";

/**
 * Keyboard shortcuts for the plaza friends sidebar panel.
 *
 * @module components/world/hooks/usingWorldPlazaFriendsPanelKeyboardShortcuts
 */

import {
  DEFINING_WORLD_PLAZA_FRIENDS_PANEL_TOGGLE_KEY,
  DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY,
} from "@/components/world/domains/definingWorldPlazaSidebarPanelConstants";
import { useEffect } from "react";

/** Params for {@link usingWorldPlazaFriendsPanelKeyboardShortcuts}. */
export interface UsingWorldPlazaFriendsPanelKeyboardShortcutsParams {
  /** When false, shortcuts are ignored. */
  isEnabled: boolean;
  isFriendsPanelOpen: boolean;
  isChatOpen: boolean;
  closeChat: () => void;
  closingFriendsPanel: () => void;
  togglingFriendsPanel: () => void;
}

/**
 * Binds `F` to toggle friends and `Escape` to close the friends sidebar.
 */
export function usingWorldPlazaFriendsPanelKeyboardShortcuts({
  isEnabled,
  isFriendsPanelOpen,
  isChatOpen,
  closeChat,
  closingFriendsPanel,
  togglingFriendsPanel,
}: UsingWorldPlazaFriendsPanelKeyboardShortcutsParams): void {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingFriendsPanelKeyDown = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement;
      const isTypingInField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (isTypingInField) {
        return;
      }

      if (
        event.key === DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY &&
        isFriendsPanelOpen
      ) {
        event.preventDefault();
        closingFriendsPanel();
        return;
      }

      if (
        event.key.toLowerCase() !== DEFINING_WORLD_PLAZA_FRIENDS_PANEL_TOGGLE_KEY
      ) {
        return;
      }

      event.preventDefault();

      if (!isFriendsPanelOpen && isChatOpen) {
        closeChat();
      }

      togglingFriendsPanel();
    };

    window.addEventListener("keydown", handlingFriendsPanelKeyDown);

    return () => {
      window.removeEventListener("keydown", handlingFriendsPanelKeyDown);
    };
  }, [
    closeChat,
    closingFriendsPanel,
    isChatOpen,
    isEnabled,
    isFriendsPanelOpen,
    togglingFriendsPanel,
  ]);
}
