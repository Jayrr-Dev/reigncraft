"use client";

/**
 * Friends sidebar panel for the world plaza action bar.
 *
 * @module components/world/components/renderingWorldPlazaFriendsPanel
 */

import { LABELING_USER_PROFILE_FRIENDS_PANEL_TITLE } from "@/components/friends/domains/definingUserProfileFriend";
import { RenderingUserProfileFriendRequestsList } from "@/components/friends/components/renderingUserProfileFriendRequestsList";
import { RenderingUserProfileFriendsList } from "@/components/friends/components/renderingUserProfileFriendsList";
import { RenderingWorldPlazaSidebarPanelHeader } from "@/components/world/components/renderingWorldPlazaSidebarPanelHeader";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import {
  DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_WIDTH_CLASS_NAME,
  STYLING_WORLD_PLAZA_FRIENDS_PANEL_SCROLL_CONTENT_CLASS_NAME,
  STYLING_WORLD_PLAZA_FRIENDS_PANEL_TITLE_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaFriendsPanelConstants";
import { DEFINING_WORLD_PLAZA_FRIENDS_PANEL_TOGGLE_KEY } from "@/components/world/domains/definingWorldPlazaSidebarPanelConstants";
import { useEffect, useMemo } from "react";

/** Props for {@link RenderingWorldPlazaFriendsPanel}. */
export interface RenderingWorldPlazaFriendsPanelProps {
  /** When false, hides the panel. */
  isEnabled: boolean;
  /** Controlled open state from the action bar. */
  isOpen: boolean;
  onClose: () => void;
  /** Signed-in viewer auth user id. */
  localUserId: string;
  /** User ids currently in the viewer's plaza room. */
  plazaOnlineUserIds: readonly string[];
  /** Auth user id of the friend currently being tracked. */
  trackedFriendUserId?: string | null;
  /** Toggles the direction arrow for one friend in the plaza. */
  onToggleTrackFriend?: (friendUserId: string) => void;
}

/** Shared dark-theme overrides for friends list content in the plaza sidebar. */
const STYLING_WORLD_PLAZA_FRIENDS_PANEL_LIST_CONTENT_CLASS_NAME =
  "[&_a]:text-white [&_a:hover]:bg-white/10 [&_p]:text-white/60 [&_span]:text-white/60 [&_.font-medium]:text-white" as const;

/**
 * Right-side friends list panel aligned with build and claim sidebars.
 */
export function RenderingWorldPlazaFriendsPanel({
  isEnabled,
  isOpen,
  onClose,
  localUserId,
  plazaOnlineUserIds,
  trackedFriendUserId = null,
  onToggleTrackFriend,
}: RenderingWorldPlazaFriendsPanelProps): React.JSX.Element | null {
  const plazaOnlineUserIdsSet = useMemo(
    () => new Set(plazaOnlineUserIds),
    [plazaOnlineUserIds],
  );

  useEffect(() => {
    if (!isEnabled) {
      onClose();
    }
  }, [isEnabled, onClose]);

  if (!isEnabled || !isOpen) {
    return null;
  }

  return (
    <div
      className={`${DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_ANCHOR_CLASS_NAME} ${DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_WIDTH_CLASS_NAME}`}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={`${DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_CLASS_NAME} ${DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_WIDTH_CLASS_NAME}`}
      >
        <RenderingWorldPlazaSidebarPanelHeader
          panelTitle={LABELING_USER_PROFILE_FRIENDS_PANEL_TITLE}
          shortcutKey={DEFINING_WORLD_PLAZA_FRIENDS_PANEL_TOGGLE_KEY}
          titleClassName={STYLING_WORLD_PLAZA_FRIENDS_PANEL_TITLE_CLASS_NAME}
          onExit={onClose}
          exitAriaLabel="Close friends panel"
        />

        <div className={STYLING_WORLD_PLAZA_FRIENDS_PANEL_SCROLL_CONTENT_CLASS_NAME}>
          <RenderingUserProfileFriendRequestsList
            enabled={isOpen}
            polling={isOpen}
            className={STYLING_WORLD_PLAZA_FRIENDS_PANEL_LIST_CONTENT_CLASS_NAME}
          />
          <RenderingUserProfileFriendsList
            enabled={isOpen}
            plazaOnlineUserIds={plazaOnlineUserIdsSet}
            currentUserId={localUserId}
            trackedFriendUserId={trackedFriendUserId}
            onToggleTrackFriend={onToggleTrackFriend}
            className={`max-h-none min-h-0 flex-1 ${STYLING_WORLD_PLAZA_FRIENDS_PANEL_LIST_CONTENT_CLASS_NAME}`}
          />
        </div>
      </div>
    </div>
  );
}
