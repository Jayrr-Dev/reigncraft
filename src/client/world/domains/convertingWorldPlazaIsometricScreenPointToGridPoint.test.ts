import { describe, expect, it } from "vitest";

import {
  convertingWorldPlazaGridPointToIsometricScreenPointOnSurface,
  convertingWorldPlazaIsometricScreenPointToGridPoint,
  convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation,
} from "@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

describe("convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation", () => {
  it("matches the floor inverse on flat ground", () => {
    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: 4,
      y: -7,
    });

    expect(
      convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation(
        screenPoint
      )
    ).toEqual(convertingWorldPlazaIsometricScreenPointToGridPoint(screenPoint));
  });

  it("round-trips raised terrain tile centers", () => {
    const sampleTiles = [
      { tileX: -173, tileY: -358 },
      { tileX: 12, tileY: 18 },
      { tileX: -40, tileY: 55 },
    ];

    for (const tile of sampleTiles) {
      const gridPoint = { x: tile.tileX, y: tile.tileY };
      const surfaceScreenPoint =
        convertingWorldPlazaGridPointToIsometricScreenPointOnSurface(gridPoint);
      const projectedGridPoint =
        convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation(
          surfaceScreenPoint
        );
      const projectedTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(projectedGridPoint);

      expect(projectedTile).toEqual(tile);
    }
  });
});
