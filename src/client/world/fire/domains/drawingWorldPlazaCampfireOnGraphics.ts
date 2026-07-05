import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { adjustingWorldPlazaRgbColorBrightness } from '@/components/world/domains/blendingWorldPlazaRgbColors';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { Graphics } from 'pixi.js';
import {
  WORLD_CAMPFIRE_STAGE_EXTINGUISHED,
  WORLD_CAMPFIRE_STAGE_METADATA_KEY,
} from '../../../../shared/worldCampfireStage';

/**
 * Draws procedural campfires (stone ring, log teepee, burnt remains) with the
 * same seeded cartoon shading style as the terrain rocks and trees.
 *
 * The lit flame animation stays on the fire layer sprite pipeline; this module
 * only paints the ground-level campfire body under it.
 *
 * @module components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics
 */

/** Visual construction stages for a procedural campfire. */
export type DrawingWorldPlazaCampfireStage =
  | 'base'
  | 'unlit'
  | 'lit'
  | 'extinguished';

/** Vertical offset so the campfire body sits on the flame foot anchor. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_FOOT_OFFSET_PX = 2;

/** Soft ground scorch ellipse half-width. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_RADIUS_X_PX = 16;

/** Soft ground scorch ellipse half-height (2:1 isometric). */
const DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_RADIUS_Y_PX = 8;

/** Ground scorch fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_FILL_COLOR = 0x1c140e;

/** Ground scorch fill alpha. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_FILL_ALPHA = 0.4;

/** Number of stones in the surrounding ring. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_COUNT = 8;

/** Stone ring ellipse half-width. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RING_RADIUS_X_PX = 14;

/** Stone ring ellipse half-height (2:1 isometric). */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RING_RADIUS_Y_PX = 7;

/** Mid stone body fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_BODY_COLOR = 0x82807b;

/** Base stone radius before per-stone jitter. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RADIUS_PX = 3.4;

/** Max +/- fraction of stone radius jitter. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RADIUS_JITTER = 0.3;

/** Max +/- radial placement jitter for ring stones (px). */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_PLACEMENT_JITTER_PX = 1.6;

/** Stone outline width. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_OUTLINE_WIDTH_PX = 1;

/** Fresh log body fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BODY_COLOR = 0x7a4b26;

/** Fresh log cut-face (end cap) fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_END_CAP_COLOR = 0xc99a63;

/** Fresh log outline color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_STROKE_COLOR = 0x3c2412;

/** Charred log body fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_BODY_COLOR = 0x2a211b;

/** Charred log end cap fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_END_CAP_COLOR = 0x4a3f36;

/** Charred log outline color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_STROKE_COLOR = 0x120d09;

/** Ash pile fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_ASH_FILL_COLOR = 0x5d5851;

/** Ash pile highlight fill color. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_ASH_HIGHLIGHT_COLOR = 0x7b756c;

/** Number of teepee logs when the campfire holds fresh wood. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_COUNT = 4;

/** Log base half-width at the ground end. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_HALF_WIDTH_PX = 2.1;

/** Log tip half-width where the logs cross. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_TIP_HALF_WIDTH_PX = 1.2;

/** Ellipse half-width of the log base circle inside the stone ring. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_RADIUS_X_PX = 9;

/** Ellipse half-height of the log base circle inside the stone ring. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_RADIUS_Y_PX = 4.5;

/** Height of the teepee crossing point above the ring center. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_PEAK_RAISE_PX = 10;

/** How far a log tip overshoots past the ring center (px). */
const DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_TIP_OVERSHOOT_PX = 3;

/** Ember glow fill color under a lit flame. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_EMBER_GLOW_COLOR = 0xffaa50;

/** Ember glow core fill color under a lit flame. */
const DRAWING_WORLD_PLAZA_CAMPFIRE_EMBER_CORE_COLOR = 0xfff2b0;

/**
 * Screen-Y offset from the tile center anchor to the campfire flame base.
 *
 * Sits inside the log teepee, slightly above the stone ring — not at the
 * log crossing point, which reads as floating when the flame sprite is tall.
 */
export function resolvingWorldPlazaCampfireFlameFootOffsetFromFootAnchorPx(): number {
  return (
    DRAWING_WORLD_PLAZA_CAMPFIRE_FOOT_OFFSET_PX +
    Math.round(DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_PEAK_RAISE_PX * 0.2)
  );
}

