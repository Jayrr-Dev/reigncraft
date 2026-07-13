import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  resolvingWorldBuildingEffectiveBlockHeight,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockBlockHeight } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  findingWorldBuildingPlacedBlockAtTileLayerIndex,
  listingWorldBuildingPlacedBlocksAtTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';

/**
 * Resolves the effective placement layer while hovering tiles in build mode.
 *
 * @module components/world/building/domains/resolvingWorldBuildingHoverPlacementWorldLayer
 */

export interface ResolvingWorldBuildingHoverPlacementWorldLayerParams {
  readonly tilePosition: DefiningWorldBuildingTilePosition | null;
  readonly selectedWorldLayer: number;
  readonly selectedBlockHeight: number;
  readonly placedBlocks: DefiningWorldBuildingPlacedBlock[];
}

/**
 * Returns true when a non-passable block caps the tile at the walkable surface.
 *
 * Solid caps need the next block stacked above (`L = S + H`). Terrain and
 * passable floors are walkable volume at `S`, so new blocks sit flush
 * (`L = S + H - 1`).
 */
function checkingWorldBuildingHoverPlacementHasSolidSurfaceCap(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  const blockAtSurface = findingWorldBuildingPlacedBlockAtTileLayerIndex(
    tileX,
    tileY,
    surfaceLayer,
    placedBlocks
  );

  if (!blockAtSurface) {
    return false;
  }

  return !checkingWorldBuildingPlacedBlockIsPassableTile(
    resolvingWorldBuildingPlacedBlockBlockHeight(blockAtSurface)
  );
}

/**
 * Returns the top anchor layer used for preview and placement on a hovered tile.
 *
 * World layer is the **top** anchor and columns extrude downward. On a walkable
 * surface `S` (terrain or passable floor), height `H` anchors at `S + H - 1` so
 * the bottom rests on `S`. On a solid block cap at `S`, anchors at `S + H` so
 * the bottom rests at `S + 1` (stacked on top). Empty flat-ground tiles keep
 * the sidebar layer, and a manually raised layer is still honored.
 *
 * @param params - Hover tile, sidebar layer, block height, and placed blocks.
 */
export function resolvingWorldBuildingHoverPlacementWorldLayer(
  params: ResolvingWorldBuildingHoverPlacementWorldLayerParams
): number {
  const selectedWorldLayer = clampingWorldBuildingWorldLayer(
    params.selectedWorldLayer
  );

  if (!params.tilePosition) {
    return selectedWorldLayer;
  }

  const { tileX, tileY } = params.tilePosition;
  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTileIndex(
    tileX,
    tileY,
    params.placedBlocks
  );
  const stackTopLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    params.placedBlocks
  );

  // Empty flat ground: sidebar L wins (manual raise still works).
  if (
    blocksOnTile.length === 0 &&
    stackTopLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  ) {
    return selectedWorldLayer;
  }

  const effectiveBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
    params.selectedBlockHeight,
    selectedWorldLayer
  );

  if (checkingWorldBuildingPlacedBlockIsPassableTile(effectiveBlockHeight)) {
    return clampingWorldBuildingWorldLayer(
      Math.max(selectedWorldLayer, stackTopLayer)
    );
  }

  const stackingBlockHeight = Math.max(1, effectiveBlockHeight);
  const hasSolidSurfaceCap = checkingWorldBuildingHoverPlacementHasSolidSurfaceCap(
    tileX,
    tileY,
    stackTopLayer,
    params.placedBlocks
  );
  // Solid cap: stack above (`S + H`). Terrain / passable: sit flush (`S + H - 1`).
  const stackedTopAnchorLayer = clampingWorldBuildingWorldLayer(
    hasSolidSurfaceCap
      ? stackTopLayer + stackingBlockHeight
      : stackTopLayer + stackingBlockHeight - 1
  );

  return clampingWorldBuildingWorldLayer(
    Math.max(selectedWorldLayer, stackedTopAnchorLayer)
  );
}
