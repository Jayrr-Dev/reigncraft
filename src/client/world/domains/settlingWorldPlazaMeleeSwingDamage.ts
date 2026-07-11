/**
 * Settles a completed melee swing exactly once.
 *
 * The swing state is shared between two independent frame loops (the avatar
 * Pixi tick and the DOM-overlay combat-lock loop). Whichever loop observes
 * completion first must register the damage; otherwise a new swing can
 * overwrite the state and silently drop the hit. `damageRegistered` is the
 * single-flight guard.
 *
 * @module components/world/domains/settlingWorldPlazaMeleeSwingDamage
 */

import type { DefiningWorldPlazaAvatarMeleePresentationState } from '@/components/world/domains/definingWorldPlazaAvatarCombatPresentationTypes';
import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';

export type SettlingWorldPlazaMeleeSwingDamageResult = {
  /** True when the swing duration has fully elapsed. */
  readonly isComplete: boolean;
  /** True when this call registered the damage (first observer wins). */
  readonly didRegisterDamage: boolean;
};

/**
 * Registers swing damage exactly once when the swing duration has elapsed.
 * Safe to call from multiple frame loops; later callers become no-ops.
 */
export function settlingWorldPlazaMeleeSwingDamage(
  melee: DefiningWorldPlazaAvatarMeleePresentationState | null,
  nowMs: number,
  applyDamage: (
    completedMelee: DefiningWorldPlazaAvatarMeleePresentationState
  ) => void
): SettlingWorldPlazaMeleeSwingDamageResult {
  if (!melee || nowMs - melee.startedAtMs < melee.durationMs) {
    return { isComplete: false, didRegisterDamage: false };
  }

  if (melee.damageRegistered) {
    return { isComplete: true, didRegisterDamage: false };
  }

  melee.damageRegistered = true;
  invokingWorldPlazaLoopBodySafely('combat:melee-settle', () => {
    applyDamage(melee);
  });
  return { isComplete: true, didRegisterDamage: true };
}
