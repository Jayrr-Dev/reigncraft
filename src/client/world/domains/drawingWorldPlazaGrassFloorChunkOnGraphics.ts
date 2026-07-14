import {
  creatingWorldPlazaGrassFloorChunkDrawPassContext,
  type CreatingWorldPlazaGrassFloorChunkDrawPassContext,
} from '@/components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext';
import {
  drawingWorldPlazaGrassFloorTileOnGraphics,
  type DrawingWorldPlazaGrassFloorTileDrawOptions,
} from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import type { Graphics } from 'pixi.js';

/**
 * Draws one batched floor chunk into a single graphics object.
 *
 * @module components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics
 */

/** Bake phase for resumeable chunk draws (fills first, decorations last). */
export type DrawingWorldPlazaGrassFloorChunkDrawPhase = 'fill' | 'decoration';

/** Input for {@link drawingWorldPlazaGrassFloorChunkOnGraphics}. */
export interface DrawingWorldPlazaGrassFloorChunkOnGraphicsInput {
  readonly graphics: Graphics;
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
  readonly chunkSizeTiles: number;
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
}

/** Input for a resumeable tile range within one chunk. */
export interface DrawingWorldPlazaGrassFloorChunkTilesOnGraphicsInput {
  readonly graphics: Graphics;
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
  readonly chunkSizeTiles: number;
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
  /** Inclusive flat tile offset into the chunk (row-major). */
  readonly startTileOffset: number;
  /** Max tiles to draw this call; omit to finish the chunk. */
  readonly maxTiles?: number;
  /** Reused across resumes so per-chunk lookup Maps stay warm. */
  readonly drawPassContext?: CreatingWorldPlazaGrassFloorChunkDrawPassContext;
  /**
   * Fill pass draws grass diamonds only. Decoration pass draws flowers/stones
   * on top so neighbor fills cannot bury them.
   */
  readonly drawPhase?: DrawingWorldPlazaGrassFloorChunkDrawPhase;
}

/** Result from a resumeable chunk tile draw. */
export interface DrawingWorldPlazaGrassFloorChunkTilesOnGraphicsResult {
  /** Next flat tile offset to resume from (equals tileCount when done). */
  readonly nextTileOffset: number;
  /** True when every tile in the chunk has been drawn for this phase. */
  readonly isComplete: boolean;
  /** Draw-pass caches to pass back on the next resume. */
  readonly drawPassContext: CreatingWorldPlazaGrassFloorChunkDrawPassContext;
}

/**
 * Resolves draw options for one chunk bake phase.
 */
function resolvingWorldPlazaGrassFloorChunkPhaseDrawOptions(
  drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions,
  drawPassContext: CreatingWorldPlazaGrassFloorChunkDrawPassContext,
  drawPhase: DrawingWorldPlazaGrassFloorChunkDrawPhase
): DrawingWorldPlazaGrassFloorTileDrawOptions {
  const sharedOptions: DrawingWorldPlazaGrassFloorTileDrawOptions = {
    ...drawOptions,
    isDaytime: drawPassContext.isDaytime,
    drawsEnvironmentalHazardFloorTint:
      drawPassContext.drawsEnvironmentalHazardFloorTint,
    drawPassContext,
  };

  if (drawPhase === 'fill') {
    return {
      ...sharedOptions,
      drawsFloorFill: true,
      drawsGrassDecorations: false,
      drawsFlowerDecorations: false,
      drawsStoneDecorations: false,
    };
  }

  return {
    ...sharedOptions,
    drawsFloorFill: false,
  };
}

/**
 * Draws a contiguous tile range inside one floor chunk for one bake phase.
 *
 * Flat offsets are row-major: `tileOffsetY * chunkSize + tileOffsetX`.
 *
 * @param input - Chunk origin, resume offset, and optional tile cap.
 */
export function drawingWorldPlazaGrassFloorChunkTilesOnGraphics(
  input: DrawingWorldPlazaGrassFloorChunkTilesOnGraphicsInput
): DrawingWorldPlazaGrassFloorChunkTilesOnGraphicsResult {
  const chunkSizeTiles = Math.max(1, Math.floor(input.chunkSizeTiles));
  const tileCount = chunkSizeTiles * chunkSizeTiles;
  const startTileOffset = Math.max(
    0,
    Math.min(tileCount, Math.floor(input.startTileOffset))
  );
  const maxTiles =
    input.maxTiles === undefined
      ? tileCount - startTileOffset
      : Math.max(0, Math.floor(input.maxTiles));
  const endTileOffset = Math.min(tileCount, startTileOffset + maxTiles);
  const drawPassContext =
    input.drawPassContext ??
    creatingWorldPlazaGrassFloorChunkDrawPassContext(input.drawOptions);
  const drawPhase = input.drawPhase ?? 'fill';
  const drawOptions = resolvingWorldPlazaGrassFloorChunkPhaseDrawOptions(
    input.drawOptions,
    drawPassContext,
    drawPhase
  );

  for (
    let tileOffset = startTileOffset;
    tileOffset < endTileOffset;
    tileOffset += 1
  ) {
    const tileOffsetY = Math.floor(tileOffset / chunkSizeTiles);
    const tileOffsetX = tileOffset - tileOffsetY * chunkSizeTiles;

    drawingWorldPlazaGrassFloorTileOnGraphics(
      input.graphics,
      input.chunkOriginTileX + tileOffsetX,
      input.chunkOriginTileY + tileOffsetY,
      drawOptions
    );
  }

  return {
    nextTileOffset: endTileOffset,
    isComplete: endTileOffset >= tileCount,
    drawPassContext,
  };
}

/**
 * Draws every tile in a chunk's fixed region (fills first, decorations second).
 *
 * A chunk covers a stable world region, so it always renders its full tile
 * grid. Clipping to a transient visible window would bake gaps into the cached
 * graphics and surface them as seams once the viewport shifts.
 *
 * @param input - Chunk origin, size, and decoration toggles.
 */
export function drawingWorldPlazaGrassFloorChunkOnGraphics(
  input: DrawingWorldPlazaGrassFloorChunkOnGraphicsInput
): void {
  const fillPass = drawingWorldPlazaGrassFloorChunkTilesOnGraphics({
    graphics: input.graphics,
    chunkOriginTileX: input.chunkOriginTileX,
    chunkOriginTileY: input.chunkOriginTileY,
    chunkSizeTiles: input.chunkSizeTiles,
    drawOptions: input.drawOptions,
    startTileOffset: 0,
    drawPhase: 'fill',
  });

  drawingWorldPlazaGrassFloorChunkTilesOnGraphics({
    graphics: input.graphics,
    chunkOriginTileX: input.chunkOriginTileX,
    chunkOriginTileY: input.chunkOriginTileY,
    chunkSizeTiles: input.chunkSizeTiles,
    drawOptions: input.drawOptions,
    startTileOffset: 0,
    drawPhase: 'decoration',
    drawPassContext: fillPass.drawPassContext,
  });
}