/**
 * Returns a deterministic unit float in [0, 1) from rounded screen coords.
 *
 * Matches the seeding approach used by the terrain rock boulders so campfires
 * stay stable per placement without storing extra state.
 */
function seedingWorldPlazaCampfireUnit(
  seedX: number,
  seedY: number,
  salt: number
): number {
  const raw =
    Math.sin(seedX * 127.1 + seedY * 311.7 + salt * 74.7) * 43758.5453;

  return raw - Math.floor(raw);
}

/**
 * Draws the soft scorched-ground ellipse under every campfire stage.
 */
function drawingWorldPlazaCampfireGroundScorch(
  graphics: Graphics,
  centerX: number,
  centerY: number
): void {
  graphics
    .ellipse(
      centerX,
      centerY,
      DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_RADIUS_X_PX,
      DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_RADIUS_Y_PX
    )
    .fill({
      color: DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_FILL_COLOR,
      alpha: DRAWING_WORLD_PLAZA_CAMPFIRE_SCORCH_FILL_ALPHA,
    });
}

/**
 * Draws the seeded stone ring around the fire pit, back stones first.
 */
function drawingWorldPlazaCampfireStoneRing(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  seedX: number,
  seedY: number
): void {
  const stones: { x: number; y: number; radius: number; brightness: number }[] =
    [];

  for (
    let stoneIndex = 0;
    stoneIndex < DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_COUNT;
    stoneIndex += 1
  ) {
    const angle =
      (stoneIndex / DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_COUNT) * Math.PI * 2 +
      (seedingWorldPlazaCampfireUnit(seedX, seedY, stoneIndex * 3 + 1) - 0.5) *
        0.5;
    const radialJitter =
      (seedingWorldPlazaCampfireUnit(seedX, seedY, stoneIndex * 3 + 2) * 2 -
        1) *
      DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_PLACEMENT_JITTER_PX;
    const radius =
      DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RADIUS_PX *
      (1 +
        (seedingWorldPlazaCampfireUnit(seedX, seedY, stoneIndex * 3 + 3) * 2 -
          1) *
          DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RADIUS_JITTER);

    stones.push({
      x:
        centerX +
        Math.cos(angle) *
          (DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RING_RADIUS_X_PX + radialJitter),
      y:
        centerY +
        Math.sin(angle) *
          (DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_RING_RADIUS_Y_PX +
            radialJitter * 0.5),
      radius,
      brightness:
        (seedingWorldPlazaCampfireUnit(seedX, seedY, stoneIndex * 3 + 4) * 2 -
          1) *
        0.07,
    });
  }

  stones.sort((stoneA, stoneB) => stoneA.y - stoneB.y);

  for (const stone of stones) {
    const bodyColor = adjustingWorldPlazaRgbColorBrightness(
      DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_BODY_COLOR,
      stone.brightness
    );
    const strokeColor = adjustingWorldPlazaRgbColorBrightness(bodyColor, -0.22);
    const highlightColor = adjustingWorldPlazaRgbColorBrightness(
      bodyColor,
      0.14
    );

    graphics
      .ellipse(stone.x, stone.y, stone.radius, stone.radius * 0.8)
      .fill({ color: bodyColor })
      .stroke({
        color: strokeColor,
        width: DRAWING_WORLD_PLAZA_CAMPFIRE_STONE_OUTLINE_WIDTH_PX,
      });

    graphics
      .ellipse(
        stone.x - stone.radius * 0.25,
        stone.y - stone.radius * 0.35,
        stone.radius * 0.5,
        stone.radius * 0.35
      )
      .fill({ color: highlightColor });
  }
}

type DrawingWorldPlazaCampfireLogSpec = {
  readonly baseX: number;
  readonly baseY: number;
  readonly tipX: number;
  readonly tipY: number;
};

/**
 * Builds the seeded teepee log layout leaning into the ring center.
 */
function buildingWorldPlazaCampfireTeepeeLogSpecs(
  centerX: number,
  centerY: number,
  seedX: number,
  seedY: number
): DrawingWorldPlazaCampfireLogSpec[] {
  const peakY = centerY - DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_PEAK_RAISE_PX;
  const logSpecs: DrawingWorldPlazaCampfireLogSpec[] = [];

  for (
    let logIndex = 0;
    logIndex < DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_COUNT;
    logIndex += 1
  ) {
    const angle =
      (logIndex / DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_COUNT) * Math.PI * 2 +
      Math.PI / DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_COUNT +
      (seedingWorldPlazaCampfireUnit(seedX, seedY, 40 + logIndex) - 0.5) * 0.6;
    const baseX =
      centerX +
      Math.cos(angle) * DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_RADIUS_X_PX;
    const baseY =
      centerY +
      Math.sin(angle) * DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_RADIUS_Y_PX;

    logSpecs.push({
      baseX,
      baseY,
      tipX:
        centerX -
        Math.cos(angle) * DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_TIP_OVERSHOOT_PX,
      tipY:
        peakY -
        Math.sin(angle) *
          DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_TIP_OVERSHOOT_PX *
          0.5,
    });
  }

  return logSpecs.sort((logA, logB) => logA.baseY - logB.baseY);
}

