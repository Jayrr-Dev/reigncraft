import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import {
  applyingWorldPlazaDeclarativeAnimationFrameToSprites,
  resolvingWorldPlazaDeclarativeAnimationFrameAtTime,
} from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { peekingWorldPlazaLavaStaticTileTexture } from '@/components/world/domains/loadingWorldPlazaLavaTileTextures';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { Container, Graphics, Sprite, type Texture } from 'pixi.js';

/**
 * Maintains static and animated lava texture overlays for visible lava tiles.
 *
 * Each lava tile gets a static cracked-lava sprite (`tile_018`) with the
 * animated strip composited on top. A single shared mask clips both layers to
 * the union of lava diamonds so textures never bleed onto neighboring tiles.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleLavaOverlayLayer
 */

/** Milliseconds each lava animation frame stays on screen. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FRAME_DURATION_MS = 280;

/** Scale for the animated strip relative to the static lava tile (zoomed in). */
export const SYNCING_WORLD_PLAZA_LAVA_ANIMATED_OVERLAY_ZOOM_SCALE = 2;

/** Extra mask expansion in pixels so adjacent lava diamonds overlap slightly. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_MASK_BLEED_PX = 5;

/** Slight sprite overscan past the tile diamond to hide sub-pixel seams. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_SPRITE_BLEED_SCALE = 1.2;

/** Light store namespace owned by the lava overlay. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_OWNER_KEY = 'lava';

/** Molten orange-red tint for lava glow sprites. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_TINT = 0xff7a2e;

/** Source strength for lava glow (0..1, scaled by the night curve). */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_BRIGHTNESS = 0.85;

/** Glow footprint for a single-tile lava pool (1 = torch size). */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_BASE_RADIUS_SCALE = 1.3;

/** Cap on the glow footprint for very large lava pools. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_MAX_RADIUS_SCALE = 3.4;

/** Max lava pool lights published at once; largest pools win. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_MAX_COUNT = 10;

/** Z-index inside the floor layer; above floor chunks, below water surface. */
const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_Z_INDEX =
  DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX - 2;

/** Mutable overlay state owned by the terrain sync component. */
export type SyncingWorldPlazaVisibleLavaOverlayLayerState = {
  readonly container: Container;
  readonly maskGraphics: Graphics;
  staticSprites: Sprite[];
  sprites: Sprite[];
  lastAppliedFrameIndex: number;
};

/**
 * Creates the lava overlay container (with its clipping mask) when missing.
 *
 * @param parentContainer - Floor layer container that owns floor chunks.
 * @param state - Existing overlay state, if any.
 */
export function ensuringWorldPlazaVisibleLavaOverlayLayer(
  parentContainer: Container,
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState | null
): SyncingWorldPlazaVisibleLavaOverlayLayerState {
  if (state) {
    return state;
  }

  const container = new Container();
  container.eventMode = 'none';
  container.zIndex = SYNCING_WORLD_PLAZA_LAVA_OVERLAY_Z_INDEX;

  const maskGraphics = new Graphics();
  maskGraphics.eventMode = 'none';
  container.addChild(maskGraphics);
  container.mask = maskGraphics;
  parentContainer.addChild(container);

  return {
    container,
    maskGraphics,
    staticSprites: [],
    sprites: [],
    lastAppliedFrameIndex: -1,
  };
}

type SyncingWorldPlazaLavaTileIndex = { tileX: number; tileY: number };

/**
 * Groups visible lava tiles into connected pools (8-neighbor flood fill) and
 * publishes one warm light per pool, sized by the pool's tile count. Keeping
 * one light per pool instead of one per tile stays under the global glow
 * sprite cap even when lava blobs span dozens of tiles.
 */
