/**
 * Realtime join/leave broadcast for plaza room roster sync.
 *
 * @module components/world/domains/definingWorldPlazaOnlineRoomPresenceBroadcast
 */

/** Broadcast event for immediate join/leave visibility on the plaza room channel. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_EVENT =
  "world-plaza-room-presence" as const;

/** Join or leave signal for a plaza room participant. */
export type DefiningWorldPlazaOnlineRoomPresenceBroadcastKind = "join" | "leave";

/** Payload broadcast when a player enters or exits a plaza room shard. */
export interface DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload {
  kind: DefiningWorldPlazaOnlineRoomPresenceBroadcastKind;
  user_id: string;
  display_name: string;
  x: number;
  y: number;
  updated_at: string;
}
