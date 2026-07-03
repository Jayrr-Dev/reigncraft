import { DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHANNEL_PREFIX } from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/**
 * Builds the Supabase Realtime channel name for a plaza room shard.
 *
 * @param roomIndex - One-based shard index (1 = first room).
 */
export function buildingWorldPlazaOnlineRoomChannelName(
  roomIndex: number,
): string {
  return `${DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHANNEL_PREFIX}${roomIndex}`;
}
