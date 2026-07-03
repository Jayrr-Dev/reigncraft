export const COMMUNITY_PAGE_USERS_CARD_SKELETON_HEIGHT_CLASS = 'h-24' as const;

export type CommunityMemberProfile = {
  userId: string;
  username: string | null;
  alias: string | null;
  useAliasForCard?: boolean;
};
