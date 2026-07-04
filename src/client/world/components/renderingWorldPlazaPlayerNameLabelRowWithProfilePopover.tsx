'use client';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { RenderingWorldPlazaPlayerNameLabelAvatar } from '@/components/world/components/renderingWorldPlazaPlayerNameLabelAvatar';
import { RenderingWorldPlazaPlayerProfileModal } from '@/components/world/components/renderingWorldPlazaPlayerProfileModal';
import { RenderingWorldPlazaPlayerProfileStatusIcon } from '@/components/world/components/renderingWorldPlazaPlayerProfileStatusIcon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaPlayerNameLabelConstants';
import {
  DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_AVATAR_SIZE_PX,
  DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_MAX_WIDTH_PX,
  DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_STATUS_ICON_SIZE_CLASS,
} from '@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants';
import { usingWorldPlazaPlayerProfilePopoverOpenState } from '@/components/world/hooks/usingWorldPlazaPlayerProfilePopoverOpenState';
import {
  useCallback,
  useRef,
  type CSSProperties,
  type SyntheticEvent,
} from 'react';

/** Black outline-style shadow so white names stay readable on any tile. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_TEXT_SHADOW =
  '0 1px 2px #000, 0 0 1px #000, 1px 0 1px #000, -1px 0 1px #000, 0 -1px 1px #000' as const;

export interface RenderingWorldPlazaPlayerNameLabelRowWithProfilePopoverProps {
  /** Auth user id for the labeled player. */
  userId: string;
  /** Label shown above the avatar. */
  displayName: string;
  /** Lucide profile status badge shown to the right of the name. */
  profileStatusKind: CommunityMemberProfileStatusKind | null;
  /** Profile avatar shown to the left of the name. */
  avatarUrl: string | null;
  /** When false, renders the row without a profile modal (local player). */
  opensProfilePopover: boolean;
  /** Inner scale style so the row matches camera zoom. */
  scaleStyle: CSSProperties;
  /** Compact row stacked directly above the health bar. */
  layout?: 'default' | 'compact';
}

/**
 * Name tag row anchored above a plaza avatar. Remote players open a centered
 * profile modal instead of a popover anchored to the label.
 */
export function RenderingWorldPlazaPlayerNameLabelRowWithProfilePopover({
  userId,
  displayName,
  profileStatusKind,
  avatarUrl,
  opensProfilePopover,
  scaleStyle,
  layout = 'default',
}: RenderingWorldPlazaPlayerNameLabelRowWithProfilePopoverProps): React.JSX.Element {
  const rowContainerRef = useRef<HTMLDivElement>(null);
  const { isPopoverOpen, settingPopoverOpen, togglingPopoverOpen } =
    usingWorldPlazaPlayerProfilePopoverOpenState(rowContainerRef);

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const isCompact = layout === 'compact';
  const rowClassName = isCompact
    ? 'flex max-w-full select-none items-center justify-center gap-0.5 bg-transparent px-0 py-0 text-[8px] font-medium leading-none text-white font-sans'
    : 'flex max-w-full select-none items-center justify-center gap-1 bg-transparent px-2 py-0.5 text-[10px] font-semibold leading-tight text-white';
  const rowMaxWidth = isCompact
    ? DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_MAX_WIDTH_PX
    : DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_MAX_WIDTH_PX;
  const avatarSizePx = isCompact
    ? DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_AVATAR_SIZE_PX
    : undefined;

  return (
    <div ref={rowContainerRef} className="relative pointer-events-auto">
      <div
        className={rowClassName}
        style={{
          ...(isCompact ? {} : scaleStyle),
          maxWidth: rowMaxWidth,
        }}
      >
        {opensProfilePopover ? (
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: 'profile-avatar' }}
            className="shrink-0 cursor-pointer rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label={`View ${displayName}'s profile`}
            aria-expanded={isPopoverOpen}
            onPointerDown={stoppingPlazaWalkPointerPropagation}
            onClick={(event) => {
              stoppingPlazaWalkPointerPropagation(event);
              togglingPopoverOpen();
            }}
          >
            <RenderingWorldPlazaPlayerNameLabelAvatar
              avatarUrl={avatarUrl}
              displayName={displayName}
              sizePx={avatarSizePx}
            />
          </button>
        ) : (
          <RenderingWorldPlazaPlayerNameLabelAvatar
            avatarUrl={avatarUrl}
            displayName={displayName}
            sizePx={avatarSizePx}
          />
        )}
        <span
          className="truncate"
          style={{
            textShadow: RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_TEXT_SHADOW,
          }}
        >
          {displayName}
        </span>
        <RenderingWorldPlazaPlayerProfileStatusIcon
          statusKind={profileStatusKind}
          iconSizeClassName={
            isCompact
              ? DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_COMPACT_STATUS_ICON_SIZE_CLASS
              : undefined
          }
        />
      </div>
      {opensProfilePopover ? (
        <RenderingWorldPlazaPlayerProfileModal
          isOpen={isPopoverOpen}
          userId={userId}
          displayName={displayName}
          onClose={() => {
            settingPopoverOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
