/**
 * Formats profile Attack as `100 +15` when equipped weapon adds EV.
 *
 * @module components/world/domains/formattingWorldPlazaProfilePanelAttackValueText
 */

/**
 * Shows base attack and equipped weapon bonus as `base +bonus`.
 * Unarmed / no bonus stays a plain number.
 */
export function formattingWorldPlazaProfilePanelAttackValueText(
  baseAttackPower: number,
  equippedAttackEv: number
): string {
  const base = Math.round(baseAttackPower);
  const equipped = Math.round(equippedAttackEv);
  const bonus = equipped - base;

  if (bonus > 0) {
    return `${base} +${bonus}`;
  }

  if (bonus < 0) {
    return `${base} ${bonus}`;
  }

  return `${base}`;
}
