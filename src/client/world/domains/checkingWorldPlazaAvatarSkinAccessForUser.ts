import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/**
 * Returns true when the signed-in user may select one plaza avatar skin.
 *
 * @param skinId - Candidate avatar skin id.
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 */
export function checkingWorldPlazaAvatarSkinAccessForUser(
  _skinId: DefiningWorldPlazaAvatarSkinId,
  _username: string | null | undefined,
  _alias: string | null | undefined
): boolean {
  return true;
}
