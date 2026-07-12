import { computingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/domains/computingWorldPlazaAnchoredPopoverViewportShiftX';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaAnchoredPopoverViewportShiftX', () => {
  it('returns 0 when the popover already fits', () => {
    expect(
      computingWorldPlazaAnchoredPopoverViewportShiftX({
        popoverLeftPx: 100,
        popoverRightPx: 260,
        clipLeftPx: 0,
        clipRightPx: 400,
        edgeInsetPx: 16,
      })
    ).toBe(0);
  });

  it('shifts right when the left edge clips', () => {
    expect(
      computingWorldPlazaAnchoredPopoverViewportShiftX({
        popoverLeftPx: -40,
        popoverRightPx: 120,
        clipLeftPx: 0,
        clipRightPx: 400,
        edgeInsetPx: 16,
      })
    ).toBe(56);
  });

  it('shifts left when the right edge clips', () => {
    expect(
      computingWorldPlazaAnchoredPopoverViewportShiftX({
        popoverLeftPx: 300,
        popoverRightPx: 460,
        clipLeftPx: 0,
        clipRightPx: 400,
        edgeInsetPx: 16,
      })
    ).toBe(-76);
  });

  it('pins to the left inset when wider than the safe viewport', () => {
    expect(
      computingWorldPlazaAnchoredPopoverViewportShiftX({
        popoverLeftPx: -20,
        popoverRightPx: 420,
        clipLeftPx: 0,
        clipRightPx: 400,
        edgeInsetPx: 16,
      })
    ).toBe(36);
  });
});
