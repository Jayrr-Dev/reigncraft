/**
 * Prefer above the buff icons; flip below when the card would clip the host top.
 */

export type ResolvingWorldPlazaEntityHealthBuffCardVerticalPlacement =
  | 'above'
  | 'below';

/**
 * Picks above vs below for the world-anchored buff explanation card.
 *
 * @param preferredPlacement - Caller preference (usually above).
 * @param popoverTopPx - Popover top edge in viewport coordinates.
 * @param clipTopPx - Overflow clip container top edge in viewport coordinates.
 * @param edgeInsetPx - Extra padding inside the clip edge before flipping.
 */
export function resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
  preferredPlacement,
  popoverTopPx,
  clipTopPx,
  edgeInsetPx = 0,
}: {
  preferredPlacement: ResolvingWorldPlazaEntityHealthBuffCardVerticalPlacement;
  popoverTopPx: number;
  clipTopPx: number;
  edgeInsetPx?: number;
}): ResolvingWorldPlazaEntityHealthBuffCardVerticalPlacement {
  if (preferredPlacement === 'below') {
    return 'below';
  }

  if (popoverTopPx < clipTopPx + edgeInsetPx) {
    return 'below';
  }

  return 'above';
}