function publishingWorldPlazaLavaPoolLightSources(
  lavaTiles: readonly SyncingWorldPlazaLavaTileIndex[]
): void {
  const remainingTileKeys = new Map<string, SyncingWorldPlazaLavaTileIndex>();

  for (const tile of lavaTiles) {
    remainingTileKeys.set(`${tile.tileX},${tile.tileY}`, tile);
  }

  const pools: { centerX: number; centerY: number; tileCount: number }[] = [];

  while (remainingTileKeys.size > 0) {
    const firstEntry = remainingTileKeys.entries().next();

    if (firstEntry.done) {
      break;
    }

    const [firstKey, firstTile] = firstEntry.value;
    remainingTileKeys.delete(firstKey);

    const poolTiles: SyncingWorldPlazaLavaTileIndex[] = [firstTile];
    const visitQueue: SyncingWorldPlazaLavaTileIndex[] = [firstTile];

    for (
      let currentTile = visitQueue.pop();
      currentTile !== undefined;
      currentTile = visitQueue.pop()
    ) {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue;
          }

          const neighborKey = `${currentTile.tileX + offsetX},${currentTile.tileY + offsetY}`;
          const neighborTile = remainingTileKeys.get(neighborKey);

          if (neighborTile) {
            remainingTileKeys.delete(neighborKey);
            poolTiles.push(neighborTile);
            visitQueue.push(neighborTile);
          }
        }
      }
    }

    let sumX = 0;
    let sumY = 0;

    for (const poolTile of poolTiles) {
      sumX += poolTile.tileX;
      sumY += poolTile.tileY;
    }

    pools.push({
      centerX: sumX / poolTiles.length + 0.5,
      centerY: sumY / poolTiles.length + 0.5,
      tileCount: poolTiles.length,
    });
  }

  pools.sort((poolA, poolB) => poolB.tileCount - poolA.tileCount);

  const lights: DefiningWorldPlazaLightSource[] = pools
    .slice(0, SYNCING_WORLD_PLAZA_LAVA_LIGHT_MAX_COUNT)
    .map((pool) => ({
      id: `lava:${Math.round(pool.centerX * 10)},${Math.round(pool.centerY * 10)}`,
      gridX: pool.centerX,
      gridY: pool.centerY,
      worldLayer: 0,
      radiusScale: Math.min(
        SYNCING_WORLD_PLAZA_LAVA_LIGHT_MAX_RADIUS_SCALE,
        SYNCING_WORLD_PLAZA_LAVA_LIGHT_BASE_RADIUS_SCALE *
          Math.sqrt(pool.tileCount)
      ),
      brightness: SYNCING_WORLD_PLAZA_LAVA_LIGHT_BRIGHTNESS,
      colorTint: SYNCING_WORLD_PLAZA_LAVA_LIGHT_TINT,
    }));

  syncingWorldPlazaLightSourcesForOwner(
    SYNCING_WORLD_PLAZA_LAVA_LIGHT_OWNER_KEY,
    lights
  );
}

/**
 * Removes every lava pool light (overlay unmount or world reset).
 */
export function clearingWorldPlazaLavaPoolLightSources(): void {
  clearingWorldPlazaLightSourcesForOwner(
    SYNCING_WORLD_PLAZA_LAVA_LIGHT_OWNER_KEY
  );
}

function checkingWorldPlazaLavaOverlayTileIsDrawable(
  tileX: number,
  tileY: number
): boolean {
  if (!checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY)
  ) {
    return false;
  }

  return !checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(
    tileX,
    tileY
  );
}

function listingWorldPlazaIsometricTileDiamondMaskPolygonAtCenter(
  centerX: number,
  centerY: number,
  bleedPx: number
): number[] {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const vertices = [
    { x: centerX, y: centerY - halfHeight },
    { x: centerX + halfWidth, y: centerY },
    { x: centerX, y: centerY + halfHeight },
    { x: centerX - halfWidth, y: centerY },
  ];

  return vertices.flatMap((vertex) => {
    const deltaX = vertex.x - centerX;
    const deltaY = vertex.y - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance <= 0) {
      return [vertex.x, vertex.y];
    }

    const bleedScale = (distance + bleedPx) / distance;

    return [centerX + deltaX * bleedScale, centerY + deltaY * bleedScale];
  });
}

