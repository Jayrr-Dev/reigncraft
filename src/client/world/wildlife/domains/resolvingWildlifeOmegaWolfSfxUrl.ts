import {
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_CLIP_CATALOG,
  type DefiningWildlifeOmegaWolfSfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/**
 * Builds a browser-safe public URL for one Omega Wolf clip.
 */
export function resolvingWildlifeOmegaWolfSfxUrl(
  clipId: DefiningWildlifeOmegaWolfSfxClipId
): string {
  const clip = DEFINING_WILDLIFE_OMEGA_WOLF_SFX_CLIP_CATALOG[clipId];
  const encodedBaseUrl = DEFINING_WILDLIFE_OMEGA_WOLF_SFX_ASSET_BASE_URL.split(
    '/'
  )
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
