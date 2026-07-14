import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND,
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_WORLD_SPRITE_URL,
  type DefiningWorldPlazaBlacksmithUtilityKind,
} from '@/components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl } from '@/components/world/building/domains/loadingWorldPlazaBlacksmithUtilitySpriteTextures';
import type { Sprite, Texture } from 'pixi.js';

/**
 * Syncs Pixi sprites for placed blacksmith utilities (anvil / kiln / stove).
 *
 * @module components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer
 */

export type SyncingWorldPlazaBlacksmithUtilitySpriteState = {
  readonly spriteByBlockId: Map<string, Sprite>;
};

const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND_BY_BLOCK_ID: Record<
  string,
  DefiningWorldPlazaBlacksmithUtilityKind
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL]:
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN]:
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE]:
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE,
};

export function resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId(
  definitionId: string
): DefiningWorldPlazaBlacksmithUtilityKind | null {
  return DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND_BY_BLOCK_ID[definitionId] ?? null;
}

export function checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility(
  definitionId: string
): boolean {
  return resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId(definitionId) !== null;
}

function applyingWorldPlazaBlacksmithUtilityToSprite(
  sprite: Sprite,
  block: DefiningWorldBuildingPlacedBlock,
  utilityKind: DefiningWorldPlazaBlacksmithUtilityKind,
  texture: Texture
): void {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
  const footprint = definition
    ? resolvingWorldBuildingBlockPlacementFootprint(definition)
    : { tileWidth: 1, tileHeight: 1 };
  const centerTileX =
    block.tilePosition.tileX + (footprint.tileWidth - 1) * 0.5;
  const centerTileY =
    block.tilePosition.tileY + (footprint.tileHeight - 1) * 0.5;
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: centerTileX,
    y: centerTileY,
  });
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const layerOffsetY = computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);
  const displayScale =
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_DISPLAY_SCALE[utilityKind];
  const targetWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * displayScale;
  const textureScale = targetWidth / Math.max(texture.width, 1);

  sprite.texture = texture;
  sprite.visible = true;
  sprite.anchor.set(0.5, 1);
  sprite.scale.set(textureScale);
  sprite.position.set(screenPoint.x, screenPoint.y + layerOffsetY);
  sprite.zIndex = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
    block.tilePosition.tileX,
    block.tilePosition.tileY,
    worldLayer
  );
}

/**
 * Keeps blacksmith utility sprites in sync with placed blocks.
 */
export function syncingWorldPlazaVisibleBlacksmithUtilityLayer(input: {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly state: SyncingWorldPlazaBlacksmithUtilitySpriteState;
  readonly creatingSprite: () => Sprite;
  readonly destroyingSprite: (sprite: Sprite) => void;
}): { readonly needsChildSort: boolean } {
  const liveBlockIds = new Set<string>();
  let needsChildSort = false;

  for (const block of input.placedBlocks) {
    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const utilityKind = resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId(
      block.definitionId
    );

    if (!utilityKind) {
      continue;
    }

    const spriteUrl =
      DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_WORLD_SPRITE_URL[utilityKind];
    const texture = peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl(spriteUrl);

    if (!texture) {
      continue;
    }

    liveBlockIds.add(block.blockId);
    const existingSprite = input.state.spriteByBlockId.get(block.blockId);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      applyingWorldPlazaBlacksmithUtilityToSprite(
        existingSprite,
        block,
        utilityKind,
        texture
      );
      if (existingSprite.zIndex !== previousZIndex) {
        needsChildSort = true;
      }
      continue;
    }

    const sprite = input.creatingSprite();
    applyingWorldPlazaBlacksmithUtilityToSprite(
      sprite,
      block,
      utilityKind,
      texture
    );
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
