import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { applyingWorldPlazaTreeChopStateToInstance } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import { DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID } from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey } from '@/components/world/harvest/domains/formattingWorldPlazaTreeStumpStudySelectionKey';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { checkingWorldPlazaLocalTreeStumpStudied } from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';

export type ListingWorldPlazaTreeStumpsInStudyRangeEntry = {
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly tileX: number;
  readonly tileY: number;
  readonly variant: DefiningWorldPlazaTreeVariantKind;
};

/**
 * Resolves selected stump Study targets that are still valid and in range.
 */
export function listingWorldPlazaTreeStumpsInStudyRange(params: {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly selectedKeys: ReadonlySet<string>;
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly persistenceOwnerId: string | null;
}): readonly ListingWorldPlazaTreeStumpsInStudyRangeEntry[] {
  const {
    placedBlocks,
    selectedKeys,
    playerPosition,
    choppedTreeStateByTileKey,
    persistenceOwnerId,
  } = params;

  if (!playerPosition || selectedKeys.size === 0) {
    return [];
  }

  const entries: ListingWorldPlazaTreeStumpsInStudyRangeEntry[] = [];

  for (const selectionKey of selectedKeys) {
    const tile =
      resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    if (
      checkingWorldPlazaLocalTreeStumpStudied(
        persistenceOwnerId,
        tile.tileX,
        tile.tileY
      )
    ) {
      continue;
    }

    const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tile.tileX,
      tile.tileY,
      placedBlocks
    );

    if (!baseTree) {
      continue;
    }

    const tree = applyingWorldPlazaTreeChopStateToInstance(
      baseTree,
      choppedTreeStateByTileKey?.get(
        formattingWorldPlazaChoppedTreeTileKey(tile.tileX, tile.tileY)
      )
    );

    if (!tree?.isStump) {
      continue;
    }

    const distance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      tile.tileX + 0.5,
      tile.tileY + 0.5
    );

    if (distance > DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID) {
      continue;
    }

    entries.push({
      tree,
      tileX: tile.tileX,
      tileY: tile.tileY,
      variant: tree.variant,
    });
  }

  return entries;
}
