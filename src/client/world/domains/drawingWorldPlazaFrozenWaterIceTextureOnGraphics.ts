import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_HALF_LENGTH_PX,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COUNT_MAX,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_TILE_THRESHOLD,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_TILE_THRESHOLD,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Static crack lines and glint dots for frozen water floor tiles.
 *
 * Drawn once into floor chunks (no animation) so ice reads textured on low tiers.
 *
 * @module components/world/domains/drawingWorldPlazaFrozenWaterIceTextureOnGraphics
 */

/** Salt for deciding whether a frozen tile receives crack lines. */
const DRAWING_WORLD_PLAZA_FROZEN_WATER_CRACK_TILE_SEED_SALT = 4411;

/** Salt for crack segment placement and angle. */
const DRAWING_WORLD_PLAZA_FROZEN_WATER_CRACK_SEGMENT_SEED_SALT = 5527;

/** Salt for static glint dot placement. */
const DRAWING_WORLD_PLAZA_FROZEN_WATER_SHINE_TILE_SEED_SALT = 6631;

/**
 * Draws hairline crack strokes and an optional glint dot on one frozen tile.
 *
 * @param graphics - Pixi graphics instance for the floor tile.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 */
export function drawingWorldPlazaFrozenWaterIceTextureOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
): void {
  const crackTileSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DRAWING_WORLD_PLAZA_FROZEN_WATER_CRACK_TILE_SEED_SALT,
  );

  if (crackTileSeed >= DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_TILE_THRESHOLD) {
    const crackCount = mappingWorldPlazaGrassSeededUnitToIntegerRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        DRAWING_WORLD_PLAZA_FROZEN_WATER_CRACK_SEGMENT_SEED_SALT,
      ),
      1,
      DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COUNT_MAX,
    );

    for (let crackIndex = 0; crackIndex < crackCount; crackIndex += 1) {
      const segmentSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        DRAWING_WORLD_PLAZA_FROZEN_WATER_CRACK_SEGMENT_SEED_SALT + crackIndex,
      );
      const angleRadians = mappingWorldPlazaGrassSeededUnitToFloatRange(
        segmentSeed,
        0,
        Math.PI,
      );
      const directionX = Math.cos(angleRadians);
      const directionY = Math.sin(angleRadians);
      const offsetX =
        (seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          771 + crackIndex,
        ) -
          0.5) *
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
        0.55;
      const offsetY =
        (seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          883 + crackIndex,
        ) -
          0.5) *
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
        0.55;
      const crackCenterX = centerX + offsetX;
      const crackCenterY = centerY + offsetY;
      const halfLengthPx = DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_HALF_LENGTH_PX;

      graphics
        .moveTo(
          crackCenterX - directionX * halfLengthPx,
          crackCenterY - directionY * halfLengthPx,
        )
        .lineTo(
          crackCenterX + directionX * halfLengthPx,
          crackCenterY + directionY * halfLengthPx,
        )
        .stroke({
          width: DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_WIDTH_PX,
          color: DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COLOR,
          alpha: DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_ALPHA,
          cap: "round",
        });
    }
  }

  const shineTileSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DRAWING_WORLD_PLAZA_FROZEN_WATER_SHINE_TILE_SEED_SALT,
  );

  if (shineTileSeed < DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_TILE_THRESHOLD) {
    return;
  }

  const shineOffsetX =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 991) -
      0.5) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
    0.35;
  const shineOffsetY =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 1093) -
      0.5) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    0.35;

  graphics
    .circle(
      centerX + shineOffsetX,
      centerY + shineOffsetY - DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * 0.08,
      DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_DOT_RADIUS_PX,
    )
    .fill({
      color: DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_COLOR,
      alpha: DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_ALPHA,
    });
}
