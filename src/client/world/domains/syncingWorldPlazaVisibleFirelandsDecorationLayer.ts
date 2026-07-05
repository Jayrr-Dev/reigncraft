import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { peekingWorldPlazaFirelandsSpriteTextureForProp } from '@/components/world/domains/loadingWorldPlazaFirelandsSpriteTextures';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import {
  resolvingWorldPlazaFirelandsPropAtTileIndex,
  type DefiningWorldPlazaFirelandsPropInstance,
} from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import type { Container } from 'pixi.js';
import { Sprite } from 'pixi.js';

/**
 * Incrementally syncs depth-sorted Firelands sprite props for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleFirelandsDecorationLayer
 */

/** Default build budget per sync call. */
export const SYNCING_WORLD_PLAZA_FIRELANDS_DECORATION_DEFAULT_BUILD_BUDGET = 24;

/** Input for {@link syncingWorldPlazaVisibleFirelandsDecorationLayer}. */
export type SyncingWorldPlazaVisibleFirelandsDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
};

/** Result from {@link syncingWorldPlazaVisibleFirelandsDecorationLayer}. */
export type SyncingWorldPlazaVisibleFirelandsDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

/**
 * Lists prop anchors in the visible bounds.
 *
 * @param bounds - Visible tile bounds.
 */
function listingWorldPlazaVisibleFirelandsPropCandidatesInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds
): DefiningWorldPlazaFirelandsPropInstance[] {
  const candidates: DefiningWorldPlazaFirelandsPropInstance[] = [];

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const prop = resolvingWorldPlazaFirelandsPropAtTileIndex(tileX, tileY);

      if (!prop || prop.anchorTileX !== tileX || prop.anchorTileY !== tileY) {
        continue;
      }

      candidates.push(prop);
    }
  }

  return candidates;
}

/**
 * Applies screen placement and depth sort to one Firelands sprite.
 *
 * @param sprite - Pixi sprite to position.
 * @param prop - Prop instance metadata.
 */
function applyingWorldPlazaFirelandsPropToSprite(
  sprite: Sprite,
  prop: DefiningWorldPlazaFirelandsPropInstance
): void {
  const texture = peekingWorldPlazaFirelandsSpriteTextureForProp(
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
    y: prop.anchorTileY,
  });
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * prop.displayScale * 4;
  const targetHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX * prop.displayScale * 8;
  const textureScale = Math.min(
    targetWidth / Math.max(texture.width, 1),
    targetHeight / Math.max(texture.height, 1)
  );

  // Props stand on the elevated column surface, not the ground plane, so
  // lift them by the surface layer offset or the front columns hide them.
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
  // Draw just above the anchor tile's own terrain column top cap.
  sprite.zIndex =
    resolvingWorldPlazaIsometricEntityZIndex({
      x: prop.sortTileX,
      y: prop.sortTileY,
    }) + 0.2;
}

/**
 * Adds or removes Firelands sprite props as the visible window shifts.
 *
 * @param input - Parent container, bounds, cache, and build budget.
 */
export function syncingWorldPlazaVisibleFirelandsDecorationLayer(
  input: SyncingWorldPlazaVisibleFirelandsDecorationLayerInput
): SyncingWorldPlazaVisibleFirelandsDecorationLayerResult {
  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_FIRELANDS_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? true;
  const propCandidates =
    listingWorldPlazaVisibleFirelandsPropCandidatesInBounds(input.bounds);
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaFirelandsPropInstance[] = [];
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
      applyingWorldPlazaFirelandsPropToSprite(existingSprite, candidate);

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
    applyingWorldPlazaFirelandsPropToSprite(sprite, candidate);
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
