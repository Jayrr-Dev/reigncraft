"use client";

import {
  DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX,
} from "@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants";
import { resolvingWorldPlazaPlayerNameLabelAvatarInitial } from "@/components/world/domains/resolvingWorldPlazaPlayerNameLabelAvatarInitial";
import { useState } from "react";

/** Fallback fill when the avatar image fails to load. */
const RENDERING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_FALLBACK_CLASS =
  "bg-[#415a77] text-[9px] font-semibold uppercase text-white" as const;

export interface RenderingWorldPlazaPlayerNameLabelAvatarProps {
  /** Resolved avatar image URL. */
  avatarUrl: string | null;
  /** Display name used for initials fallback. */
  displayName: string;
}

/**
 * Small circular avatar shown to the left of a plaza player name tag.
 */
export function RenderingWorldPlazaPlayerNameLabelAvatar({
  avatarUrl,
  displayName,
}: RenderingWorldPlazaPlayerNameLabelAvatarProps): React.JSX.Element {
  const [hasImageError, setHasImageError] = useState(false);
  const avatarInitial = resolvingWorldPlazaPlayerNameLabelAvatarInitial(displayName);
  const showsImage = Boolean(avatarUrl) && !hasImageError;

  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
      style={{
        width: DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX,
        height: DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_AVATAR_SIZE_PX,
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
          aria-hidden
        >
          {avatarInitial}
        </span>
      )}
    </span>
  );
}
