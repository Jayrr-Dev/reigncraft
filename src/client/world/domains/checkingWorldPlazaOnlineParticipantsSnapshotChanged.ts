/**
 * Detects whether multiplayer HUD participant metadata changed.
 *
 * @module components/world/domains/checkingWorldPlazaOnlineParticipantsSnapshotChanged
 */

import type { DefiningWorldPlazaOnlineRoomSnapshot } from '@/components/world/domains/definingWorldPlazaOnlineRoom';

/**
 * Returns true when participant count or roster ids/names changed.
 *
 * @param currentSnapshot - Previous TanStack Query snapshot.
 * @param participantCount - Latest server participant count.
 * @param onlineParticipants - Latest participant roster for HUD surfaces.
 */
export function checkingWorldPlazaOnlineParticipantsSnapshotChanged(
  currentSnapshot: DefiningWorldPlazaOnlineRoomSnapshot,
  participantCount: number,
  onlineParticipants: DefiningWorldPlazaOnlineRoomSnapshot['onlineParticipants']
): boolean {
  if (currentSnapshot.participantCount !== participantCount) {
    return true;
  }

  if (currentSnapshot.onlineParticipants.length !== onlineParticipants.length) {
    return true;
  }

  for (let index = 0; index < onlineParticipants.length; index += 1) {
    const nextParticipant = onlineParticipants[index];
    const currentParticipant = currentSnapshot.onlineParticipants[index];

    if (!nextParticipant || !currentParticipant) {
      return true;
    }

    if (
      nextParticipant.userId !== currentParticipant.userId ||
      nextParticipant.displayName !== currentParticipant.displayName
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when a room patch would change observable snapshot state.
 *
 * Participant arrays are compared by value so the 150ms position sync can
 * return the existing snapshot instead of re-rendering the full plaza tree.
 */
export function checkingWorldPlazaOnlineRoomSnapshotPatchChanged(
  currentSnapshot: DefiningWorldPlazaOnlineRoomSnapshot,
  patch: Partial<DefiningWorldPlazaOnlineRoomSnapshot>
): boolean {
  if (
    patch.remotePlayers !== undefined &&
    patch.remotePlayers !== currentSnapshot.remotePlayers
  ) {
    return true;
  }

  if (
    patch.onlineParticipants !== undefined &&
    checkingWorldPlazaOnlineParticipantsSnapshotChanged(
      currentSnapshot,
      patch.participantCount ?? currentSnapshot.participantCount,
      patch.onlineParticipants
    )
  ) {
    return true;
  }

  if (
    patch.onlineParticipants === undefined &&
    patch.participantCount !== undefined &&
    patch.participantCount !== currentSnapshot.participantCount
  ) {
    return true;
  }

  return (
    (patch.roomId !== undefined &&
      patch.roomId !== currentSnapshot.roomId) ||
    (patch.roomDisplayName !== undefined &&
      patch.roomDisplayName !== currentSnapshot.roomDisplayName) ||
    (patch.maxPlayers !== undefined &&
      patch.maxPlayers !== currentSnapshot.maxPlayers) ||
    (patch.createdBy !== undefined &&
      patch.createdBy !== currentSnapshot.createdBy) ||
    (patch.roomChannelName !== undefined &&
      patch.roomChannelName !== currentSnapshot.roomChannelName) ||
    (patch.isConnected !== undefined &&
      patch.isConnected !== currentSnapshot.isConnected) ||
    (patch.isJoined !== undefined &&
      patch.isJoined !== currentSnapshot.isJoined) ||
    (patch.isReconnecting !== undefined &&
      patch.isReconnecting !== currentSnapshot.isReconnecting) ||
    (patch.isRoomFull !== undefined &&
      patch.isRoomFull !== currentSnapshot.isRoomFull) ||
    (patch.lastError !== undefined &&
      patch.lastError !== currentSnapshot.lastError)
  );
}
