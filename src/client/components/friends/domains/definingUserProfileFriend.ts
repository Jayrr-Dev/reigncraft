export const PAGING_USER_PROFILE_FRIENDS_PAGE_SIZE = 20;
export const LABELING_USER_PROFILE_FRIENDS_PANEL_TITLE = 'Friends';
export const USER_PROFILE_FRIEND_REQUESTS_PENDING_COUNT_QUERY_KEY = [
  'friend-requests-pending-count',
] as const;
export const USER_PROFILE_FRIEND_REQUESTS_QUERY_KEY = ['friend-requests'] as const;
export const USER_PROFILE_FRIEND_STATE_QUERY_KEY = ['friend-state'] as const;
export const USER_PROFILE_FRIENDS_QUERY_KEY = ['friends'] as const;

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

export function labelingUserProfileFriendToast(_message: string): void {
  // Phase 1: multiplayer/friends disabled.
}
