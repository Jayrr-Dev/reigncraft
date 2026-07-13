import { checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import { checkingWorldPlazaAvatarSkinAccessForUser } from '@/components/world/domains/checkingWorldPlazaAvatarSkinAccessForUser';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS,
  type DefiningWorldPlazaAvatarSkinOption,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/**
 * Lists avatar skin options visible to one signed-in user.
 *
 * Animal skins also require the bestiary playable study tier for that species.
 *
 * @param username - Public username from {@code auth_user}.
 * @param alias - Optional alias from {@code auth_user}.
 * @param studyCountsBySpeciesId - Per-species bestiary study counts.
 */
export function listingWorldPlazaAvatarSkinOptionsForUser(
  username: string | null | undefined,
  alias: string | null | undefined,
  studyCountsBySpeciesId: Readonly<Partial<Record<string, number>>> = {}
): readonly DefiningWorldPlazaAvatarSkinOption[] {
  return DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.filter(
    (skinOption) =>
      checkingWorldPlazaAvatarSkinAccessForUser(
        skinOption.skinId,
        username,
        alias
      ) &&
      checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked(
        skinOption.skinId,
        studyCountsBySpeciesId
      )
  );
}
