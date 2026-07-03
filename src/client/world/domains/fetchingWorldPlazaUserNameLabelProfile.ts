import type { DefiningWorldPlazaUserNameLabelProfile } from "@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync";
import { fetchingWorldPlazaUserProfileAvatarUrl } from "@/components/world/domains/fetchingWorldPlazaUserProfileAvatarUrl";
import { fetchingWorldPlazaUserProfileStatusKind } from "@/components/world/domains/fetchingWorldPlazaUserProfileStatusKind";

/**
 * Loads avatar URL and status badge for the signed-in user's plaza name tag.
 */
export async function fetchingWorldPlazaUserNameLabelProfile(): Promise<DefiningWorldPlazaUserNameLabelProfile> {
  const [profileStatusKind, avatarUrl] = await Promise.all([
    fetchingWorldPlazaUserProfileStatusKind(),
    fetchingWorldPlazaUserProfileAvatarUrl(),
  ]);

  return {
    profileStatusKind,
    avatarUrl,
  };
}
