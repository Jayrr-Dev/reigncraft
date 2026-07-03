import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import { listingWorldPlazaRemotePlayerFromColyseusPlayer } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayerFromColyseusPlayer";

/**
 * Updates live avatar coordinates in the Pixi registry without touching React state.
 *
 * @param registry - Map read every Pixi frame for remote avatars.
 * @param player - Synchronized Colyseus player schema.
 * @param localUserId - Auth user id to ignore.
 */
export function syncingWorldPlazaRemotePlayerPositionInRegistry(
  registry: Map<string, DefiningWorldPlazaRemotePlayer>,
  player: DefiningWorldPlazaColyseusPlayer,
  localUserId: string,
): void {
  if (player.userId === localUserId) {
    return;
  }

  const existingPlayer = registry.get(player.userId);

  if (existingPlayer) {
    existingPlayer.x = player.x;
    existingPlayer.y = player.y;
    return;
  }

  registry.set(
    player.userId,
    listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
  );
}
