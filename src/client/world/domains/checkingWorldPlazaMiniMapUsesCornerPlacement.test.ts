import { checkingWorldPlazaMiniMapUsesCornerPlacement } from '@/components/world/domains/checkingWorldPlazaMiniMapUsesCornerPlacement';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaMiniMapUsesCornerPlacement', () => {
  it('pins the map to the far-right corner on desktop viewports', () => {
    expect(checkingWorldPlazaMiniMapUsesCornerPlacement(false)).toBe(true);
  });

  it('keeps the compass dropdown on mobile viewports', () => {
    expect(checkingWorldPlazaMiniMapUsesCornerPlacement(true)).toBe(false);
  });
});
