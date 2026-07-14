import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import {
  computingWorldPlazaCampfireAdjacentTemperatureCelsius,
  computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_HEAT_RADIATION_RING,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Builds 2D tile → standing heat (°C) for lit campfires.
 *
 * Center tile keeps full fuel-scaled heat. Adjacent tiles within the campfire
 * radiation ring (Chebyshev 1) get assignable heat like lava neighbors, so the
 * one-block ring stays hot without relying on the wider averaging blend.
 */
export function buildingWorldPlazaLitCampfireTileKeysFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): ReadonlyMap<string, number> {
  const standingCelsiusByCenterTile = new Map<string, number>();

  for (const cell of fireCells) {
    if (
      cell.kind !== 'campfire' ||
      !Number.isFinite(cell.fuelRemainingMs) ||
      cell.fuelRemainingMs <= 0
    ) {
      continue;
    }

    const tileKey = formattingWorldPlazaLitCampfireHeatTileKey(
      cell.tileX,
      cell.tileY
    );
    const standingCelsius =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(
        Math.max(0, cell.inventoryFuelWoodCount ?? 0)
      );
    const existingCelsius = standingCelsiusByCenterTile.get(tileKey) ?? 0;

    if (standingCelsius >= existingCelsius) {
      standingCelsiusByCenterTile.set(tileKey, standingCelsius);
    }
  }

  const heatCelsiusByTile = new Map<string, number>();
  const radiationRing =
    DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_HEAT_RADIATION_RING;

  for (const [centerTileKey, standingCelsius] of standingCelsiusByCenterTile) {
    const [centerTileXText, centerTileYText] = centerTileKey.split(',');
    const centerTileX = Number(centerTileXText);
    const centerTileY = Number(centerTileYText);
    const adjacentCelsius =
      computingWorldPlazaCampfireAdjacentTemperatureCelsius(standingCelsius);

    for (
      let offsetTileY = -radiationRing;
      offsetTileY <= radiationRing;
      offsetTileY += 1
    ) {
      for (
        let offsetTileX = -radiationRing;
        offsetTileX <= radiationRing;
        offsetTileX += 1
      ) {
        const tileX = centerTileX + offsetTileX;
        const tileY = centerTileY + offsetTileY;
        const tileKey = formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY);
        const tileCelsius =
          offsetTileX === 0 && offsetTileY === 0
            ? standingCelsius
            : adjacentCelsius;
        const existingCelsius = heatCelsiusByTile.get(tileKey) ?? 0;

        if (tileCelsius >= existingCelsius) {
          heatCelsiusByTile.set(tileKey, tileCelsius);
        }
      }
    }
  }

  return heatCelsiusByTile;
}
