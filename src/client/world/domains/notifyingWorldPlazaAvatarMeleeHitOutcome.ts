/**
 * Bridges player melee hit outcomes to avatar melee SFX playback.
 *
 * @module components/world/domains/notifyingWorldPlazaAvatarMeleeHitOutcome
 */

export type NotifyingWorldPlazaAvatarMeleeHitOutcomeListener = (
  outcomeTier: string | null
) => void;

let notifyingWorldPlazaAvatarMeleeHitOutcomeListener: NotifyingWorldPlazaAvatarMeleeHitOutcomeListener | null =
  null;

/**
 * Registers the active avatar melee hit listener from {@link usingWorldPlazaAvatarMeleeSfx}.
 */
export function registeringWorldPlazaAvatarMeleeHitOutcomeListener(
  listener: NotifyingWorldPlazaAvatarMeleeHitOutcomeListener
): () => void {
  notifyingWorldPlazaAvatarMeleeHitOutcomeListener = listener;

  return () => {
    if (notifyingWorldPlazaAvatarMeleeHitOutcomeListener === listener) {
      notifyingWorldPlazaAvatarMeleeHitOutcomeListener = null;
    }
  };
}

/**
 * Notifies the active listener that a player melee hit resolved with a tier.
 */
export function notifyingWorldPlazaAvatarMeleeHitOutcome(
  outcomeTier: string | null
): void {
  notifyingWorldPlazaAvatarMeleeHitOutcomeListener?.(outcomeTier);
}
