'use client';

import { RenderingWorldPlazaRoomStatusHudFriendButton } from '@/components/world/components/renderingWorldPlazaRoomStatusHudFriendButton';
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS,
  type DefiningWorldPlazaOnlineRoomSnapshot,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';

/** Label suffix for the signed-in user in the online list. */
const RENDERING_WORLD_PLAZA_ROOM_STATUS_HUD_LOCAL_PLAYER_SUFFIX =
  ' (you)' as const;

/** Maximum names shown in the online list before truncating. */
const RENDERING_WORLD_PLAZA_ROOM_STATUS_HUD_MAX_ONLINE_NAMES = 8;

export interface RenderingWorldPlazaRoomStatusHudProps {
  roomSnapshot: DefiningWorldPlazaOnlineRoomSnapshot;
  /** Auth user id for marking the local row in the online list. */
  localUserId: string;
  /** Maximum players allowed in the room (defaults to Colyseus cap). */
  maxPlayers?: number;
  /** Hides the HUD when build mode sidebar is open. */
  isHidden?: boolean;
}

/**
 * Overlay showing plaza room connection status and player count.
 */
export function RenderingWorldPlazaRoomStatusHud({
  roomSnapshot,
  localUserId,
  maxPlayers = DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS,
  isHidden = false,
}: RenderingWorldPlazaRoomStatusHudProps): React.JSX.Element | null {
  if (isHidden) {
    return null;
  }

  const connectionLabel = roomSnapshot.lastError
    ? 'Connection failed'
    : roomSnapshot.isReconnecting
      ? 'Reconnecting...'
      : roomSnapshot.isRoomFull
        ? 'Room full'
        : roomSnapshot.isJoined
          ? null
          : roomSnapshot.isConnected
            ? 'Finding room...'
            : 'Connecting...';

  const orderedOnlineParticipants = [...roomSnapshot.onlineParticipants].sort(
    (firstParticipant, secondParticipant) => {
      if (firstParticipant.userId === localUserId) {
        return -1;
      }
      if (secondParticipant.userId === localUserId) {
        return 1;
      }
      return 0;
    }
  );

  const visibleOnlineParticipants = orderedOnlineParticipants.slice(
    0,
    RENDERING_WORLD_PLAZA_ROOM_STATUS_HUD_MAX_ONLINE_NAMES
  );
  const hiddenOnlineParticipantCount = Math.max(
    0,
    roomSnapshot.onlineParticipants.length -
      RENDERING_WORLD_PLAZA_ROOM_STATUS_HUD_MAX_ONLINE_NAMES
  );

  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden max-w-56 flex-col gap-1 rounded-md border border-poster-gold/25 bg-poster-teal-deep/85 px-2 py-1.5 text-xs text-parchment/90 backdrop-blur-sm md:flex">
      {connectionLabel ? (
        <p className="font-medium">{connectionLabel}</p>
      ) : null}
      {roomSnapshot.roomIndex !== null ? (
        <p>Room {roomSnapshot.roomIndex}</p>
      ) : null}
      <p>
        Players {roomSnapshot.participantCount}/{maxPlayers}
      </p>
      {roomSnapshot.lastError ? (
        <p className="text-amber-200">{roomSnapshot.lastError}</p>
      ) : null}
      {roomSnapshot.remotePlayers.length === 0 &&
      roomSnapshot.isJoined &&
      roomSnapshot.participantCount > 1 ? (
        <p className="text-[11px] text-amber-200">
          Others are in this room. Move around if you do not see them yet.
        </p>
      ) : null}
      {roomSnapshot.isJoined && visibleOnlineParticipants.length > 0 ? (
        <ul className="mt-0.5 space-y-0.5 text-[11px] text-white/75">
          {visibleOnlineParticipants.map((participant) => {
            const isLocalParticipant = participant.userId === localUserId;

            return (
              <li
                key={participant.userId}
                className="flex items-center gap-1.5"
              >
                <span className="min-w-0 flex-1 truncate">
                  {participant.displayName}
                  {isLocalParticipant
                    ? RENDERING_WORLD_PLAZA_ROOM_STATUS_HUD_LOCAL_PLAYER_SUFFIX
                    : null}
                </span>
                {isLocalParticipant ? null : (
                  <RenderingWorldPlazaRoomStatusHudFriendButton
                    participantUserId={participant.userId}
                    participantDisplayName={participant.displayName}
                  />
                )}
              </li>
            );
          })}
          {hiddenOnlineParticipantCount > 0 ? (
            <li>+{hiddenOnlineParticipantCount} more</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
