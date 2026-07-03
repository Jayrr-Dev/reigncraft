import type { DefiningWorldPlazaOnlineRoomSnapshot } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import {
  countingWorldPlazaPresenceParticipants,
  listingWorldPlazaRemotePlayersFromPresenceState,
} from "@/components/world/domains/listingWorldPlazaRemotePlayersFromPresenceState";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Reads Supabase presence state from a channel and returns a room snapshot patch.
 *
 * @param channel - Active plaza room Realtime channel.
 * @param localUserId - Authenticated user id to exclude from remotes.
 */
export function syncingWorldPlazaOnlineRoomPresenceSnapshot(
  channel: RealtimeChannel,
  localUserId: string,
): Pick<
  DefiningWorldPlazaOnlineRoomSnapshot,
  "remotePlayers" | "participantCount"
> {
  const presenceState = channel.presenceState() as Record<string, unknown[]>;

  return {
    remotePlayers: listingWorldPlazaRemotePlayersFromPresenceState(
      presenceState,
      localUserId,
    ),
    participantCount: countingWorldPlazaPresenceParticipants(presenceState),
  };
}
