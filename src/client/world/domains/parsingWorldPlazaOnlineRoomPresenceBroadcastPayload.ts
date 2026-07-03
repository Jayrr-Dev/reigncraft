import type {
  DefiningWorldPlazaOnlineRoomPresenceBroadcastKind,
  DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomPresenceBroadcast";

const DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_KINDS = new Set<
  DefiningWorldPlazaOnlineRoomPresenceBroadcastKind
>(["join", "leave"]);

/**
 * Validates a raw plaza presence broadcast payload from Supabase Realtime.
 *
 * @param payload - Untyped broadcast payload.
 */
export function parsingWorldPlazaOnlineRoomPresenceBroadcastPayload(
  payload: unknown,
): DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Partial<DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload>;
  const userId = record.user_id?.trim();
  const kind = record.kind;

  if (!userId || !kind || !DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_KINDS.has(kind)) {
    return null;
  }

  if (typeof record.x !== "number" || typeof record.y !== "number") {
    return null;
  }

  return {
    kind,
    user_id: userId,
    display_name: record.display_name?.trim() || "Member",
    x: record.x,
    y: record.y,
    updated_at: record.updated_at ?? new Date().toISOString(),
  };
}
