export type CommunityMemberProfileStatusKind =
  | 'admin'
  | 'founder'
  | 'prime_typologist'
  | 'typologist';

export const LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN = 'Admin' as const;
export const LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER = 'Founder' as const;
export const LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_TYPOLOGIST =
  'Community Owner' as const;
export const LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST =
  'Typologist' as const;
export const SIZING_COMMUNITY_MEMBER_PROFILE_STATUS_ICON_CLASS = 'h-4 w-4';
export const STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN_ICON_CLASS =
  'fill-black text-gray-500 shrink-0';
export const STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_ICON_CLASS =
  'text-amber-500 shrink-0';
export const STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST_ICON_CLASS =
  'text-gray-700 shrink-0';
export const STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER_ICON_CLASS =
  'fill-amber-400 text-amber-500 shrink-0';
