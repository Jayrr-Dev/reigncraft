import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws cooled crust along lava pool edges that border dry terrain.
 *
 * Instead of stroking each tile's edges independently (which leaves caps and
 * seams at every tile corner), this traces the whole pool boundary: dry-facing
 * diamond edges are collected as shared-vertex segments, chained into
 * continuous paths, and each path is stroked once so the crust reads as a
 * single unbroken rim.
 *
 * @module components/world/domains/drawingWorldPlazaLavaCrustDetailsOnGraphics
 */

/** Dark cooled crust body along the lava shoreline. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_COLOR = 0x3d1808;

/** Outer crust stroke opacity. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_ALPHA = 0.9;

/** Outer crust stroke width in pixels. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_WIDTH_PX = 6;

/** Mid-tone baked crust between char and molten rim. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_COLOR = 0x7a3010;

/** Mid crust stroke opacity. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_ALPHA = 0.85;

/** Mid crust stroke width in pixels. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_WIDTH_PX = 3.5;

/** Warm rim where crust meets flowing lava. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_COLOR = 0xc85a20;

/** Rim stroke opacity. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_ALPHA = 0.7;

/** Rim stroke width in pixels. */
export const DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_WIDTH_PX = 1.5;

/** One visible lava tile index. */
export type DrawingWorldPlazaLavaCrustTileIndex = {
  readonly tileX: number;
  readonly tileY: number;
};

/** Optional overrides for elevated lava surfaces. */
export type DrawingWorldPlazaLavaCrustDrawOptions = {
  /** Vertical screen offset applied to every vertex (elevated surfaces). */
  readonly offsetY?: number;
  /**
   * Custom molten-connectivity check; edges facing tiles where this returns
   * false receive crust. Defaults to the ground-level molten lava check.
   */
  readonly checkingTileIsConnected?: (tileX: number, tileY: number) => boolean;
};

/** One directed boundary segment between two shared diamond vertices. */
type DrawingWorldPlazaLavaCrustBoundarySegment = {
  readonly fromKey: string;
  readonly toKey: string;
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
};

/** One chained boundary path; closed loops rejoin their first vertex. */
type DrawingWorldPlazaLavaCrustBoundaryPath = {
  readonly points: Array<{ readonly x: number; readonly y: number }>;
  readonly isClosed: boolean;
};

/** Neighbor deltas per diamond edge, ordered top→right→bottom→left (clockwise). */
const DRAWING_WORLD_PLAZA_LAVA_CRUST_EDGE_NEIGHBOR_DELTAS: ReadonlyArray<{
  readonly deltaX: number;
  readonly deltaY: number;
}> = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
];

/**
 * Returns true when the tile should participate in the molten lava overlay.
 */
