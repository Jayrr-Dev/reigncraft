import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * One-shot click marker shown at the walk destination.
 */
export interface DefiningWorldPlazaClickArrowEffectState {
  /** Grid tile the player clicked. */
  targetGrid: DefiningWorldPlazaWorldPoint;
  /** Animation start timestamp from {@link Date.now}. */
  startedAtMs: number;
}
