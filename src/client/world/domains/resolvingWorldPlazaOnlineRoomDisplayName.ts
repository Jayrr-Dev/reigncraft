/**
 * Resolves a display label for plaza presence from auth profile fields.
 *
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 * @param email - Account email fallback.
 */
export function resolvingWorldPlazaOnlineRoomDisplayName(
  username: string | null | undefined,
  alias: string | null | undefined,
  email: string | null | undefined,
): string {
  const trimmedUsername = username?.trim();

  if (trimmedUsername) {
    return trimmedUsername;
  }

  const trimmedAlias = alias?.trim();

  if (trimmedAlias) {
    return trimmedAlias;
  }

  const trimmedEmail = email?.trim();

  if (trimmedEmail) {
    return trimmedEmail.split("@")[0] ?? "Member";
  }

  return "Member";
}
