import { listingWorldPlazaRemotePlayerFromColyseusPlayer } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayerFromColyseusPlayer";
import { listingWorldPlazaOnlineParticipantsFromColyseusPlayerMap } from "@/components/world/colyseus/domains/listingWorldPlazaOnlineParticipantsFromColyseusPlayerMap";
import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type {
  DefiningWorldPlazaOnlineParticipant,
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { RefObject } from "react";

/** Iterable Colyseus player map exposed on synchronized room state. */
type ListingWorldPlazaRemotePlayersFromColyseusPlayerMapParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Builds the remote player roster from authoritative Colyseus room state.
 *
 * @param players - Synchronized player map from the joined room.
 * @param localSessionId - Current client session id to exclude.
 * @param localUserId - Auth user id to exclude.
 */
export function listingWorldPlazaRemotePlayersFromColyseusPlayerMap(
  players: ListingWorldPlazaRemotePlayersFromColyseusPlayerMapParams | undefined,
  localSessionId: string,
  localUserId: string,
): DefiningWorldPlazaRemotePlayer[] {
  const remotePlayersByUserId = new Map<string, DefiningWorldPlazaRemotePlayer>();

  for (const [sessionId, player] of players?.entries() ?? []) {
    if (sessionId === localSessionId || player.userId === localUserId) {
      continue;
    }

    const userId = player.userId?.trim();

    if (!userId) {
      continue;
    }

    remotePlayersByUserId.set(
      userId,
      listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
    );
  }

  return Array.from(remotePlayersByUserId.values());
}

/**
 * Replaces the live remote registry and TanStack snapshot roster from Colyseus state.
 *
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param applySnapshotUpdate - Writes the merged snapshot to TanStack Query.
 * @param remotePlayers - Authoritative remote roster for the active room.
 * @param onlineParticipants - Every unique auth user in the room, including local.
 */
export function replacingWorldPlazaRemotePlayerRosterFromColyseusState(
  remotePlayerRegistryRef: RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >,
  applySnapshotUpdate: (
    updater: (
      snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
    ) => DefiningWorldPlazaOnlineRoomSnapshot,
  ) => void,
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[],
  onlineParticipants: readonly DefiningWorldPlazaOnlineParticipant[],
): void {
  const registry = remotePlayerRegistryRef.current;
  registry.clear();

  for (const remotePlayer of remotePlayers) {
    registry.set(remotePlayer.userId, remotePlayer);
  }

  applySnapshotUpdate((snapshot) => ({
    ...snapshot,
    remotePlayers: [...remotePlayers],
    onlineParticipants: [...onlineParticipants],
    participantCount: onlineParticipants.length,
  }));
}

/** Iterable Colyseus player map exposed on synchronized room state. */
type SyncingWorldPlazaOnlineRoomRosterFromColyseusRoomParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Rebuilds remote avatars and the HUD participant list from Colyseus room state.
 *
 * @param players - Synchronized player map from the joined room.
 * @param localSessionId - Current client session id to exclude from remotes.
 * @param localUserId - Auth user id to exclude from remotes.
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param applySnapshotUpdate - Writes the merged snapshot to TanStack Query.
 */
export function syncingWorldPlazaOnlineRoomRosterFromColyseusRoom(
  players: SyncingWorldPlazaOnlineRoomRosterFromColyseusRoomParams | undefined,
  localSessionId: string,
  localUserId: string,
  remotePlayerRegistryRef: RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >,
  applySnapshotUpdate: (
    updater: (
      snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
    ) => DefiningWorldPlazaOnlineRoomSnapshot,
  ) => void,
): void {
  replacingWorldPlazaRemotePlayerRosterFromColyseusState(
    remotePlayerRegistryRef,
    applySnapshotUpdate,
    listingWorldPlazaRemotePlayersFromColyseusPlayerMap(
      players,
      localSessionId,
      localUserId,
    ),
    listingWorldPlazaOnlineParticipantsFromColyseusPlayerMap(players),
  );
}
