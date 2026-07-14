import { DEFINING_WORLD_DEPTH_SHRUB_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { checkingWorldPlazaShrubDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaShrubDecorationAtTileIndex';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_SHRUB_DISPLAY_SCALE } from '@/components/world/domains/definingWorldPlazaShrubConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { peekingWorldPlazaShrubSpriteTextureForUrl } from '@/components/world/domains/loadingWorldPlazaShrubSpriteTextures';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';
import type { Container } from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';
import {
  formattingWorldShrubSpriteUrl,
  resolvingWorldShrubFacingAtTileIndex,
} from '../../../shared/worldShrubPlacement';

/**
 * Incrementally syncs depth-sorted berry-shrub sprites for a visible window.
 *
 * Always draws when decoration exists; swaps unpicked/picked sprite by runtime
 * pick state (never hides after pick).
 *
 * @module components/world/domains/syncingWorldPlazaVisibleShrubDecorationLayer
 */

/** Default build budget per sync call. */
export const SYNCING_WORLD_PLAZA_SHRUB_DECORATION_DEFAULT_BUILD_BUDGET = 24;

/**
 * Tiny per-tile bias so neighboring shrubs keep relative iso order while staying
 * inside the floor-decoration z band above batched floor chunks.
 */
const SYNCING_WORLD_PLAZA_SHRUB_TILE_DEPTH_BIAS_SCALE = 0.001;

export type SyncingWorldPlazaVisibleShrubDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
};

export type SyncingWorldPlazaVisibleShrubDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

type DefiningWorldPlazaShrubTileInstance = {
  readonly tileX: number;
  readonly tileY: number;
  readonly spriteUrl: string;
};

function listingWorldPlazaVisibleShrubCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  burntGrassTileKeys?: ReadonlySet<string>
): DefiningWorldPlazaShrubTileInstance[] {
  const candidates: DefiningWorldPlazaShrubTileInstance[] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        burntGrassTileKeys
      ) ||
      !checkingWorldPlazaShrubDecorationAtTileIndex(tileX, tileY)
    ) {
      continue;
    }

    const facing = resolvingWorldShrubFacingAtTileIndex(tileX, tileY);
    const isPicked = checkingWorldPlazaRuntimeShrubIsPicked(tileX, tileY);

    candidates.push({
      tileX,
      tileY,
      spriteUrl: formattingWorldShrubSpriteUrl(facing, isPicked),
    });
  }

  return candidates;
}

function checkingWorldPlazaShrubTextureIsRenderable(
  texture: Texture | null
): texture is Texture {
  return (
    texture !== null &&
    texture !== Texture.EMPTY &&
    texture.width > 0 &&
    texture.height > 0
  );
}

function applyingWorldPlazaShrubTileToSprite(
  sprite: Sprite,
  instance: DefiningWorldPlazaShrubTileInstance
): boolean {
  const texture = peekingWorldPlazaShrubSpriteTextureForUrl(instance.spriteUrl);

  if (!checkingWorldPlazaShrubTextureIsRenderable(texture)) {
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
    DEFINING_WORLD_PLAZA_SHRUB_DISPLAY_SCALE;
  const targetHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_SHRUB_DISPLAY_SCALE *
    4;
  const textureScale = Math.min(
    targetWidth / Math.max(texture.width, 1),
    targetHeight / Math.max(texture.height, 1)
  );

  sprite.scale.set(textureScale);
  sprite.position.set(screenPoint.x, screenPoint.y + surfaceLiftY);
  sprite.zIndex =
    DEFINING_WORLD_DEPTH_SHRUB_DECORATION_LAYER_Z_INDEX +
    (instance.tileX + instance.tileY) *
      SYNCING_WORLD_PLAZA_SHRUB_TILE_DEPTH_BIAS_SCALE;

  return true;
}

export function syncingWorldPlazaVisibleShrubDecorationLayer(
  input: SyncingWorldPlazaVisibleShrubDecorationLayerInput
): SyncingWorldPlazaVisibleShrubDecorationLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_SHRUB_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const candidates = listingWorldPlazaVisibleShrubCandidatesInBounds(
    input.bounds,
    input.burntGrassTileKeys
  );
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaShrubTileInstance[] = [];
  let didMutateChildren = false;
  let hasPendingTexture = false;

  for (const candidate of candidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );
    neededKeys.add(cacheKey);

    const existingSprite = input.spriteByKey.get(cacheKey);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      const previousTexture = existingSprite.texture;
      const didApplyTexture = applyingWorldPlazaShrubTileToSprite(
        existingSprite,
        candidate
      );

      if (!didApplyTexture) {
        hasPendingTexture = true;
      }

      if (
        existingSprite.zIndex !== previousZIndex ||
        existingSprite.texture !== previousTexture
      ) {
        didMutateChildren = true;
      }

      continue;
    }

    missingCandidates.push(candidate);
  }

  missingCandidates.sort((candidateA, candidateB) => {
    const distanceA =
      Math.abs(candidateA.tileX - input.centerTileX) +
      Math.abs(candidateA.tileY - input.centerTileY);
    const distanceB =
      Math.abs(candidateB.tileX - input.centerTileX) +
      Math.abs(candidateB.tileY - input.centerTileY);

    return distanceA - distanceB;
  });

  const propsToBuild = missingCandidates.slice(0, buildBudget);
  let propsBuilt = 0;

  for (const candidate of propsToBuild) {
    const texture = peekingWorldPlazaShrubSpriteTextureForUrl(
      candidate.spriteUrl
    );

    if (!checkingWorldPlazaShrubTextureIsRenderable(texture)) {
      hasPendingTexture = true;
      continue;
    }

    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );
    const sprite = new Sprite();
    sprite.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(sprite);
    applyingWorldPlazaShrubTileToSprite(sprite, candidate);
    input.parentContainer.addChild(sprite);
    input.spriteByKey.set(cacheKey, sprite);
    didMutateChildren = true;
    propsBuilt += 1;
  }

  for (const [cacheKey, sprite] of input.spriteByKey.entries()) {
    if (!neededKeys.has(cacheKey)) {
      input.parentContainer.removeChild(sprite);
      sprite.destroy();
      input.spriteByKey.delete(cacheKey);
      didMutateChildren = true;
    }
  }

  if (didMutateChildren && shouldSortChildrenImmediately) {
    input.parentContainer.sortChildren();
  }

  return {
    isComplete: !hasPendingTexture && missingCandidates.length <= buildBudget,
    propsBuilt,
    needsChildSort: didMutateChildren,
  };
}
