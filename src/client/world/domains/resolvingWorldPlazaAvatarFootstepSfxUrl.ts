import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG,
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaAvatarFootstepClipId,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';

/**
 * Builds a browser-safe public URL for one avatar footstep clip.
 */
export function resolvingWorldPlazaAvatarFootstepSfxUrl(
  clipId: DefiningWorldPlazaAvatarFootstepClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG[clipId];
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
