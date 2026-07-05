/**
 * Resolves whether one profile is a friend of the viewer.
 *
 * Everyone is a friend by default unless the viewer has unfriended them.
 *
 * @module components/friends/domains/resolvingUserProfileIsFriendByViewer
 */

/** Input for {@link resolvingUserProfileIsFriendByViewer}. */
export type ResolvingUserProfileIsFriendByViewerInput = {
  profileUserId: string;
  viewerUserId: string | null;
  unfriendedUserIds: ReadonlySet<string>;
};

/**
 * Returns true when the viewer treats the profile as a friend.
 *
 * @param input - Profile id, viewer id, and unfriended ids for the viewer.
 */
export function resolvingUserProfileIsFriendByViewer({
  profileUserId,
  viewerUserId,
  unfriendedUserIds,
}: ResolvingUserProfileIsFriendByViewerInput): boolean {
  const trimmedProfileUserId = profileUserId.trim();
  const trimmedViewerUserId = viewerUserId?.trim() ?? '';

  if (!trimmedProfileUserId || !trimmedViewerUserId) {
    return false;
  }

  if (trimmedProfileUserId === trimmedViewerUserId) {
    return false;
  }

  return !unfriendedUserIds.has(trimmedProfileUserId);
}
