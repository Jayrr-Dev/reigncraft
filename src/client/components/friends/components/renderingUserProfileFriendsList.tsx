'use client';

import { resolvingUserProfileIsFriendByViewer } from '@/components/friends/domains/resolvingUserProfileIsFriendByViewer';
import { usingUserProfileUnfriendedUserIds } from '@/components/friends/hooks/usingUserProfileUnfriendedUserIds';
import { cn } from '@/lib/utils';
import { Navigation } from 'lucide-react';

/** Props for {@link RenderingUserProfileFriendsList}. */
export type RenderingUserProfileFriendsListProps = {
  enabled?: boolean;
  plazaOnlineParticipants: ReadonlyArray<{
    userId: string;
    displayName: string;
  }>;
  currentUserId: string;
  trackedFriendUserId?: string | null;
  onToggleTrackFriend?: (friendUserId: string) => void;
  className?: string;
};

/**
 * Lists online plaza participants the viewer still considers friends.
 */
export function RenderingUserProfileFriendsList({
  enabled = true,
  plazaOnlineParticipants,
  currentUserId,
  trackedFriendUserId = null,
  onToggleTrackFriend,
  className,
}: RenderingUserProfileFriendsListProps): React.JSX.Element {
  const trimmedCurrentUserId = currentUserId.trim();

  const { unfriendedUserIds } = usingUserProfileUnfriendedUserIds({
    viewerUserId: trimmedCurrentUserId,
    enabled: enabled && trimmedCurrentUserId.length > 0,
  });

  const friendParticipants = plazaOnlineParticipants.filter((participant) =>
    resolvingUserProfileIsFriendByViewer({
      profileUserId: participant.userId,
      viewerUserId: trimmedCurrentUserId,
      unfriendedUserIds,
    })
  );

  if (!enabled) {
    return <div className={className} />;
  }

  if (friendParticipants.length === 0) {
    return (
      <div className={cn('px-2 py-3 text-xs text-white/60', className)}>
        No friends online in this room.
      </div>
    );
  }

  return (
    <ul className={cn('flex flex-col gap-1 px-2 py-2', className)}>
      {friendParticipants.map((participant) => {
        const isTracked = trackedFriendUserId === participant.userId;

        return (
          <li
            key={participant.userId}
            className="flex items-center gap-2 rounded-sm px-1 py-1 text-xs text-white/85"
          >
            <span className="min-w-0 flex-1 truncate font-medium">
              {participant.displayName}
            </span>
            {onToggleTrackFriend ? (
              <button
                type="button"
                aria-label={
                  isTracked
                    ? `Stop tracking ${participant.displayName}`
                    : `Track ${participant.displayName}`
                }
                title={
                  isTracked
                    ? `Stop tracking ${participant.displayName}`
                    : `Track ${participant.displayName}`
                }
                aria-pressed={isTracked}
                onClick={() => {
                  onToggleTrackFriend(participant.userId);
                }}
                className={cn(
                  'inline-flex size-6 shrink-0 items-center justify-center rounded-sm transition-colors',
                  isTracked
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'text-white/55 hover:bg-white/10 hover:text-white'
                )}
              >
                <Navigation className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
