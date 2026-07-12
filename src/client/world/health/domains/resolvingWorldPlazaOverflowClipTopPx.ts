/**
 * Walks ancestors for the nearest overflow clip and returns its viewport top.
 */

/**
 * Top edge (viewport px) of the nearest overflow:hidden/clip ancestor.
 * Falls back to 0 when no clip ancestor exists.
 */
export function resolvingWorldPlazaOverflowClipTopPx(
  element: HTMLElement | null
): number {
  let node = element?.parentElement ?? null;

  while (node) {
    const style = getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflow = style.overflow;

    if (
      overflowY === 'hidden' ||
      overflowY === 'clip' ||
      overflow === 'hidden' ||
      overflow === 'clip'
    ) {
      return node.getBoundingClientRect().top;
    }

    node = node.parentElement;
  }

  return 0;
}
