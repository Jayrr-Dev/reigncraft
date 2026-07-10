import {
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Builds a browser-safe public URL for one FilmCow footstep clip.
 */
export function resolvingFilmcowFootstepSfxUrl(
  clipId: DefiningFilmcowFootstepClipId
): string {
  const clip = DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG[clipId];
  const encodedBaseUrl = DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL.split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
