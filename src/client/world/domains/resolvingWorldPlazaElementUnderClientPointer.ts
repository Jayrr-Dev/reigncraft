import { checkingWorldPlazaPointerClientCoordinatesAreFinite } from '@/components/world/domains/checkingWorldPlazaPointerClientCoordinatesAreFinite';

/**
 * Hit-tests the document at client pointer coordinates.
 *
 * Returns null when coordinates are non-finite or nothing is under the point.
 *
 * @param clientX - Pointer client X in CSS pixels.
 * @param clientY - Pointer client Y in CSS pixels.
 */
export function resolvingWorldPlazaElementUnderClientPointer(
  clientX: number,
  clientY: number
): Element | null {
  if (
    typeof document === 'undefined' ||
    !checkingWorldPlazaPointerClientCoordinatesAreFinite(clientX, clientY)
  ) {
    return null;
  }

  return document.elementFromPoint(clientX, clientY);
}
