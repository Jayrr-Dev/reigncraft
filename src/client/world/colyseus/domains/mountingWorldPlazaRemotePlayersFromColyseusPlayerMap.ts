import { listingWorldPlazaRemotePlayerFromColyseusPlayer } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayerFromColyseusPlayer";
import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type {
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import { applyingWorldPlazaRemotePlayerLiveUpdate } from "@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate";
import type { RefObject } from "react";

/** Iterable Colyseus player map exposed on synchronized room state. */
type MountingWorldPlazaRemotePlayersFromColyseusPlayerMapParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Ensures every remote Colyseus player is mounted in React state for Pixi avatars.
 *
 * Live motion sync mutates the registry directly. Remote sprites only mount when
 * `roomSnapshot.remotePlayers` includes the user id, so this bridges that gap.
 *
 * @param players - Synchronized player map from the joined room.
 * @param localSessionId - Current client session id to exclude.
 * @param localUserId - Auth user id to exclude.
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param applySnapshotUpdate - Writes the merged snapshot to TanStack Query.
 */
export function mountingWorldPlazaRemotePlayersFromColyseusPlayerMap(
  players: MountingWorldPlazaRemotePlayersFromColyseusPlayerMapParams | undefined,
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
  for (const [sessionId, player] of players?.entries() ?? []) {
    if (sessionId === localSessionId || player.userId === localUserId) {
      continue;
    }

    const userId = player.userId?.trim();

    if (!userId) {
      continue;
    }

    applyingWorldPlazaRemotePlayerLiveUpdate(
      remotePlayerRegistryRef,
      applySnapshotUpdate,
      listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
      localUserId,
    );
  }
}
