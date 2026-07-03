import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  type DefiningWorldPlazaAvatarSkinId,
} from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import { checkingWorldPlazaFoxPeachAvatarSkinAccessForUser } from "@/components/world/domains/checkingWorldPlazaFoxPeachAvatarSkinAccessForUser";

/**
 * Returns true when the signed-in user may select one plaza avatar skin.
 *
 * @param skinId - Candidate avatar skin id.
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 */
export function checkingWorldPlazaAvatarSkinAccessForUser(
  skinId: DefiningWorldPlazaAvatarSkinId,
  username: string | null | undefined,
  alias: string | null | undefined,
): boolean {
  if (skinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN.FOX_PEACH) {
    return checkingWorldPlazaFoxPeachAvatarSkinAccessForUser(username, alias);
  }

  return true;
}
