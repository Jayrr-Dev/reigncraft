import { DEFINING_WORLD_PLAZA_FOX_PEACH_AVATAR_SKIN_ALLOWED_USERNAMES } from "@/components/world/domains/definingWorldPlazaFoxPeachAvatarSkinAccessConstants";

/**
 * Normalizes one auth profile label for case-insensitive allowlist matching.
 *
 * @param profileLabel - Username or alias from {@code auth_user}.
 */
function normalizingWorldPlazaFoxPeachAvatarSkinAccessProfileLabel(
  profileLabel: string | null | undefined,
): string | null {
  const trimmedProfileLabel = profileLabel?.trim();

  if (!trimmedProfileLabel) {
    return null;
  }

  return trimmedProfileLabel.toLowerCase();
}

/**
 * Returns true when the signed-in user may use the Fox Peach avatar skin.
 *
 * Matches against both username and alias so either public label can unlock access.
 *
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 */
export function checkingWorldPlazaFoxPeachAvatarSkinAccessForUser(
  username: string | null | undefined,
  alias: string | null | undefined,
): boolean {
  const normalizedProfileLabels = new Set(
    [
      normalizingWorldPlazaFoxPeachAvatarSkinAccessProfileLabel(username),
      normalizingWorldPlazaFoxPeachAvatarSkinAccessProfileLabel(alias),
    ].filter((profileLabel): profileLabel is string => profileLabel !== null),
  );

  return DEFINING_WORLD_PLAZA_FOX_PEACH_AVATAR_SKIN_ALLOWED_USERNAMES.some(
    (allowedUsername) =>
      normalizedProfileLabels.has(allowedUsername.toLowerCase()),
  );
}
