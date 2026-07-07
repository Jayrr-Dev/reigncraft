import type { DefiningWorldPlazaOnlineRoomSnapshot } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import { applyingWorldPlazaRemotePlayerLiveUpdate } from "@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate";
import { listingWorldPlazaRemotePlayersFromPresenceState } from "@/components/world/domains/listingWorldPlazaRemotePlayersFromPresenceState";
import type { RefObject } from "react";
import type { RealtimeChannel } from "@/lib/supabase/client";

/**
 * Adds any players found in Supabase presence without removing broadcast-managed remotes.
 *
 * @param channel - Active plaza room Realtime channel.
 * @param remotePlayerRegistryRef - Live registry updated by Realtime broadcast.
 * @param applySnapshotUpdate - Writes merged snapshot updates to TanStack Query.
 * @param localUserId - Auth user id to exclude from remotes.
 */
export function seedingWorldPlazaRemotePlayersFromPresenceChannel(
  channel: RealtimeChannel,
  remotePlayerRegistryRef: RefObject<Map<string, DefiningWorldPlazaRemotePlayer>>,
  applySnapshotUpdate: (
    updater: (
      snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
    ) => DefiningWorldPlazaOnlineRoomSnapshot,
  ) => void,
  localUserId: string,
): void {
  const presenceState = channel.presenceState() as Record<string, unknown[]>;
  const remotePlayers = listingWorldPlazaRemotePlayersFromPresenceState(
    presenceState,
    localUserId,
  );

  for (const remotePlayer of remotePlayers) {
    applyingWorldPlazaRemotePlayerLiveUpdate(
      remotePlayerRegistryRef,
      applySnapshotUpdate,
      remotePlayer,
      localUserId,
    );
  }
}
