import { playingPlazaHomeScreenButtonSfx } from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { selectingPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/selectingPlazaHomeScreenButtonSfxClipId';

/**
 * Plays the next chest-close click clip for a home screen button.
 */
export function notifyingPlazaHomeScreenButtonClicked(): void {
  playingPlazaHomeScreenButtonSfx({
    clipId: selectingPlazaHomeScreenButtonSfxClipId(),
  });
}
