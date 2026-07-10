/**
 * True when both pointer client coordinates are usable for hit testing.
 *
 * @param clientX - Pointer client X in CSS pixels.
 * @param clientY - Pointer client Y in CSS pixels.
 */
export function checkingWorldPlazaPointerClientCoordinatesAreFinite(
  clientX: number,
  clientY: number
): boolean {
  return Number.isFinite(clientX) && Number.isFinite(clientY);
}
