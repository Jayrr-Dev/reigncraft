/**
 * Shifts a centered slot-anchored popover so it stays inside the viewport
 * (same idea as Floating UI / Radix `shift` + `avoidCollisions`).
 */

export type ComputingWorldPlazaAnchoredPopoverViewportShiftXInput = {
  readonly popoverLeftPx: number;
  readonly popoverRightPx: number;
  readonly clipLeftPx: number;
  readonly clipRightPx: number;
  readonly edgeInsetPx?: number;
};

/**
 * Returns horizontal CSS px to add after a `-50%` center translate.
 * Positive moves the popover right; negative moves left.
 * When the popover is wider than the safe viewport, pins to the left inset.
 */
export function computingWorldPlazaAnchoredPopoverViewportShiftX({
  popoverLeftPx,
  popoverRightPx,
  clipLeftPx,
  clipRightPx,
  edgeInsetPx = 0,
}: ComputingWorldPlazaAnchoredPopoverViewportShiftXInput): number {
  const minLeftPx = clipLeftPx + edgeInsetPx;
  const maxRightPx = clipRightPx - edgeInsetPx;
  let shiftXPx = 0;

  if (popoverLeftPx + shiftXPx < minLeftPx) {
    shiftXPx = minLeftPx - popoverLeftPx;
  }

  if (popoverRightPx + shiftXPx > maxRightPx) {
    shiftXPx = maxRightPx - popoverRightPx;
  }

  if (popoverLeftPx + shiftXPx < minLeftPx) {
    shiftXPx = minLeftPx - popoverLeftPx;
  }

  return shiftXPx;
}
