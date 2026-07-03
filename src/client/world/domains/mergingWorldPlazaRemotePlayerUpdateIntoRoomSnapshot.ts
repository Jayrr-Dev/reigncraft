import type {
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/**
 * Upserts a remote player into the plaza room snapshot.
 *
 * @param snapshot - Current room snapshot.
 * @param remotePlayer - Player record to merge.
 * @param localUserId - Auth user id to exclude from remotes.
 */
export function mergingWorldPlazaRemotePlayerUpdateIntoRoomSnapshot(
  snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
  remotePlayer: DefiningWorldPlazaRemotePlayer,
  localUserId: string,
): DefiningWorldPlazaOnlineRoomSnapshot {
  if (remotePlayer.userId === localUserId) {
    return snapshot;
  }

  const existingIndex = snapshot.remotePlayers.findIndex(
    (player) => player.userId === remotePlayer.userId,
  );

  if (existingIndex >= 0) {
    const remotePlayers = snapshot.remotePlayers.slice();
    remotePlayers[existingIndex] = remotePlayer;

    return {
      ...snapshot,
      remotePlayers,
    };
  }

  return {
    ...snapshot,
    remotePlayers: [...snapshot.remotePlayers, remotePlayer],
  };
}

/**
 * Removes a remote player from the plaza room snapshot.
 *
 * @param snapshot - Current room snapshot.
 * @param remoteUserId - Auth user id to remove.
 * @param localUserId - Auth user id to never remove as a remote.
 */
export function removingWorldPlazaRemotePlayerFromRoomSnapshot(
  snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
  remoteUserId: string,
  localUserId: string,
): DefiningWorldPlazaOnlineRoomSnapshot {
  if (remoteUserId === localUserId) {
    return snapshot;
  }

  return {
    ...snapshot,
    remotePlayers: snapshot.remotePlayers.filter(
      (player) => player.userId !== remoteUserId,
    ),
  };
}
