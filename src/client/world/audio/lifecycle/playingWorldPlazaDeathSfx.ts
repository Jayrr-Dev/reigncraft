/**
 * @module components/world/audio/lifecycle/playingWorldPlazaDeathSfx
 */

type PlayingWorldPlazaDeathSfxHandler = () => void;

let playingWorldPlazaDeathSfxHandler: PlayingWorldPlazaDeathSfxHandler | null =
  null;

/**
 * Registers player-death playback from {@link usingWorldPlazaDeathSfx}.
 */
export function registeringWorldPlazaDeathSfxPlayback(
  handler: PlayingWorldPlazaDeathSfxHandler
): () => void {
  playingWorldPlazaDeathSfxHandler = handler;

  return () => {
    if (playingWorldPlazaDeathSfxHandler === handler) {
      playingWorldPlazaDeathSfxHandler = null;
    }
  };
}

/**
 * Plays the impact boom when the local player dies.
 */
export function playingWorldPlazaDeathSfx(): void {
  playingWorldPlazaDeathSfxHandler?.();
}
