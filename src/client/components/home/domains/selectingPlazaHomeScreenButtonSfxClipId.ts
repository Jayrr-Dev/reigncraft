import {
  DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS,
  type DefiningPlazaHomeScreenButtonSfxClipId,
} from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';

let selectingPlazaHomeScreenButtonSfxClipIdCursor = 0;

/**
 * Picks the next chest-close variant for a home screen button click.
 */
export function selectingPlazaHomeScreenButtonSfxClipId(): DefiningPlazaHomeScreenButtonSfxClipId {
  const clipId =
    DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS[
      selectingPlazaHomeScreenButtonSfxClipIdCursor
    ];

  selectingPlazaHomeScreenButtonSfxClipIdCursor =
    (selectingPlazaHomeScreenButtonSfxClipIdCursor + 1) %
    DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS.length;

  return clipId;
}
