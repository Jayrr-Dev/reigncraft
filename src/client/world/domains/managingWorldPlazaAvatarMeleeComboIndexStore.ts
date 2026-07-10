/**
 * Mutable combo index for the local avatar melee swing SFX loop.
 *
 * @module components/world/domains/managingWorldPlazaAvatarMeleeComboIndexStore
 */

const managingWorldPlazaAvatarMeleeComboIndexState = {
  comboIndex: 0,
};

/**
 * Reads the current melee swing combo index.
 */
export function gettingWorldPlazaAvatarMeleeComboIndex(): number {
  return managingWorldPlazaAvatarMeleeComboIndexState.comboIndex;
}

/**
 * Writes the melee swing combo index after a swing clip plays.
 */
export function settingWorldPlazaAvatarMeleeComboIndex(
  comboIndex: number
): void {
  managingWorldPlazaAvatarMeleeComboIndexState.comboIndex = comboIndex;
}

/**
 * Resets the melee swing combo back to the first step.
 */
export function resettingWorldPlazaAvatarMeleeComboIndex(): void {
  managingWorldPlazaAvatarMeleeComboIndexState.comboIndex = 0;
}
