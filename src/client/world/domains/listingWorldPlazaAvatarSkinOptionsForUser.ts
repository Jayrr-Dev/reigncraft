import { checkingWorldPlazaAvatarSkinAccessForUser } from "@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser";
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS,
  type DefiningWorldPlazaAvatarSkinOption,
} from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";

/**
 * Lists avatar skin options visible to one signed-in user.
 *
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 */
export function listingWorldPlazaAvatarSkinOptionsForUser(
  username: string | null | undefined,
  alias: string | null | undefined,
): readonly DefiningWorldPlazaAvatarSkinOption[] {
  return DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.filter((skinOption) =>
    checkingWorldPlazaAvatarSkinAccessForUser(
      skinOption.skinId,
      username,
      alias,
    ),
  );
}
