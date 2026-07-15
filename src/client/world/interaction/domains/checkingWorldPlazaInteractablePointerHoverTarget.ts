import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { findingWorldPlazaTreeStumpAtGridPoint } from '@/components/world/harvest/domains/findingWorldPlazaTreeStumpAtGridPoint';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import type { DefiningWorldPlazaPickedMushroomTileState } from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';
import type { DefiningWorldPlazaInteractablePointerHitContext } from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerHitContext';
import { resolvingWorldPlazaInteractableFlowerFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableFlowerFromPointerGridPoint';
import { resolvingWorldPlazaInteractableMushroomFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableMushroomFromPointerGridPoint';
import { resolvingWorldPlazaInteractableLongGrassFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableLongGrassFromPointerGridPoint';
import { DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_HIT_RADIUS_TILES } from '@/components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants';
import { DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_HIT_RADIUS_TILES } from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import { resolvingWorldPlazaInteractableShrubFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableShrubFromPointerGridPoint';
import { DEFINING_WORLD_PLAZA_CHEST_POINTER_HIT_RADIUS_TILES } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { resolvingWorldPlazaInteractableChestFromPointerGridPoint } from '@/components/world/chest/domains/resolvingWorldPlazaInteractableChestFromPointerGridPoint';
import { resolvingWorldPlazaInteractablePebbleFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePebbleFromPointerGridPoint';
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
  readonly pickedPebbleStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
  readonly pickedMushroomStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >;
  readonly wildlifeStore: ManagingWildlifeInstanceStore;
  readonly resolveWildlifeCollisionRadiusGrid: (
    instance: DefiningWildlifeInstance
  ) => number;
};

/**
 * True when the pointer is over a clickable corpse, studiable stump, campfire,
 * choppable tree, mineable rock, or pickable pebble. Corpse hover uses a
 * dedicated cursor in the plaza scene; this still returns true so callers can
 * treat corpses as interactable.
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
    pickedPebbleStateByTileKey,
    pickedFlowerStateByTileKey,
    pickedMushroomStateByTileKey,
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
    const stumpPointerContext = {
      gridPoint: pointerContext.gridPoint,
      viewportScreenPoint: pointerContext.viewportScreenPoint,
      cameraOffset: pointerContext.cameraOffset,
      cameraWorldZoom: pointerContext.cameraWorldZoom,
    };

    const stumpMatch = findingWorldPlazaTreeStumpAtGridPoint(
      stumpPointerContext,
      playerPosition,
      placedBlocks,
      chopPersistenceOwnerId,
      choppedTreeStateByTileKey
    );

    if (stumpMatch !== null) {
      return true;
    }

    const treeMatch = resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
      stumpPointerContext,
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

  if (rockMatch !== null) {
    return true;
  }

  const pebbleMatch = resolvingWorldPlazaInteractablePebbleFromPointerGridPoint(
    pointerContext.gridPoint,
    playerPosition,
    chopPersistenceOwnerId,
    pickedPebbleStateByTileKey
  );

  if (pebbleMatch !== null) {
    return true;
  }

  const flowerMatch = resolvingWorldPlazaInteractableFlowerFromPointerGridPoint(
    pointerContext.gridPoint,
    playerPosition,
    chopPersistenceOwnerId,
    pickedFlowerStateByTileKey
  );

  if (flowerMatch !== null) {
    return true;
  }

  const mushroomMatch =
    resolvingWorldPlazaInteractableMushroomFromPointerGridPoint(
      pointerContext.gridPoint,
      playerPosition,
      chopPersistenceOwnerId,
      pickedMushroomStateByTileKey
    );

  if (mushroomMatch !== null) {
    return true;
  }

  const longGrassMatch =
    resolvingWorldPlazaInteractableLongGrassFromPointerGridPoint(
      pointerContext.gridPoint.x,
      pointerContext.gridPoint.y,
      DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_HIT_RADIUS_TILES
    );

  if (longGrassMatch !== null) {
    return true;
  }

  const shrubMatch = resolvingWorldPlazaInteractableShrubFromPointerGridPoint(
    pointerContext.gridPoint.x,
    pointerContext.gridPoint.y,
    DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_HIT_RADIUS_TILES
  );

  if (shrubMatch !== null) {
    return true;
  }

  const chestMatch = resolvingWorldPlazaInteractableChestFromPointerGridPoint(
    pointerContext.gridPoint.x,
    pointerContext.gridPoint.y,
    DEFINING_WORLD_PLAZA_CHEST_POINTER_HIT_RADIUS_TILES
  );

  return chestMatch !== null;
}
