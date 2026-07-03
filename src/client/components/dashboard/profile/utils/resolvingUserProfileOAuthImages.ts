export function resolvingUserProfileOAuthImages(
  _profile: { avatarUrl?: string | null },
  _fallback?: string | null,
): { avatarUrl: string | null } {
  return { avatarUrl: null };
}
