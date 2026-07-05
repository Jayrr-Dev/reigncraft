import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaPlayerCircleOverlapsTileSquare } from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Lava sinking for avatars that step into molten ground-level lava.
 *
 * Avatars are not blocked by lava; instead they visually fall in: the body
 * sinks below the shoreline and a two-layer molten cover renders around the
 * avatar (a north rim behind the body and a south wave in front of it) so
 * the lava surface reads as swallowing them without flatly painting over the
 * sprite. Hazard damage comes from the existing environmental temperature
 * system.
 *
 * @module components/world/domains/resolvingWorldPlazaLavaSinkStateAtGridPoint
 */

/**
 * Future mechanic toggle: when true, avatars walk on the lava crust instead
 * of sinking (e.g. a fire-resistance buff or crust-walking boots).
 */
export const DEFINING_WORLD_PLAZA_LAVA_WALKABLE_ENABLED = false;

/** How deep an avatar sinks into ground-level molten lava, in screen pixels. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX = 10;

/**
 * Extra sink depth per world layer the lava surface sits above ground. Matches
 * the screen lift per layer so higher pools swallow more of the body.
 */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND =
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

/** Molten cover ellipse half width around a sunken avatar. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX = 38;

/** Molten cover ellipse half height around a sunken avatar. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX = 17;

/** Tile ring scanned for nearby molten lava when the avatar stands on safe ground. */
const RESOLVING_WORLD_PLAZA_LAVA_HEAT_PROXIMITY_SCAN_RING = 1;

/** Movement speed multiplier while wading through molten lava (50% slow). */
export const DEFINING_WORLD_PLAZA_LAVA_MOVEMENT_SPEED_MULTIPLIER = 0.5;

/** Vertical bob amplitude for an avatar treading lava, in screen pixels. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_BOB_AMPLITUDE_PX = 1.6;

/** Vertical bob angular speed (radians per millisecond). */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_BOB_SPEED_PER_MS = 0.0032;

/** Bright molten fill of the sink cover. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR = 0xe8641b;

/** Hot rim immediately around the sunken body. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_RIM_COLOR = 0xf7b24e;

/** Dark crust ring at the cover's outer edge. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CRUST_COLOR = 0x7a3010;

/** Near-white heat highlight along the contact line around the body. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CONTACT_COLOR = 0xffd98a;

/** Soft ambient glow bloom painted behind the sunken avatar. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_GLOW_COLOR = 0xff8a3c;

/** Cubic-bezier control scale approximating a half-ellipse bulge. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_HALF_ELLIPSE_KAPPA = 4 / 3;

/**
 * Returns true when the tile is molten ground-level lava an avatar can sink
 * into (lava that is neither raised terrain nor hidden under a rock column).
 */
export function checkingWorldPlazaLavaSinkTileIsMoltenAtTileIndex(
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
 * Returns sink depth for a molten lava surface at the given world layer.
 *
 * Ground-level pools use {@link DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX};
 * each layer above ground adds
 * {@link DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND}.
 */
export function computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer(
  surfaceLayer: number
): number {
  const layerDeltaAboveGround = Math.max(
    0,
    surfaceLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );

  return (
    DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX +
    layerDeltaAboveGround *
      DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND
  );
}

/**
 * Molten-cover scale keyed to sink depth so higher pools lap further up the body.
 */
export function computingWorldPlazaLavaSinkCoverSizeScaleForBaseOffsetPx(
  baseOffsetPx: number
): number {
  if (baseOffsetPx <= 0) {
    return 1;
  }

  return baseOffsetPx / DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX;
}

/**
 * Returns the downward screen offset for an avatar standing in molten lava.
 *
 * Zero when lava walking is enabled, the avatar stands above ground level
 * (placed blocks, elevated terrain), or the tile is not molten lava.
 *
 * @param gridX - Avatar grid X.
 * @param gridY - Avatar grid Y.
 * @param standingLayer - Avatar standing world layer.
 */
export function computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
  gridX: number,
  gridY: number,
  standingLayer: number,
  isLavaWalkable = DEFINING_WORLD_PLAZA_LAVA_WALKABLE_ENABLED
): number {
  if (isLavaWalkable) {
    return 0;
  }

  const standingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint({
    x: gridX,
    y: gridY,
  });

  if (
    !checkingWorldPlazaLavaAtTileIndex(standingTile.tileX, standingTile.tileY)
  ) {
    return 0;
  }

  if (
    checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    )
  ) {
    return 0;
  }

  const isRaisedLava =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    );

  const surfaceLayer = isRaisedLava
    ? resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        standingTile.tileX,
        standingTile.tileY
      )
    : DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  if (isRaisedLava) {
    // Elevated lava pools: only sink when the avatar stands on that surface,
    // not when walking past on the ground below.
    if (standingLayer < surfaceLayer) {
      return 0;
    }
  } else if (standingLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    // Ground-level pools: standing above ground (placed blocks) keeps the
    // avatar dry.
    return 0;
  }

  return computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer(surfaceLayer);
}

