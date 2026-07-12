import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaVisibleIsometricTileBounds', () => {
  it('expands radius by snap half so center drift cannot uncover the viewport', () => {
    const withoutSnap = resolvingWorldPlazaVisibleIsometricTileBounds(
      0,
      0,
      640,
      360,
      4,
      1,
      2
    );
    const withSnap = resolvingWorldPlazaVisibleIsometricTileBounds(
      0,
      0,
      640,
      360,
      4,
      12,
      2
    );

    const withoutSnapRadius = withoutSnap.maxTileX - Math.ceil(0.5);
    const withSnapRadius = withSnap.maxTileX - Math.ceil(6);
    // Snap centers at +6; radius must grow by floor(12/2)=6 so player-relative
    // cover on the near side stays at least as wide as the unsnapped window.
    expect(withSnapRadius - withoutSnapRadius).toBeGreaterThanOrEqual(6);
    expect(withSnap.minTileY).toBeLessThanOrEqual(withoutSnap.minTileY);
  });

  it('keeps the player inside the bounds when snap drifts the center', () => {
    const bounds = resolvingWorldPlazaVisibleIsometricTileBounds(
      1,
      1,
      390,
      700,
      10,
      12,
      1.4
    );

    expect(bounds.minTileX).toBeLessThanOrEqual(1);
    expect(bounds.maxTileX).toBeGreaterThanOrEqual(1);
    expect(bounds.minTileY).toBeLessThanOrEqual(1);
    expect(bounds.maxTileY).toBeGreaterThanOrEqual(1);
  });
});
