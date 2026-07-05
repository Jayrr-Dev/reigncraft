import { readingUserProfileUnfriendedUserIdsFromStorage } from '@/components/friends/domains/readingUserProfileUnfriendedUserIdsFromStorage';
import { writingUserProfileUnfriendedUserIdsToStorage } from '@/components/friends/domains/writingUserProfileUnfriendedUserIdsToStorage';

/** Input for {@link togglingUserProfileUnfriendByViewer}. */
export type TogglingUserProfileUnfriendByViewerInput = {
  viewerUserId: string;
  profileUserId: string;
  shouldUnfriend: boolean;
};

/** Result from {@link togglingUserProfileUnfriendByViewer}. */
export type TogglingUserProfileUnfriendByViewerResult = {
  unfriendedUserIds: string[];
  isFriendByViewer: boolean;
};

/**
 * Adds or removes one profile from the viewer's unfriended list.
 *
 * @param input - Viewer id, target profile id, and desired unfriend state.
 */
export function togglingUserProfileUnfriendByViewer({
  viewerUserId,
  profileUserId,
  shouldUnfriend,
}: TogglingUserProfileUnfriendByViewerInput): TogglingUserProfileUnfriendByViewerResult {
  const trimmedViewerUserId = viewerUserId.trim();
  const trimmedProfileUserId = profileUserId.trim();

  if (!trimmedViewerUserId || !trimmedProfileUserId) {
    return {
      unfriendedUserIds: [],
      isFriendByViewer: false,
    };
  }

  const currentUnfriendedUserIds = new Set(
    readingUserProfileUnfriendedUserIdsFromStorage(trimmedViewerUserId)
  );

  if (shouldUnfriend) {
    currentUnfriendedUserIds.add(trimmedProfileUserId);
  } else {
    currentUnfriendedUserIds.delete(trimmedProfileUserId);
  }

  const unfriendedUserIds = [...currentUnfriendedUserIds];
  writingUserProfileUnfriendedUserIdsToStorage(
    trimmedViewerUserId,
    unfriendedUserIds
  );

  return {
    unfriendedUserIds,
    isFriendByViewer: !currentUnfriendedUserIds.has(trimmedProfileUserId),
  };
}