/**
 * Returns the walk/run speed multiplier for the avatar's current footing:
 * {@link DEFINING_WORLD_PLAZA_LAVA_MOVEMENT_SPEED_MULTIPLIER} while wading
 * through molten lava, otherwise 1.
 *
 * @param gridX - Avatar grid X.
 * @param gridY - Avatar grid Y.
 * @param standingLayer - Avatar standing world layer.
 */
export function computingWorldPlazaLavaMovementSpeedMultiplierAtGridPoint(
  gridX: number,
  gridY: number,
  standingLayer: number,
  isLavaWalkable = DEFINING_WORLD_PLAZA_LAVA_WALKABLE_ENABLED
): number {
  return computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
    gridX,
    gridY,
    standingLayer,
    isLavaWalkable
  ) > 0
    ? DEFINING_WORLD_PLAZA_LAVA_MOVEMENT_SPEED_MULTIPLIER
    : 1;
}

/**
 * Returns true when the avatar stands on safe footing but their footprint
 * overlaps molten lava on a neighboring tile (shoreline heat without sinking).
 *
 * @param gridX - Avatar grid X.
 * @param gridY - Avatar grid Y.
 * @param standingLayer - Avatar standing world layer.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
export function checkingWorldPlazaLavaHeatProximityAtGridPoint(
  gridX: number,
  gridY: number,
  standingLayer: number,
  playerRadiusGrid = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
): boolean {
  if (
    computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
      gridX,
      gridY,
      standingLayer
    ) > 0
  ) {
    return false;
  }

  const center = { x: gridX, y: gridY };
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);

  for (
    let offsetTileY = -RESOLVING_WORLD_PLAZA_LAVA_HEAT_PROXIMITY_SCAN_RING;
    offsetTileY <= RESOLVING_WORLD_PLAZA_LAVA_HEAT_PROXIMITY_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX = -RESOLVING_WORLD_PLAZA_LAVA_HEAT_PROXIMITY_SCAN_RING;
      offsetTileX <= RESOLVING_WORLD_PLAZA_LAVA_HEAT_PROXIMITY_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
          center,
          playerRadiusGrid,
          tileX,
          tileY
        )
      ) {
        continue;
      }

      if (checkingWorldPlazaLavaSinkTileIsMoltenAtTileIndex(tileX, tileY)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns the gentle vertical bob (in screen px) applied to a sunken avatar
 * so treading lava reads as floating in a viscous liquid.
 *
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function computingWorldPlazaLavaSinkBobOffsetPx(
  animationTimeMs: number
): number {
  return (
    Math.sin(
      animationTimeMs * DEFINING_WORLD_PLAZA_LAVA_SINK_BOB_SPEED_PER_MS
    ) * DEFINING_WORLD_PLAZA_LAVA_SINK_BOB_AMPLITUDE_PX
  );
}

/**
 * Traces a half-ellipse (flat edge along y=0, bulge toward `bulgeSign`) using
 * a cubic bezier approximation and fills it.
 */
function tracingWorldPlazaLavaSinkHalfEllipse(
  graphics: Graphics,
  halfWidth: number,
  halfHeight: number,
  bulgeSign: 1 | -1,
  color: number,
  alpha: number
): void {
  const bulgeY =
    halfHeight * DEFINING_WORLD_PLAZA_LAVA_SINK_HALF_ELLIPSE_KAPPA * bulgeSign;

  graphics
    .moveTo(-halfWidth, 0)
    .bezierCurveTo(-halfWidth, bulgeY, halfWidth, bulgeY, halfWidth, 0)
    .closePath()
    .fill({ color, alpha });
}

/**
 * Draws the north (back) lava cover layer rendered *behind* the avatar
 * sprite: a soft heat glow plus the far crust rim and molten surface, so the
 * pool reads as surrounding the body without painting over it.
 *
 * @param graphics - Pixi graphics parented before the avatar sprite.
 */
export function drawingWorldPlazaLavaSinkCoverBackOnGraphics(
  graphics: Graphics,
  sizeScale = 1
): void {
  const halfWidth =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX * sizeScale;
  const halfHeight =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX * sizeScale;

  graphics.clear();

  // Ambient heat bloom behind the whole body.
  graphics.ellipse(0, -1, halfWidth * 1.35, halfHeight * 1.5).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_GLOW_COLOR,
    alpha: 0.18,
  });

  // Far (north) crust rim and molten surface.
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth,
    halfHeight,
    -1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CRUST_COLOR,
    0.9
  );
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth * 0.88,
    halfHeight * 0.82,
    -1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR,
    0.95
  );
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth * 0.6,
    halfHeight * 0.5,
    -1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_RIM_COLOR,
    0.55
  );
}

/**
 * Draws the south (front) lava cover layer rendered *in front of* the avatar
 * sprite: the near molten wave lapping over the lower body, kept slightly
 * translucent so the legs still read through the melt, plus a bright
 * contact line where the body meets the surface.
 *
 * @param graphics - Pixi graphics parented after the avatar sprite.
 */
