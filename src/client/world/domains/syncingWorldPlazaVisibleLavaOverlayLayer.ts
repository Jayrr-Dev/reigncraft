import { DEFINING_WORLD_DEPTH_LAVA_OVERLAY_LAYER_Z_INDEX } from '@/components/world/depth';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BASE_RADIUS_SCALE,
  DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_MAX_RADIUS_SCALE,
} from '@/components/world/domains/definingWorldPlazaEmissiveNightBoostConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaLavaCrustDetailsOnGraphics } from '@/components/world/domains/drawingWorldPlazaLavaCrustDetailsOnGraphics';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { peekingWorldPlazaLavaStaticTileTexture } from '@/components/world/domains/loadingWorldPlazaLavaTileTextures';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { Container, Graphics, TilingSprite, type Texture } from 'pixi.js';

/**
 * Maintains a scrolling lava texture overlay for visible lava tiles.
 *
 * Each lava tile uses a masked TilingSprite with world-locked UVs so the
 * seamless webp drifts slowly and reads as molten flow.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleLavaOverlayLayer
 */

/** Extra mask expansion in pixels so adjacent lava diamonds overlap slightly. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_MASK_BLEED_PX = 2;

/** Slight sprite overscan past the tile diamond to hide sub-pixel seams. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_SPRITE_BLEED_SCALE = 1.2;

/** Extra sprite size so texture scroll stays hidden inside the diamond mask. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_TEXTURE_OVERSCAN = 2.4;

/** Primary flow speed along screen X (px per ms). */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_SPEED_X_PX_PER_MS = 0.004;

/** Primary flow speed along screen Y (px per ms). */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_SPEED_Y_PX_PER_MS = 0.003;

/** Cross-flow wobble amplitude in pixels. */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_WOBBLE_AMPLITUDE_PX = 4;

/** Alpha pulse depth for a subtle heat shimmer (0..1). */
export const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_ALPHA_PULSE_AMOUNT = 0.06;

/** Light store namespace owned by the lava overlay. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_OWNER_KEY = 'lava';

/** Molten orange-red tint for lava glow sprites. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_TINT = 0xff7a2e;

/** Max lava pool lights published at once; largest pools win. */
const SYNCING_WORLD_PLAZA_LAVA_LIGHT_MAX_COUNT = 10;

/** Z-index inside the floor layer; above floor chunks, below water surface. */
const SYNCING_WORLD_PLAZA_LAVA_OVERLAY_Z_INDEX =
  DEFINING_WORLD_DEPTH_LAVA_OVERLAY_LAYER_Z_INDEX;

/** One region-covering lava sprite with its world-locked scroll origin. */
type SyncingWorldPlazaVisibleLavaOverlayRegionSpriteEntry = {
  readonly sprite: TilingSprite;
  baseTileX: number;
  baseTileY: number;
};

/** Screen-space rectangle covering a set of lava tiles. */
type SyncingWorldPlazaLavaOverlayScreenRect = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

/** Mutable overlay state owned by the terrain sync component. */
export type SyncingWorldPlazaVisibleLavaOverlayLayerState = {
  readonly container: Container;
  readonly maskedContent: Container;
  readonly maskGraphics: Graphics;
  readonly crustGraphics: Graphics;
  /** Single reusable sprite that covers every ground-level lava tile. */
  groundSpriteEntry: SyncingWorldPlazaVisibleLavaOverlayRegionSpriteEntry | null;
  /** Fingerprint of last drawable + light tile set; skip rebuild when unchanged. */
  lastOverlaySyncKey: string;
};

/**
 * Creates the lava overlay container (with its clipping mask) when missing.
 *
 * Elevated lava is not handled here: it is painted directly into the terrain
 * elevation column graphics so it depth-sorts against avatars.
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

  const maskedContent = new Container();
  maskedContent.eventMode = 'none';
  maskedContent.mask = maskGraphics;

  const crustGraphics = new Graphics();
  crustGraphics.eventMode = 'none';
  crustGraphics.zIndex = 2;

  container.sortableChildren = true;
  container.addChild(maskGraphics);
  container.addChild(maskedContent);
  container.addChild(crustGraphics);
  parentContainer.addChild(container);

  return {
    container,
    maskedContent,
    maskGraphics,
    crustGraphics,
    groundSpriteEntry: null,
    lastOverlaySyncKey: '',
  };
}

/**
 * Destroys the shared ground lava sprite (world reset or overlay teardown).
 *
 * @param state - Overlay state that may own a ground sprite.
 */
