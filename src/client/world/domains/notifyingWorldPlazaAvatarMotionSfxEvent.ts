/**
 * Bridges avatar locomotion events to jump/roll SFX playback.
 *
 * @module components/world/domains/notifyingWorldPlazaAvatarMotionSfxEvent
 */

import type { DefiningWorldPlazaAvatarMotionSfxEventKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';

export type NotifyingWorldPlazaAvatarMotionSfxEventPayload = {
  /** Which motion one-shot should play. */
  eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind;
};

export type NotifyingWorldPlazaAvatarMotionSfxEventListener = (
  payload: NotifyingWorldPlazaAvatarMotionSfxEventPayload
) => void;

let notifyingWorldPlazaAvatarMotionSfxEventListener: NotifyingWorldPlazaAvatarMotionSfxEventListener | null =
  null;

/**
 * Registers the active motion SFX listener from {@link usingWorldPlazaAvatarMotionSfx}.
 */
export function registeringWorldPlazaAvatarMotionSfxEventListener(
  listener: NotifyingWorldPlazaAvatarMotionSfxEventListener
): () => void {
  notifyingWorldPlazaAvatarMotionSfxEventListener = listener;

  return () => {
    if (notifyingWorldPlazaAvatarMotionSfxEventListener === listener) {
      notifyingWorldPlazaAvatarMotionSfxEventListener = null;
    }
  };
}

/**
 * Notifies the active listener that a jump or roll motion event occurred.
 */
export function notifyingWorldPlazaAvatarMotionSfxEvent(
  payload: NotifyingWorldPlazaAvatarMotionSfxEventPayload
): void {
  notifyingWorldPlazaAvatarMotionSfxEventListener?.(payload);
}
