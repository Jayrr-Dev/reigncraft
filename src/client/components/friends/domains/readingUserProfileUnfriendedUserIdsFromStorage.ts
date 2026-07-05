import { resolvingUserProfileUnfriendedUserIdsStorageKey } from '@/components/friends/domains/definingUserProfileFriend';

/**
 * Reads the viewer's unfriended user ids from localStorage.
 *
 * @param viewerUserId - Signed-in auth user id.
 */
export function readingUserProfileUnfriendedUserIdsFromStorage(
  viewerUserId: string
): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const trimmedViewerUserId = viewerUserId.trim();

  if (!trimmedViewerUserId) {
    return [];
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingUserProfileUnfriendedUserIdsStorageKey(trimmedViewerUserId)
    );

    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return [
      ...new Set(
        parsedValue
          .filter((value): value is string => typeof value === 'string')
          .map((userId) => userId.trim())
          .filter(
            (userId) => userId.length > 0 && userId !== trimmedViewerUserId
          )
      ),
    ];
  } catch {
    return [];
  }
}
