/**
 * @module components/home/domains/playingPlazaHomeScreenButtonSfx
 */

import type { DefiningPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';

export type PlayingPlazaHomeScreenButtonSfxRequest = {
  readonly clipId: DefiningPlazaHomeScreenButtonSfxClipId;
};

type PlayingPlazaHomeScreenButtonSfxHandler = (
  request: PlayingPlazaHomeScreenButtonSfxRequest
) => void;

let playingPlazaHomeScreenButtonSfxHandler: PlayingPlazaHomeScreenButtonSfxHandler | null =
  null;

/**
 * Registers home screen button playback from {@link usingPlazaHomeScreenButtonSfx}.
 */
export function registeringPlazaHomeScreenButtonSfxPlayback(
  handler: PlayingPlazaHomeScreenButtonSfxHandler
): () => void {
  playingPlazaHomeScreenButtonSfxHandler = handler;

  return () => {
    if (playingPlazaHomeScreenButtonSfxHandler === handler) {
      playingPlazaHomeScreenButtonSfxHandler = null;
    }
  };
}

/**
 * Plays a chest-close click clip for home screen buttons.
 */
export function playingPlazaHomeScreenButtonSfx(
  request: PlayingPlazaHomeScreenButtonSfxRequest
): void {
  playingPlazaHomeScreenButtonSfxHandler?.(request);
}