export function clearingWorldPlazaVisibleLavaOverlayGroundSprite(
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState
): void {
  if (state.groundSpriteEntry) {
    state.maskedContent.removeChild(state.groundSpriteEntry.sprite);
    state.groundSpriteEntry.sprite.destroy();
    state.groundSpriteEntry = null;
  }
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
        DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_MAX_RADIUS_SCALE,
        DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BASE_RADIUS_SCALE *
          Math.sqrt(pool.tileCount)
      ),
      brightness: DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_LIGHT_BRIGHTNESS,
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

/**
 * Returns true when the tile is lava sitting on a raised terrain column, so
 * its molten surface must render on the elevated column top instead of the
 * ground-level overlay.
 */
function checkingWorldPlazaLavaOverlayTileIsElevated(
  tileX: number,
  tileY: number
): boolean {
  if (!DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED) {
    return false;
  }

  if (!checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    !checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY)
  ) {
    return false;
  }

  return !checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex(
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

/**
 * Creates one region-covering TilingSprite. The tile pattern density matches
 * the previous per-tile sprites, but a single sprite (clipped by one shared
 * mask) covers any number of lava tiles.
 */
function buildingWorldPlazaLavaOverlayRegionSprite(
  texture: Texture
): SyncingWorldPlazaVisibleLavaOverlayRegionSpriteEntry {
  const bleedScale = SYNCING_WORLD_PLAZA_LAVA_OVERLAY_SPRITE_BLEED_SCALE;
  const overscan = SYNCING_WORLD_PLAZA_LAVA_OVERLAY_TEXTURE_OVERSCAN;
  const patternWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * bleedScale * overscan;
  const patternHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HEIGHT_PX * bleedScale * overscan;
  const sprite = new TilingSprite({ texture, width: 1, height: 1 });
  sprite.eventMode = 'none';
  sprite.roundPixels = true;
  sprite.tileScale.set(
    patternWidth / Math.max(texture.width, 1),
    patternHeight / Math.max(texture.height, 1)
  );

  return { sprite, baseTileX: 0, baseTileY: 0 };
}

/**
 * Repositions a region sprite over a screen rect, keeping the texture pattern
 * locked to world coordinates so panning never makes the lava swim.
 */
function positioningWorldPlazaLavaOverlayRegionSprite(
  entry: SyncingWorldPlazaVisibleLavaOverlayRegionSpriteEntry,
  screenRect: SyncingWorldPlazaLavaOverlayScreenRect
): void {
  const left = Math.round(screenRect.left);
  const top = Math.round(screenRect.top);

  entry.sprite.position.set(left, top);
  entry.sprite.width = Math.ceil(screenRect.width);
  entry.sprite.height = Math.ceil(screenRect.height);
  entry.baseTileX = -left;
  entry.baseTileY = -top;
  entry.sprite.tilePosition.set(entry.baseTileX, entry.baseTileY);
}

/**
 * Screen-space bounding rect over a set of tile surface centers.
 */
function computingWorldPlazaLavaOverlayScreenRectForCenters(
  centers: readonly { readonly x: number; readonly y: number }[]
): SyncingWorldPlazaLavaOverlayScreenRect {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const center of centers) {
    minX = Math.min(minX, center.x);
    maxX = Math.max(maxX, center.x);
    minY = Math.min(minY, center.y);
    maxY = Math.max(maxY, center.y);
  }

  const margin = SYNCING_WORLD_PLAZA_LAVA_OVERLAY_MASK_BLEED_PX + 4;
  const left =
    minX - DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX - margin;
  const top =
    minY - DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX - margin;

  return {
    left,
    top,
    width:
      maxX + DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX + margin - left,
    height:
      maxY + DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX + margin - top,
  };
}

/**
 * Rebuilds lava sprites and the shared diamond mask for the visible bounds.
 *
 * @param state - Overlay state from {@link ensuringWorldPlazaVisibleLavaOverlayLayer}.
 * @param bounds - Visible tile index range.
 */
