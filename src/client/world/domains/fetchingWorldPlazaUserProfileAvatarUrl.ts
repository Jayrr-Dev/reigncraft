import { resolvingUserProfileOAuthImages } from "@/components/dashboard/profile/utils/resolvingUserProfileOAuthImages";
import { trimmingWorldPlazaUserProfileAvatarUrlForNetworkSync } from "@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";

/**
 * Loads the signed-in user's avatar URL for plaza name tags.
 *
 * @returns Trimmed avatar URL, or null when unset or unavailable.
 */
export async function fetchingWorldPlazaUserProfileAvatarUrl(): Promise<
  string | null
> {
  if (!hasEnvVars) {
    return null;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return null;
  }

  const [{ data: authUserRow }, { data: profileRow }] = await Promise.all([
    supabase
      .from("auth_user")
      .select("avatar_img")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("user_profile")
      .select("avatar_img")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const metadata = user.user_metadata ?? {};
  const metadataAvatarUrl =
    (typeof metadata.avatar_url === "string" ? metadata.avatar_url : null) ??
    (typeof metadata.picture === "string" ? metadata.picture : null) ??
    (typeof metadata.image_url === "string" ? metadata.image_url : null);

  const { avatarUrl } = resolvingUserProfileOAuthImages(
    {
      avatar_img: profileRow?.avatar_img ?? null,
      cover_img: null,
    },
    authUserRow?.avatar_img || metadataAvatarUrl,
  );

  const trimmedAvatarUrl = avatarUrl.trim();

  if (!trimmedAvatarUrl) {
    return null;
  }

  return trimmingWorldPlazaUserProfileAvatarUrlForNetworkSync(trimmedAvatarUrl);
}
