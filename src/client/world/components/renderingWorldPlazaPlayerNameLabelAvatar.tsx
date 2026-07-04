'use client';

import { DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX } from '@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants';
import { resolvingWorldPlazaPlayerNameLabelAvatarInitial } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelAvatarInitial';
import { useState } from 'react';

/** Fallback fill when the avatar image fails to load. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_FALLBACK_CLASS =
  'bg-[#415a77] font-semibold uppercase text-white' as const;

export interface RenderingWorldPlazaPlayerNameLabelAvatarProps {
  /** Resolved avatar image URL. */
  avatarUrl: string | null;
  /** Display name used for initials fallback. */
  displayName: string;
  /** Optional pixel size override (defaults to standard name-tag size). */
  sizePx?: number;
}

/**
 * Small circular avatar shown to the left of a plaza player name tag.
 */
export function RenderingWorldPlazaPlayerNameLabelAvatar({
  avatarUrl,
  displayName,
  sizePx = DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX,
}: RenderingWorldPlazaPlayerNameLabelAvatarProps): React.JSX.Element {
  const [hasImageError, setHasImageError] = useState(false);
  const avatarInitial =
    resolvingWorldPlazaPlayerNameLabelAvatarInitial(displayName);
  const showsImage = Boolean(avatarUrl) && !hasImageError;

  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
      style={{
        width: sizePx,
        height: sizePx,
      }}
    >
      {showsImage ? (
        <img
          src={avatarUrl ?? undefined}
          alt=""
          aria-hidden
          className="size-full object-cover"
          onError={() => {
            setHasImageError(true);
          }}
        />
      ) : (
        <span
          className={`flex size-full items-center justify-center ${RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_FALLBACK_CLASS}`}
          style={{ fontSize: Math.max(6, Math.round(sizePx * 0.55)) }}
          aria-hidden
        >
          {avatarInitial}
        </span>
      )}
    </span>
  );
}
