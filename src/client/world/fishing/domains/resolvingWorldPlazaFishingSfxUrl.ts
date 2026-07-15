/**
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingSfxUrl
 */

import {
  DEFINING_WORLD_PLAZA_FISHING_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaFishingSfxClipId,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';

const DEFINING_WORLD_PLAZA_FISHING_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaFishingSfxClipId,
  string
> = {
  cast_whoosh: 'cast-whoosh.ogg',
  junk_splash: 'junk-splash.ogg',
  reel_winding: 'reel-winding.ogg',
};

/** Builds a browser-safe public URL for one fishing clip. */
export function resolvingWorldPlazaFishingSfxUrl(
  clipId: DefiningWorldPlazaFishingSfxClipId
): string {
  const encodedBaseUrl = DEFINING_WORLD_PLAZA_FISHING_SFX_ASSET_BASE_URL.split(
    '/'
  )
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_FISHING_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
