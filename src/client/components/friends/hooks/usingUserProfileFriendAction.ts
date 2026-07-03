export function usingUserProfileFriendAction(_options?: {
  targetUserId?: string | null;
  enabled?: boolean;
}) {
  return {
    friendActionKind: 'none' as const,
    isLoading: false,
    performingFriendAction: () => undefined,
  };
}
