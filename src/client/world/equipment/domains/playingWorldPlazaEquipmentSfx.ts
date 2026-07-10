/**
 * Imperative bridge from harvest progress milestones to equipment hit playback.
 *
 * @module components/world/equipment/domains/playingWorldPlazaEquipmentSfx
 */

import type { DefiningWorldPlazaEquipmentSfxToolActionId } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';
import type { DefiningWorldPlazaTimedInteractionMilestone } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

export type PlayingWorldPlazaEquipmentSfxRequest = {
  readonly toolActionId: DefiningWorldPlazaEquipmentSfxToolActionId;
  readonly milestone: DefiningWorldPlazaTimedInteractionMilestone;
};

type PlayingWorldPlazaEquipmentSfxHandler = (
  request: PlayingWorldPlazaEquipmentSfxRequest
) => void;

let playingWorldPlazaEquipmentSfxHandler: PlayingWorldPlazaEquipmentSfxHandler | null =
  null;

/**
 * Registers equipment hit playback from {@link usingWorldPlazaEquipmentSfx}.
 */
export function registeringWorldPlazaEquipmentSfxPlayback(
  handler: PlayingWorldPlazaEquipmentSfxHandler
): () => void {
  playingWorldPlazaEquipmentSfxHandler = handler;

  return () => {
    if (playingWorldPlazaEquipmentSfxHandler === handler) {
      playingWorldPlazaEquipmentSfxHandler = null;
    }
  };
}

/**
 * Plays one FilmCow impact clip for a harvest tool milestone pulse.
 */
export function playingWorldPlazaEquipmentSfx(
  request: PlayingWorldPlazaEquipmentSfxRequest
): void {
  playingWorldPlazaEquipmentSfxHandler?.(request);
}
