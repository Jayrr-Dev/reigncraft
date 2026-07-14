import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { checkingWorldPlazaOreSmeltingStationBlockDefinitionId } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import { resolvingWorldPlazaOreSmeltingStationAnchorBlock } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAnchorBlock';
import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import { checkingWorldPlazaPickableFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex';
import { checkingWorldPlazaShrubDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaShrubDecorationAtTileIndex';
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
import { formattingWorldPlazaTreeStumpStudySelectionKey } from '@/components/world/harvest/domains/formattingWorldPlazaTreeStumpStudySelectionKey';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { formattingWorldPlazaClearedLongGrassTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { formattingWorldPlazaMinedRockTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { formattingWorldPlazaPickedFlowerTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { formattingWorldPlazaPickedPebbleTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { formattingWorldPlazaPickedShrubTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { checkingWorldPlazaLocalTreeStumpStudied } from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';
import { checkingWorldPlazaInteractionLabelTileInPlayerProximity } from '@/components/world/interaction/domains/checkingWorldPlazaInteractionLabelTileInPlayerProximity';
import { DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES } from '@/components/world/interaction/domains/definingWorldPlazaInteractionLabelProximityConstants';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';
import { formattingWorldPlazaInteractableFlowerSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';
import { formattingWorldPlazaInteractableLongGrassSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableLongGrassSelectionKey';
import { formattingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';
import { formattingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';
import { formattingWorldPlazaInteractableShrubSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableShrubSelectionKey';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { checkingWildlifeDocilePetProximityActionAvailable } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetProximityActionAvailable';
import { resolvingWildlifeDocilePetKind } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import { formattingWildlifeDocilePetSelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeDocilePetSelectionKey';
import {
  DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID,
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { formattingNpcSelectionKey } from '@/components/world/npc/domains/formattingNpcSelectionKey';
import {
  listingNpcInstances,
  type ManagingNpcInstanceStore,
} from '@/components/world/npc/domains/managingNpcInstanceStore';
import { DEFINING_NPC_PLAYER_INTERACT_REACH_GRID } from '@/components/world/npc/domains/definingNpcActionConstants';
import { DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { formattingWorldPlazaInteractableChestSelectionKey } from '@/components/world/chest/domains/formattingWorldPlazaInteractableChestSelectionKey';
import { listingWorldPlazaChestsNearPlayerPosition } from '@/components/world/chest/domains/listingWorldPlazaChestsInInteractionRange';
import { DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACT_REACH_GRID } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import { formattingWorldPlazaInteractableBearTrapSelectionKey } from '@/components/world/trap/domains/formattingWorldPlazaInteractableBearTrapSelectionKey';
import { listingWorldPlazaBearTrapsNearPlayerPosition } from '@/components/world/trap/domains/listingWorldPlazaBearTrapsInInteractionRange';
import { DEFINING_WORLD_PLAZA_CALTROP_INTERACT_REACH_GRID } from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import { formattingWorldPlazaInteractableCaltropSelectionKey } from '@/components/world/trap/domains/formattingWorldPlazaInteractableCaltropSelectionKey';
import { listingWorldPlazaCaltropsNearPlayerPosition } from '@/components/world/trap/domains/listingWorldPlazaCaltropsInInteractionRange';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

export type ListingWorldPlazaInteractableSelectionKeysInPlayerProximityParams =
  {
    readonly playerPosition: DefiningWorldPlazaWorldPoint;
    readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
    readonly choppedTreeStateByTileKey?: ReadonlyMap<
      string,
      DefiningWorldPlazaChoppedTreeTileState
    >;
    /** Local herbarium owner used to skip already-studied stumps. */
    readonly chopPersistenceOwnerId?: string | null;
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
    readonly clearedLongGrassStateByTileKey?: ReadonlyMap<
      string,
      DefiningWorldPlazaClearedLongGrassTileState
    >;
    readonly pickedShrubStateByTileKey?: ReadonlyMap<
      string,
      DefiningWorldPlazaPickedShrubTileState
    >;
    readonly farmlandByTileKey?: ReadonlyMap<
      string,
      DefiningWorldPlazaFarmlandTileState
    >;
    readonly wildlifeStore?: ManagingWildlifeInstanceStore | null;
    readonly npcStore?: ManagingNpcInstanceStore | null;
    readonly hasEquippedFishrod?: boolean;
    readonly hasEquippedHoe?: boolean;
    readonly hasEquippedScythe?: boolean;
    readonly hasSeedsInInventory?: boolean;
    readonly proximityRadiusTiles?: number;
    /** Wall-clock ms used to filter Pet cooldowns on living companions. */
    readonly nowMs?: number;
  };

/**
 * Builds selection keys for every label-worthy interactable within proximity.
 *
 * Distance is floor-tile Chebyshev (not continuous center distance), so any
 * standing point on an adjacent tile counts — including the far / “above” edge.
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

    if (
      !checkingWorldPlazaInteractionLabelTileInPlayerProximity(
        params.playerPosition,
        block.tilePosition.tileX,
        block.tilePosition.tileY,
        radius
      )
    ) {
      continue;
    }

    keys.add(formattingWorldPlazaInteractableBlockSelectionKey(block));
  }

  for (const block of params.placedBlocks) {
    if (!checkingWorldPlazaOreSmeltingStationBlockDefinitionId(block.definitionId)) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
    const footprint = definition
      ? resolvingWorldBuildingBlockPlacementFootprint(definition)
      : { tileWidth: 1, tileHeight: 1 };
    const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
      block.tilePosition,
      footprint
    );
    const isInProximity = footprintTiles.some((footprintTile) =>
      checkingWorldPlazaInteractionLabelTileInPlayerProximity(
        params.playerPosition,
        footprintTile.tileX,
        footprintTile.tileY,
        radius
      )
    );

    if (!isInProximity) {
      continue;
    }

    const anchorBlock = resolvingWorldPlazaOreSmeltingStationAnchorBlock(
      params.placedBlocks,
      block
    );
    keys.add(formattingWorldPlazaInteractableBlockSelectionKey(anchorBlock));
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
        } else if (
          tree?.isStump &&
          !checkingWorldPlazaLocalTreeStumpStudied(
            params.chopPersistenceOwnerId ?? null,
            tileX,
            tileY
          )
        ) {
          keys.add(
            formattingWorldPlazaTreeStumpStudySelectionKey(tileX, tileY)
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

      const flowerTileKey = formattingWorldPlazaPickedFlowerTileKey(
        tileX,
        tileY
      );

      if (
        !params.pickedFlowerStateByTileKey?.get(flowerTileKey)?.isPicked &&
        checkingWorldPlazaPickableFlowerDecorationAtTileIndex(tileX, tileY)
      ) {
        keys.add(
          formattingWorldPlazaInteractableFlowerSelectionKey(tileX, tileY)
        );
      }

      const longGrassTileKey = formattingWorldPlazaClearedLongGrassTileKey(
        tileX,
        tileY
      );

      const longGrassTileState =
        params.clearedLongGrassStateByTileKey?.get(longGrassTileKey);

      if (
        !longGrassTileState?.isSearched &&
        !longGrassTileState?.isEaten &&
        !checkingWorldPlazaRuntimeLongGrassIsCleared(tileX, tileY) &&
        checkingWorldPlazaLongGrassDecorationAtTileIndex(tileX, tileY)
      ) {
        keys.add(
          formattingWorldPlazaInteractableLongGrassSelectionKey(tileX, tileY)
        );
      }

      const shrubTileKey = formattingWorldPlazaPickedShrubTileKey(tileX, tileY);

      if (
        !params.pickedShrubStateByTileKey?.get(shrubTileKey)?.isPicked &&
        !checkingWorldPlazaRuntimeShrubIsPicked(tileX, tileY) &&
        checkingWorldPlazaShrubDecorationAtTileIndex(tileX, tileY)
      ) {
        keys.add(
          formattingWorldPlazaInteractableShrubSelectionKey(tileX, tileY)
        );
      }

      if (params.hasEquippedFishrod) {
        const fishingEligibility = checkingWorldPlazaFishingCastEligibility(
          params.playerPosition,
          tileX,
          tileY
        );

        if (fishingEligibility.isEligible) {
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
      if (
        !checkingWorldPlazaInteractionLabelTileInPlayerProximity(
          params.playerPosition,
          entry.tileX,
          entry.tileY,
          radius
        )
      ) {
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
    const nowMs = params.nowMs ?? Date.now();
    const meleeReachSq =
      DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID *
      DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID;

    for (const instance of listingWildlifeInstances(params.wildlifeStore)) {
      if (
        instance.isDead &&
        !instance.hasBeenStudied &&
        instance.diedAtMs !== null
      ) {
        if (
          checkingWorldPlazaInteractionLabelTileInPlayerProximity(
            params.playerPosition,
            Math.floor(instance.position.x),
            Math.floor(instance.position.y),
            radius
          )
        ) {
          keys.add(
            formattingWildlifeCorpseStudySelectionKey(instance.instanceId)
          );
        }
        continue;
      }

      if (
        instance.isDead ||
        resolvingWildlifeDocilePetKind(instance.speciesId) === null ||
        !checkingWildlifeDocilePetProximityActionAvailable(instance, nowMs)
      ) {
        continue;
      }

      const dx = instance.position.x - params.playerPosition.x;
      const dy = instance.position.y - params.playerPosition.y;

      if (dx * dx + dy * dy > meleeReachSq) {
        continue;
      }

      keys.add(formattingWildlifeDocilePetSelectionKey(instance.instanceId));
    }
  }

  if (params.npcStore) {
    const npcReachSq =
      DEFINING_NPC_PLAYER_INTERACT_REACH_GRID *
      DEFINING_NPC_PLAYER_INTERACT_REACH_GRID;

    for (const instance of listingNpcInstances(params.npcStore)) {
      if (instance.isDead) {
        continue;
      }

      const dx = instance.position.x - params.playerPosition.x;
      const dy = instance.position.y - params.playerPosition.y;

      if (dx * dx + dy * dy > npcReachSq) {
        continue;
      }

      keys.add(formattingNpcSelectionKey(instance.npcId));
    }
  }

  if (
    checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS
    )
  ) {
    for (const chest of listingWorldPlazaChestsNearPlayerPosition(
      params.playerPosition.x,
      params.playerPosition.y,
      DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID
    )) {
      if (chest.state === 'open') {
        continue;
      }

      keys.add(
        formattingWorldPlazaInteractableChestSelectionKey(chest.chestId)
      );
    }
  }

  if (
    checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
    )
  ) {
    for (const trap of listingWorldPlazaBearTrapsNearPlayerPosition(
      params.playerPosition.x,
      params.playerPosition.y,
      DEFINING_WORLD_PLAZA_BEAR_TRAP_INTERACT_REACH_GRID
    )) {
      keys.add(
        formattingWorldPlazaInteractableBearTrapSelectionKey(trap.trapId)
      );
    }

    for (const trap of listingWorldPlazaCaltropsNearPlayerPosition(
      params.playerPosition.x,
      params.playerPosition.y,
      DEFINING_WORLD_PLAZA_CALTROP_INTERACT_REACH_GRID
    )) {
      keys.add(
        formattingWorldPlazaInteractableCaltropSelectionKey(trap.trapId)
      );
    }
  }

  return keys;
}
