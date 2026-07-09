import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaInteractablePointerHitContext } from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerHitContext';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';
import { resolvingWorldPlazaInteractableRockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableRockFromPointerGridPoint';
import { resolvingWorldPlazaInteractableTreeFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableTreeFromPointerGridPoint';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { findingWildlifeCorpseAtGridPoint } from '@/components/world/wildlife/domains/findingWildlifeCorpseAtGridPoint';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/** Block definition ids that show a pointer cursor on hover. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_HOVER_DEFINITION_IDS: ReadonlySet<string> =
  new Set([
    DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
    DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  ]);

export type CheckingWorldPlazaInteractablePointerHoverTargetInput = {
  readonly pointerContext: DefiningWorldPlazaInteractablePointerHitContext;
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly actorUserId: string | null;
  readonly chopPersistenceOwnerId: string | null;
  readonly choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
  readonly wildlifeStore: ManagingWildlifeInstanceStore;
  readonly resolveWildlifeCollisionRadiusGrid: (
    instance: DefiningWildlifeInstance
  ) => number;
};

/**
 * True when the pointer is over a clickable corpse, campfire, choppable tree,
 * or mineable rock. Corpse hover uses a dedicated cursor in the plaza scene;
 * this still returns true so callers can treat corpses as interactable.
 */
export function checkingWorldPlazaInteractablePointerHoverTarget(
  input: CheckingWorldPlazaInteractablePointerHoverTargetInput
): boolean {
  const {
    pointerContext,
    playerPosition,
    placedBlocks,
    actorUserId,
    chopPersistenceOwnerId,
    choppedTreeStateByTileKey,
    minedRockStateByTileKey,
    wildlifeStore,
    resolveWildlifeCollisionRadiusGrid,
  } = input;

  const hoveredCorpse = findingWildlifeCorpseAtGridPoint(
    wildlifeStore,
    pointerContext.gridPoint,
    resolveWildlifeCollisionRadiusGrid
  );

  if (hoveredCorpse) {
    return true;
  }

  if (!playerPosition) {
    return false;
  }

  const placedMatch =
    resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
      pointerContext,
      playerPosition,
      placedBlocks,
      actorUserId,
      DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_HOVER_DEFINITION_IDS
    );

  if (placedMatch) {
    return true;
  }

  if (
    pointerContext.viewportScreenPoint !== undefined &&
    pointerContext.cameraOffset !== undefined &&
    pointerContext.cameraWorldZoom !== undefined
  ) {
    const treeMatch = resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
      {
        gridPoint: pointerContext.gridPoint,
        viewportScreenPoint: pointerContext.viewportScreenPoint,
        cameraOffset: pointerContext.cameraOffset,
        cameraWorldZoom: pointerContext.cameraWorldZoom,
      },
      playerPosition,
      placedBlocks,
      chopPersistenceOwnerId,
      choppedTreeStateByTileKey
    );

    if (treeMatch !== null) {
      return true;
    }
  }

  const rockMatch = resolvingWorldPlazaInteractableRockFromPointerGridPoint(
    pointerContext.gridPoint,
    playerPosition,
    chopPersistenceOwnerId,
    minedRockStateByTileKey
  );

  return rockMatch !== null;
}
