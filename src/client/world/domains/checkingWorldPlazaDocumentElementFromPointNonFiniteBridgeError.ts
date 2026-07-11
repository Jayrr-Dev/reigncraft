/**
 * True when a captured error is Reddit/Devvit webview click-bridge noise from
 * `elementFromPoint` receiving NaN or Infinity.
 *
 * @module components/world/domains/checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError
 */

const DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_NON_FINITE_ERROR_FRAGMENTS = [
  "Failed to execute 'elementFromPoint' on 'Document': The provided double value is non-finite",
  "Failed to execute 'elementsFromPoint' on 'Document': The provided double value is non-finite",
] as const;

/**
 * @param error - Captured runtime error or message string.
 */
export function checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError(
  error: unknown
): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  if (!message) {
    return false;
  }

  return DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_NON_FINITE_ERROR_FRAGMENTS.some(
    (fragment) => message.includes(fragment)
  );
}