/**
 * Draws one tapered log with a shaded body, outline, and a cut end cap.
 */
function drawingWorldPlazaCampfireLog(
  graphics: Graphics,
  logSpec: DrawingWorldPlazaCampfireLogSpec,
  bodyColor: number,
  endCapColor: number,
  strokeColor: number
): void {
  const deltaX = logSpec.tipX - logSpec.baseX;
  const deltaY = logSpec.tipY - logSpec.baseY;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const perpX = -deltaY / length;
  const perpY = deltaX / length;
  const baseHalfWidth = DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BASE_HALF_WIDTH_PX;
  const tipHalfWidth = DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_TIP_HALF_WIDTH_PX;

  const bodyPoints = [
    logSpec.baseX + perpX * baseHalfWidth,
    logSpec.baseY + perpY * baseHalfWidth,
    logSpec.tipX + perpX * tipHalfWidth,
    logSpec.tipY + perpY * tipHalfWidth,
    logSpec.tipX - perpX * tipHalfWidth,
    logSpec.tipY - perpY * tipHalfWidth,
    logSpec.baseX - perpX * baseHalfWidth,
    logSpec.baseY - perpY * baseHalfWidth,
  ];

  graphics
    .poly(bodyPoints)
    .fill({ color: bodyColor })
    .stroke({ color: strokeColor, width: 1 });

  // Lit-side highlight strip along the upper edge reads the log as round.
  graphics
    .poly([
      logSpec.baseX + perpX * baseHalfWidth * 0.55,
      logSpec.baseY + perpY * baseHalfWidth * 0.55,
      logSpec.tipX + perpX * tipHalfWidth * 0.55,
      logSpec.tipY + perpY * tipHalfWidth * 0.55,
      logSpec.tipX,
      logSpec.tipY,
      logSpec.baseX,
      logSpec.baseY,
    ])
    .fill({
      color: adjustingWorldPlazaRgbColorBrightness(bodyColor, 0.08),
    });

  graphics
    .ellipse(logSpec.baseX, logSpec.baseY, baseHalfWidth, baseHalfWidth * 0.75)
    .fill({ color: endCapColor })
    .stroke({ color: strokeColor, width: 1 });
}

/**
 * Draws the fresh log teepee stacked inside the stone ring.
 */
function drawingWorldPlazaCampfireFreshLogs(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  seedX: number,
  seedY: number
): void {
  const logSpecs = buildingWorldPlazaCampfireTeepeeLogSpecs(
    centerX,
    centerY,
    seedX,
    seedY
  );

  for (const [logIndex, logSpec] of logSpecs.entries()) {
    const bodyColor = adjustingWorldPlazaRgbColorBrightness(
      DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_BODY_COLOR,
      (seedingWorldPlazaCampfireUnit(seedX, seedY, 60 + logIndex) * 2 - 1) *
        0.05
    );

    drawingWorldPlazaCampfireLog(
      graphics,
      logSpec,
      bodyColor,
      DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_END_CAP_COLOR,
      DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_STROKE_COLOR
    );
  }
}

/**
 * Draws the warm ember bed under the flame animation for lit campfires.
 */
function drawingWorldPlazaCampfireEmberGlow(
  graphics: Graphics,
  centerX: number,
  centerY: number
): void {
  const emberCenterY =
    centerY - Math.round(DRAWING_WORLD_PLAZA_CAMPFIRE_LOG_PEAK_RAISE_PX * 0.45);

  graphics.ellipse(centerX, emberCenterY, 8, 4).fill({
    color: DRAWING_WORLD_PLAZA_CAMPFIRE_EMBER_GLOW_COLOR,
    alpha: 0.72,
  });
  graphics.ellipse(centerX, emberCenterY, 4.2, 2.1).fill({
    color: DRAWING_WORLD_PLAZA_CAMPFIRE_EMBER_CORE_COLOR,
    alpha: 0.88,
  });
}

