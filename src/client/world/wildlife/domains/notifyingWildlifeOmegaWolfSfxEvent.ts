/**
 * Bridges wildlife simulation events to Omega Wolf SFX playback.
 *
 * @module components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeOmegaWolfSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

export type NotifyingWildlifeOmegaWolfSfxEventPayload = {
  /** Which Omega Wolf vocal / combat event fired. */
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind;
  /** World position of the Omega Wolf instance. */
  worldPoint: DefiningWorldPlazaWorldPoint;
};

export type NotifyingWildlifeOmegaWolfSfxEventListener = (
  payload: NotifyingWildlifeOmegaWolfSfxEventPayload
) => void;

let notifyingWildlifeOmegaWolfSfxEventListener: NotifyingWildlifeOmegaWolfSfxEventListener | null =
  null;

/**
 * Registers the active Omega Wolf SFX listener from {@link usingWildlifeOmegaWolfSfx}.
 */
export function registeringWildlifeOmegaWolfSfxEventListener(
  listener: NotifyingWildlifeOmegaWolfSfxEventListener
): () => void {
  notifyingWildlifeOmegaWolfSfxEventListener = listener;

  return () => {
    if (notifyingWildlifeOmegaWolfSfxEventListener === listener) {
      notifyingWildlifeOmegaWolfSfxEventListener = null;
    }
  };
}

/**
 * Notifies the active listener that an Omega Wolf SFX event occurred.
 */
export function notifyingWildlifeOmegaWolfSfxEvent(
  payload: NotifyingWildlifeOmegaWolfSfxEventPayload
): void {
  notifyingWildlifeOmegaWolfSfxEventListener?.(payload);
}
