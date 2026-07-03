import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
} from "./definingWorldPlazaOnlineRoomChat";
import { parsingWorldPlazaRoomChatGifIdFromMessage } from "./encodingWorldPlazaRoomChatGifMessage";
import { filteringWorldPlazaRoomChatProfanity } from "./filteringWorldPlazaRoomChatProfanity";

/**
 * Trims, caps length, filters profanity, and rejects empty chat input.
 *
 * @param rawMessage - User input before send
 * @returns Sanitized message or null when nothing should be sent
 */
export function trimmingWorldPlazaRoomChatMessage(
  rawMessage: string,
): string | null {
  const trimmedMessage = rawMessage.trim();

  if (!trimmedMessage) {
    return null;
  }

  if (parsingWorldPlazaRoomChatGifIdFromMessage(trimmedMessage)) {
    return trimmedMessage.slice(
      0,
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
    );
  }

  const cappedMessage = trimmedMessage.slice(
    0,
    DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
  );
  const filteredMessage = filteringWorldPlazaRoomChatProfanity(cappedMessage);

  if (!filteredMessage.trim()) {
    return null;
  }

  return filteredMessage;
}
