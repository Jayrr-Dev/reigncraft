/**
 * @module components/world/wildlife/domains/playingWildlifeStudySfx
 */

import type { DefiningWildlifeStudySfxSectionId } from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';

export type PlayingWildlifeStudySfxRequest = {
  /** Reward / learn section; defaults to study completion volume. */
  readonly sectionId?: DefiningWildlifeStudySfxSectionId;
};

type PlayingWildlifeStudySfxHandler = (
  request: PlayingWildlifeStudySfxRequest
) => void;

let playingWildlifeStudySfxHandler: PlayingWildlifeStudySfxHandler | null =
  null;

/**
 * Registers study / reward playback from {@link usingWildlifeStudySfx}.
 */
export function registeringWildlifeStudySfxPlayback(
  handler: PlayingWildlifeStudySfxHandler
): () => void {
  playingWildlifeStudySfxHandler = handler;

  return () => {
    if (playingWildlifeStudySfxHandler === handler) {
      playingWildlifeStudySfxHandler = null;
    }
  };
}

/**
 * Plays the Fantasy UI study clip for study completion or a reward grant.
 */
export function playingWildlifeStudySfx(
  request: PlayingWildlifeStudySfxRequest = {}
): void {
  playingWildlifeStudySfxHandler?.(request);
}
