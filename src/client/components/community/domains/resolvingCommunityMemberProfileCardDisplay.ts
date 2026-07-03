import type { CommunityMemberProfile } from '@/components/community/domains/definingCommunityMemberProfile';

export function resolvingCommunityMemberProfileCardDisplay(
  profile: CommunityMemberProfile | null | undefined,
): { displayName: string } {
  return {
    displayName:
      profile?.alias ?? profile?.username ?? 'Player',
  };
}

export function resolvingCommunityMemberProfileDisplayName(
  profile: CommunityMemberProfile | null | undefined,
): string {
  return resolvingCommunityMemberProfileCardDisplay(profile).displayName;
}

export function resolvingCommunityMemberProfilePagePath(_userId: string): string {
  return '#';
}
