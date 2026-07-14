import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(),
}));

import { checkingWorldPlazaLandNearLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearLavaAtTileIndex';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';

describe('checkingWorldPlazaLandNearLavaAtTileIndex', () => {
  beforeEach(() => {
    vi.mocked(checkingWorldPlazaLavaAtTileIndex).mockReset();
    vi.mocked(checkingWorldPlazaLavaAtTileIndex).mockReturnValue(false);
  });

  it('returns false when no lava is in range', () => {
    expect(checkingWorldPlazaLandNearLavaAtTileIndex(10, 20, 2)).toBe(false);
  });

  it('returns true when the center tile is lava', () => {
    vi.mocked(checkingWorldPlazaLavaAtTileIndex).mockImplementation(
      (tileX, tileY) => tileX === 10 && tileY === 20
    );

    expect(checkingWorldPlazaLandNearLavaAtTileIndex(10, 20, 2)).toBe(true);
  });

  it('returns true when lava sits within the clearance radius', () => {
    vi.mocked(checkingWorldPlazaLavaAtTileIndex).mockImplementation(
      (tileX, tileY) => tileX === 12 && tileY === 20
    );

    expect(checkingWorldPlazaLandNearLavaAtTileIndex(10, 20, 2)).toBe(true);
  });

  it('returns false when lava sits outside the clearance radius', () => {
    vi.mocked(checkingWorldPlazaLavaAtTileIndex).mockImplementation(
      (tileX, tileY) => tileX === 13 && tileY === 20
    );

    expect(checkingWorldPlazaLandNearLavaAtTileIndex(10, 20, 2)).toBe(false);
  });
});
