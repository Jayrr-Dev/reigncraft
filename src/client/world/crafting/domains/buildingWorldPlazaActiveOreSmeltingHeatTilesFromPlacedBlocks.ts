import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockFootprintGroupId,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { formattingWorldPlazaActiveOreSmeltingHeatTileKey } from '@/components/world/crafting/domains/managingWorldPlazaActiveOreSmeltingHeatTilesStore';
import {
  computingWorldPlazaOreSmeltingAdjacentTemperatureCelsius,
  DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_HEAT_RADIATION_RING,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Builds tile → heat (°C) for active ore-smelting stations.
 *
 * Every footprint tile of an active bloomery / kiln / stove is a standing heat
 * source. One Chebyshev ring around those tiles gets adjacent heat, same pattern
 * as lit campfires.
 */
export function buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  activeBlockIds: ReadonlySet<string>
): ReadonlyMap<string, number> {
  if (activeBlockIds.size === 0) {
    return new Map();
  }

  const standingTiles = new Set<string>();

  for (const block of placedBlocks) {
    const footprintGroupId =
      resolvingWorldBuildingPlacedBlockFootprintGroupId(block) ?? block.blockId;

    if (
      !activeBlockIds.has(block.blockId) &&
      !activeBlockIds.has(footprintGroupId)
    ) {
      continue;
    }

    standingTiles.add(
      formattingWorldPlazaActiveOreSmeltingHeatTileKey(
        block.tilePosition.tileX,
        block.tilePosition.tileY
      )
    );
  }

  if (standingTiles.size === 0) {
    return new Map();
  }

  const heatCelsiusByTile = new Map<string, number>();
  const standingCelsius = DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS;
  const adjacentCelsius =
    computingWorldPlazaOreSmeltingAdjacentTemperatureCelsius(standingCelsius);
  const radiationRing =
    DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_HEAT_RADIATION_RING;

  for (const standingTileKey of standingTiles) {
    const [tileXText, tileYText] = standingTileKey.split(',');
    const standingTileX = Number(tileXText);
    const standingTileY = Number(tileYText);

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
        const tileX = standingTileX + offsetTileX;
        const tileY = standingTileY + offsetTileY;
        const tileKey = formattingWorldPlazaActiveOreSmeltingHeatTileKey(
          tileX,
          tileY
        );
        const isStandingTile = standingTiles.has(tileKey);
        const tileCelsius = isStandingTile
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
