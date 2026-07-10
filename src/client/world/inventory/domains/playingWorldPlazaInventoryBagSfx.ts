/**
 * @module components/world/inventory/domains/playingWorldPlazaInventoryBagSfx
 */

import type { DefiningWorldPlazaInventoryBagSfxActionId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

export type PlayingWorldPlazaInventoryBagSfxRequest = {
  readonly actionId: DefiningWorldPlazaInventoryBagSfxActionId;
};

type PlayingWorldPlazaInventoryBagSfxHandler = (
  request: PlayingWorldPlazaInventoryBagSfxRequest
) => void;

let playingWorldPlazaInventoryBagSfxHandler: PlayingWorldPlazaInventoryBagSfxHandler | null =
  null;

/**
 * Registers bag pickup/drop playback from {@link usingWorldPlazaInventoryBagSfx}.
 */
export function registeringWorldPlazaInventoryBagSfxPlayback(
  handler: PlayingWorldPlazaInventoryBagSfxHandler
): () => void {
  playingWorldPlazaInventoryBagSfxHandler = handler;

  return () => {
    if (playingWorldPlazaInventoryBagSfxHandler === handler) {
      playingWorldPlazaInventoryBagSfxHandler = null;
    }
  };
}

/**
 * Plays inventory pickup or drop clips for plaza item grants and ground drops.
 */
export function playingWorldPlazaInventoryBagSfx(
  request: PlayingWorldPlazaInventoryBagSfxRequest
): void {
  playingWorldPlazaInventoryBagSfxHandler?.(request);
}
