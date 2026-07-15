import {
  DEFINING_WILDLIFE_STUDY_SFX_ASSET_BASE_URL,
  type DefiningWildlifeStudySfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';

const DEFINING_WILDLIFE_STUDY_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWildlifeStudySfxClipId,
  string
> = {
  study_learn: 'study-learn.ogg',
  chest_open: 'chest-open.ogg',
};

/**
 * Builds a browser-safe public URL for one study-complete clip.
 */
export function resolvingWildlifeStudySfxUrl(
  clipId: DefiningWildlifeStudySfxClipId
): string {
  const encodedBaseUrl = DEFINING_WILDLIFE_STUDY_SFX_ASSET_BASE_URL.split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WILDLIFE_STUDY_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
