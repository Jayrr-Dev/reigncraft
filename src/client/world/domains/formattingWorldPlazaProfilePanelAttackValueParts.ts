/**
 * Splits profile Attack into base and signed weapon bonus for colored UI.
 *
 * @module components/world/domains/formattingWorldPlazaProfilePanelAttackValueParts
 */

/** Base attack plus optional signed bonus text for the combat chip. */
export type FormattingWorldPlazaProfilePanelAttackValueParts = {
  readonly baseText: string;
  /** Signed bonus such as `+10` or `-5`; null when unarmed / no change. */
  readonly bonusText: string | null;
  readonly bonusTone: 'positive' | 'negative' | null;
};

/**
 * Splits base attack and equipped weapon delta for profile Attack chip.
 */
export function formattingWorldPlazaProfilePanelAttackValueParts(
  baseAttackPower: number,
  equippedAttackEv: number
): FormattingWorldPlazaProfilePanelAttackValueParts {
  const base = Math.round(baseAttackPower);
  const equipped = Math.round(equippedAttackEv);
  const bonus = equipped - base;

  if (bonus > 0) {
    return {
      baseText: `${base}`,
      bonusText: `+${bonus}`,
      bonusTone: 'positive',
    };
  }

  if (bonus < 0) {
    return {
      baseText: `${base}`,
      bonusText: `${bonus}`,
      bonusTone: 'negative',
    };
  }

  return {
    baseText: `${base}`,
    bonusText: null,
    bonusTone: null,
  };
}
