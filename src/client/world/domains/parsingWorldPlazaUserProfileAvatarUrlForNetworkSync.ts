import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import { DEFINING_WORLD_PLAZA_USER_NAME_LABEL_AVATAR_URL_MAX_NETWORK_LENGTH } from "@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants";

/** Plaza name-tag profile metadata synced on Colyseus join. */
export interface DefiningWorldPlazaUserNameLabelProfile {
  profileStatusKind: CommunityMemberProfileStatusKind | null;
  avatarUrl: string | null;
}

/**
 * Truncates an avatar URL so it fits Colyseus join options.
 *
 * @param avatarUrl - Resolved avatar URL for display.
 */
export function trimmingWorldPlazaUserProfileAvatarUrlForNetworkSync(
  avatarUrl: string,
): string {
  return avatarUrl.slice(
    0,
    DEFINING_WORLD_PLAZA_USER_NAME_LABEL_AVATAR_URL_MAX_NETWORK_LENGTH,
  );
}

/**
 * Parses a network avatar URL for plaza name tags.
 *
 * @param avatarUrl - Raw value from Colyseus player state.
 */
export function parsingWorldPlazaUserProfileAvatarUrlForNetworkSync(
  avatarUrl: string | null | undefined,
): string | null {
  const trimmedValue = avatarUrl?.trim();

  if (!trimmedValue) {
    return null;
  }

  return trimmedValue;
}

/**
 * Serializes an avatar URL for Colyseus join options.
 *
 * @param avatarUrl - Resolved local avatar URL, if any.
 */
export function serializingWorldPlazaUserProfileAvatarUrlForNetworkSync(
  avatarUrl: string | null | undefined,
): string | undefined {
  const trimmedValue = avatarUrl?.trim();

  if (!trimmedValue) {
    return undefined;
  }

  return trimmingWorldPlazaUserProfileAvatarUrlForNetworkSync(trimmedValue);
}
