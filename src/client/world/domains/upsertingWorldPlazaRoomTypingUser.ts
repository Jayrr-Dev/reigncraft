import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_EXPIRY_MS,
  type DefiningWorldPlazaOnlineRoomTypingUser,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";

export interface UpsertingWorldPlazaRoomTypingUserParams {
  /** Current typing users. */
  typingUsers: readonly DefiningWorldPlazaOnlineRoomTypingUser[];
  /** Stable id of the typist. */
  userId: string;
  /** Display name for the typist. */
  displayName: string;
  /** Typist grid X when the state was reported. */
  anchorGridX: number;
  /** Typist grid Y when the state was reported. */
  anchorGridY: number;
  /** Current timestamp for the expiry window. */
  nowMs: number;
}

/**
 * Adds or refreshes a typing user with a rolling expiry (one entry per user).
 *
 * @param params - Current list, typist identity, position, and timestamp.
 */
export function upsertingWorldPlazaRoomTypingUser({
  typingUsers,
  userId,
  displayName,
  anchorGridX,
  anchorGridY,
  nowMs,
}: UpsertingWorldPlazaRoomTypingUserParams): DefiningWorldPlazaOnlineRoomTypingUser[] {
  const withoutSameUser = typingUsers.filter(
    (typingUser) => typingUser.userId !== userId,
  );

  return [
    ...withoutSameUser,
    {
      userId,
      displayName,
      anchorGridX,
      anchorGridY,
      expiresAt: nowMs + DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_EXPIRY_MS,
    },
  ];
}

/**
 * Removes a typing user (typing stopped or sender left).
 *
 * @param typingUsers - Current typing users.
 * @param userId - Typist id to drop.
 */
export function removingWorldPlazaRoomTypingUser(
  typingUsers: readonly DefiningWorldPlazaOnlineRoomTypingUser[],
  userId: string,
): DefiningWorldPlazaOnlineRoomTypingUser[] {
  return typingUsers.filter((typingUser) => typingUser.userId !== userId);
}
