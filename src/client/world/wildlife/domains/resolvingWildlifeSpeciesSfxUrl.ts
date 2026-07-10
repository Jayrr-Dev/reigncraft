import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG,
  type DefiningWildlifeFarmAnimalSfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';

/**
 * Builds a browser-safe public URL for one farm animal clip.
 */
export function resolvingWildlifeSpeciesSfxUrl(
  clipId: DefiningWildlifeFarmAnimalSfxClipId
): string {
  const clip = DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG[clipId];
  const encodedBaseUrl = DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL.split(
    '/'
  )
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
