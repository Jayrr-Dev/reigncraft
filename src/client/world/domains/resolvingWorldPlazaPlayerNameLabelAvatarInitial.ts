/**
 * Returns a single initial for plaza name-tag avatar fallbacks.
 *
 * @param displayName - Player display name.
 */
export function resolvingWorldPlazaPlayerNameLabelAvatarInitial(
  displayName: string,
): string {
  const trimmedDisplayName = displayName.trim();

  if (!trimmedDisplayName) {
    return "?";
  }

  return trimmedDisplayName.charAt(0).toUpperCase();
}