export function drawingWorldPlazaLavaSinkCoverFrontOnGraphics(
  graphics: Graphics,
  sizeScale = 1
): void {
  const halfWidth =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX * sizeScale;
  const halfHeight =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX * sizeScale;

  graphics.clear();

  // Near (south) crust rim and molten fill, translucent over the legs.
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth,
    halfHeight,
    1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CRUST_COLOR,
    0.82
  );
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth * 0.88,
    halfHeight * 0.82,
    1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR,
    0.85
  );
  tracingWorldPlazaLavaSinkHalfEllipse(
    graphics,
    halfWidth * 0.6,
    halfHeight * 0.5,
    1,
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_RIM_COLOR,
    0.5
  );

  // Hot contact line across the surface where the body breaks the melt.
  graphics.ellipse(0, 0, halfWidth * 0.82, 1.6).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CONTACT_COLOR,
    alpha: 0.55,
  });
}

/**
 * Draws a floor-level heat bloom for avatars standing beside molten lava on
 * safe ground. Parent this in the shadow container so it sorts beneath the
 * body while still painting on top of the tile floor.
 *
 * @param graphics - Pixi graphics in the avatar shadow container.
 * @param footOffsetBelowGridAnchorPx - Distance from grid anchor to painted feet.
 */
export function drawingWorldPlazaLavaHeatProximityGlowOnGraphics(
  graphics: Graphics,
  footOffsetBelowGridAnchorPx: number,
  sizeScale = 1
): void {
  const halfWidth =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX * sizeScale;
  const halfHeight =
    DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX * sizeScale;
  const footCenterY =
    footOffsetBelowGridAnchorPx +
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX;

  graphics.clear();

  graphics
    .ellipse(0, footCenterY - 1, halfWidth * 1.35, halfHeight * 1.5)
    .fill({
      color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_GLOW_COLOR,
      alpha: 0.2,
    });

  graphics.ellipse(0, footCenterY, halfWidth * 0.92, halfHeight * 0.88).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR,
    alpha: 0.38,
  });

  graphics.ellipse(0, footCenterY, halfWidth * 0.82, 1.8).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CONTACT_COLOR,
    alpha: 0.45,
  });
}

/** Both cover layers of one avatar's lava sink effect. */
export type UpdatingWorldPlazaLavaSinkCoverGraphicsPair = {
  readonly backGraphics: Graphics | null;
  readonly frontGraphics: Graphics | null;
};

/**
 * Animates the two lava cover layers: a slow breathing pulse on scale, a
 * shimmer on alpha, and a counter-phase glow so the melt feels alive. Cheap
 * per-frame work only (no redraw) so it is safe to run for every avatar.
 *
 * @param pair - Back and front cover graphics for one avatar.
 * @param isSunken - Whether the avatar is currently sunk in molten lava.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function updatingWorldPlazaLavaSinkCoverAnimation(
  pair: UpdatingWorldPlazaLavaSinkCoverGraphicsPair,
  isSunken: boolean,
  animationTimeMs: number,
  coverSizeScale = 1
): void {
  const { backGraphics, frontGraphics } = pair;

  if (backGraphics) {
    backGraphics.visible = isSunken;
  }

  if (frontGraphics) {
    frontGraphics.visible = isSunken;
  }

  if (!isSunken) {
    return;
  }

  const breathingScale =
    (1 + 0.035 * Math.sin(animationTimeMs * 0.0021)) * coverSizeScale;
  const shimmerAlpha = 0.92 + 0.08 * Math.sin(animationTimeMs * 0.0045);
  const glowAlpha = 0.9 + 0.1 * Math.sin(animationTimeMs * 0.0028 + Math.PI);

  if (backGraphics) {
    backGraphics.position.set(0, 2);
    backGraphics.scale.set(breathingScale);
    backGraphics.alpha = glowAlpha;
  }

  if (frontGraphics) {
    frontGraphics.position.set(0, 2);
    frontGraphics.scale.set(breathingScale);
    frontGraphics.alpha = shimmerAlpha;
  }
}

/**
 * Animates the floor-level shoreline heat glow beside molten lava.
 *
 * @param graphics - Proximity glow graphics in the shadow container.
 * @param isActive - Whether the avatar is beside lava on safe footing.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function updatingWorldPlazaLavaHeatProximityGlowAnimation(
  graphics: Graphics | null,
  isActive: boolean,
  animationTimeMs: number
): void {
  if (!graphics) {
    return;
  }

  graphics.visible = isActive;

  if (!isActive) {
    return;
  }

  const breathingScale = 1 + 0.03 * Math.sin(animationTimeMs * 0.0021);
  const glowAlpha = 0.88 + 0.12 * Math.sin(animationTimeMs * 0.0028 + Math.PI);

  graphics.scale.set(breathingScale);
  graphics.alpha = glowAlpha;
}
