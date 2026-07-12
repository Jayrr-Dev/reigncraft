import { resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement', () => {
  it('keeps above when the popover clears the clip top', () => {
    expect(
      resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
        preferredPlacement: 'above',
        popoverTopPx: 40,
        clipTopPx: 0,
        edgeInsetPx: 2,
      })
    ).toBe('above');
  });

  it('flips below when the popover clips the host top', () => {
    expect(
      resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
        preferredPlacement: 'above',
        popoverTopPx: -12,
        clipTopPx: 0,
        edgeInsetPx: 2,
      })
    ).toBe('below');
  });

  it('flips below when inside the edge inset band', () => {
    expect(
      resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
        preferredPlacement: 'above',
        popoverTopPx: 1,
        clipTopPx: 0,
        edgeInsetPx: 2,
      })
    ).toBe('below');
  });

  it('honors an explicit below preference', () => {
    expect(
      resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
        preferredPlacement: 'below',
        popoverTopPx: 80,
        clipTopPx: 0,
      })
    ).toBe('below');
  });
});
