/**
 * @module components/world/wildlife/domains/playingWildlifeStudySfx
 */

type PlayingWildlifeStudySfxHandler = () => void;

let playingWildlifeStudySfxHandler: PlayingWildlifeStudySfxHandler | null =
  null;

/**
 * Registers study-complete playback from {@link usingWildlifeStudySfx}.
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
 * Plays the Fantasy UI clip when a corpse Study channel completes.
 */
export function playingWildlifeStudySfx(): void {
  playingWildlifeStudySfxHandler?.();
}
