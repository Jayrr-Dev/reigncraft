import { DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS } from "@/components/world/domains/definingWorldPlazaBiomeWaterPlacementConstants";
import type { DefiningWorldPlazaBiomeKind } from "@/components/world/domains/definingWorldPlazaBiomeKind";
import {
  DEFINING_WORLD_PLAZA_WATER_STILL_WATER_BIOME_BORDER_BUFFER_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BIOME_BORDER_BUFFER_BLOCKS,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import {
  checkingWorldPlazaBiomeAllowsStillWaterKind,
  resolvingWorldPlazaStillWaterRegionKindAtTileIndex,
} from "@/components/world/domains/resolvingWorldPlazaStillWaterRegionKindAtTileIndex";

/**
 * Placement gates for lakes, ponds, and swamp pools.
 *
 * @module components/world/domains/checkingWorldPlazaStillWaterPlacementAtTileIndex
 */

type CheckingWorldPlazaStillWaterKind =
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_LAKE
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_POND
  | typeof DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND;

/**
 * Returns true when a neighbor biome cannot host the still water kind being placed.
 *
 * @param neighborBiomeKind - Neighbor tile biome id.
 * @param waterKind - Lake, pond, or swamp pond variant.
 */
function checkingWorldPlazaNeighborBiomeConflictsWithStillWaterKind(
  neighborBiomeKind: DefiningWorldPlazaBiomeKind,
  waterKind: CheckingWorldPlazaStillWaterKind,
): boolean {
  return !DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS[neighborBiomeKind].includes(
    waterKind,
  );
}

/**
 * Returns true when every tile within the biome border buffer allows the same
 * still water kind as the center tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, pond, or swamp pond variant.
 */
export function checkingWorldPlazaStillWaterIsInsideCompatibleBiomeAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: CheckingWorldPlazaStillWaterKind,
): boolean {
  const borderBufferBlocks =
    waterKind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
      ? DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BIOME_BORDER_BUFFER_BLOCKS
      : DEFINING_WORLD_PLAZA_WATER_STILL_WATER_BIOME_BORDER_BUFFER_BLOCKS;

  for (let deltaY = -borderBufferBlocks; deltaY <= borderBufferBlocks; deltaY += 1) {
    for (
      let deltaX = -borderBufferBlocks;
      deltaX <= borderBufferBlocks;
      deltaX += 1
    ) {
      const chebyshevDistanceBlocks = Math.max(
        Math.abs(deltaX),
        Math.abs(deltaY),
      );

      if (chebyshevDistanceBlocks > borderBufferBlocks) {
        continue;
      }

      const neighborBiomeKind = resolvingWorldPlazaBiomeAtTileIndex(
        tileX + deltaX,
        tileY + deltaY,
      ).kind;

      if (
        checkingWorldPlazaNeighborBiomeConflictsWithStillWaterKind(
          neighborBiomeKind,
          waterKind,
        )
      ) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Returns true when the tile sits in the correct still-water region and biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, pond, or swamp pond variant.
 */
export function checkingWorldPlazaStillWaterPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: CheckingWorldPlazaStillWaterKind,
): boolean {
  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;

  if (!checkingWorldPlazaBiomeAllowsStillWaterKind(biomeKind, waterKind)) {
    return false;
  }

  if (
    resolvingWorldPlazaStillWaterRegionKindAtTileIndex(tileX, tileY) !==
    waterKind
  ) {
    return false;
  }

  return checkingWorldPlazaStillWaterIsInsideCompatibleBiomeAtTileIndex(
    tileX,
    tileY,
    waterKind,
  );
}
