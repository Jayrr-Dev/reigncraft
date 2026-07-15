/**
 * Syncs Pixi sprites for craftable storage chest blocks.
 *
 * @module components/world/storage-chest/domains/syncingWorldPlazaVisibleStorageChestLayer
 */

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { checkingWorldBuildingPlacedBlockIsPassableTile } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBuildingPlacedBlockIsFootprintSatellite } from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import {
  resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
  resolvingWorldPlazaBlacksmithUtilityEntityZIndex,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { peekingWorldPlazaChestSpriteTextureForUrlFromManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_FOOT_SINK_PX,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_ALPHA,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_BLOCK_ID,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_CLOSED,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_OPEN,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants';
import type { Sprite, Texture } from 'pixi.js';

export type SyncingWorldPlazaStorageChestSpriteState = {
  readonly spriteByBlockId: Map<string, Sprite>;
};

export function checkingWorldBuildingBlockDefinitionIdIsStorageChest(
  definitionId: string
): boolean {
  return definitionId === DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC;
}

function applyingWorldPlazaStorageChestToSprite(
  sprite: Sprite,
  block: DefiningWorldBuildingPlacedBlock,
  texture: Texture
): void {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
  const depthSortGridPoint =
    resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint(
      block.tilePosition.tileX,
      block.tilePosition.tileY,
      1,
      1
    );
  const screenPoint =
    convertingWorldPlazaGridPointToIsometricScreenPoint(depthSortGridPoint);
  const layerOffsetY = checkingWorldBuildingPlacedBlockIsPassableTile(
    blockHeight
  )
    ? computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer)
    : computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer - 1);
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_STORAGE_CHEST_DISPLAY_SCALE;
  const textureScale = targetWidth / Math.max(texture.width, 1);

  sprite.texture = texture;
  sprite.visible = true;
  sprite.anchor.set(0.5, 1);
  sprite.scale.set(textureScale);
  sprite.position.set(
    screenPoint.x,
    screenPoint.y +
      layerOffsetY +
      DEFINING_WORLD_PLAZA_STORAGE_CHEST_FOOT_SINK_PX
  );
  sprite.zIndex = resolvingWorldPlazaBlacksmithUtilityEntityZIndex(
    block.tilePosition.tileX,
    block.tilePosition.tileY,
    1,
    1
  );
}

/**
 * Keeps storage-chest sprites in sync with placed blocks + open UI state.
 */
export function syncingWorldPlazaVisibleStorageChestLayer(input: {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  readonly openBlockIds?: ReadonlySet<string>;
  readonly state: SyncingWorldPlazaStorageChestSpriteState;
  readonly creatingSprite: () => Sprite;
  readonly destroyingSprite: (sprite: Sprite) => void;
}): { readonly needsChildSort: boolean } {
  const liveBlockIds = new Set<string>();
  let needsChildSort = false;
  const blocksToDraw: DefiningWorldBuildingPlacedBlock[] = [
    ...input.placedBlocks,
  ];

  if (input.placementPreviewBlock) {
    blocksToDraw.push(input.placementPreviewBlock);
  }

  for (const block of blocksToDraw) {
    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    if (!checkingWorldBuildingBlockDefinitionIdIsStorageChest(block.definitionId)) {
      continue;
    }

    const isOpen = input.openBlockIds?.has(block.blockId) === true;
    const spriteUrl = isOpen
      ? DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_OPEN
      : DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_CLOSED;
    const texture =
      peekingWorldPlazaChestSpriteTextureForUrlFromManifest(spriteUrl);

    if (!texture) {
      continue;
    }

    const isPlacementPreview =
      block.blockId ===
      DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_BLOCK_ID;

    liveBlockIds.add(block.blockId);
    const existingSprite = input.state.spriteByBlockId.get(block.blockId);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      applyingWorldPlazaStorageChestToSprite(existingSprite, block, texture);
      existingSprite.alpha = isPlacementPreview
        ? DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_ALPHA
        : 1;
      if (isPlacementPreview) {
        existingSprite.zIndex =
          DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX;
      }
      if (existingSprite.zIndex !== previousZIndex) {
        needsChildSort = true;
      }
      continue;
    }

    const sprite = input.creatingSprite();
    applyingWorldPlazaStorageChestToSprite(sprite, block, texture);
    sprite.alpha = isPlacementPreview
      ? DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_ALPHA
      : 1;
    if (isPlacementPreview) {
      sprite.zIndex = DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX;
    }
    input.state.spriteByBlockId.set(block.blockId, sprite);
    needsChildSort = true;
  }

  for (const [blockId, sprite] of input.state.spriteByBlockId) {
    if (liveBlockIds.has(blockId)) {
      continue;
    }

    input.destroyingSprite(sprite);
    input.state.spriteByBlockId.delete(blockId);
    needsChildSort = true;
  }

  return { needsChildSort };
}
