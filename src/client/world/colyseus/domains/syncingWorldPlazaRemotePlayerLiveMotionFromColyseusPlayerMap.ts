import { listingWorldPlazaRemotePlayerFromColyseusPlayer } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayerFromColyseusPlayer";
import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/** Iterable Colyseus player map exposed on synchronized room state. */
type SyncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMapParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Copies live avatar motion from Colyseus state into the Pixi registry.
 *
 * Mutates existing registry entries so high-frequency facing and position
 * updates never lose to timestamp comparisons.
 *
 * @param players - Synchronized player map from the joined room.
 * @param localSessionId - Current client session id to exclude.
 * @param localUserId - Auth user id to exclude.
 * @param registry - Map read every Pixi frame for remote avatars.
 */
export function syncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMap(
  players:
    | SyncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMapParams
    | undefined,
  localSessionId: string,
  localUserId: string,
  registry: Map<string, DefiningWorldPlazaRemotePlayer>,
): void {
  for (const [sessionId, player] of players?.entries() ?? []) {
    if (sessionId === localSessionId || player.userId === localUserId) {
      continue;
    }

    const userId = player.userId?.trim();

    if (!userId) {
      continue;
    }

    const existingPlayer = registry.get(userId);

    if (existingPlayer) {
      const listedPlayer = listingWorldPlazaRemotePlayerFromColyseusPlayer(player);

      existingPlayer.x = listedPlayer.x;
      existingPlayer.y = listedPlayer.y;
      existingPlayer.motionKind = listedPlayer.motionKind;
      existingPlayer.facingDirection = listedPlayer.facingDirection;
      existingPlayer.jumpStartedAtMs = listedPlayer.jumpStartedAtMs;
      existingPlayer.jumpArcPeakScreenPx = listedPlayer.jumpArcPeakScreenPx;
      existingPlayer.layer = listedPlayer.layer;
      continue;
    }

    registry.set(userId, listingWorldPlazaRemotePlayerFromColyseusPlayer(player));
  }
}
