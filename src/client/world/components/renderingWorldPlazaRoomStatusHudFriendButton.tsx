'use client';

/**
 * Minimalist unfriend icon button for one participant row in the plaza
 * room status HUD. Everyone is a friend by default until unfriended.
 *
 * @module components/world/components/renderingWorldPlazaRoomStatusHudFriendButton
 */

import { usingUserProfileFriendAction } from '@/components/friends/hooks/usingUserProfileFriendAction';
import { cn } from '@/lib/utils';
import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import { useRef, type JSX } from 'react';

/** Icon glyph size inside the HUD friend button. */
const STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_ICON_SIZE =
  'size-3.5' as const;

/** Base button styling (compact, transparent, dark-panel friendly). */
const STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_BUTTON =
  'pointer-events-auto inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/55' as const;

/** Tint when a friend relationship is already active. */
const STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_BUTTON_ACTIVE =
  'text-emerald-300 hover:text-emerald-200' as const;

/** Props for {@link RenderingWorldPlazaRoomStatusHudFriendButton}. */
export interface RenderingWorldPlazaRoomStatusHudFriendButtonProps {
  /** Participant auth user id to add as a friend. */
  participantUserId: string;
  /** Participant display name for success toasts. */
  participantDisplayName: string;
  /** Signed-in viewer auth user id. */
  viewerUserId: string;
}

/**
 * Renders a small icon button that unfriends or re-adds one plaza participant.
 */
export function RenderingWorldPlazaRoomStatusHudFriendButton({
  participantUserId,
  participantDisplayName,
  viewerUserId,
}: RenderingWorldPlazaRoomStatusHudFriendButtonProps): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    isFriendByViewer,
    isRelationshipActive,
    resolvedTooltip,
    isInteractive,
    isDeclineCooldownActive,
    isPending,
    act,
  } = usingUserProfileFriendAction({
    profileUserId: participantUserId,
    profileDisplayName: participantDisplayName,
    viewerUserId,
    originRef: buttonRef,
  });

  const Icon = isPending ? Loader2 : isFriendByViewer ? UserMinus : UserPlus;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_BUTTON,
        isRelationshipActive &&
          STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_BUTTON_ACTIVE
      )}
      aria-pressed={isRelationshipActive}
      aria-label={resolvedTooltip}
      title={resolvedTooltip}
      disabled={!isInteractive || isDeclineCooldownActive || isPending}
      onClick={act}
    >
      <Icon
        className={cn(
          STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_FRIEND_ICON_SIZE,
          isPending && 'animate-spin'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
