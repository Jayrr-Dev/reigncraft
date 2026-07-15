import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { checkingWorldBuildingPlacedBlockIsPassableTile } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import {
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX,
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_ALPHA,
  resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaSurvivalShelterSpriteConstants';
import { peekingWorldPlazaSurvivalShelterSpriteTextureForKind } from '@/components/world/building/domains/loadingWorldPlazaSurvivalShelterSpriteTextures';
import {
  resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
  resolvingWorldPlazaBlacksmithUtilityEntityZIndex,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import type { Sprite, Texture } from 'pixi.js';

export const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_BLOCK_ID =
  'placement-preview-survival-shelter' as const;

export type SyncingWorldPlazaSurvivalShelterSpriteState = {
  readonly spriteByBlockId: Map<string, Sprite>;
};

export function checkingWorldBuildingBlockDefinitionIdIsSurvivalShelter(
  definitionId: string
): boolean {
  return (
    resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId(definitionId) !==
    null
  );
}

function applyingWorldPlazaSurvivalShelterToSprite(
  sprite: Sprite,
  block: DefiningWorldBuildingPlacedBlock,
  texture: Texture
): void {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
  const footprint = definition
    ? resolvingWorldBuildingBlockPlacementFootprint(definition)
    : { tileWidth: 1, tileHeight: 1 };
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
  const depthSortGridPoint =
    resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint(
      block.tilePosition.tileX,
      block.tilePosition.tileY,
      footprint.tileWidth,
      footprint.tileHeight
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
    DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE;
  const textureScale = targetWidth / Math.max(texture.width, 1);

  sprite.texture = texture;
  sprite.visible = true;
  sprite.anchor.set(0.5, 1);
  sprite.scale.set(textureScale);
  sprite.position.set(
    screenPoint.x,
    screenPoint.y +
      layerOffsetY +
      DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX
  );
  sprite.zIndex = resolvingWorldPlazaBlacksmithUtilityEntityZIndex(
    block.tilePosition.tileX,
    block.tilePosition.tileY,
    footprint.tileWidth,
    footprint.tileHeight
  );
}

export function syncingWorldPlazaVisibleSurvivalShelterUtilityLayer(input: {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  readonly state: SyncingWorldPlazaSurvivalShelterSpriteState;
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

    const shelterKind =
      resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId(
        block.definitionId
      );

    if (!shelterKind) {
      continue;
    }

    const texture =
      peekingWorldPlazaSurvivalShelterSpriteTextureForKind(shelterKind);

    if (!texture) {
      continue;
    }

    const isPlacementPreview =
      block.blockId ===
      DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_BLOCK_ID;

    liveBlockIds.add(block.blockId);
    const existingSprite = input.state.spriteByBlockId.get(block.blockId);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      applyingWorldPlazaSurvivalShelterToSprite(existingSprite, block, texture);
      existingSprite.alpha = isPlacementPreview
        ? DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_ALPHA
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
    applyingWorldPlazaSurvivalShelterToSprite(sprite, block, texture);
    sprite.alpha = isPlacementPreview
      ? DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_ALPHA
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
