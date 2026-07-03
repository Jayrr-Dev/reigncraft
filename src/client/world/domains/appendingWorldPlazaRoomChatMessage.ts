import type {
  DefiningWorldPlazaOnlineRoomChatBubble,
  DefiningWorldPlazaOnlineRoomChatBroadcastPayload,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_DURATION_MS,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";

/**
 * Builds a bubble id from broadcast payload fields.
 *
 * @param payload - Validated chat broadcast payload
 */
export function buildingWorldPlazaRoomChatBubbleId(
  payload: DefiningWorldPlazaOnlineRoomChatBroadcastPayload,
): string {
  return `${payload.user_id}:${payload.sent_at}`;
}

/**
 * Appends or replaces the bubble for a user (one active bubble per player).
 *
 * @param bubbles - Current active bubbles
 * @param payload - Validated incoming message
 * @param nowMs - Current timestamp for expiry
 */
export function appendingWorldPlazaRoomChatMessage(
  bubbles: readonly DefiningWorldPlazaOnlineRoomChatBubble[],
  payload: DefiningWorldPlazaOnlineRoomChatBroadcastPayload,
  nowMs: number = Date.now(),
): DefiningWorldPlazaOnlineRoomChatBubble[] {
  const nextBubble: DefiningWorldPlazaOnlineRoomChatBubble = {
    id: buildingWorldPlazaRoomChatBubbleId(payload),
    userId: payload.user_id,
    displayName: payload.display_name,
    message: payload.message,
    expiresAt: nowMs + DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_DURATION_MS,
    anchorGridX: payload.grid_x,
    anchorGridY: payload.grid_y,
  };

  const withoutSameUser = bubbles.filter(
    (bubble) => bubble.userId !== payload.user_id,
  );

  return [...withoutSameUser, nextBubble];
}
