import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_ACTIVE_WORLD_SPRITE_URL,
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND,
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_ALPHA,
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
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { peekingWorldPlazaBlacksmithUtilitySpriteTextureForUrl } from '@/components/world/building/domains/loadingWorldPlazaBlacksmithUtilitySpriteTextures';
import type { Sprite, Texture } from 'pixi.js';

/** Synthetic block id for the craft/build utility placement ghost. */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_BLOCK_ID =
  'placement-preview-blacksmith-utility' as const;

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
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY]:
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY,
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

/**
 * Positions and scales a blacksmith utility sprite at an anchor tile.
 */
export function applyingWorldPlazaBlacksmithUtilitySpriteAtAnchorTile(input: {
  readonly sprite: Sprite;
  readonly utilityKind: DefiningWorldPlazaBlacksmithUtilityKind;
  readonly texture: Texture;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly footprintTileWidth: number;
  readonly footprintTileHeight: number;
  readonly alpha?: number;
}): void {
  const centerTileX =
    input.tileX + (input.footprintTileWidth - 1) * 0.5;
  const centerTileY =
    input.tileY + (input.footprintTileHeight - 1) * 0.5;
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: centerTileX,
    y: centerTileY,
  });
  const layerOffsetY = computingWorldBuildingWorldLayerScreenOffsetPx(
    input.worldLayer
  );
  const displayScale =
    DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_DISPLAY_SCALE[input.utilityKind];
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * displayScale;
  const textureScale = targetWidth / Math.max(input.texture.width, 1);

  input.sprite.texture = input.texture;
  input.sprite.visible = true;
  input.sprite.alpha = input.alpha ?? 1;
  input.sprite.anchor.set(0.5, 1);
  input.sprite.scale.set(textureScale);
  input.sprite.position.set(screenPoint.x, screenPoint.y + layerOffsetY);
  input.sprite.zIndex = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
    input.tileX,
    input.tileY,
    input.worldLayer
  );
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
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  applyingWorldPlazaBlacksmithUtilitySpriteAtAnchorTile({
    sprite,
    utilityKind,
    texture,
    tileX: block.tilePosition.tileX,
    tileY: block.tilePosition.tileY,
    worldLayer,
    footprintTileWidth: footprint.tileWidth,
    footprintTileHeight: footprint.tileHeight,
  });
}

/**
 * Keeps blacksmith utility sprites in sync with placed blocks.
 */
export function syncingWorldPlazaVisibleBlacksmithUtilityLayer(input: {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  /** Optional craft/build ghost shown while placing a utility. */
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  readonly placementPreviewAlpha?: number;
  readonly activeBlockIds?: ReadonlySet<string>;
  readonly state: SyncingWorldPlazaBlacksmithUtilitySpriteState;
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

    const utilityKind = resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId(
      block.definitionId
    );

    if (!utilityKind) {
      continue;
    }

    const isPlacementPreview =
      block.blockId === DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_BLOCK_ID;
    const spriteUrl = input.activeBlockIds?.has(block.blockId)
      ? DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_ACTIVE_WORLD_SPRITE_URL[
          utilityKind
        ]
      : DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_WORLD_SPRITE_URL[utilityKind];
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
      existingSprite.alpha = isPlacementPreview
        ? (input.placementPreviewAlpha ??
          DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_ALPHA)
        : 1;
      if (isPlacementPreview) {
        existingSprite.zIndex = DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX;
      }
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
    sprite.alpha = isPlacementPreview
      ? (input.placementPreviewAlpha ??
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_ALPHA)
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
