import { DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH } from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";

/** Result of inserting an emoji into a chat draft. */
export interface InsertingWorldPlazaRoomChatEmojiIntoDraftResult {
  /** Updated draft text. */
  nextDraft: string;
  /** Cursor position after insertion. */
  nextCursorPosition: number;
}

/**
 * Inserts an emoji into a chat draft at the current selection, respecting max length.
 *
 * @param draftMessage - Current draft text.
 * @param emoji - Emoji to insert.
 * @param selectionStart - Input selection start.
 * @param selectionEnd - Input selection end.
 * @param maxLength - Maximum allowed draft length.
 */
export function insertingWorldPlazaRoomChatEmojiIntoDraft(
  draftMessage: string,
  emoji: string,
  selectionStart: number,
  selectionEnd: number,
  maxLength: number = DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
): InsertingWorldPlazaRoomChatEmojiIntoDraftResult {
  const safeStart = Math.max(0, Math.min(selectionStart, draftMessage.length));
  const safeEnd = Math.max(safeStart, Math.min(selectionEnd, draftMessage.length));
  const beforeSelection = draftMessage.slice(0, safeStart);
  const afterSelection = draftMessage.slice(safeEnd);
  const nextDraft = `${beforeSelection}${emoji}${afterSelection}`.slice(
    0,
    maxLength,
  );
  const nextCursorPosition = Math.min(
    beforeSelection.length + emoji.length,
    nextDraft.length,
  );

  return {
    nextDraft,
    nextCursorPosition,
  };
}
