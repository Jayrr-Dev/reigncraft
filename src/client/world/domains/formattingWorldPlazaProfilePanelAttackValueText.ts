/**
 * Formats profile Attack as `100 +15` when equipped weapon adds EV.
 *
 * @module components/world/domains/formattingWorldPlazaProfilePanelAttackValueText
 */

import { formattingWorldPlazaProfilePanelAttackValueParts } from '@/components/world/domains/formattingWorldPlazaProfilePanelAttackValueParts';

/**
 * Shows base attack and equipped weapon bonus as `base +bonus`.
 * Unarmed / no bonus stays a plain number.
 */
export function formattingWorldPlazaProfilePanelAttackValueText(
  baseAttackPower: number,
  equippedAttackEv: number
): string {
  const parts = formattingWorldPlazaProfilePanelAttackValueParts(
    baseAttackPower,
    equippedAttackEv
  );

  if (parts.bonusText === null) {
    return parts.baseText;
  }

  return `${parts.baseText} ${parts.bonusText}`;
}
