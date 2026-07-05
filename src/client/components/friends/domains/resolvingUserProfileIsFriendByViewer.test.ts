import { resolvingUserProfileIsFriendByViewer } from '@/components/friends/domains/resolvingUserProfileIsFriendByViewer';
import { describe, expect, it } from 'vitest';

describe('resolvingUserProfileIsFriendByViewer', () => {
  it('treats everyone as a friend unless unfriended', () => {
    const unfriendedUserIds = new Set(['user-b']);

    expect(
      resolvingUserProfileIsFriendByViewer({
        profileUserId: 'user-a',
        viewerUserId: 'viewer',
        unfriendedUserIds,
      })
    ).toBe(true);

    expect(
      resolvingUserProfileIsFriendByViewer({
        profileUserId: 'user-b',
        viewerUserId: 'viewer',
        unfriendedUserIds,
      })
    ).toBe(false);
  });

  it('returns false for self and missing ids', () => {
    expect(
      resolvingUserProfileIsFriendByViewer({
        profileUserId: 'viewer',
        viewerUserId: 'viewer',
        unfriendedUserIds: new Set(),
      })
    ).toBe(false);

    expect(
      resolvingUserProfileIsFriendByViewer({
        profileUserId: 'user-a',
        viewerUserId: null,
        unfriendedUserIds: new Set(),
      })
    ).toBe(false);
  });
});
