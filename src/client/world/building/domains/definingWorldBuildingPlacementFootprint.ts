import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  creatingWorldBuildingTilePosition,
  type DefiningWorldBuildingTilePosition,
} from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';

/**
 * Multi-tile placement footprint helpers for craft utilities (e.g. 2x2 kiln).
 *
 * @module components/world/building/domains/definingWorldBuildingPlacementFootprint
 */

/** Shared id tying every tile of one multi-tile placement together. */
export const DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY =
  'footprintGroupId' as const;

/** Anchor draws the sprite; satellites only reserve tiles. */
export const DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY =
  'footprintRole' as const;

export const DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR = 'anchor' as const;
export const DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE =
  'satellite' as const;

export type DefiningWorldBuildingFootprintRole =
  | typeof DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR
  | typeof DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE;

export type DefiningWorldBuildingPlacementFootprint = {
  readonly tileWidth: number;
  readonly tileHeight: number;
};

/**
 * Resolves placement footprint span for a block definition (defaults to 1x1).
 */
export function resolvingWorldBuildingBlockPlacementFootprint(
  definition: DefiningWorldBuildingBlockDefinition
): DefiningWorldBuildingPlacementFootprint {
  const tileWidth = Math.max(
    1,
    Math.floor(definition.placementFootprintTileWidth ?? 1)
  );
  const tileHeight = Math.max(
    1,
    Math.floor(definition.placementFootprintTileHeight ?? 1)
  );

  return { tileWidth, tileHeight };
}

/**
 * Lists tile positions covered by a footprint anchored at the click tile.
 * Anchor is the north-west (min X / min Y) corner; span grows +X / +Y.
 */
export function listingWorldBuildingPlacementFootprintTilePositions(
  anchorTilePosition: DefiningWorldBuildingTilePosition,
  footprint: DefiningWorldBuildingPlacementFootprint
): DefiningWorldBuildingTilePosition[] {
  const tilePositions: DefiningWorldBuildingTilePosition[] = [];

  for (let offsetY = 0; offsetY < footprint.tileHeight; offsetY += 1) {
    for (let offsetX = 0; offsetX < footprint.tileWidth; offsetX += 1) {
      tilePositions.push(
        creatingWorldBuildingTilePosition(
          anchorTilePosition.tileX + offsetX,
          anchorTilePosition.tileY + offsetY
        )
      );
    }
  }

  return tilePositions;
}

/**
 * True when the footprint is larger than a single tile.
 */
export function checkingWorldBuildingPlacementFootprintIsMultiTile(
  footprint: DefiningWorldBuildingPlacementFootprint
): boolean {
  return footprint.tileWidth * footprint.tileHeight > 1;
}

/**
 * Resolves footprint role from placed-block metadata.
 */
export function resolvingWorldBuildingPlacedBlockFootprintRole(
  block: DefiningWorldBuildingPlacedBlock
): DefiningWorldBuildingFootprintRole | null {
  const role = block.metadata[DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY];

  if (
    role === DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR ||
    role === DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE
  ) {
    return role;
  }

  return null;
}

/**
 * Resolves shared footprint group id (anchor block id), or null for 1x1 blocks.
 */
export function resolvingWorldBuildingPlacedBlockFootprintGroupId(
  block: DefiningWorldBuildingPlacedBlock
): string | null {
  const groupId =
    block.metadata[DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY];

  return typeof groupId === 'string' && groupId.length > 0 ? groupId : null;
}

/**
 * True when this tile is a satellite reservation (no sprite / no refund alone).
 */
export function checkingWorldBuildingPlacedBlockIsFootprintSatellite(
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  return (
    resolvingWorldBuildingPlacedBlockFootprintRole(block) ===
    DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE
  );
}

/**
 * Lists every placed block that shares a footprint group with the given block.
 */
export function listingWorldBuildingPlacedBlocksInFootprintGroup(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  block: DefiningWorldBuildingPlacedBlock
): DefiningWorldBuildingPlacedBlock[] {
  const groupId =
    resolvingWorldBuildingPlacedBlockFootprintGroupId(block) ?? block.blockId;

  return placedBlocks.filter((candidate) => {
    const candidateGroupId =
      resolvingWorldBuildingPlacedBlockFootprintGroupId(candidate) ??
      candidate.blockId;

    return candidateGroupId === groupId;
  });
}
