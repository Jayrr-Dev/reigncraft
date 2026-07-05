import { readingUserProfileUnfriendedUserIdsFromStorage } from '@/components/friends/domains/readingUserProfileUnfriendedUserIdsFromStorage';

/** Payload from {@link fetchingUserProfileUnfriendedUserIds}. */
export type FetchingUserProfileUnfriendedUserIdsResult = {
  userIds: string[];
};

/**
 * Loads auth user ids the signed-in viewer has unfriended.
 *
 * @param viewerUserId - Signed-in auth user id.
 */
export async function fetchingUserProfileUnfriendedUserIds(
  viewerUserId: string
): Promise<FetchingUserProfileUnfriendedUserIdsResult> {
  const trimmedViewerUserId = viewerUserId.trim();

  if (!trimmedViewerUserId) {
    return { userIds: [] };
  }

  return {
    userIds:
      readingUserProfileUnfriendedUserIdsFromStorage(trimmedViewerUserId),
  };
}
