export function usingUserProfileFriendRequestPlazaDialogs(_options?: {
  enabled?: boolean;
  currentUserId?: string | null;
}) {
  return {
    activeFriendRequestDialog: null,
    acceptingFriendRequestDialog: () => undefined,
    decliningFriendRequestDialog: () => undefined,
    dismissingFriendRequestDialogLater: () => undefined,
    isRespondingToFriendRequestDialog: false,
  };
}
