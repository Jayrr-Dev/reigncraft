import { computingWorldPlazaCameraZoomedDomOverlayPositionTransform } from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCameraZoomedDomOverlayPositionTransform', () => {
  it('uses compositor-friendly pixel-quantized translation', () => {
    expect(
      computingWorldPlazaCameraZoomedDomOverlayPositionTransform(12.4, 27.6)
    ).toBe('translate3d(12px, 28px, 0) translate(-50%, -100%)');
  });
});
