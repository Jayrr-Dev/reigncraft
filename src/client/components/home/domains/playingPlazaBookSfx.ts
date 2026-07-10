/**
 * @module components/home/domains/playingPlazaBookSfx
 */

import type { DefiningPlazaBookSfxActionId } from '@/components/home/domains/definingPlazaBookSfxConstants';

export type PlayingPlazaBookSfxRequest = {
  readonly actionId: DefiningPlazaBookSfxActionId;
};

type PlayingPlazaBookSfxHandler = (request: PlayingPlazaBookSfxRequest) => void;

let playingPlazaBookSfxHandler: PlayingPlazaBookSfxHandler | null = null;

/**
 * Registers book UI playback from {@link usingPlazaBookSfx}.
 */
export function registeringPlazaBookSfxPlayback(
  handler: PlayingPlazaBookSfxHandler
): () => void {
  playingPlazaBookSfxHandler = handler;

  return () => {
    if (playingPlazaBookSfxHandler === handler) {
      playingPlazaBookSfxHandler = null;
    }
  };
}

/**
 * Plays a book open, close, or page-turn clip for tutorial and lore UI.
 */
export function playingPlazaBookSfx(request: PlayingPlazaBookSfxRequest): void {
  playingPlazaBookSfxHandler?.(request);
}
