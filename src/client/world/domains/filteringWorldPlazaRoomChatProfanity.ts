/**
 * Basic client-side profanity filter for plaza chat.
 *
 * @module components/world/domains/filteringWorldPlazaRoomChatProfanity
 */

/** Whole-word patterns replaced with asterisks before broadcast. */
const FILTERING_WORLD_PLAZA_ROOM_CHAT_PROFANITY_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|damn|cunt|nigger|faggot|retard)\b/gi,
] as const;

/** Replacement for matched profanity tokens. */
const FILTERING_WORLD_PLAZA_ROOM_CHAT_PROFANITY_REPLACEMENT = "****" as const;

/**
 * Replaces common profanity with a neutral placeholder.
 *
 * @param message - Raw chat text
 * @returns Filtered message safe to broadcast
 */
export function filteringWorldPlazaRoomChatProfanity(message: string): string {
  let filteredMessage = message;

  for (const pattern of FILTERING_WORLD_PLAZA_ROOM_CHAT_PROFANITY_PATTERNS) {
    filteredMessage = filteredMessage.replace(
      pattern,
      FILTERING_WORLD_PLAZA_ROOM_CHAT_PROFANITY_REPLACEMENT,
    );
  }

  return filteredMessage;
}
