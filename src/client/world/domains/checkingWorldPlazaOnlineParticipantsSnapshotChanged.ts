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
