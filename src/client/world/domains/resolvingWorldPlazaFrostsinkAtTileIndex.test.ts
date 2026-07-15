import {
  DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_LETHAL_FALL_LAYER_DELTA,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_WILDLIFE_MIN_RADIUS_TILES,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import {
  checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles,
  resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles,
  resolvingWorldPlazaFrostsinkAtTileIndex,
  resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex';
import { resolvingWorldPlazaFrostsinkPropAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFrostsinkPropAtTileIndex';
import {
  checkingWorldPlazaFrostsinkCrevasseAtOffset,
  resolvingWorldPlazaFrostsinkMountainSurfaceLayerFromRadiusTiles,
  resolvingWorldPlazaFrostsinkTerrainElevationSurfaceLayerAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkTerrainElevationAtTileIndex';
import { describe, expect, it } from 'vitest';

/**
 * Frostsink disc stamp, ring temps, bowl elevation, and Cryocore.
 */
describe('Frostsink legendary ice disc', () => {
  // Spacing cell (1,1) → center inside the 3k–10k discovery ring.
  const centerTileX =
    1 * DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES +
    DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE;
  const centerTileY =
    1 * DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES +
    DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE;

  it('keeps active sites inside the 3k–10k discovery ring only', () => {
    const nearDistSquared =
      centerTileX * centerTileX + centerTileY * centerTileY;
    expect(nearDistSquared).toBeGreaterThanOrEqual(3000 * 3000);
    expect(nearDistSquared).toBeLessThanOrEqual(10_000 * 10_000);
    expect(
      resolvingWorldPlazaFrostsinkAtTileIndex(centerTileX, centerTileY)
    ).not.toBeNull();

    const farTileX =
      8 * DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES +
      DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE;
    const farTileY = farTileX;
    expect(
      resolvingWorldPlazaFrostsinkAtTileIndex(farTileX, farTileY)
    ).toBeNull();
  });

  it('stamps frostsink biome over climate inside the disc', () => {
    const biome = resolvingWorldPlazaBiomeAtTileIndex(
      centerTileX + 20,
      centerTileY
    );

    expect(biome.kind).toBe('frostsink');
  });

  it('places a Cryocore prop at the active site center', () => {
    const prop = resolvingWorldPlazaFrostsinkPropAtTileIndex(
      centerTileX,
      centerTileY
    );

    expect(prop?.kind).toBe('cryocore');
    expect(prop?.anchorTileX).toBe(centerTileX);
    expect(prop?.anchorTileY).toBe(centerTileY);
  });

  it('maps ring ids and ambient °C endpoints at scaled radii', () => {
    const [r0, r1, r2, r3, r4] =
      DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES;

    expect(resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(0)).toBe(
      'oxygen_lake'
    );
    expect(resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(r0 + 1)).toBe(
      'cryogenic_basin'
    );
    expect(resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(r1 + 1)).toBe(
      'frozen_tundra'
    );
    expect(resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(r2 + 1)).toBe(
      'snow_forest_inner'
    );
    expect(resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(r3 + 1)).toBe(
      'snow_forest_outer'
    );
    expect(r4).toBe(DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES);

    expect(
      resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(0)
    ).toBe(DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS);
    expect(
      resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(r0)
    ).toBe(-200);
    expect(
      resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(r2)
    ).toBe(-45);
    expect(
      resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(r4)
    ).toBe(-20);
  });

  it('allows wildlife only in outer snow-forest rings', () => {
    const wildlifeMin =
      DEFINING_WORLD_PLAZA_FROSTSINK_WILDLIFE_MIN_RADIUS_TILES;

    expect(
      checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(wildlifeMin)
    ).toBe(false);
    expect(
      checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(
        wildlifeMin + 0.01
      )
    ).toBe(true);

    const inner = resolvingWorldPlazaFrostsinkAtTileIndex(
      centerTileX + 16,
      centerTileY
    );
    const outer = resolvingWorldPlazaFrostsinkAtTileIndex(
      centerTileX + wildlifeMin + 8,
      centerTileY
    );

    expect(inner).not.toBeNull();
    expect(outer).not.toBeNull();
    expect(
      checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(
        inner!.radiusTiles
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(
        outer!.radiusTiles
      )
    ).toBe(true);
  });

  it('raises a 32H peak with lethal crevasse floors and foothill exits', () => {
    const tipLayer =
      resolvingWorldPlazaFrostsinkTerrainElevationSurfaceLayerAtTileIndex(
        centerTileX + 1,
        centerTileY
      );
    const foothillLayer =
      resolvingWorldPlazaFrostsinkTerrainElevationSurfaceLayerAtTileIndex(
        centerTileX + DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES - 6,
        centerTileY
      );
    const midShelf =
      resolvingWorldPlazaFrostsinkMountainSurfaceLayerFromRadiusTiles(40);

    expect(tipLayer).toBe(DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER);
    expect(foothillLayer).toBeLessThanOrEqual(5);
    expect(tipLayer).toBeGreaterThan(foothillLayer!);
    expect(midShelf).toBeGreaterThanOrEqual(
      DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_LETHAL_FALL_LAYER_DELTA + 1
    );

    const midRadius = 60;
    const isCrevasse = checkingWorldPlazaFrostsinkCrevasseAtOffset(
      midRadius,
      0,
      midRadius,
      centerTileX,
      centerTileY
    );

    if (isCrevasse) {
      const crevasseLayer =
        resolvingWorldPlazaFrostsinkTerrainElevationSurfaceLayerAtTileIndex(
          centerTileX + midRadius,
          centerTileY
        );
      const shelf =
        resolvingWorldPlazaFrostsinkMountainSurfaceLayerFromRadiusTiles(
          midRadius
        );
      expect(crevasseLayer).toBe(1);
      expect(shelf - crevasseLayer!).toBeGreaterThanOrEqual(
        DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_LETHAL_FALL_LAYER_DELTA
      );
    }
  });
});