export function updatingWorldPlazaVisibleLavaOverlayLayer(
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  const staticTexture = peekingWorldPlazaLavaStaticTileTexture();

  if (!staticTexture) {
    state.maskGraphics.clear();
    state.crustGraphics.clear();
    clearingWorldPlazaVisibleLavaOverlayGroundSprite(state);
    publishingWorldPlazaLavaPoolLightSources([]);
    state.lastOverlaySyncKey = '';
    return;
  }

  const lavaTiles: SyncingWorldPlazaLavaTileIndex[] = [];
  const lightTiles: SyncingWorldPlazaLavaTileIndex[] = [];
  const groundCenters: { x: number; y: number }[] = [];
  let overlaySyncKeyParts = '';

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    // Elevated lava renders inside the terrain column graphics; it only
    // contributes to the pool glow lights here.
    if (checkingWorldPlazaLavaOverlayTileIsElevated(tileX, tileY)) {
      lightTiles.push({ tileX, tileY });
      overlaySyncKeyParts += `e${tileX},${tileY};`;
      continue;
    }

    if (!checkingWorldPlazaLavaOverlayTileIsDrawable(tileX, tileY)) {
      continue;
    }

    lavaTiles.push({ tileX, tileY });
    lightTiles.push({ tileX, tileY });
    overlaySyncKeyParts += `g${tileX},${tileY};`;
    groundCenters.push(
      convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: tileX,
        y: tileY,
      })
    );
  }

  // Same visible lava set as last rebuild: keep mask, crust, sprite, and lights.
  if (overlaySyncKeyParts === state.lastOverlaySyncKey) {
    return;
  }

  state.lastOverlaySyncKey = overlaySyncKeyParts;
  state.maskGraphics.clear();
  state.crustGraphics.clear();

  for (const center of groundCenters) {
    state.maskGraphics.poly(
      listingWorldPlazaIsometricTileDiamondMaskPolygonAtCenter(
        center.x,
        center.y,
        SYNCING_WORLD_PLAZA_LAVA_OVERLAY_MASK_BLEED_PX
      )
    );
  }

  if (lavaTiles.length > 0) {
    state.maskGraphics.fill({ color: 0xffffff });

    if (!state.groundSpriteEntry) {
      state.groundSpriteEntry =
        buildingWorldPlazaLavaOverlayRegionSprite(staticTexture);
      state.maskedContent.addChild(state.groundSpriteEntry.sprite);
    }

    state.groundSpriteEntry.sprite.visible = true;
    positioningWorldPlazaLavaOverlayRegionSprite(
      state.groundSpriteEntry,
      computingWorldPlazaLavaOverlayScreenRectForCenters(groundCenters)
    );
  } else if (state.groundSpriteEntry) {
    state.groundSpriteEntry.sprite.visible = false;
  }

  drawingWorldPlazaLavaCrustDetailsOnGraphics(state.crustGraphics, lavaTiles);

  publishingWorldPlazaLavaPoolLightSources(lightTiles);
}

/**
 * Scrolls the seamless lava texture and applies a subtle heat shimmer.
 *
 * @param state - Overlay state with live sprites.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function advancingWorldPlazaVisibleLavaOverlayAnimation(
  state: SyncingWorldPlazaVisibleLavaOverlayLayerState,
  animationTimeMs: number,
  nightSpriteAlphaMultiplier = 1
): void {
  if (!state.groundSpriteEntry) {
    return;
  }

  const flowOffsetX =
    animationTimeMs * SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_SPEED_X_PX_PER_MS +
    Math.sin(animationTimeMs * 0.0011) *
      SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_WOBBLE_AMPLITUDE_PX;
  const flowOffsetY =
    animationTimeMs * SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_SPEED_Y_PX_PER_MS +
    Math.cos(animationTimeMs * 0.0009) *
      SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FLOW_WOBBLE_AMPLITUDE_PX;
  const alphaPulse =
    1 -
    SYNCING_WORLD_PLAZA_LAVA_OVERLAY_ALPHA_PULSE_AMOUNT +
    SYNCING_WORLD_PLAZA_LAVA_OVERLAY_ALPHA_PULSE_AMOUNT *
      (0.5 + 0.5 * Math.sin(animationTimeMs * 0.0024));

  state.groundSpriteEntry.sprite.tilePosition.set(
    state.groundSpriteEntry.baseTileX + flowOffsetX,
    state.groundSpriteEntry.baseTileY + flowOffsetY
  );
  state.groundSpriteEntry.sprite.alpha =
    alphaPulse * Math.max(1, nightSpriteAlphaMultiplier);
}
