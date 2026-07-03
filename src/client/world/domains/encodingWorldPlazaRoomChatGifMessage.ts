import {
  DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_MESSAGE_PREFIX,
  DEFINING_WORLD_PLAZA_GIPHY_PREVIEW_URL_TEMPLATE,
} from "@/components/world/domains/definingWorldPlazaRoomChatGifConstants";

/** Valid GIPHY id characters inside encoded chat messages. */
const ENCODING_WORLD_PLAZA_ROOM_CHAT_GIF_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Encodes a GIPHY id as a plaza chat message payload.
 *
 * @param gifId - GIPHY media id.
 */
export function encodingWorldPlazaRoomChatGifMessage(gifId: string): string {
  return `${DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_MESSAGE_PREFIX}${gifId}`;
}

/**
 * Returns true when a chat message is an encoded GIPHY payload.
 *
 * @param message - Chat bubble text.
 */
export function checkingWorldPlazaRoomChatMessageIsGif(
  message: string,
): boolean {
  return message.startsWith(DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_MESSAGE_PREFIX);
}

/**
 * Extracts the GIPHY id from an encoded chat message, or null when invalid.
 *
 * @param message - Chat bubble text.
 */
export function parsingWorldPlazaRoomChatGifIdFromMessage(
  message: string,
): string | null {
  if (!checkingWorldPlazaRoomChatMessageIsGif(message)) {
    return null;
  }

  const gifId = message.slice(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_MESSAGE_PREFIX.length,
  );

  if (!gifId || !ENCODING_WORLD_PLAZA_ROOM_CHAT_GIF_ID_PATTERN.test(gifId)) {
    return null;
  }

  return gifId;
}

/**
 * Builds a fixed-size preview URL for a GIPHY id shown in chat bubbles.
 *
 * @param gifId - GIPHY media id.
 */
export function buildingWorldPlazaRoomChatGifPreviewUrl(gifId: string): string {
  return DEFINING_WORLD_PLAZA_GIPHY_PREVIEW_URL_TEMPLATE.replace("{id}", gifId);
}

/**
 * Resolves a chat bubble preview URL when the message is a GIF payload.
 *
 * @param message - Chat bubble text.
 */
export function resolvingWorldPlazaRoomChatGifPreviewUrlFromMessage(
  message: string,
): string | null {
  const gifId = parsingWorldPlazaRoomChatGifIdFromMessage(message);

  if (!gifId) {
    return null;
  }

  return buildingWorldPlazaRoomChatGifPreviewUrl(gifId);
}