function checkingWorldPlazaLavaCrustTileIsMoltenLava(
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

function buildingWorldPlazaLavaCrustVertexKey(x: number, y: number): string {
  return `${Math.round(x * 4)},${Math.round(y * 4)}`;
}

function listingWorldPlazaLavaCrustDiamondVertices(
  tileX: number,
  tileY: number,
  offsetY: number
): Array<{ readonly x: number; readonly y: number }> {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const centerY = center.y + offsetY;
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return [
    { x: center.x, y: centerY - halfHeight },
    { x: center.x + halfWidth, y: centerY },
    { x: center.x, y: centerY + halfHeight },
    { x: center.x - halfWidth, y: centerY },
  ];
}

function collectingWorldPlazaLavaCrustBoundarySegments(
  lavaTiles: readonly DrawingWorldPlazaLavaCrustTileIndex[],
  drawOptions: DrawingWorldPlazaLavaCrustDrawOptions
): DrawingWorldPlazaLavaCrustBoundarySegment[] {
  const segments: DrawingWorldPlazaLavaCrustBoundarySegment[] = [];
  const offsetY = drawOptions.offsetY ?? 0;
  const checkingTileIsConnected =
    drawOptions.checkingTileIsConnected ??
    checkingWorldPlazaLavaCrustTileIsMoltenLava;

  for (const { tileX, tileY } of lavaTiles) {
    if (!checkingTileIsConnected(tileX, tileY)) {
      continue;
    }

    const vertices = listingWorldPlazaLavaCrustDiamondVertices(
      tileX,
      tileY,
      offsetY
    );

    for (let edgeIndex = 0; edgeIndex < 4; edgeIndex += 1) {
      const neighborDelta =
        DRAWING_WORLD_PLAZA_LAVA_CRUST_EDGE_NEIGHBOR_DELTAS[edgeIndex];

      if (
        checkingTileIsConnected(
          tileX + neighborDelta.deltaX,
          tileY + neighborDelta.deltaY
        )
      ) {
        continue;
      }

      const fromVertex = vertices[edgeIndex];
      const toVertex = vertices[(edgeIndex + 1) % 4];

      segments.push({
        fromKey: buildingWorldPlazaLavaCrustVertexKey(
          fromVertex.x,
          fromVertex.y
        ),
        toKey: buildingWorldPlazaLavaCrustVertexKey(toVertex.x, toVertex.y),
        fromX: fromVertex.x,
        fromY: fromVertex.y,
        toX: toVertex.x,
        toY: toVertex.y,
      });
    }
  }

  return segments;
}

/**
 * Chains directed boundary segments into continuous paths. Per-tile edges are
 * emitted clockwise, so a pool boundary chains head-to-tail into closed loops;
 * pools clipped by the visible bounds yield open chains instead.
 */
function chainingWorldPlazaLavaCrustBoundaryPaths(
  segments: readonly DrawingWorldPlazaLavaCrustBoundarySegment[]
): DrawingWorldPlazaLavaCrustBoundaryPath[] {
  const outgoingByFromKey = new Map<
    string,
    DrawingWorldPlazaLavaCrustBoundarySegment[]
  >();

  for (const segment of segments) {
    const bucket = outgoingByFromKey.get(segment.fromKey);

    if (bucket) {
      bucket.push(segment);
    } else {
      outgoingByFromKey.set(segment.fromKey, [segment]);
    }
  }

  const incomingByToKey = new Map<
    string,
    DrawingWorldPlazaLavaCrustBoundarySegment[]
  >();

  for (const segment of segments) {
    const bucket = incomingByToKey.get(segment.toKey);

    if (bucket) {
      bucket.push(segment);
    } else {
      incomingByToKey.set(segment.toKey, [segment]);
    }
  }

  const consumed = new Set<DrawingWorldPlazaLavaCrustBoundarySegment>();
  const paths: DrawingWorldPlazaLavaCrustBoundaryPath[] = [];

  const takingNextSegment = (fromKey: string) => {
    const bucket = outgoingByFromKey.get(fromKey);

    if (!bucket) {
      return null;
    }

    for (const candidate of bucket) {
      if (!consumed.has(candidate)) {
        consumed.add(candidate);
        return candidate;
      }
    }

    return null;
  };

  for (const seedSegment of segments) {
    if (consumed.has(seedSegment)) {
      continue;
    }

    consumed.add(seedSegment);

    const chain: DrawingWorldPlazaLavaCrustBoundarySegment[] = [seedSegment];

    for (
      let nextSegment = takingNextSegment(seedSegment.toKey);
      nextSegment !== null &&
      chain[chain.length - 1].toKey !== seedSegment.fromKey;
      nextSegment = takingNextSegment(chain[chain.length - 1].toKey)
    ) {
      chain.push(nextSegment);
    }

    const isClosed = chain[chain.length - 1].toKey === seedSegment.fromKey;

    if (!isClosed) {
      // Extend backwards for open chains clipped by the viewport.
      let headKey = chain[0].fromKey;

      for (
        let previousBucket = incomingByToKey.get(headKey);
        previousBucket !== undefined;
        previousBucket = incomingByToKey.get(headKey)
      ) {
        const previousSegment = previousBucket.find(
          (candidate) => !consumed.has(candidate)
        );

        if (!previousSegment) {
          break;
        }

        consumed.add(previousSegment);
        chain.unshift(previousSegment);
        headKey = previousSegment.fromKey;
      }
    }

    const points: Array<{ readonly x: number; readonly y: number }> = [
      { x: chain[0].fromX, y: chain[0].fromY },
    ];

    for (const segment of chain) {
      points.push({ x: segment.toX, y: segment.toY });
    }

    if (isClosed) {
      points.pop();
    }

    paths.push({ points, isClosed });
  }

  return paths;
}

function strokingWorldPlazaLavaCrustBoundaryPath(
  graphics: Graphics,
  path: DrawingWorldPlazaLavaCrustBoundaryPath,
  strokeColor: number,
  strokeAlpha: number,
  strokeWidthPx: number,
  strokeAlignment: number
): void {
  const [firstPoint, ...restPoints] = path.points;

  if (!firstPoint || restPoints.length === 0) {
    return;
  }

  graphics.moveTo(firstPoint.x, firstPoint.y);

  for (const point of restPoints) {
    graphics.lineTo(point.x, point.y);
  }

  if (path.isClosed) {
    graphics.closePath();
  }

  graphics.stroke({
    width: strokeWidthPx,
    color: strokeColor,
    alpha: strokeAlpha,
    alignment: strokeAlignment,
    cap: 'round',
    join: 'round',
  });
}

/**
 * Draws the cooled crust rim for every visible lava tile in one pass.
 *
 * @param graphics - Pixi graphics instance (should sit above the lava mask).
 * @param lavaTiles - Visible molten lava tile indices.
 * @param drawOptions - Optional overrides for elevated lava surfaces.
 */
export function drawingWorldPlazaLavaCrustDetailsOnGraphics(
  graphics: Graphics,
  lavaTiles: readonly DrawingWorldPlazaLavaCrustTileIndex[],
  drawOptions: DrawingWorldPlazaLavaCrustDrawOptions = {}
): void {
  const segments = collectingWorldPlazaLavaCrustBoundarySegments(
    lavaTiles,
    drawOptions
  );

  if (segments.length === 0) {
    return;
  }

  const paths = chainingWorldPlazaLavaCrustBoundaryPaths(segments);

  // Bands are anchored by stroke alignment so the crust fades from dark char
  // on the land side to the warm rim on the lava side, with no dark line
  // bleeding into the lava. Loops wind clockwise (per-tile edge order), so
  // alignment 0 faces land and alignment 1 faces lava.
  for (const path of paths) {
    strokingWorldPlazaLavaCrustBoundaryPath(
      graphics,
      path,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_COLOR,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_ALPHA,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_OUTER_WIDTH_PX,
      0
    );
  }

  for (const path of paths) {
    strokingWorldPlazaLavaCrustBoundaryPath(
      graphics,
      path,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_COLOR,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_ALPHA,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_MID_WIDTH_PX,
      0.5
    );
  }

  for (const path of paths) {
    strokingWorldPlazaLavaCrustBoundaryPath(
      graphics,
      path,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_COLOR,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_ALPHA,
      DRAWING_WORLD_PLAZA_LAVA_CRUST_RIM_WIDTH_PX,
      1
    );
  }
}
