import { checkingWorldBuildingPlacedBlockIsFootprintSatellite } from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX,
  DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_PLACEMENT_PREVIEW_ALPHA,
  resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaSurvivalShelterSpriteConstants';
import { peekingWorldPlazaSurvivalShelterSpriteTextureForKind } from '@/components/world/building/domains/loadingWorldPlazaSurvivalShelterSpriteTextures';
import {
  applyingWorldPlazaBlacksmithUtilityToSprite,
  resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import type { Sprite } from 'pixi.js';

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

    const shelterKind = resolvingWorldPlazaSurvivalShelterKindForBlockDefinitionId(
      block.definitionId
    );

    if (!shelterKind) {
      continue;
    }

    const texture = peekingWorldPlazaSurvivalShelterSpriteTextureForKind(
      shelterKind
    );

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
      applyingWorldPlazaBlacksmithUtilityToSprite(
        existingSprite,
        block,
        shelterKind,
        texture,
        {
          displayScale: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE,
          footSinkPx: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX,
          depthSortGridPointResolver:
            resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
        }
      );
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
    applyingWorldPlazaBlacksmithUtilityToSprite(
      sprite,
      block,
      shelterKind,
      texture,
      {
        displayScale: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_DISPLAY_SCALE,
        footSinkPx: DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_FOOT_SINK_PX,
        depthSortGridPointResolver:
          resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
      }
    );
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
