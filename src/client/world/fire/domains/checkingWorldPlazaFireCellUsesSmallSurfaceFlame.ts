import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaFireIntensityTier } from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';
import {
  WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID,
  type WorldFireDevvitCell,
} from '../../../../shared/worldFireDevvit';

/** Smaller flame footprint for grass and wood floor fires. */
export const DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_FLAME_SCALE = 0.58;

/** Max sprite tier for grass and wood floor fires. */
export const DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_MAX_TIER =
  2 as DefiningWorldPlazaFireIntensityTier;

const DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_BLOCK_DEFINITION_IDS = new Set([
  WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID,
  'functional:door:wooden',
  'functional:sign:wooden',
]);

function findingWorldPlazaPlacedBlockAtFireCell(
  cell: WorldFireDevvitCell,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] | undefined
): DefiningWorldBuildingPlacedBlock | null {
  if (!placedBlocks) {
    return null;
  }

  return (
    placedBlocks.find(
      (block) =>
        block.tilePosition.tileX === cell.tileX &&
        block.tilePosition.tileY === cell.tileY &&
        resolvingWorldBuildingPlacedBlockWorldLayer(block) === cell.worldLayer
    ) ?? null
  );
}

/**
 * Returns true when a spreading fire should use the compact grass/wood flame set.
 */
export function checkingWorldPlazaFireCellUsesSmallSurfaceFlame(
  cell: WorldFireDevvitCell,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] | undefined
): boolean {
  if (cell.kind !== 'spreading') {
    return false;
  }

  const placedBlock = findingWorldPlazaPlacedBlockAtFireCell(
    cell,
    placedBlocks
  );

  if (!placedBlock) {
    return true;
  }

  return DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_BLOCK_DEFINITION_IDS.has(
    placedBlock.definitionId
  );
}
