/**
 * Bridges avatar gameplay events to girl-sample voice SFX playback.
 *
 * @module components/world/domains/notifyingWorldPlazaGirlSampleVoiceSfxEvent
 */

import type { DefiningWorldPlazaGirlSampleVoiceSfxEventKind } from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

export type NotifyingWorldPlazaGirlSampleVoiceSfxEventPayload = {
  /** Which girl voice line should play. */
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind;
};

export type NotifyingWorldPlazaGirlSampleVoiceSfxEventListener = (
  payload: NotifyingWorldPlazaGirlSampleVoiceSfxEventPayload
) => void;

let notifyingWorldPlazaGirlSampleVoiceSfxEventListener: NotifyingWorldPlazaGirlSampleVoiceSfxEventListener | null =
  null;

/**
 * Registers the active girl voice listener from {@link usingWorldPlazaGirlSampleVoiceSfx}.
 */
export function registeringWorldPlazaGirlSampleVoiceSfxEventListener(
  listener: NotifyingWorldPlazaGirlSampleVoiceSfxEventListener
): () => void {
  notifyingWorldPlazaGirlSampleVoiceSfxEventListener = listener;

  return () => {
    if (notifyingWorldPlazaGirlSampleVoiceSfxEventListener === listener) {
      notifyingWorldPlazaGirlSampleVoiceSfxEventListener = null;
    }
  };
}

/**
 * Notifies the active listener that a girl voice event occurred.
 */
export function notifyingWorldPlazaGirlSampleVoiceSfxEvent(
  payload: NotifyingWorldPlazaGirlSampleVoiceSfxEventPayload
): void {
  notifyingWorldPlazaGirlSampleVoiceSfxEventListener?.(payload);
}
