'use client';

import { USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY } from '@/components/friends/domains/definingUserProfileFriend';
import { fetchingUserProfileUnfriendedUserIds } from '@/components/friends/utils/fetchingUserProfileUnfriendedUserIds';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/** Params for {@link usingUserProfileUnfriendedUserIds}. */
export type UsingUserProfileUnfriendedUserIdsParams = {
  viewerUserId: string | null;
  enabled?: boolean;
};

/**
 * Loads the viewer's unfriended user ids.
 */
export function usingUserProfileUnfriendedUserIds({
  viewerUserId,
  enabled = true,
}: UsingUserProfileUnfriendedUserIdsParams) {
  const trimmedViewerUserId = viewerUserId?.trim() ?? '';

  const query = useQuery({
    queryKey: [
      ...USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY,
      trimmedViewerUserId,
    ],
    queryFn: () => fetchingUserProfileUnfriendedUserIds(trimmedViewerUserId),
    enabled: enabled && trimmedViewerUserId.length > 0,
    staleTime: Infinity,
  });

  const unfriendedUserIds = useMemo(
    () => new Set(query.data?.userIds ?? []),
    [query.data?.userIds]
  );

  return {
    ...query,
    unfriendedUserIds,
  };
}
