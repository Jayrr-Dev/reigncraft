import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import type { RefObject } from "react";

/**
 * Resolves a tracked friend's live grid position from the remote player registry.
 *
 * @param remotePlayerRegistryRef - Live Colyseus remote player map
 * @param trackedFriendUserId - Friend auth user id to track
 */
export function resolvingWorldPlazaTrackedFriendWorldPoint(
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>,
  trackedFriendUserId: string | null,
): DefiningWorldPlazaWorldPoint | null {
  if (!trackedFriendUserId) {
    return null;
  }

  const remotePlayer = remotePlayerRegistryRef.current?.get(trackedFriendUserId);

  if (!remotePlayer) {
    return null;
  }

  return {
    x: remotePlayer.x,
    y: remotePlayer.y,
    layer: remotePlayer.layer,
  };
}
