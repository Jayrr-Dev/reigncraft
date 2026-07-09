import { computingWorldPlazaEntityDeathScreenTitleFontSizePx } from '@/components/world/health/domains/computingWorldPlazaEntityDeathScreenTitleFontSizePx';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityDeathScreenTitleFontSizePx', () => {
  it('keeps max size when the title already fits', () => {
    expect(
      computingWorldPlazaEntityDeathScreenTitleFontSizePx({
        availableWidthPx: 400,
        naturalWidthPx: 320,
        maxFontSizePx: 64,
        minFontSizePx: 18,
      })
    ).toBe(64);
  });

  it('scales down proportionally when the title overflows', () => {
    expect(
      computingWorldPlazaEntityDeathScreenTitleFontSizePx({
        availableWidthPx: 200,
        naturalWidthPx: 400,
        maxFontSizePx: 64,
        minFontSizePx: 18,
      })
    ).toBe(32);
  });

  it('clamps to the minimum font size', () => {
    expect(
      computingWorldPlazaEntityDeathScreenTitleFontSizePx({
        availableWidthPx: 40,
        naturalWidthPx: 400,
        maxFontSizePx: 64,
        minFontSizePx: 18,
      })
    ).toBe(18);
  });

  it('returns max size for non-positive measurements', () => {
    expect(
      computingWorldPlazaEntityDeathScreenTitleFontSizePx({
        availableWidthPx: 0,
        naturalWidthPx: 400,
        maxFontSizePx: 64,
        minFontSizePx: 18,
      })
    ).toBe(64);
  });
});
