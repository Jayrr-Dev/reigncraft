export function usingUserProfileFriendPlazaNotifications(_options?: {
  enabled?: boolean;
}) {
  return {
    activeFriendPlazaNotification: null,
    acknowledgingFriendPlazaNotification: () => undefined,
    isAcknowledgingFriendPlazaNotification: false,
  };
}
