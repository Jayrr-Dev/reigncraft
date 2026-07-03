import type { CommunityMemberProfile } from '@/components/community/domains/definingCommunityMemberProfile';

export function resolvingCommunityMemberProfileByUserIdQueryKey(userId: string) {
  return ['community-member-profile', userId] as const;
}

export async function fetchingCommunityMemberProfileByUserIdFromApi(
  _userId: string,
): Promise<CommunityMemberProfile | null> {
  return null;
}
