import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBurnStageMetadataIsBurnt } from '../../../../shared/worldBurnStage';
import { WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID } from '../../../../shared/worldFireDevvit';

/** Charred wood floor top/side fill. */
const RESOLVING_WORLD_BUILDING_BURNT_WOOD_FILL_COLOR = 0x1a1410;

/** Charred wood floor stroke. */
const RESOLVING_WORLD_BUILDING_BURNT_WOOD_STROKE_COLOR = 0x0a0806;

/** Scorched grass-brown fill for other burnt blocks. */
const RESOLVING_WORLD_BUILDING_BURNT_GRASSY_FILL_COLOR = 0x4a3528;

/** Scorched grass-brown stroke for other burnt blocks. */
const RESOLVING_WORLD_BUILDING_BURNT_GRASSY_STROKE_COLOR = 0x2f2218;

const RESOLVING_WORLD_BUILDING_BURNT_WOOD_BLOCK_DEFINITION_IDS = new Set([
  WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID,
  'functional:door:wooden',
  'functional:sign:wooden',
]);

export type ResolvingWorldBuildingPlacedBlockVisualColors = {
  readonly fillColor: number;
  readonly strokeColor: number;
};

/**
 * Returns true when a placed block has finished burning.
 */
export function checkingWorldBuildingPlacedBlockIsBurnt(
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  return checkingWorldBurnStageMetadataIsBurnt(block.metadata);
}

function checkingWorldBuildingBlockDefinitionIsBurntWood(
  definitionId: string
): boolean {
  return RESOLVING_WORLD_BUILDING_BURNT_WOOD_BLOCK_DEFINITION_IDS.has(
    definitionId
  );
}

/**
 * Resolves fill/stroke colors for normal, burning, or burnt block visuals.
 */
export function resolvingWorldBuildingPlacedBlockVisualColors(
  block: DefiningWorldBuildingPlacedBlock,
  definition: DefiningWorldBuildingBlockDefinition
): ResolvingWorldBuildingPlacedBlockVisualColors {
  if (!checkingWorldBuildingPlacedBlockIsBurnt(block)) {
    return {
      fillColor: definition.visualConfig.fillColor,
      strokeColor: definition.visualConfig.strokeColor,
    };
  }

  if (checkingWorldBuildingBlockDefinitionIsBurntWood(definition.id)) {
    return {
      fillColor: RESOLVING_WORLD_BUILDING_BURNT_WOOD_FILL_COLOR,
      strokeColor: RESOLVING_WORLD_BUILDING_BURNT_WOOD_STROKE_COLOR,
    };
  }

  return {
    fillColor: RESOLVING_WORLD_BUILDING_BURNT_GRASSY_FILL_COLOR,
    strokeColor: RESOLVING_WORLD_BUILDING_BURNT_GRASSY_STROKE_COLOR,
  };
}
