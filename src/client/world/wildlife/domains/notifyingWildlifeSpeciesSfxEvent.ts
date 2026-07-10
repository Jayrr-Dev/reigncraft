/**
 * Bridges wildlife simulation events to species vocal SFX playback.
 *
 * @module components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

export type NotifyingWildlifeSpeciesSfxEventPayload = {
  instanceId: string;
  speciesId: string;
  eventKind: DefiningWildlifeSpeciesSfxEventKind;
  worldPoint: DefiningWorldPlazaWorldPoint;
};

export type NotifyingWildlifeSpeciesSfxEventListener = (
  payload: NotifyingWildlifeSpeciesSfxEventPayload
) => void;

let notifyingWildlifeSpeciesSfxEventListener: NotifyingWildlifeSpeciesSfxEventListener | null =
  null;

/**
 * Registers the active species SFX listener from {@link usingWildlifeSpeciesSfx}.
 */
export function registeringWildlifeSpeciesSfxEventListener(
  listener: NotifyingWildlifeSpeciesSfxEventListener
): () => void {
  notifyingWildlifeSpeciesSfxEventListener = listener;

  return () => {
    if (notifyingWildlifeSpeciesSfxEventListener === listener) {
      notifyingWildlifeSpeciesSfxEventListener = null;
    }
  };
}

/**
 * Notifies the active listener that a species vocal SFX event occurred.
 */
export function notifyingWildlifeSpeciesSfxEvent(
  payload: NotifyingWildlifeSpeciesSfxEventPayload
): void {
  notifyingWildlifeSpeciesSfxEventListener?.(payload);
}
