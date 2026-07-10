/**
 * Additive or multiplicative EV modifiers for equipped items.
 *
 * @module components/world/equipment/domains/definingWorldPlazaEquipmentEvModifier
 */

/** How an equipment EV modifier combines with the player's base EV. */
export type DefiningWorldPlazaEquipmentEvModifierMode =
  | 'additive'
  | 'multiplicative';

/** One attack or defense EV modifier on an equipment item. */
export type DefiningWorldPlazaEquipmentEvModifier = {
  readonly mode: DefiningWorldPlazaEquipmentEvModifierMode;
  readonly value: number;
};
