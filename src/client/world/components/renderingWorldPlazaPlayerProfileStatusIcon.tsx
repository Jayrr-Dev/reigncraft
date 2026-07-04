'use client';

import {
  STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN_ICON_CLASS,
  STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER_ICON_CLASS,
  STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_ICON_CLASS,
  STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST_ICON_CLASS,
  type CommunityMemberProfileStatusKind,
} from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_STATUS_ICON_SIZE_CLASS } from '@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants';
import { cn } from '@/lib/utils';
import {
  BookType as BookTypeIcon,
  ChessKing as ChessKingIcon,
  ChessQueen as ChessQueenIcon,
  Crown as CrownIcon,
} from 'lucide-react';

/** Drop shadow so status icons stay visible over isometric tiles. */
const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_STATUS_ICON_SHADOW_CLASS =
  'drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]' as const;

export interface RenderingWorldPlazaPlayerProfileStatusIconProps {
  /** Resolved public profile status badge. */
  statusKind: CommunityMemberProfileStatusKind | null;
  /** Optional Tailwind size class override. */
  iconSizeClassName?: string;
}

/**
 * Lucide status icon beside a plaza player name (matches community profile cards).
 */
export function RenderingWorldPlazaPlayerProfileStatusIcon({
  statusKind,
  iconSizeClassName,
}: RenderingWorldPlazaPlayerProfileStatusIconProps): React.JSX.Element | null {
  if (!statusKind) {
    return null;
  }

  const iconClassName = cn(
    iconSizeClassName ??
      DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_STATUS_ICON_SIZE_CLASS,
    RENDERING_WORLD_PLAZA_PLAYER_PROFILE_STATUS_ICON_SHADOW_CLASS
  );

  if (statusKind === 'admin') {
    return (
      <ChessKingIcon
        className={cn(
          iconClassName,
          STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN_ICON_CLASS
        )}
        aria-hidden
      />
    );
  }

  if (statusKind === 'prime_typologist') {
    return (
      <CrownIcon
        className={cn(
          iconClassName,
          STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_ICON_CLASS
        )}
        aria-hidden
      />
    );
  }

  if (statusKind === 'typologist') {
    return (
      <BookTypeIcon
        className={cn(
          iconClassName,
          STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST_ICON_CLASS
        )}
        aria-hidden
      />
    );
  }

  return (
    <ChessQueenIcon
      className={cn(
        iconClassName,
        STYLING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER_ICON_CLASS
      )}
      aria-hidden
    />
  );
}
