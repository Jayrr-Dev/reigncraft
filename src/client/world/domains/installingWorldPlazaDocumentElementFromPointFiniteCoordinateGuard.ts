/**
 * Prevents `document.elementFromPoint` from throwing when Reddit or Devvit
 * click bridges pass non-finite coordinates during expanded webview clicks.
 *
 * @module components/world/domains/installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard
 */

let installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = false;

/**
 * Wraps `document.elementFromPoint` so NaN and Infinity return null instead of
 * throwing. Safe to call more than once.
 */
export function installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard(): void {
  if (
    installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled ||
    typeof document === 'undefined'
  ) {
    return;
  }

  installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = true;

  const nativeElementFromPoint = document.elementFromPoint.bind(document);

  document.elementFromPoint = ((x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return null;
    }

    return nativeElementFromPoint(x, y);
  }) as typeof document.elementFromPoint;
}
