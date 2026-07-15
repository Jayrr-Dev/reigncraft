import { checkingWorldPlazaLandNearCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearCliffEdgeAtTileIndex';
import { checkingWorldPlazaLandNearLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearLavaAtTileIndex';
import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_LONG_GRASS_CLIFF_EDGE_CLEARANCE_RADIUS_TILES } from '@/components/world/domains/definingWorldPlazaLongGrassConstants';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkingWorldLongGrassPlacementAtTileIndex } from '../../../shared/worldLongGrassPlacement';

vi.mock(
  '@/components/world/domains/managingWorldPlazaGenerationFeatureStore',
  () => ({
    checkingWorldPlazaGenerationFeatureEnabled: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/checkingWorldPlazaLandNearCliffEdgeAtTileIndex',
  () => ({
    checkingWorldPlazaLandNearCliffEdgeAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/checkingWorldPlazaLandNearLavaAtTileIndex',
  () => ({
    checkingWorldPlazaLandNearLavaAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex',
  () => ({
    checkingWorldPlazaLakeShoreBlockAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex',
  () => ({
    checkingWorldPlazaOceanShoreBlockAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex',
  () => ({
    checkingWorldPlazaPondShoreBlockAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex',
  () => ({
    resolvingWorldPlazaBiomeAtTileIndex: vi.fn(),
  })
);
vi.mock(
  '@/components/world/domains/checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex',
  () => ({
    checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex: vi.fn(
      () => false
    ),
  })
);
vi.mock('../../../shared/worldLongGrassPlacement', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../../../shared/worldLongGrassPlacement')
    >();
  return {
    ...actual,
    checkingWorldLongGrassPlacementAtTileIndex: vi.fn(),
  };
});

const featureEnabledMock = vi.mocked(
  checkingWorldPlazaGenerationFeatureEnabled
);
const waterMock = vi.mocked(resolvingWorldPlazaWaterAtTileIndex);
const nearCliffEdgeMock = vi.mocked(
  checkingWorldPlazaLandNearCliffEdgeAtTileIndex
);
const lavaMock = vi.mocked(checkingWorldPlazaLandNearLavaAtTileIndex);
const lakeShoreMock = vi.mocked(checkingWorldPlazaLakeShoreBlockAtTileIndex);
const oceanShoreMock = vi.mocked(checkingWorldPlazaOceanShoreBlockAtTileIndex);
const pondShoreMock = vi.mocked(checkingWorldPlazaPondShoreBlockAtTileIndex);
const biomeMock = vi.mocked(resolvingWorldPlazaBiomeAtTileIndex);
const placementMock = vi.mocked(checkingWorldLongGrassPlacementAtTileIndex);

describe('checkingWorldPlazaLongGrassDecorationAtTileIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    featureEnabledMock.mockReturnValue(true);
    waterMock.mockReturnValue(false);
    nearCliffEdgeMock.mockReturnValue(false);
    lavaMock.mockReturnValue(false);
    lakeShoreMock.mockReturnValue(false);
    oceanShoreMock.mockReturnValue(false);
    pondShoreMock.mockReturnValue(false);
    biomeMock.mockReturnValue(DEFINING_WORLD_PLAZA_BIOME_CATALOG.plains);
    placementMock.mockReturnValue(true);
  });

  it('returns false within cliff-edge clearance', () => {
    nearCliffEdgeMock.mockReturnValue(true);

    expect(checkingWorldPlazaLongGrassDecorationAtTileIndex(3, 7)).toBe(false);
    // Placement runs before expensive cliff rings; cliff still rejects the tile.
    expect(placementMock).toHaveBeenCalledWith(
      3,
      7,
      DEFINING_WORLD_PLAZA_BIOME_CATALOG.plains.longGrassTileModulus
    );
    expect(nearCliffEdgeMock).toHaveBeenCalledWith(
      3,
      7,
      DEFINING_WORLD_PLAZA_LONG_GRASS_CLIFF_EDGE_CLEARANCE_RADIUS_TILES
    );
  });

  it('skips cliff rings when placement rejects the tile', () => {
    placementMock.mockReturnValue(false);

    expect(checkingWorldPlazaLongGrassDecorationAtTileIndex(3, 7)).toBe(false);
    expect(nearCliffEdgeMock).not.toHaveBeenCalled();
    expect(lavaMock).not.toHaveBeenCalled();
  });

  it('keeps placement on plateau interior tiles', () => {
    expect(checkingWorldPlazaLongGrassDecorationAtTileIndex(3, 7)).toBe(true);
    expect(placementMock).toHaveBeenCalledWith(
      3,
      7,
      DEFINING_WORLD_PLAZA_BIOME_CATALOG.plains.longGrassTileModulus
    );
    expect(featureEnabledMock).toHaveBeenCalledWith(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LONG_GRASS
    );
  });
});
