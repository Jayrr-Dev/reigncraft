import type { DefiningPlazaButtonSfxKind } from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { DEFINING_PLAZA_BUTTON_SFX_KIND } from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { playingPlazaHomeScreenButtonSfx } from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { selectingPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/selectingPlazaHomeScreenButtonSfxClipId';

/**
 * Plays the resolved chest-close or custom book clip for one button press.
 */
export function notifyingPlazaDefaultButtonPressed(
  kind: DefiningPlazaButtonSfxKind
): void {
  switch (kind) {
    case DEFINING_PLAZA_BUTTON_SFX_KIND.none:
      return;
    case DEFINING_PLAZA_BUTTON_SFX_KIND.bookPageTurn:
      playingPlazaBookSfx({ actionId: 'page_turn' });
      return;
    case DEFINING_PLAZA_BUTTON_SFX_KIND.bookOpen:
      playingPlazaBookSfx({ actionId: 'open' });
      return;
    case DEFINING_PLAZA_BUTTON_SFX_KIND.bookClose:
      playingPlazaBookSfx({ actionId: 'close' });
      return;
    default:
      playingPlazaHomeScreenButtonSfx({
        clipId: selectingPlazaHomeScreenButtonSfxClipId(),
      });
  }
}
