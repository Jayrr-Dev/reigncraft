/**
 * Tip width + viewport clamping for plaza onboarding coachmarks.
 *
 * Fixed-position tips with `left` near the right edge shrink via CSS
 * abspos shrink-to-fit unless width is explicit and the center is clamped.
 */

import {
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_MAX_WIDTH_REM,
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_VIEWPORT_GUTTER_REM,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

export type ComputingWorldPlazaOnboardingCoachmarkTipLayoutInput = {
  readonly preferredCenterXPx: number;
  readonly preferredTopPx: number;
  readonly tipPlacement: 'above' | 'below' | 'center';
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
  readonly rootFontSizePx: number;
  /** Measured tip height after layout; omit on first paint. */
  readonly tipHeightPx?: number;
};

export type ComputingWorldPlazaOnboardingCoachmarkTipLayout = {
  readonly tipWidthPx: number;
  readonly leftPx: number;
  readonly topPx: number;
};

/**
 * Resolves the authored tip width: `min(18rem, 100vw - 1.5rem)`.
 */
export function computingWorldPlazaOnboardingCoachmarkTipWidthPx(
  viewportWidthPx: number,
  rootFontSizePx: number
): number {
  const maxWidthPx =
    DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_MAX_WIDTH_REM *
    rootFontSizePx;
  const gutterPx =
    DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_VIEWPORT_GUTTER_REM *
    rootFontSizePx;

  return Math.min(maxWidthPx, Math.max(0, viewportWidthPx - gutterPx));
}

/**
 * Clamps a `-50%` centered tip so its box stays inside the viewport gutter.
 */
export function clampingWorldPlazaOnboardingCoachmarkTipCenterX(
  preferredCenterXPx: number,
  tipWidthPx: number,
  viewportWidthPx: number,
  edgeInsetPx: number
): number {
  const halfWidthPx = tipWidthPx / 2;
  const minCenterXPx = edgeInsetPx + halfWidthPx;
  const maxCenterXPx = viewportWidthPx - edgeInsetPx - halfWidthPx;

  if (minCenterXPx >= maxCenterXPx) {
    return viewportWidthPx / 2;
  }

  return Math.min(Math.max(preferredCenterXPx, minCenterXPx), maxCenterXPx);
}

/**
 * Clamps tip top so an above/below/center tip stays inside the viewport.
 */
export function clampingWorldPlazaOnboardingCoachmarkTipTop(
  preferredTopPx: number,
  tipPlacement: 'above' | 'below' | 'center',
  tipHeightPx: number,
  viewportHeightPx: number,
  edgeInsetPx: number
): number {
  if (tipHeightPx <= 0) {
    return preferredTopPx;
  }

  if (tipPlacement === 'below') {
    const maxTopPx = viewportHeightPx - edgeInsetPx - tipHeightPx;
    return Math.min(Math.max(preferredTopPx, edgeInsetPx), maxTopPx);
  }

  // above / center: transform translateY(-100%) pins the bottom edge at `top`.
  const minTopPx = edgeInsetPx + tipHeightPx;
  const maxTopPx = viewportHeightPx - edgeInsetPx;
  return Math.min(Math.max(preferredTopPx, minTopPx), maxTopPx);
}

/**
 * Resolves tip width and clamped fixed position for the coachmark card.
 */
export function computingWorldPlazaOnboardingCoachmarkTipLayout(
  input: ComputingWorldPlazaOnboardingCoachmarkTipLayoutInput
): ComputingWorldPlazaOnboardingCoachmarkTipLayout {
  const tipWidthPx = computingWorldPlazaOnboardingCoachmarkTipWidthPx(
    input.viewportWidthPx,
    input.rootFontSizePx
  );
  const edgeInsetPx =
    (DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_VIEWPORT_GUTTER_REM *
      input.rootFontSizePx) /
    2;

  const leftPx = clampingWorldPlazaOnboardingCoachmarkTipCenterX(
    input.preferredCenterXPx,
    tipWidthPx,
    input.viewportWidthPx,
    edgeInsetPx
  );

  const topPx = clampingWorldPlazaOnboardingCoachmarkTipTop(
    input.preferredTopPx,
    input.tipPlacement,
    input.tipHeightPx ?? 0,
    input.viewportHeightPx,
    edgeInsetPx
  );

  return {
    tipWidthPx,
    leftPx,
    topPx,
  };
}
