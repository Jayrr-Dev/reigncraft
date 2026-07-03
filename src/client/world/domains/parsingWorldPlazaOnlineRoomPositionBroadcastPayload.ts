import type { DefiningWorldPlazaOnlineRoomPositionBroadcastPayload } from "@/components/world/domains/definingWorldPlazaOnlineRoomPositionBroadcast";

/**
 * Validates a raw plaza position broadcast payload from Supabase Realtime.
 *
 * @param payload - Untyped broadcast payload.
 */
export function parsingWorldPlazaOnlineRoomPositionBroadcastPayload(
  payload: unknown,
): DefiningWorldPlazaOnlineRoomPositionBroadcastPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Partial<DefiningWorldPlazaOnlineRoomPositionBroadcastPayload>;
  const userId = record.user_id?.trim();

  if (!userId) {
    return null;
  }

  if (typeof record.x !== "number" || typeof record.y !== "number") {
    return null;
  }

  return {
    user_id: userId,
    display_name: record.display_name?.trim() || "Member",
    x: record.x,
    y: record.y,
    updated_at: record.updated_at ?? new Date().toISOString(),
  };
}
