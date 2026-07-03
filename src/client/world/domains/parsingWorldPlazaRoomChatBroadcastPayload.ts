import type { DefiningWorldPlazaOnlineRoomChatBroadcastPayload } from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import { trimmingWorldPlazaRoomChatMessage } from "@/components/world/domains/trimmingWorldPlazaRoomChatMessage";

/**
 * Validates an incoming Realtime broadcast payload for plaza chat.
 *
 * @param payload - Unknown broadcast payload
 * @returns Parsed payload or null when invalid
 */
export function parsingWorldPlazaRoomChatBroadcastPayload(
  payload: unknown,
): DefiningWorldPlazaOnlineRoomChatBroadcastPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const userId = record.user_id;
  const displayName = record.display_name;
  const rawMessage = record.message;
  const sentAt = record.sent_at;

  if (typeof userId !== "string" || !userId.trim()) {
    return null;
  }

  if (typeof displayName !== "string" || !displayName.trim()) {
    return null;
  }

  if (typeof rawMessage !== "string") {
    return null;
  }

  if (typeof sentAt !== "string" || Number.isNaN(Date.parse(sentAt))) {
    return null;
  }

  const message = trimmingWorldPlazaRoomChatMessage(
    rawMessage.slice(0, DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH),
  );

  if (!message) {
    return null;
  }

  const gridX = record.grid_x;
  const gridY = record.grid_y;

  return {
    user_id: userId.trim(),
    display_name: displayName.trim().slice(0, 32),
    message,
    sent_at: sentAt,
    grid_x: typeof gridX === "number" ? gridX : 0,
    grid_y: typeof gridY === "number" ? gridY : 0,
  };
}
