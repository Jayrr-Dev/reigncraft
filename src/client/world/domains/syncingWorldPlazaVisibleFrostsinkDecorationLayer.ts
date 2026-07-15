import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldDepthSortKey } from '@/components/world/depth';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_GRID_OFFSET } from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { peekingWorldPlazaFrostsinkSpriteTextureForProp } from '@/components/world/domains/loadingWorldPlazaFrostsinkSpriteTextures';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import {
  resolvingWorldPlazaFrostsinkPropAtTileIndex,
  type DefiningWorldPlazaFrostsinkPropInstance,
} from '@/components/world/domains/resolvingWorldPlazaFrostsinkPropAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import type { Container } from 'pixi.js';
import { Sprite } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted Frostsink Cryocore sprites for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleFrostsinkDecorationLayer
 */

/** Default build budget per sync call. */
export const SYNCING_WORLD_PLAZA_FROSTSINK_DECORATION_DEFAULT_BUILD_BUDGET = 8;

/** Input for {@link syncingWorldPlazaVisibleFrostsinkDecorationLayer}. */
export type SyncingWorldPlazaVisibleFrostsinkDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
};

/** Result from {@link syncingWorldPlazaVisibleFrostsinkDecorationLayer}. */
export type SyncingWorldPlazaVisibleFrostsinkDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

function listingWorldPlazaVisibleFrostsinkPropCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds
): DefiningWorldPlazaFrostsinkPropInstance[] {
  const candidates: DefiningWorldPlazaFrostsinkPropInstance[] = [];

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const prop = resolvingWorldPlazaFrostsinkPropAtTileIndex(tileX, tileY);

      if (!prop || prop.anchorTileX !== tileX || prop.anchorTileY !== tileY) {
        continue;
      }

      candidates.push(prop);
    }
  }

  return candidates;
}

function applyingWorldPlazaFrostsinkPropToSprite(
  sprite: Sprite,
  prop: DefiningWorldPlazaFrostsinkPropInstance
): void {
  const texture = peekingWorldPlazaFrostsinkSpriteTextureForProp(
    prop.kind,
    prop.variantIndex
  );

  if (!texture) {
    sprite.visible = false;
    return;
  }

  sprite.texture = texture;
  sprite.visible = true;
  sprite.anchor.set(0.5, 1);
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: prop.anchorTileX,
    y:
      prop.anchorTileY +
      DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_GRID_OFFSET,
  });
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * prop.displayScale * 4;
  const targetHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX * prop.displayScale * 8;
  const textureScale = Math.min(
    targetWidth / Math.max(texture.width, 1),
    targetHeight / Math.max(texture.height, 1)
  );

  const surfaceOffsetY =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED
      ? computingWorldBuildingWorldLayerScreenOffsetPx(
          resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
            prop.anchorTileX,
            prop.anchorTileY
          )
        )
      : 0;

  sprite.scale.set(textureScale);
  sprite.position.set(
    screenPoint.x + prop.offsetXPx,
    screenPoint.y + prop.offsetYPx + surfaceOffsetY
  );
  sprite.zIndex =
    computingWorldDepthSortKey({
      x: prop.sortTileX,
      y: prop.sortTileY,
    }) + 0.2;
}

/**
 * Adds or removes Frostsink Cryocore sprites as the visible window shifts.
 *
 * @param input - Parent container, bounds, cache, and build budget.
 */
export function syncingWorldPlazaVisibleFrostsinkDecorationLayer(
  input: SyncingWorldPlazaVisibleFrostsinkDecorationLayerInput
): SyncingWorldPlazaVisibleFrostsinkDecorationLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_FROSTSINK_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const propCandidates =
    listingWorldPlazaVisibleFrostsinkPropCandidatesInBounds(input.bounds);
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaFrostsinkPropInstance[] = [];
  let didMutateChildren = false;

  for (const candidate of propCandidates) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.anchorTileX,
      candidate.anchorTileY
    );
    neededKeys.add(cacheKey);

    const existingSprite = input.spriteByKey.get(cacheKey);

    if (existingSprite) {
      const previousZIndex = existingSprite.zIndex;
      applyingWorldPlazaFrostsinkPropToSprite(existingSprite, candidate);

      if (existingSprite.zIndex !== previousZIndex) {
        didMutateChildren = true;
      }

      continue;
    }

    missingCandidates.push(candidate);
  }

  missingCandidates.sort((candidateA, candidateB) => {
    const distanceA =
      Math.abs(candidateA.anchorTileX - input.centerTileX) +
      Math.abs(candidateA.anchorTileY - input.centerTileY);
    const distanceB =
      Math.abs(candidateB.anchorTileX - input.centerTileX) +
      Math.abs(candidateB.anchorTileY - input.centerTileY);

    return distanceA - distanceB;
  });

  const propsToBuild = missingCandidates.slice(0, buildBudget);

  for (const candidate of propsToBuild) {
    const cacheKey = formattingWorldPlazaTileIndexCacheKey(
      candidate.anchorTileX,
      candidate.anchorTileY
    );
    const sprite = new Sprite();
    sprite.eventMode = 'none';
    markingWorldPlazaPixiDisplayObjectCullable(sprite);
    applyingWorldPlazaFrostsinkPropToSprite(sprite, candidate);
    input.parentContainer.addChild(sprite);
    input.spriteByKey.set(cacheKey, sprite);
    didMutateChildren = true;
  }

  for (const [cacheKey, sprite] of input.spriteByKey) {
    if (neededKeys.has(cacheKey)) {
      continue;
    }

    input.parentContainer.removeChild(sprite);
    sprite.destroy();
    input.spriteByKey.delete(cacheKey);
    didMutateChildren = true;
  }

  if (
    didMutateChildren &&
    shouldSortChildrenImmediately &&
    input.parentContainer.sortableChildren
  ) {
    input.parentContainer.sortChildren();
  }

  return {
    isComplete: missingCandidates.length <= propsToBuild.length,
    propsBuilt: propsToBuild.length,
    needsChildSort:
      didMutateChildren &&
      !shouldSortChildrenImmediately &&
      input.parentContainer.sortableChildren,
  };
}
