import type { RefObject } from "react";

import type {
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import { countingWorldPlazaPresenceParticipants } from "@/components/world/domains/listingWorldPlazaRemotePlayersFromPresenceState";

/**
 * Compares two remote player records; returns the one with the newer `updatedAt`.
 *
 * @param leftPlayer - First player record.
 * @param rightPlayer - Second player record.
 */
export function pickingWorldPlazaNewerRemotePlayerRecord(
  leftPlayer: DefiningWorldPlazaRemotePlayer,
  rightPlayer: DefiningWorldPlazaRemotePlayer,
): DefiningWorldPlazaRemotePlayer {
  const leftUpdatedAtMs = Date.parse(leftPlayer.updatedAt);
  const rightUpdatedAtMs = Date.parse(rightPlayer.updatedAt);

  if (
    Number.isFinite(leftUpdatedAtMs) &&
    Number.isFinite(rightUpdatedAtMs) &&
    rightUpdatedAtMs > leftUpdatedAtMs
  ) {
    return rightPlayer;
  }

  return leftPlayer;
}

/**
 * Upserts a remote player into the live registry and TanStack Query snapshot.
 *
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param applySnapshotUpdate - Writes the merged snapshot to TanStack Query.
 * @param remotePlayer - Incoming player record.
 * @param localUserId - Auth user id to ignore.
 */
export function applyingWorldPlazaRemotePlayerLiveUpdate(
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>,
  applySnapshotUpdate: (
    updater: (
      snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
    ) => DefiningWorldPlazaOnlineRoomSnapshot,
  ) => void,
  remotePlayer: DefiningWorldPlazaRemotePlayer,
  localUserId: string,
): void {
  if (remotePlayer.userId === localUserId) {
    return;
  }

  const registry = remotePlayerRegistryRef.current;
  const existingRegistryPlayer = registry.get(remotePlayer.userId);

  if (existingRegistryPlayer) {
    existingRegistryPlayer.x = remotePlayer.x;
    existingRegistryPlayer.y = remotePlayer.y;
    existingRegistryPlayer.motionKind = remotePlayer.motionKind;
    existingRegistryPlayer.facingDirection = remotePlayer.facingDirection;
    existingRegistryPlayer.jumpStartedAtMs = remotePlayer.jumpStartedAtMs;
    existingRegistryPlayer.jumpArcPeakScreenPx = remotePlayer.jumpArcPeakScreenPx;
    existingRegistryPlayer.updatedAt = remotePlayer.updatedAt;
    existingRegistryPlayer.displayName = remotePlayer.displayName;
    existingRegistryPlayer.profileStatusKind = remotePlayer.profileStatusKind;
    existingRegistryPlayer.avatarUrl = remotePlayer.avatarUrl;
    existingRegistryPlayer.avatarSkinId = remotePlayer.avatarSkinId;
  } else {
    registry.set(remotePlayer.userId, remotePlayer);
  }

  const resolvedPlayer = existingRegistryPlayer ?? remotePlayer;

  applySnapshotUpdate((snapshot) => {
    const existingIndex = snapshot.remotePlayers.findIndex(
      (player) => player.userId === resolvedPlayer.userId,
    );

    if (existingIndex < 0) {
      const hasOnlineParticipant = snapshot.onlineParticipants.some(
        (participant) => participant.userId === resolvedPlayer.userId,
      );
      const onlineParticipants = hasOnlineParticipant
        ? snapshot.onlineParticipants
        : [
            ...snapshot.onlineParticipants,
            {
              userId: resolvedPlayer.userId,
              displayName: resolvedPlayer.displayName,
            },
          ];

      return {
        ...snapshot,
        remotePlayers: [...snapshot.remotePlayers, resolvedPlayer],
        onlineParticipants,
        participantCount: onlineParticipants.length,
      };
    }

    const existingRosterPlayer = snapshot.remotePlayers[existingIndex];

    if (
      existingRosterPlayer.displayName === resolvedPlayer.displayName &&
      existingRosterPlayer.profileStatusKind ===
        resolvedPlayer.profileStatusKind &&
      existingRosterPlayer.avatarUrl === resolvedPlayer.avatarUrl &&
      existingRosterPlayer.avatarSkinId === resolvedPlayer.avatarSkinId
    ) {
      // Same reference signals TanStack Query to skip notifying subscribers,
      // so a pure position/motion update never triggers a React re-render.
      return snapshot;
    }

    const remotePlayers = snapshot.remotePlayers.slice();
    remotePlayers[existingIndex] = {
      ...existingRosterPlayer,
      displayName: resolvedPlayer.displayName,
      profileStatusKind: resolvedPlayer.profileStatusKind,
      avatarUrl: resolvedPlayer.avatarUrl,
      avatarSkinId: resolvedPlayer.avatarSkinId,
    };

    return {
      ...snapshot,
      remotePlayers,
    };
  });
}

/**
 * Removes a remote player from the live registry and TanStack Query snapshot.
 *
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param applySnapshotUpdate - Writes the merged snapshot to TanStack Query.
 * @param remoteUserId - Auth user id to remove.
 * @param localUserId - Auth user id to never remove as a remote.
 */
export function removingWorldPlazaRemotePlayerLiveUpdate(
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>,
  applySnapshotUpdate: (
    updater: (
      snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
    ) => DefiningWorldPlazaOnlineRoomSnapshot,
  ) => void,
  remoteUserId: string,
  localUserId: string,
): void {
  if (remoteUserId === localUserId) {
    return;
  }

  remotePlayerRegistryRef.current.delete(remoteUserId);

  applySnapshotUpdate((snapshot) => {
    const onlineParticipants = snapshot.onlineParticipants.filter(
      (participant) => participant.userId !== remoteUserId,
    );

    return {
      ...snapshot,
      remotePlayers: snapshot.remotePlayers.filter(
        (player) => player.userId !== remoteUserId,
      ),
      onlineParticipants,
      participantCount: onlineParticipants.length,
    };
  });
}

/**
 * Reads only participant count from Supabase presence (never replaces remotes).
 *
 * @param channel - Active plaza room Realtime channel.
 */
export function countingWorldPlazaOnlineRoomPresenceParticipantsFromChannel(
  channel: { presenceState: () => Record<string, unknown[]> },
): number {
  return countingWorldPlazaPresenceParticipants(
    channel.presenceState() as Record<string, unknown[]>,
  );
}
