/**
 * @module components/world/storage-chest/domains/playingWorldPlazaStorageChestSfx
 */

import type { DefiningWorldPlazaStorageChestSfxActionId } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';

export type PlayingWorldPlazaStorageChestSfxRequest = {
  readonly actionId: DefiningWorldPlazaStorageChestSfxActionId;
};

type PlayingWorldPlazaStorageChestSfxHandler = (
  request: PlayingWorldPlazaStorageChestSfxRequest
) => void;

let playingWorldPlazaStorageChestSfxHandler: PlayingWorldPlazaStorageChestSfxHandler | null =
  null;

/**
 * Registers lid open/close playback from {@link usingWorldPlazaStorageChestSfx}.
 */
export function registeringWorldPlazaStorageChestSfxPlayback(
  handler: PlayingWorldPlazaStorageChestSfxHandler
): () => void {
  playingWorldPlazaStorageChestSfxHandler = handler;

  return () => {
    if (playingWorldPlazaStorageChestSfxHandler === handler) {
      playingWorldPlazaStorageChestSfxHandler = null;
    }
  };
}

/**
 * Plays a storage chest lid open or close clip.
 */
export function playingWorldPlazaStorageChestSfx(
  request: PlayingWorldPlazaStorageChestSfxRequest
): void {
  playingWorldPlazaStorageChestSfxHandler?.(request);
}
