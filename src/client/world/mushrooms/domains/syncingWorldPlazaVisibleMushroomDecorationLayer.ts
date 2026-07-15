/**
 * Syncs depth-sorted mushroom sprites for the visible tile window.
 *
 * @module components/world/mushrooms/domains/syncingWorldPlazaVisibleMushroomDecorationLayer
 */

import { DEFINING_WORLD_DEPTH_MUSHROOM_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import { resolvingWorldPlazaMushroomSpeciesSheetIndex } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpriteSheetConstants';
import { peekingWorldPlazaMushroomSpriteTextureForSpeciesIndex } from '@/components/world/mushrooms/domains/loadingWorldPlazaMushroomSpriteTextures';
import { checkingWorldPlazaRuntimeMushroomIsPicked } from '@/components/world/mushrooms/domains/registeringWorldPlazaPickedMushroomsLookup';
import { resolvingWorldPlazaMushroomAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex';
import type { Container } from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';

export const SYNCING_WORLD_PLAZA_MUSHROOM_DECORATION_DEFAULT_BUILD_BUDGET = 24;

const SYNCING_WORLD_PLAZA_MUSHROOM_TILE_DEPTH_BIAS_SCALE = 0.001;

export type SyncingWorldPlazaVisibleMushroomDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
  readonly epochMs?: number;
};

export type SyncingWorldPlazaVisibleMushroomDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

type DefiningWorldPlazaMushroomTileInstance = {
  readonly tileX: number;
  readonly tileY: number;
  readonly speciesIndex: number;
};

function listingWorldPlazaVisibleMushroomCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  burntGrassTileKeys: ReadonlySet<string> | undefined,
  epochMs: number
): DefiningWorldPlazaMushroomTileInstance[] {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS
    )
  ) {
    return [];
  }

  const candidates: DefiningWorldPlazaMushroomTileInstance[] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        burntGrassTileKeys
      )
    ) {
      continue;
    }

    if (checkingWorldPlazaRuntimeMushroomIsPicked(tileX, tileY)) {
      continue;
    }

    const entry = resolvingWorldPlazaMushroomAtTileIndex({
      tileX,
      tileY,
      epochMs,
    });

    if (!entry) {
      continue;
    }

    candidates.push({
      tileX,
      tileY,
      speciesIndex: resolvingWorldPlazaMushroomSpeciesSheetIndex(
        entry.speciesId
      ),
    });
  }

  return candidates;
}

function checkingWorldPlazaMushroomTextureIsRenderable(
  texture: Texture | null
): texture is Texture {
  return (
    texture !== null &&
    texture !== Texture.EMPTY &&
    texture.width > 0 &&
    texture.height > 0
  );
}

function applyingWorldPlazaMushroomTileToSprite(
  sprite: Sprite,
  instance: DefiningWorldPlazaMushroomTileInstance
): boolean {
  const texture = peekingWorldPlazaMushroomSpriteTextureForSpeciesIndex(
    instance.speciesIndex
  );

  if (!checkingWorldPlazaMushroomTextureIsRenderable(texture)) {
    sprite.visible = false;
    return false;
  }

  sprite.texture = texture;
  sprite.visible = true;
  sprite.anchor.set(0.5, 1);

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: instance.tileX,
    y: instance.tileY,
  });
  const surfaceLiftY =
    computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(
      instance.tileX,
      instance.tileY
    );
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE;
  const targetHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE *
    2;
  const textureScale = Math.min(
    targetWidth / Math.max(texture.width, 1),
    targetHeight / Math.max(texture.height, 1)
  );

  sprite.scale.set(textureScale);
  sprite.position.set(screenPoint.x, screenPoint.y + surfaceLiftY);
  sprite.zIndex =
    DEFINING_WORLD_DEPTH_MUSHROOM_DECORATION_LAYER_Z_INDEX +
    (instance.tileX + instance.tileY) *
      SYNCING_WORLD_PLAZA_MUSHROOM_TILE_DEPTH_BIAS_SCALE;

  return true;
}

export function syncingWorldPlazaVisibleMushroomDecorationLayer(
  input: SyncingWorldPlazaVisibleMushroomDecorationLayerInput
): SyncingWorldPlazaVisibleMushroomDecorationLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_MUSHROOM_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const epochMs = input.epochMs ?? Date.now();
  const candidates = listingWorldPlazaVisibleMushroomCandidatesInBounds(
    input.bounds,
    input.burntGrassTileKeys,
    epochMs
  );
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaMushroomTileInstance[] = [];
  let didMutateChildren = false;
  let hasPendingTexture = false;
  let propsBuilt = 0;

  for (const instance of candidates) {
    const key = formattingWorldPlazaTileIndexCacheKey(
      instance.tileX,
      instance.tileY
    );
    neededKeys.add(key);

    const existing = input.spriteByKey.get(key);

    if (existing) {
      if (!applyingWorldPlazaMushroomTileToSprite(existing, instance)) {
        hasPendingTexture = true;
      }
      continue;
    }

    missingCandidates.push(instance);
  }

  for (const [key, sprite] of input.spriteByKey.entries()) {
    if (neededKeys.has(key)) {
      continue;
    }

    input.parentContainer.removeChild(sprite);
    sprite.destroy();
    input.spriteByKey.delete(key);
    didMutateChildren = true;
  }

  for (const instance of missingCandidates) {
    if (propsBuilt >= buildBudget) {
      break;
    }

    const texture = peekingWorldPlazaMushroomSpriteTextureForSpeciesIndex(
      instance.speciesIndex
    );

    if (!checkingWorldPlazaMushroomTextureIsRenderable(texture)) {
      hasPendingTexture = true;
      continue;
    }

    const sprite = new Sprite(texture);
    markingWorldPlazaPixiDisplayObjectCullable(sprite);
    applyingWorldPlazaMushroomTileToSprite(sprite, instance);
    input.parentContainer.addChild(sprite);
    input.spriteByKey.set(
      formattingWorldPlazaTileIndexCacheKey(instance.tileX, instance.tileY),
      sprite
    );
    didMutateChildren = true;
    propsBuilt += 1;
  }

  const needsChildSort = didMutateChildren;

  if (needsChildSort && shouldSortChildrenImmediately) {
    input.parentContainer.sortChildren();
  }

  const isComplete =
    missingCandidates.length <= propsBuilt && !hasPendingTexture;

  return {
    isComplete,
    propsBuilt,
    needsChildSort,
  };
}
