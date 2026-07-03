import type {
  UserProfileFriendsPage,
} from '@/components/friends/domains/definingUserProfileFriend';

export type FetchingUserProfileFriendsInput = {
  page?: number;
  pageSize?: number;
};

export async function fetchingUserProfileFriends(
  _input: FetchingUserProfileFriendsInput = {},
): Promise<UserProfileFriendsPage> {
  return { rows: [], totalCount: 0 };
}
