import { DEFINING_REIGNCRAFT_TOASTER_ID } from '@/components/ui/domains/definingReigncraftToastConstants';
import { showingReigncraftToastSuccess } from '@/components/ui/domains/showingReigncraftToast';

export const PAGING_USER_PROFILE_FRIENDS_PAGE_SIZE = 20;
export const LABELING_USER_PROFILE_FRIENDS_PANEL_TITLE = 'Friends';
export const USER_PROFILE_FRIEND_REQUESTS_PENDING_COUNT_QUERY_KEY = [
  'friend-requests-pending-count',
] as const;
export const USER_PROFILE_FRIEND_REQUESTS_QUERY_KEY = [
  'friend-requests',
] as const;
export const USER_PROFILE_FRIEND_STATE_QUERY_KEY = ['friend-state'] as const;
export const USER_PROFILE_FRIENDS_QUERY_KEY = ['friends'] as const;
export const USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY = [
  'user-profile-unfriended-user-ids',
] as const;

/** localStorage key prefix for viewer-specific unfriended user ids. */
export const DEFINING_USER_PROFILE_UNFRIENDED_USER_IDS_STORAGE_KEY_PREFIX =
  'user-profile-unfriended-user-ids' as const;

/**
 * Resolves the localStorage key for one viewer's unfriended user ids.
 *
 * @param viewerUserId - Signed-in auth user id.
 */
export function resolvingUserProfileUnfriendedUserIdsStorageKey(
  viewerUserId: string
): string {
  return `${DEFINING_USER_PROFILE_UNFRIENDED_USER_IDS_STORAGE_KEY_PREFIX}:${viewerUserId.trim()}`;
}

export type UserProfileFriendRequestListMember = {
  requestId: string;
  fromUserId: string;
  displayName: string;
};

export type UserProfileFriendsPageRow = {
  userId: string;
};

export type UserProfileFriendsPage = {
  rows: UserProfileFriendsPageRow[];
  totalCount: number;
};

export function labelingUserProfileFriendToast(message: string): void {
  showingReigncraftToastSuccess(message, {
    toasterId: DEFINING_REIGNCRAFT_TOASTER_ID.global,
  });
}
