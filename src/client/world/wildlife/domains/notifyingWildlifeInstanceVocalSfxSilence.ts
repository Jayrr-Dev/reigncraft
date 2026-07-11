/**
 * Stops in-flight wildlife vocals for one instance (death, despawn, etc.).
 *
 * @module components/world/wildlife/domains/notifyingWildlifeInstanceVocalSfxSilence
 */

export type NotifyingWildlifeInstanceVocalSfxSilencePayload = {
  instanceId: string;
};

export type NotifyingWildlifeInstanceVocalSfxSilenceListener = (
  payload: NotifyingWildlifeInstanceVocalSfxSilencePayload
) => void;

const notifyingWildlifeInstanceVocalSfxSilenceListeners =
  new Set<NotifyingWildlifeInstanceVocalSfxSilenceListener>();

/**
 * Registers a silence listener from a wildlife vocal SFX hook.
 */
export function registeringWildlifeInstanceVocalSfxSilenceListener(
  listener: NotifyingWildlifeInstanceVocalSfxSilenceListener
): () => void {
  notifyingWildlifeInstanceVocalSfxSilenceListeners.add(listener);

  return () => {
    notifyingWildlifeInstanceVocalSfxSilenceListeners.delete(listener);
  };
}

/**
 * Stops every active vocal play tracked for one wildlife instance.
 */
export function notifyingWildlifeInstanceVocalSfxSilence(
  payload: NotifyingWildlifeInstanceVocalSfxSilencePayload
): void {
  for (const listener of notifyingWildlifeInstanceVocalSfxSilenceListeners) {
    listener(payload);
  }
}