/**
 * Draws collapsed charred logs and an ash pile for burnt-out campfires.
 */
function drawingWorldPlazaCampfireBurntRemains(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  seedX: number,
  seedY: number
): void {
  graphics
    .ellipse(centerX, centerY, 8.5, 4.2)
    .fill({ color: DRAWING_WORLD_PLAZA_CAMPFIRE_ASH_FILL_COLOR });
  graphics
    .ellipse(centerX - 1, centerY - 0.8, 4.5, 2.2)
    .fill({ color: DRAWING_WORLD_PLAZA_CAMPFIRE_ASH_HIGHLIGHT_COLOR });

  // Collapsed stubs: shorter, flatter versions of the teepee logs.
  const logSpecs = buildingWorldPlazaCampfireTeepeeLogSpecs(
    centerX,
    centerY,
    seedX,
    seedY
  ).map((logSpec) => ({
    baseX: logSpec.baseX,
    baseY: logSpec.baseY,
    tipX: logSpec.baseX + (logSpec.tipX - logSpec.baseX) * 0.6,
    tipY: logSpec.baseY + (logSpec.tipY - logSpec.baseY) * 0.25,
  }));

  for (const logSpec of logSpecs) {
    drawingWorldPlazaCampfireLog(
      graphics,
      logSpec,
      DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_BODY_COLOR,
      DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_END_CAP_COLOR,
      DRAWING_WORLD_PLAZA_CAMPFIRE_BURNT_LOG_STROKE_COLOR
    );
  }
}

/**
 * Draws one procedural campfire at an absolute screen point.
 *
 * Stages layer up like a real campfire build: `base` is just the stone ring,
 * `unlit` adds the log teepee, `lit` adds an ember bed for the flame overlay,
 * and `extinguished` shows charred logs collapsed into ash.
 *
 * @param graphics - Target Pixi graphics (caller manages clear / batching).
 * @param centerX - Fire pit center X in world screen space.
 * @param centerY - Fire pit center Y in world screen space.
 * @param stage - Campfire construction stage to render.
 */
export function drawingWorldPlazaCampfireOnGraphicsAtScreenPoint(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  stage: DrawingWorldPlazaCampfireStage
): void {
  const seedX = Math.round(centerX);
  const seedY = Math.round(centerY);

  drawingWorldPlazaCampfireGroundScorch(graphics, centerX, centerY);

  if (stage === 'extinguished') {
    drawingWorldPlazaCampfireBurntRemains(
      graphics,
      centerX,
      centerY,
      seedX,
      seedY
    );
  }

  drawingWorldPlazaCampfireStoneRing(graphics, centerX, centerY, seedX, seedY);

  if (stage === 'unlit' || stage === 'lit') {
    drawingWorldPlazaCampfireFreshLogs(
      graphics,
      centerX,
      centerY,
      seedX,
      seedY
    );
  }

  if (stage === 'lit') {
    drawingWorldPlazaCampfireEmberGlow(graphics, centerX, centerY);
  }
}

/**
 * Resolves the persisted campfire stage for a placed block.
 *
 * Lit is driven live by fire cells on the fire layer, so persisted rendering
 * only distinguishes fresh wood from burnt-out remains.
 */
export function resolvingWorldPlazaCampfirePlacedBlockStage(
  block: DefiningWorldBuildingPlacedBlock
): DrawingWorldPlazaCampfireStage {
  if (
    block.metadata[WORLD_CAMPFIRE_STAGE_METADATA_KEY] ===
    WORLD_CAMPFIRE_STAGE_EXTINGUISHED
  ) {
    return 'extinguished';
  }

  return 'unlit';
}

/**
 * Draws one placed campfire block aligned with the fire layer flame anchor.
 *
 * @param graphics - Target graphics for the block's tile column.
 * @param block - Placed campfire block.
 */
export function drawingWorldPlazaCampfirePlacedBlockOnGraphics(
  graphics: Graphics,
  block: DefiningWorldBuildingPlacedBlock
): void {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: block.tilePosition.tileX,
    y: block.tilePosition.tileY,
    layer: worldLayer,
  });

  drawingWorldPlazaCampfireOnGraphicsAtScreenPoint(
    graphics,
    tileAnchor.centerXPx,
    tileAnchor.centerYPx + DRAWING_WORLD_PLAZA_CAMPFIRE_FOOT_OFFSET_PX,
    resolvingWorldPlazaCampfirePlacedBlockStage(block)
  );
}
