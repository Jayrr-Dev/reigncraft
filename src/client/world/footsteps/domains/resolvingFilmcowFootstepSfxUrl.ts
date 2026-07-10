import {
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL,
  DEFINING_NOX_FOOTSTEP_SFX_ASSET_BASE_URL,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Builds a browser-safe public URL for one plaza footstep clip.
 */
export function resolvingFilmcowFootstepSfxUrl(
  clipId: DefiningFilmcowFootstepClipId
): string {
  const clip = DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG[clipId];
  const assetBaseUrl =
    clip.assetPack === 'nox'
      ? DEFINING_NOX_FOOTSTEP_SFX_ASSET_BASE_URL
      : DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL;
  const encodedBaseUrl = assetBaseUrl
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
