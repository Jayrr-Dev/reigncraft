import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBuildingPlacedBlockCanInteract } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { findingWorldBuildingPlacedBlockAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type {
  DefiningWorldPlazaInteractableBlockClickActionDefinition,
  ResolvingWorldPlazaInteractablePlacedBlockFromPointerGridPointResult,
} from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction';
import { resolvingWorldPlazaInteractableBlockClickAction } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickActionRegistry';

function checkingWorldPlazaInteractableBlockClickActorCanUseBlock(
  block: DefiningWorldBuildingPlacedBlock,
  action: DefiningWorldPlazaInteractableBlockClickActionDefinition,
  actorUserId: string | null
): boolean {
  if (!action.requiresPlotOwner) {
    return true;
  }

  if (!actorUserId) {
    return false;
  }

  return checkingWorldBuildingPlacedBlockCanInteract(block, actorUserId);
}

function resolvingWorldPlazaInteractablePlacedBlockPointerDistance(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  block: DefiningWorldBuildingPlacedBlock,
  action: DefiningWorldPlazaInteractableBlockClickActionDefinition
): number | null {
  if (action.hitTest === 'tile') {
    const snappedTile = snappingWorldBuildingTilePositionFromGridPoint(
      pointerGridPoint
    );

    if (!snappedTile) {
      return null;
    }

    if (
      snappedTile.tileX !== block.tilePosition.tileX ||
      snappedTile.tileY !== block.tilePosition.tileY
    ) {
      return null;
    }

    return 0;
  }

  const pointerHitRadiusTiles = action.pointerHitRadiusTiles;

  if (pointerHitRadiusTiles === undefined) {
    return null;
  }

  const pointerDistance = computingWorldPlazaGridChebyshevDistance(
    pointerGridPoint.x,
    pointerGridPoint.y,
    block.tilePosition.tileX,
    block.tilePosition.tileY
  );

  if (pointerDistance > pointerHitRadiusTiles) {
    return null;
  }

  return pointerDistance;
}

/**
 * Resolves the nearest interactable placed block under a pointer using the
 * shared click-action registry.
 */
export function resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  actorUserId: string | null,
  enabledDefinitionIds: ReadonlySet<string>
): ResolvingWorldPlazaInteractablePlacedBlockFromPointerGridPointResult | null {
  let closestMatch: ResolvingWorldPlazaInteractablePlacedBlockFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const block of placedBlocks) {
    if (!enabledDefinitionIds.has(block.definitionId)) {
      continue;
    }

    const action = resolvingWorldPlazaInteractableBlockClickAction(
      block.definitionId
    );

    if (!action) {
      continue;
    }

    if (
      !checkingWorldPlazaInteractableBlockClickActorCanUseBlock(
        block,
        action,
        actorUserId
      )
    ) {
      continue;
    }

    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      block.tilePosition.tileX + 0.5,
      block.tilePosition.tileY + 0.5
    );

    if (playerDistance > action.playerRangeTiles) {
      continue;
    }

    const pointerDistance = resolvingWorldPlazaInteractablePlacedBlockPointerDistance(
      pointerGridPoint,
      block,
      action
    );

    if (pointerDistance === null) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = { block, action };
    }
  }

  return closestMatch;
}

/**
 * Resolves an interactable block on an exact snapped tile (no forgiving radius).
 */
export function resolvingWorldPlazaInteractablePlacedBlockAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  actorUserId: string | null,
  enabledDefinitionIds: ReadonlySet<string>
): ResolvingWorldPlazaInteractablePlacedBlockFromPointerGridPointResult | null {
  const block = findingWorldBuildingPlacedBlockAtTileIndex(
    tileX,
    tileY,
    placedBlocks
  );

  if (!block || !enabledDefinitionIds.has(block.definitionId)) {
    return null;
  }

  const action = resolvingWorldPlazaInteractableBlockClickAction(
    block.definitionId
  );

  if (!action) {
    return null;
  }

  if (
    !checkingWorldPlazaInteractableBlockClickActorCanUseBlock(
      block,
      action,
      actorUserId
    )
  ) {
    return null;
  }

  return { block, action };
}
