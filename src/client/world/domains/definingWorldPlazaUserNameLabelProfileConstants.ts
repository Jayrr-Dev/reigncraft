/** TanStack Query key for plaza name-tag profile metadata (avatar + status). */
export const DEFINING_WORLD_PLAZA_USER_NAME_LABEL_PROFILE_QUERY_KEY = [
  'world-plaza-user-name-label-profile',
] as const;

/** Maximum avatar URL length sent to Colyseus (bytes). */
export const DEFINING_WORLD_PLAZA_USER_NAME_LABEL_AVATAR_URL_MAX_NETWORK_LENGTH = 512;

/** Lucide status icon size beside plaza name tags (Tailwind class). */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_STATUS_ICON_SIZE_CLASS =
  'h-2.5 w-2.5' as const;

/** Circular avatar size beside plaza name tags (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX = 14;

/** Compact avatar size stacked above the health bar (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_AVATAR_SIZE_PX = 8;

/** Lucide status icon size beside compact health-bar name tags. */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_STATUS_ICON_SIZE_CLASS =
  'h-2 w-2' as const;

/** Max width for compact name text centered above the health bar. */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_MAX_WIDTH_PX = 64;
