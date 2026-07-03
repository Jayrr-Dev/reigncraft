import type { CommunityMemberProfileStatusKind } from "@/components/community/domains/definingCommunityMemberProfileStatus";

/** Allowed profile status values broadcast over Colyseus. */
const PARSING_WORLD_PLAZA_USER_PROFILE_STATUS_KIND_ALLOWED_VALUES =
  new Set<CommunityMemberProfileStatusKind>([
    "admin",
    "founder",
    "prime_typologist",
    "typologist",
  ]);

/**
 * Parses a network status string into a community profile status kind.
 *
 * @param profileStatusKind - Raw value from Colyseus player state.
 */
export function parsingWorldPlazaUserProfileStatusKindForNetworkSync(
  profileStatusKind: string | null | undefined,
): CommunityMemberProfileStatusKind | null {
  const trimmedValue = profileStatusKind?.trim();

  if (
    !trimmedValue ||
    !PARSING_WORLD_PLAZA_USER_PROFILE_STATUS_KIND_ALLOWED_VALUES.has(
      trimmedValue as CommunityMemberProfileStatusKind,
    )
  ) {
    return null;
  }

  return trimmedValue as CommunityMemberProfileStatusKind;
}

/**
 * Serializes a profile status kind for Colyseus join options.
 *
 * @param profileStatusKind - Resolved local status badge, if any.
 */
export function serializingWorldPlazaUserProfileStatusKindForNetworkSync(
  profileStatusKind: CommunityMemberProfileStatusKind | null | undefined,
): string | undefined {
  if (!profileStatusKind) {
    return undefined;
  }

  return profileStatusKind;
}
