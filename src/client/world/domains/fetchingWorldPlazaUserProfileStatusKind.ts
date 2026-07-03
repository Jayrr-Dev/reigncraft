import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";
import { resolvingCommunityMemberProfileStatusKind } from "@/components/community/domains/resolvingCommunityMemberProfileStatus";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";

/**
 * Loads the signed-in user's public profile status badge for plaza name tags.
 *
 * @returns Resolved status kind, or null when the member has no badge.
 */
export async function fetchingWorldPlazaUserProfileStatusKind(): Promise<
  CommunityMemberProfileStatusKind | null
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

  const [{ data: isAdmin }, { data: authUserRow }, { data: typologistRow }] =
    await Promise.all([
      supabase.rpc("is_admin"),
      supabase
        .from("auth_user")
        .select("is_founder")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("typologist_user")
        .select("is_active, is_prime")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  return resolvingCommunityMemberProfileStatusKind({
    userId: user.id,
    isFounder: Boolean(authUserRow?.is_founder),
    isTypologist: Boolean(typologistRow?.is_active),
    isPrime: Boolean(typologistRow?.is_prime),
    hasAdminRole: Boolean(isAdmin),
  });
}
