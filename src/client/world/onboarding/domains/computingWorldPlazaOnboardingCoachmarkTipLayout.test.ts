import {
  clampingWorldPlazaOnboardingCoachmarkTipCenterX,
  clampingWorldPlazaOnboardingCoachmarkTipTop,
  computingWorldPlazaOnboardingCoachmarkTipLayout,
  computingWorldPlazaOnboardingCoachmarkTipWidthPx,
} from '@/components/world/onboarding/domains/computingWorldPlazaOnboardingCoachmarkTipLayout';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaOnboardingCoachmarkTipWidthPx', () => {
  it('uses the rem max width on wide viewports', () => {
    expect(computingWorldPlazaOnboardingCoachmarkTipWidthPx(1280, 16)).toBe(
      224
    );
  });

  it('subtracts the viewport gutter on narrow viewports', () => {
    expect(computingWorldPlazaOnboardingCoachmarkTipWidthPx(200, 16)).toBe(168);
  });
});

describe('clampingWorldPlazaOnboardingCoachmarkTipCenterX', () => {
  it('keeps a near-edge tip from shrinking past the right gutter', () => {
    const tipWidthPx = 168;
    const viewportWidthPx = 200;
    const edgeInsetPx = 16;

    expect(
      clampingWorldPlazaOnboardingCoachmarkTipCenterX(
        190,
        tipWidthPx,
        viewportWidthPx,
        edgeInsetPx
      )
    ).toBe(100);
  });

  it('preserves centers that already fit', () => {
    expect(
      clampingWorldPlazaOnboardingCoachmarkTipCenterX(400, 224, 1280, 16)
    ).toBe(400);
  });
});

describe('clampingWorldPlazaOnboardingCoachmarkTipTop', () => {
  it('pushes an above tip down when it would clip the top', () => {
    expect(
      clampingWorldPlazaOnboardingCoachmarkTipTop(40, 'above', 120, 640, 12)
    ).toBe(132);
  });

  it('leaves room below for a below tip', () => {
    expect(
      clampingWorldPlazaOnboardingCoachmarkTipTop(600, 'below', 120, 640, 12)
    ).toBe(508);
  });
});

describe('computingWorldPlazaOnboardingCoachmarkTipLayout', () => {
  it('centers a gutter-width mobile tip and clamps vertical overflow', () => {
    const layout = computingWorldPlazaOnboardingCoachmarkTipLayout({
      preferredCenterXPx: 190,
      preferredTopPx: 80,
      tipPlacement: 'above',
      viewportWidthPx: 200,
      viewportHeightPx: 640,
      rootFontSizePx: 16,
      tipHeightPx: 160,
    });

    expect(layout.tipWidthPx).toBe(168);
    expect(layout.leftPx).toBe(100);
    expect(layout.topPx).toBe(176);
  });
});
