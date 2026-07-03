import { resolvingWorldBuildingPlacedBlockExtrusionBottomLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import {
  checkingWorldBuildingBlockUsesTileColumnExtrusion,
  checkingWorldBuildingPlacedBlockUsesFlatTileRendering,
} from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { GroupingWorldBuildingPlacedBlocksTileColumn } from "@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn";

/**
 * Resolves the vertical world-layer span for a tile column shadow.
 *
 * @module components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers
 */

/**
 * Returns the tallest extruded span on a tile column, or null when no shadow is needed.
 *
 * @param tileColumn - Blocks grouped on one tile.
 */
export function resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers(
  tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn,
): number | null {
  let minBottomLayer: number | null = null;
  let maxTopLayer: number | null = null;

  for (const block of tileColumn.blocks) {
    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

    if (!definition || !checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
      continue;
    }

    const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
    const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);

    if (
      checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
        definition,
        worldLayer,
        blockHeight,
      )
    ) {
      continue;
    }

    const bottomLayer = resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
      worldLayer,
      blockHeight,
    );

    minBottomLayer =
      minBottomLayer === null
        ? bottomLayer
        : Math.min(minBottomLayer, bottomLayer);
    maxTopLayer =
      maxTopLayer === null ? worldLayer : Math.max(maxTopLayer, worldLayer);
  }

  if (minBottomLayer === null || maxTopLayer === null) {
    return null;
  }

  const columnSpanLayers = maxTopLayer - minBottomLayer + 1;

  if (
    columnSpanLayers <
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS
  ) {
    return null;
  }

  return columnSpanLayers;
}
