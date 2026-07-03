/**
 * Realtime position broadcast for plaza room movement sync.
 *
 * @module components/world/domains/definingWorldPlazaOnlineRoomPositionBroadcast
 */

/** Broadcast event for live avatar positions on the plaza room channel. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_EVENT =
  "world-plaza-room-position" as const;

/** Minimum interval between outgoing position broadcasts (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_INTERVAL_MS = 50;

/** Payload broadcast when a player moves in the plaza room. */
export interface DefiningWorldPlazaOnlineRoomPositionBroadcastPayload {
  user_id: string;
  display_name: string;
  x: number;
  y: number;
  updated_at: string;
}
