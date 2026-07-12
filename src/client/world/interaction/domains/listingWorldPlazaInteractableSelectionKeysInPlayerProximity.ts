import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';
import { formattingWorldPlazaFarmlandTileSelectionKey } from '@/components/world/farming/domains/formattingWorldPlazaFarmlandTileSelectionKey';
import { listingWorldPlazaFarmlandTilesInInteractionRange } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import {
  applyingWorldPlazaRockMineStateToColumnRockMetadata,
  computingWorldPlazaRockMineableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaRockMineStateToColumnRockMetadata';
import {
  applyingWorldPlazaTreeChopStateToInstance,
  computingWorldPlazaTreeChoppableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { formattingWorldPlazaMinedRockTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { formattingWorldPlazaPickedPebbleTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES } from '@/components/world/interaction/domains/definingWorldPlazaInteractionLabelProximityConstants';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { formattingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';
import { formattingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ListingWorldPlazaInteractableSelectionKeysInPlayerProximityParams =
  {
    readonly playerPosition: DefiningWorldPlazaWorldPoint;
    readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
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
    readonly farmlandByTileKey?: ReadonlyMap<
      string,
      DefiningWorldPlazaFarmlandTileState
    >;
    readonly wildlifeStore?: ManagingWildlifeInstanceStore | null;
    readonly hasEquippedFishrod?: boolean;
    readonly hasEquippedHoe?: boolean;
    readonly hasEquippedScythe?: boolean;
    readonly hasSeedsInInventory?: boolean;
    readonly proximityRadiusTiles?: number;
  };

/**
 * Builds selection keys for every label-worthy interactable within proximity.
 *
 * Keys match the click-selection formatters so existing label list/progress
 * hooks keep working without per-label rewrites.
 */
export function listingWorldPlazaInteractableSelectionKeysInPlayerProximity(
  params: ListingWorldPlazaInteractableSelectionKeysInPlayerProximityParams
): ReadonlySet<string> {
  const radius =
    params.proximityRadiusTiles ??
    DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES;
  const centerTileX = Math.floor(params.playerPosition.x);
  const centerTileY = Math.floor(params.playerPosition.y);
  const keys = new Set<string>();
  const seenRockAnchors = new Set<string>();

  for (const block of params.placedBlocks) {
    if (
      block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
    ) {
      continue;
    }

    const distance = computingWorldPlazaGridChebyshevDistance(
      params.playerPosition.x,
      params.playerPosition.y,
      block.tilePosition.tileX + 0.5,
      block.tilePosition.tileY + 0.5
    );

    if (distance > radius) {
      continue;
    }

    keys.add(formattingWorldPlazaInteractableBlockSelectionKey(block));
  }

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const tileX = centerTileX + offsetX;
      const tileY = centerTileY + offsetY;

      const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
        tileX,
        tileY,
        params.placedBlocks
      );

      if (baseTree) {
        const tree = applyingWorldPlazaTreeChopStateToInstance(
          baseTree,
          params.choppedTreeStateByTileKey?.get(
            formattingWorldPlazaChoppedTreeTileKey(tileX, tileY)
          )
        );

        if (tree && computingWorldPlazaTreeChoppableLayerCount(tree) > 0) {
          keys.add(
            formattingWorldPlazaInteractableTreeSelectionKey(tileX, tileY)
          );
        }
      }

      const baseRock = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
        tileX,
        tileY
      );

      if (baseRock) {
        const anchorKey = formattingWorldPlazaMinedRockTileKey(
          baseRock.anchorTileX,
          baseRock.anchorTileY
        );

        if (!seenRockAnchors.has(anchorKey)) {
          seenRockAnchors.add(anchorKey);

          const rock = applyingWorldPlazaRockMineStateToColumnRockMetadata(
            baseRock,
            params.minedRockStateByTileKey?.get(anchorKey)
          );

          if (rock && computingWorldPlazaRockMineableLayerCount(rock) > 0) {
            keys.add(
              formattingWorldPlazaInteractableRockSelectionKey(
                baseRock.anchorTileX,
                baseRock.anchorTileY
              )
            );
          }
        }
      }

      const pebbleTileKey = formattingWorldPlazaPickedPebbleTileKey(
        tileX,
        tileY
      );

      if (!params.pickedPebbleStateByTileKey?.get(pebbleTileKey)?.isPicked) {
        const decoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
          tileX,
          tileY
        );

        if (decoration && decoration.surfaceWorldLayer === null) {
          keys.add(
            formattingWorldPlazaInteractablePebbleSelectionKey(tileX, tileY)
          );
        }
      }

      if (params.hasEquippedFishrod) {
        const fishingEligibility = checkingWorldPlazaFishingCastEligibility(
          params.playerPosition,
          tileX,
          tileY
        );

        if (
          fishingEligibility.isEligible &&
          computingWorldPlazaGridChebyshevDistance(
            params.playerPosition.x,
            params.playerPosition.y,
            tileX + 0.5,
            tileY + 0.5
          ) <= radius
        ) {
          keys.add(formattingWorldPlazaFishingTileSelectionKey(tileX, tileY));
        }
      }
    }
  }

  if (
    params.farmlandByTileKey &&
    (params.hasEquippedHoe ||
      params.hasEquippedScythe ||
      params.hasSeedsInInventory)
  ) {
    const farmlandEntries = listingWorldPlazaFarmlandTilesInInteractionRange({
      playerPosition: params.playerPosition,
      farmlandByTileKey: params.farmlandByTileKey,
      hasEquippedHoe: params.hasEquippedHoe ?? false,
      hasEquippedScythe: params.hasEquippedScythe ?? false,
      hasSeedsInInventory: params.hasSeedsInInventory ?? false,
    });

    for (const entry of farmlandEntries) {
      const distance = computingWorldPlazaGridChebyshevDistance(
        params.playerPosition.x,
        params.playerPosition.y,
        entry.tileX + 0.5,
        entry.tileY + 0.5
      );

      if (distance > radius) {
        continue;
      }

      keys.add(
        formattingWorldPlazaFarmlandTileSelectionKey(
          entry.tileX,
          entry.tileY,
          entry.interactionKind
        )
      );
    }
  }

  if (params.wildlifeStore) {
    for (const instance of listingWildlifeInstances(params.wildlifeStore)) {
      if (
        !instance.isDead ||
        instance.hasBeenStudied ||
        instance.diedAtMs === null
      ) {
        continue;
      }

      const distance = computingWorldPlazaGridChebyshevDistance(
        params.playerPosition.x,
        params.playerPosition.y,
        instance.position.x,
        instance.position.y
      );

      if (distance > radius) {
        continue;
      }

      keys.add(formattingWildlifeCorpseStudySelectionKey(instance.instanceId));
    }
  }

  return keys;
}
