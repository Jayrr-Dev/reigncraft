/**
 * Builds night light sources for active ore-smelting stations.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingLightSources
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  resolvingWorldBuildingBlockPlacementFootprint,
  resolvingWorldBuildingPlacedBlockFootprintGroupId,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint } from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import {
  DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_RADIUS_SCALE,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_TINT,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingLightConstants';
import { checkingWorldPlazaOreSmeltingStationBlockDefinitionId } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';

/**
 * One warm ground glow per active bloomery / kiln / stove anchor (footprint center).
 */
export function resolvingWorldPlazaOreSmeltingLightSources(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  activeBlockIds: ReadonlySet<string>
): readonly DefiningWorldPlazaLightSource[] {
  if (activeBlockIds.size === 0) {
    return [];
  }

  const lights: DefiningWorldPlazaLightSource[] = [];
  const seenAnchorBlockIds = new Set<string>();

  for (const block of placedBlocks) {
    if (!checkingWorldPlazaOreSmeltingStationBlockDefinitionId(block.definitionId)) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const footprintGroupId =
      resolvingWorldBuildingPlacedBlockFootprintGroupId(block) ?? block.blockId;

    if (
      !activeBlockIds.has(block.blockId) &&
      !activeBlockIds.has(footprintGroupId)
    ) {
      continue;
    }

    if (seenAnchorBlockIds.has(block.blockId)) {
      continue;
    }

    seenAnchorBlockIds.add(block.blockId);

    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
    const footprint = definition
      ? resolvingWorldBuildingBlockPlacementFootprint(definition)
      : { tileWidth: 1, tileHeight: 1 };
    const footCenter = resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint(
      block.tilePosition.tileX,
      block.tilePosition.tileY,
      footprint.tileWidth,
      footprint.tileHeight
    );

    lights.push({
      id: `ore-smelting:${block.blockId}`,
      gridX: footCenter.x,
      gridY: footCenter.y,
      worldLayer: block.worldLayer,
      radiusScale: DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_RADIUS_SCALE,
      brightness: DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_BRIGHTNESS,
      colorTint: DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_TINT,
    });
  }

  return lights;
}
