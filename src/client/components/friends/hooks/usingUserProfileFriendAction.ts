'use client';

import {
  labelingUserProfileFriendToast,
  USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY,
} from '@/components/friends/domains/definingUserProfileFriend';
import { resolvingUserProfileIsFriendByViewer } from '@/components/friends/domains/resolvingUserProfileIsFriendByViewer';
import { usingUserProfileUnfriendedUserIds } from '@/components/friends/hooks/usingUserProfileUnfriendedUserIds';
import { togglingUserProfileUnfriendByViewer } from '@/components/friends/utils/togglingUserProfileUnfriendByViewer';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState, type RefObject } from 'react';

/** Params for {@link usingUserProfileFriendAction}. */
export type UsingUserProfileFriendActionParams = {
  profileUserId: string;
  profileDisplayName: string;
  viewerUserId: string;
  originRef?: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/**
 * Friend relationship actions for one profile.
 *
 * Everyone is a friend by default unless the viewer has unfriended them.
 */
export function usingUserProfileFriendAction({
  profileUserId,
  profileDisplayName,
  viewerUserId,
  enabled = true,
}: UsingUserProfileFriendActionParams) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const trimmedProfileUserId = profileUserId.trim();
  const trimmedViewerUserId = viewerUserId.trim();
  const trimmedProfileDisplayName = profileDisplayName.trim() || 'this player';

  const { unfriendedUserIds, isLoading } = usingUserProfileUnfriendedUserIds({
    viewerUserId: trimmedViewerUserId,
    enabled: enabled && trimmedViewerUserId.length > 0,
  });

  const isFriendByViewer = useMemo(
    () =>
      resolvingUserProfileIsFriendByViewer({
        profileUserId: trimmedProfileUserId,
        viewerUserId: trimmedViewerUserId,
        unfriendedUserIds,
      }),
    [trimmedProfileUserId, trimmedViewerUserId, unfriendedUserIds]
  );

  const resolvedTooltip = isFriendByViewer
    ? `Unfriend ${trimmedProfileDisplayName}`
    : `Add ${trimmedProfileDisplayName} back as a friend`;

  const act = useCallback((): void => {
    if (
      !enabled ||
      isPending ||
      !trimmedProfileUserId ||
      !trimmedViewerUserId ||
      trimmedProfileUserId === trimmedViewerUserId
    ) {
      return;
    }

    setIsPending(true);

    try {
      const result = togglingUserProfileUnfriendByViewer({
        viewerUserId: trimmedViewerUserId,
        profileUserId: trimmedProfileUserId,
        shouldUnfriend: isFriendByViewer,
      });

      void queryClient.setQueryData(
        [...USER_PROFILE_UNFRIENDED_USER_IDS_QUERY_KEY, trimmedViewerUserId],
        { userIds: result.unfriendedUserIds }
      );

      labelingUserProfileFriendToast(
        result.isFriendByViewer
          ? `Added ${trimmedProfileDisplayName} back as a friend`
          : `Unfriended ${trimmedProfileDisplayName}`
      );
    } finally {
      setIsPending(false);
    }
  }, [
    enabled,
    isFriendByViewer,
    isPending,
    queryClient,
    trimmedProfileDisplayName,
    trimmedProfileUserId,
    trimmedViewerUserId,
  ]);

  return {
    isFriendByViewer,
    hasPendingOutgoingRequest: false,
    hasPendingIncomingRequest: false,
    isRelationshipActive: isFriendByViewer,
    resolvedTooltip,
    isInteractive:
      enabled &&
      trimmedProfileUserId.length > 0 &&
      trimmedViewerUserId.length > 0 &&
      trimmedProfileUserId !== trimmedViewerUserId,
    isDeclineCooldownActive: false,
    isPending: isPending || isLoading,
    act,
  };
}
