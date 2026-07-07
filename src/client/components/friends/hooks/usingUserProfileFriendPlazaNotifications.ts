export function usingUserProfileFriendPlazaNotifications(_options?: {
  enabled?: boolean;
  currentUserId?: string | null;
  polling?: boolean;
}) {
  return {
    activeFriendPlazaNotification: null,
    acknowledgingFriendPlazaNotification: () => undefined,
    isAcknowledgingFriendPlazaNotification: false,
  };
}
