import { DEFINING_WORLD_DEPTH_LONG_GRASS_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import {
  checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex,
  resolvingWorldPlazaRareShrubTallGrassCompanionSizeVariantAtTileIndex,
} from '@/components/world/domains/checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_LONG_GRASS_DISPLAY_SCALE } from '@/components/world/domains/definingWorldPlazaLongGrassConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import {
  peekingWorldPlazaLongGrassSpriteTextureForUrl,
  peekingWorldPlazaLongGrassSpriteTextures,
} from '@/components/world/domains/loadingWorldPlazaLongGrassSpriteTextures';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';
import type { Container } from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';
import {
  formattingWorldLongGrassSpriteUrl,
  resolvingWorldLongGrassFacingAtTileIndex,
  resolvingWorldLongGrassSizeVariantAtTileIndex,
} from '../../../shared/worldLongGrassPlacement';

/**
 * Incrementally syncs depth-sorted long-grass sprite clumps for a visible window.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleLongGrassDecorationLayer
 */

/** Default build budget per sync call. */
export const SYNCING_WORLD_PLAZA_LONG_GRASS_DECORATION_DEFAULT_BUILD_BUDGET = 24;

/**
 * Tiny per-tile bias so neighboring clumps keep relative iso order while staying
 * inside the floor-decoration z band above batched floor chunks.
 */
const SYNCING_WORLD_PLAZA_LONG_GRASS_TILE_DEPTH_BIAS_SCALE = 0.001;

export type SyncingWorldPlazaVisibleLongGrassDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  /** Invalidates the candidate listing cache when bounds / clears / burns change. */
  readonly listingCacheKey?: string;
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

type SyncingWorldPlazaLongGrassCandidateListingCache = {
  readonly listingCacheKey: string;
  readonly candidates: readonly DefiningWorldPlazaLongGrassTileInstance[];
};

/** Last applied long-grass sprite URL; skip rebuild when variant/facing unchanged. */
const SYNCING_WORLD_PLAZA_LONG_GRASS_APPLIED_SPRITE_URL_BY_SPRITE = new WeakMap<
  Sprite,
  string
>();

/** Reuse candidate listings across incremental builds for the same window. */
const SYNCING_WORLD_PLAZA_LONG_GRASS_CANDIDATE_LISTING_BY_SPRITE_MAP =
  new WeakMap<
    Map<string, Sprite>,
    SyncingWorldPlazaLongGrassCandidateListingCache
  >();

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

    const sizeVariant =
      checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex(tileX, tileY)
        ? resolvingWorldPlazaRareShrubTallGrassCompanionSizeVariantAtTileIndex(
            tileX,
            tileY
          )
        : resolvingWorldLongGrassSizeVariantAtTileIndex(tileX, tileY);
    const facing = resolvingWorldLongGrassFacingAtTileIndex(tileX, tileY);

    candidates.push({
      tileX,
      tileY,
      spriteUrl: formattingWorldLongGrassSpriteUrl(sizeVariant, facing),
    });
  }

  return candidates;
}

function resolvingWorldPlazaVisibleLongGrassCandidates(
  input: SyncingWorldPlazaVisibleLongGrassDecorationLayerInput
): readonly DefiningWorldPlazaLongGrassTileInstance[] {
  const listingCacheKey =
    input.listingCacheKey ??
    `${input.bounds.minTileX}:${input.bounds.maxTileX}:${input.bounds.minTileY}:${input.bounds.maxTileY}`;
  const cachedListing =
    SYNCING_WORLD_PLAZA_LONG_GRASS_CANDIDATE_LISTING_BY_SPRITE_MAP.get(
      input.spriteByKey
    );

  if (cachedListing && cachedListing.listingCacheKey === listingCacheKey) {
    return cachedListing.candidates;
  }

  const candidates = listingWorldPlazaVisibleLongGrassCandidatesInBounds(
    input.bounds,
    input.burntGrassTileKeys
  );

  SYNCING_WORLD_PLAZA_LONG_GRASS_CANDIDATE_LISTING_BY_SPRITE_MAP.set(
    input.spriteByKey,
    {
      listingCacheKey,
      candidates,
    }
  );

  return candidates;
}

function checkingWorldPlazaLongGrassTextureIsRenderable(
  texture: Texture | null
): texture is Texture {
  return (
    texture !== null &&
    texture !== Texture.EMPTY &&
    texture.width > 0 &&
    texture.height > 0
  );
}

function applyingWorldPlazaLongGrassTileToSprite(
  sprite: Sprite,
  instance: DefiningWorldPlazaLongGrassTileInstance
): boolean {
  const texture = peekingWorldPlazaLongGrassSpriteTextureForUrl(
    instance.spriteUrl
  );

  if (!checkingWorldPlazaLongGrassTextureIsRenderable(texture)) {
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
    DEFINING_WORLD_DEPTH_LONG_GRASS_DECORATION_LAYER_Z_INDEX +
    (instance.tileX + instance.tileY) *
      SYNCING_WORLD_PLAZA_LONG_GRASS_TILE_DEPTH_BIAS_SCALE;
  SYNCING_WORLD_PLAZA_LONG_GRASS_APPLIED_SPRITE_URL_BY_SPRITE.set(
    sprite,
    instance.spriteUrl
  );

  return true;
}

export function syncingWorldPlazaVisibleLongGrassDecorationLayer(
  input: SyncingWorldPlazaVisibleLongGrassDecorationLayerInput
): SyncingWorldPlazaVisibleLongGrassDecorationLayerResult {
  // Textures load async. Do not scan the full floor window every frame while waiting.
  if (!peekingWorldPlazaLongGrassSpriteTextures()) {
    return {
      isComplete: false,
      propsBuilt: 0,
      needsChildSort: false,
    };
  }

  const buildBudget = Math.max(
    1,
    input.maxBuildsPerCall ??
      SYNCING_WORLD_PLAZA_LONG_GRASS_DECORATION_DEFAULT_BUILD_BUDGET
  );
  const shouldSortChildrenImmediately =
    input.shouldSortChildrenImmediately ?? false;
  const candidates = resolvingWorldPlazaVisibleLongGrassCandidates(input);
  const neededKeys = new Set<string>();
  const missingCandidates: DefiningWorldPlazaLongGrassTileInstance[] = [];
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
      if (
        SYNCING_WORLD_PLAZA_LONG_GRASS_APPLIED_SPRITE_URL_BY_SPRITE.get(
          existingSprite
        ) === candidate.spriteUrl &&
        checkingWorldPlazaLongGrassTextureIsRenderable(existingSprite.texture)
      ) {
        continue;
      }

      const previousZIndex = existingSprite.zIndex;
      const didApplyTexture = applyingWorldPlazaLongGrassTileToSprite(
        existingSprite,
        candidate
      );

      if (!didApplyTexture) {
        hasPendingTexture = true;
      }

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
  let propsBuilt = 0;

  for (const candidate of propsToBuild) {
    const texture = peekingWorldPlazaLongGrassSpriteTextureForUrl(
      candidate.spriteUrl
    );

    if (!checkingWorldPlazaLongGrassTextureIsRenderable(texture)) {
      // Do not create invisible placeholders. Stay incomplete until textures load.
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
    applyingWorldPlazaLongGrassTileToSprite(sprite, candidate);
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
