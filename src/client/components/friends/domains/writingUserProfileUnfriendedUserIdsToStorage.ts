import { resolvingUserProfileUnfriendedUserIdsStorageKey } from '@/components/friends/domains/definingUserProfileFriend';

/**
 * Persists the viewer's unfriended user ids to localStorage.
 *
 * @param viewerUserId - Signed-in auth user id.
 * @param unfriendedUserIds - Auth user ids the viewer has unfriended.
 */
export function writingUserProfileUnfriendedUserIdsToStorage(
  viewerUserId: string,
  unfriendedUserIds: readonly string[]
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const trimmedViewerUserId = viewerUserId.trim();

  if (!trimmedViewerUserId) {
    return;
  }

  const normalizedUnfriendedUserIds = [
    ...new Set(
      unfriendedUserIds
        .map((userId) => userId.trim())
        .filter((userId) => userId.length > 0 && userId !== trimmedViewerUserId)
    ),
  ];

  try {
    localStorage.setItem(
      resolvingUserProfileUnfriendedUserIdsStorageKey(trimmedViewerUserId),
      JSON.stringify(normalizedUnfriendedUserIds)
    );
  } catch {
    // Quota exceeded or private browsing; fail silently.
  }
}
