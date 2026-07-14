import {
  COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
  computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCameraZoomedDomOverlayPositionTransform', () => {
  it('uses compositor-friendly pixel-quantized translation', () => {
    expect(
      computingWorldPlazaCameraZoomedDomOverlayPositionTransform(12.4, 27.6)
    ).toBe('translate3d(12px, 28px, 0) translate(-50%, -100%)');
  });
});

describe('computingWorldPlazaCameraZoomedDomOverlayScaleStyle', () => {
  it('exposes live zoom as an inheritable CSS custom property', () => {
    expect(computingWorldPlazaCameraZoomedDomOverlayScaleStyle(2.5)).toEqual({
      transform: 'scale(2.5)',
      transformOrigin: 'bottom center',
      [COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE]: '2.5',
    });
  });
});

describe('computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle', () => {
  it('counter-scales from the bottom when anchored above', () => {
    expect(
      computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle(
        'above'
      )
    ).toEqual({
      transform: `translateX(-50%) scale(calc(1 / var(${COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE}, 3)))`,
      transformOrigin: 'bottom center',
    });
  });

  it('counter-scales from the top when anchored below', () => {
    expect(
      computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle(
        'below'
      )
    ).toEqual({
      transform: `translateX(-50%) scale(calc(1 / var(${COMPUTING_WORLD_PLAZA_CAMERA_WORLD_ZOOM_CSS_VARIABLE}, 3)))`,
      transformOrigin: 'top center',
    });
  });
});
