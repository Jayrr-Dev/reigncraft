import { checkingWorldPlazaAvatarSkinAccessForUser } from "@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser";
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";

/**
 * Resolves an avatar skin id the current user is allowed to wear.
 *
 * Falls back to the default skin when the requested skin is restricted.
 *
 * @param skinId - Locally selected avatar skin id.
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 */
export function resolvingWorldPlazaValidatedAvatarSkinId(
  skinId: DefiningWorldPlazaAvatarSkinId,
  username: string | null | undefined,
  alias: string | null | undefined,
): DefiningWorldPlazaAvatarSkinId {
  if (checkingWorldPlazaAvatarSkinAccessForUser(skinId, username, alias)) {
    return skinId;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
}
