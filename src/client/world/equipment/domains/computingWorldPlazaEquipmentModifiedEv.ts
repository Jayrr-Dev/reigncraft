/**
 * Applies an equipment EV modifier to a base expected-value.
 *
 * @module components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv
 */

import type { DefiningWorldPlazaEquipmentEvModifier } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentEvModifier';

/**
 * Returns base unchanged when modifier is missing.
 * Additive: base + value. Multiplicative: base * value.
 */
export function computingWorldPlazaEquipmentModifiedEv(
  baseEv: number,
  modifier: DefiningWorldPlazaEquipmentEvModifier | undefined
): number {
  if (!modifier) {
    return baseEv;
  }

  if (modifier.mode === 'additive') {
    return baseEv + modifier.value;
  }

  return baseEv * modifier.value;
}
