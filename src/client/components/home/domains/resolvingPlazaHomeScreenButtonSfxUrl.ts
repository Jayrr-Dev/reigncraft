import {
  DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_ASSET_BASE_URL,
  type DefiningPlazaHomeScreenButtonSfxClipId,
} from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';

const DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningPlazaHomeScreenButtonSfxClipId,
  string
> = {
  chest_close_01: 'chest-close-01.ogg',
  chest_close_02: 'chest-close-02.ogg',
};

/**
 * Builds a browser-safe public URL for one home screen button clip.
 */
export function resolvingPlazaHomeScreenButtonSfxUrl(
  clipId: DefiningPlazaHomeScreenButtonSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
