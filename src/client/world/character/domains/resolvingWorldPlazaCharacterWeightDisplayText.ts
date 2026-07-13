/**
 * Formats character mass for the profile attribute chip.
 *
 * @module components/world/character/domains/resolvingWorldPlazaCharacterWeightDisplayText
 */

/**
 * Formats kilograms as a short profile value (`70 kg`, `12.5 kg`).
 */
export function resolvingWorldPlazaCharacterWeightDisplayText(
  massKg: number
): string {
  const safeMassKg = Math.max(0, massKg);
  const roundedToTenth = Math.round(safeMassKg * 10) / 10;
  const massText =
    Number.isInteger(roundedToTenth) ||
    Math.abs(roundedToTenth - Math.round(roundedToTenth)) < 0.05
      ? `${Math.round(roundedToTenth)}`
      : roundedToTenth.toFixed(1);

  return `${massText} kg`;
}
