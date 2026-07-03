import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";

/** Allowed avatar skin ids broadcast over Colyseus. */
const PARSING_WORLD_PLAZA_AVATAR_SKIN_ID_ALLOWED_VALUES =
  new Set<DefiningWorldPlazaAvatarSkinId>([
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.GOLDEN_RETRIEVER,
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY,
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN,
  ]);

/**
 * Parses a network skin string into a plaza avatar skin id.
 *
 * @param avatarSkinId - Raw value from Colyseus player state.
 */
export function parsingWorldPlazaAvatarSkinIdForNetworkSync(
  avatarSkinId: string | null | undefined,
): DefiningWorldPlazaAvatarSkinId {
  const trimmedValue = avatarSkinId?.trim();

  if (
    trimmedValue &&
    PARSING_WORLD_PLAZA_AVATAR_SKIN_ID_ALLOWED_VALUES.has(
      trimmedValue as DefiningWorldPlazaAvatarSkinId,
    )
  ) {
    return trimmedValue as DefiningWorldPlazaAvatarSkinId;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
}

/**
 * Serializes a plaza avatar skin id for Colyseus join and profile messages.
 *
 * @param avatarSkinId - Locally selected avatar skin id.
 */
export function serializingWorldPlazaAvatarSkinIdForNetworkSync(
  avatarSkinId: DefiningWorldPlazaAvatarSkinId | null | undefined,
): string {
  return parsingWorldPlazaAvatarSkinIdForNetworkSync(avatarSkinId);
}
