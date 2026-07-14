import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx } from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_OFFSET_ABOVE_FOOT_PX } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingInteractionLabelConstants';
import { resolvingWorldPlazaOreSmeltingStationFootprintCenterTile } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAnchorBlock';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';

/**
 * Maps an ore-smelting station to viewport coords for its Refine label.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingInteractionLabelScreenPoint
 */

/**
 * Anchors the Refine button above the station sprite foot (footprint center).
 */
export function resolvingWorldPlazaOreSmeltingInteractionLabelScreenPoint(
  block: DefiningWorldBuildingPlacedBlock,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
  const footprintCenter =
    resolvingWorldPlazaOreSmeltingStationFootprintCenterTile(block);
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: footprintCenter.tileX,
    y: footprintCenter.tileY,
  });
  const footLayerOffsetY = computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx(
    worldLayer,
    blockHeight
  );
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: screenPoint.x,
        y: screenPoint.y + footLayerOffsetY,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_OFFSET_ABOVE_FOOT_PX *
        cameraWorldZoom,
  };
}
