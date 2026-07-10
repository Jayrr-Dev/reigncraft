import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_CLIP_CATALOG,
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaAvatarMeleeClipId,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';

/**
 * Builds a browser-safe public URL for one avatar melee clip.
 */
export function resolvingWorldPlazaAvatarMeleeSfxUrl(
  clipId: DefiningWorldPlazaAvatarMeleeClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_AVATAR_MELEE_CLIP_CATALOG[clipId];
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_AVATAR_MELEE_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