function buildingWorldPlazaLavaOverlaySpriteAtCenter(
  texture: Texture,
  center: { readonly x: number; readonly y: number },
  zoomScale = 1
): Sprite {
  const bleedScale = SYNCING_WORLD_PLAZA_LAVA_OVERLAY_SPRITE_BLEED_SCALE;
  const sprite = new Sprite(texture);
  sprite.eventMode = 'none';
  sprite.anchor.set(0.5, 0.5);
  sprite.roundPixels = true;
  sprite.position.set(Math.round(center.x), Math.round(center.y));
  sprite.width =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * zoomScale * bleedScale;
  sprite.height =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX * zoomScale * bleedScale;

  return sprite;
}

/**
 * Rebuilds lava sprites and the shared diamond mask for the visible bounds.
 *
 * @param state - Overlay state from {@link ensuringWorldPlazaVisibleLavaOverlayLayer}.
 * @param bounds - Visible tile index range.
 * @param frameTextures - Sliced lava animation frames.
 */
export function updatingWorldPlazaVisibleLavaOverlayLayer(
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  animationTimeMs: number
): void {
  const staticTexture = peekingWorldPlazaLavaStaticTileTexture();
  const lavaClip = resolvingWorldPlazaAnimationClip(
    DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE
  );
  const initialFrame =
    lavaClip === null
      ? null
      : resolvingWorldPlazaDeclarativeAnimationFrameAtTime(
          { clipId: DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE },
          lavaClip,
          animationTimeMs
        ).texture;

  for (const sprite of state.staticSprites) {
    state.container.removeChild(sprite);
    sprite.destroy();
  }

  for (const sprite of state.sprites) {
    state.container.removeChild(sprite);
    sprite.destroy();
  }

  state.staticSprites = [];
  state.sprites = [];
  state.maskGraphics.clear();

  if (!staticTexture && !initialFrame) {
    publishingWorldPlazaLavaPoolLightSources([]);
    state.lastAppliedFrameIndex = -1;
    return;
  }

  const lavaTiles: SyncingWorldPlazaLavaTileIndex[] = [];
  const maskPolygons: number[][] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    if (!checkingWorldPlazaLavaOverlayTileIsDrawable(tileX, tileY)) {
      continue;
    }

    lavaTiles.push({ tileX, tileY });

    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: tileX,
      y: tileY,
    });

    if (staticTexture) {
      const staticSprite = buildingWorldPlazaLavaOverlaySpriteAtCenter(
        staticTexture,
        center
      );
      state.container.addChild(staticSprite);
      state.staticSprites.push(staticSprite);
    }

    if (initialFrame) {
      const animatedSprite = buildingWorldPlazaLavaOverlaySpriteAtCenter(
        initialFrame,
        center,
        SYNCING_WORLD_PLAZA_LAVA_ANIMATED_OVERLAY_ZOOM_SCALE
      );
      state.container.addChild(animatedSprite);
      state.sprites.push(animatedSprite);
    }

    maskPolygons.push(
      listingWorldPlazaIsometricTileDiamondMaskPolygonAtCenter(
        center.x,
        center.y,
        SYNCING_WORLD_PLAZA_LAVA_OVERLAY_MASK_BLEED_PX
      )
    );
  }

  for (const maskPolygon of maskPolygons) {
    state.maskGraphics.poly(maskPolygon);
  }

  if (maskPolygons.length > 0) {
    state.maskGraphics.fill({ color: 0xffffff });
  }

  publishingWorldPlazaLavaPoolLightSources(lavaTiles);
  state.lastAppliedFrameIndex = -1;
}

/**
 * Advances the shared lava animation frame across every visible sprite.
 *
 * @param state - Overlay state with live sprites.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function advancingWorldPlazaVisibleLavaOverlayAnimation(
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState,
  animationTimeMs: number
): void {
  if (state.sprites.length === 0) {
    return;
  }

  const lavaClip = resolvingWorldPlazaAnimationClip(
    DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE
  );

  if (!lavaClip) {
    return;
  }

  const playbackRequest = {
    clipId: DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE,
  };
  const frame = resolvingWorldPlazaDeclarativeAnimationFrameAtTime(
    playbackRequest,
    lavaClip,
    animationTimeMs
  );

  if (frame.frameIndex === state.lastAppliedFrameIndex) {
    return;
  }

  applyingWorldPlazaDeclarativeAnimationFrameToSprites(state.sprites, frame);
  state.lastAppliedFrameIndex = frame.frameIndex;
}
