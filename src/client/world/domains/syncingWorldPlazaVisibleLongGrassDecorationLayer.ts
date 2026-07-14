import { computingWorldDepthSortKey } from '@/components/world/depth';
import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_LONG_GRASS_DISPLAY_SCALE } from '@/components/world/domains/definingWorldPlazaLongGrassConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { peekingWorldPlazaLongGrassSpriteTextureForUrl } from '@/components/world/domains/loadingWorldPlazaLongGrassSpriteTextures';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';
import {
  formattingWorldLongGrassSpriteUrl,
  resolvingWorldLongGrassFacingAtTileIndex,
  resolvingWorldLongGrassSizeVariantAtTileIndex,
} from '../../../shared/worldLongGrassPlacement';
import type { Container } from 'pixi.js';
import { Sprite } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted long-grass sprite clumps for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleLongGrassDecorationLayer
 */

/** Default build budget per sync call. */
export const SYNCING_WORLD_PLAZA_LONG_GRASS_DECORATION_DEFAULT_BUILD_BUDGET = 24;

export type SyncingWorldPlazaVisibleLongGrassDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
};

export type SyncingWorldPlazaVisibleLongGrassDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

type DefiningWorldPlazaLongGrassTileInstance = {
  readonly tileX: number;
  readonly tileY: number;
  readonly spriteUrl: string;
};

function listingWorldPlazaVisibleLongGrassCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  burntGrassTileKeys?: ReadonlySet<string>
): DefiningWorldPlazaLongGrassTileInstance[] {
  const candidates: DefiningWorldPlazaLongGrassTileInstance[] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        burntGrassTileKeys
      ) ||
      checkingWorldPlazaRuntimeLongGrassIsCleared(tileX, tileY) ||
      !checkingWorldPlazaLongGrassDecorationAtTileIndex(tileX, tileY)
    ) {
      continue;
    }

    const sizeVariant = resolvingWorldLongGrassSizeVariantAtTileIndex(
      tileX,
      tileY
    );
    const facing = resolvingWorldLongGrassFacingAtTileIndex(tileX, tileY);

    candidates.push({
      tileX,
      tileY,
      spriteUrl: formattingWorldLongGrassSpriteUrl(sizeVariant, facing),
    });
  }

  return candidates;
}

function applyingWorldPlazaLongGrassTileToSprite(
  sprite: Sprite,
  instance: DefiningWorldPlazaLongGrassTileInstance
): void {
  const texture = peekingWorldPlazaLongGrassSpriteTextureForUrl(
    instance.spriteUrl
  );

  if (!texture) {
    sprite.visible = false;
    return;
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
    DEFINING_WORLD_PLAZA_LONG_GRASS_DISPLAY_SCALE;
  const targetHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_LONG_GRASS_DISPLAY_SCALE *
    4;
  const textureScale = Math.min(
    targetWidth / Math.max(texture.width, 1),
    targetHeight / Math.max(texture.height, 1)
  );

  sprite.scale.set(textureScale);
  sprite.position.set(screenPoint.x, screenPoint.y + surfaceLiftY);
  sprite.zIndex =
    computingWorldDepthSortKey({
      x: instance.tileX,
      y: instance.tileY,
    }) + 0.15;
}

export function syncingWorldPlazaVisibleLongGrassDecorationLayer(
  input: SyncingWorldPlazaVisibleLongGrassDecorationLayerInput
): SyncingWorldPlazaVisibleLongGrassDecorationLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_LONG_GRASS_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const candidates = listingWorldPlazaVisibleLongGrassCandidatesInBounds(
    input.bounds,
    input.burntGrassTileKeys
  );
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaLongGrassTileInstance[] = [];
  let didMutateChildren = false;

  for (const candidate of candidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );
    neededKeys.add(cacheKey);

    const existingSprite = input.spriteByKey.get(cacheKey);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      applyingWorldPlazaLongGrassTileToSprite(existingSprite, candidate);

      if (existingSprite.zIndex !== previousZIndex) {
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

  for (const candidate of propsToBuild) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.tileX,
      candidate.tileY
    );
    const sprite = new Sprite();
    sprite.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(sprite);
    applyingWorldPlazaLongGrassTileToSprite(sprite, candidate);
    input.parentContainer.addChild(sprite);
    input.spriteByKey.set(cacheKey, sprite);
    didMutateChildren = true;
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
    isComplete: missingCandidates.length <= buildBudget,
    propsBuilt: propsToBuild.length,
    needsChildSort: didMutateChildren,
  };
}
