/**
 * Syncs depth-sorted mushroom sprites for the visible tile window.
 *
 * @module components/world/mushrooms/domains/syncingWorldPlazaVisibleMushroomDecorationLayer
 */

import { DEFINING_WORLD_DEPTH_MUSHROOM_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { resolvingWorldPlazaDayNightCyclePhase } from '@/components/world/domains/resolvingWorldPlazaDayNightCyclePhase';
import { DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import {
  listingWorldPlazaMushroomDecorationCandidatesInBounds,
  type ListingWorldPlazaMushroomDecorationCandidate,
} from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomDecorationCandidatesInBounds';
import { peekingWorldPlazaMushroomSpriteTextureForSpeciesIndex } from '@/components/world/mushrooms/domains/loadingWorldPlazaMushroomSpriteTextures';
import type { Container } from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';

export const SYNCING_WORLD_PLAZA_MUSHROOM_DECORATION_DEFAULT_BUILD_BUDGET = 24;

const SYNCING_WORLD_PLAZA_MUSHROOM_TILE_DEPTH_BIAS_SCALE = 0.001;
const SYNCING_WORLD_PLAZA_MUSHROOM_PHASE_BUCKET_COUNT = 32;

export type SyncingWorldPlazaMushroomDecorationCandidateCache = {
  cacheKey: string;
  candidates: readonly ListingWorldPlazaMushroomDecorationCandidate[];
};

export type SyncingWorldPlazaVisibleMushroomDecorationLayerInput = {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly spriteByKey: Map<string, Sprite>;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  readonly maxBuildsPerCall?: number;
  readonly shouldSortChildrenImmediately?: boolean;
  readonly epochMs?: number;
  /** Persists across budgeted sync frames until bounds/day/sun invalidate. */
  readonly candidateCache?: SyncingWorldPlazaMushroomDecorationCandidateCache;
};

export type SyncingWorldPlazaVisibleMushroomDecorationLayerResult = {
  readonly isComplete: boolean;
  readonly propsBuilt: number;
  readonly needsChildSort: boolean;
};

function formattingWorldPlazaMushroomDecorationCandidateCacheKey(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  epochMs: number,
  burntGrassTileKeys: ReadonlySet<string> | undefined
): string {
  const dayNumber = formattingWorldPlazaDayNightDayNumber(epochMs);
  const phaseBucket =
    Math.floor(
      (((resolvingWorldPlazaDayNightCyclePhase(epochMs) % 1) + 1) *
        SYNCING_WORLD_PLAZA_MUSHROOM_PHASE_BUCKET_COUNT) %
        SYNCING_WORLD_PLAZA_MUSHROOM_PHASE_BUCKET_COUNT
    );
  const burntRevision = burntGrassTileKeys?.size ?? 0;

  return `${buildingWorldPlazaVisibleTileBoundsCacheKey(bounds)}:${dayNumber}:${phaseBucket}:${burntRevision}`;
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
  instance: ListingWorldPlazaMushroomDecorationCandidate
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
    x: instance.tileX + 0.5,
    y: instance.tileY + 0.5,
  });
  const elevationOffsetPx =
    computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(
      instance.tileX,
      instance.tileY
    );

  sprite.x = screenPoint.x;
  sprite.y =
    screenPoint.y +
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX * 0.15 +
    elevationOffsetPx;
  sprite.width =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE;
  sprite.height =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX *
    DEFINING_WORLD_PLAZA_MUSHROOM_DISPLAY_SCALE *
    1.15;
  sprite.zIndex =
    DEFINING_WORLD_DEPTH_MUSHROOM_DECORATION_LAYER_Z_INDEX +
    (instance.tileX + instance.tileY) *
      SYNCING_WORLD_PLAZA_MUSHROOM_TILE_DEPTH_BIAS_SCALE;

  return true;
}

function resolvingWorldPlazaMushroomDecorationCandidates(
  input: SyncingWorldPlazaVisibleMushroomDecorationLayerInput,
  epochMs: number
): readonly ListingWorldPlazaMushroomDecorationCandidate[] {
  const cacheKey = formattingWorldPlazaMushroomDecorationCandidateCacheKey(
    input.bounds,
    epochMs,
    input.burntGrassTileKeys
  );

  if (input.candidateCache && input.candidateCache.cacheKey === cacheKey) {
    return input.candidateCache.candidates;
  }

  const candidates = listingWorldPlazaMushroomDecorationCandidatesInBounds(
    input.bounds,
    input.burntGrassTileKeys,
    epochMs
  );

  if (input.candidateCache) {
    input.candidateCache.cacheKey = cacheKey;
    input.candidateCache.candidates = candidates;
  }

  return candidates;
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
  const candidates = resolvingWorldPlazaMushroomDecorationCandidates(
    input,
    epochMs
  );
  const neededKeys = new Set<string>();
  const missingCandidates: ListingWorldPlazaMushroomDecorationCandidate[] = [];
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
