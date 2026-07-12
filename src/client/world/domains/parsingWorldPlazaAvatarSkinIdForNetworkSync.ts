import { checkingWorldPlazaAvatarSkinIdKnown } from '@/components/world/domains/checkingWorldPlazaAvatarSkinIdKnown';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/**
 * Parses a network skin string into a plaza avatar skin id.
 *
 * @param avatarSkinId - Raw value from Colyseus player state.
 */
export function parsingWorldPlazaAvatarSkinIdForNetworkSync(
  avatarSkinId: string | null | undefined
): DefiningWorldPlazaAvatarSkinId {
  const trimmedValue = avatarSkinId?.trim();

  if (trimmedValue && checkingWorldPlazaAvatarSkinIdKnown(trimmedValue)) {
    return trimmedValue;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
}

/**
 * Serializes a plaza avatar skin id for Colyseus join and profile messages.
 *
 * @param avatarSkinId - Locally selected avatar skin id.
 */
export function serializingWorldPlazaAvatarSkinIdForNetworkSync(
  avatarSkinId: DefiningWorldPlazaAvatarSkinId | null | undefined
): string {
  return parsingWorldPlazaAvatarSkinIdForNetworkSync(avatarSkinId);
}
