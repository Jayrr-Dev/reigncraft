import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_COLOR,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_LINE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_COLOR,
  DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_LINE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_COVER_EDGE_FRACTION,
  DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_COVER_MIN_ALPHA,
} from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from '@/components/world/domains/definingWorldPlazaWaterKind';
import type { DefiningWorldPlazaWaterShoreDiamondVertex } from '@/components/world/domains/definingWorldPlazaWaterShoreOuterCornerTipRegistry';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Shore foam rendering for one water tile.
 *
 * The water surface itself is drawn as a single merged translucent fill by
 * {@link module:components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics};
 * this module adds foam only on edges that border dry land.
 *
 * @module components/world/domains/drawingWorldPlazaWaterTileOnGraphics
 */

/** Screen center and half extents for one isometric tile. */
interface DrawingWorldPlazaWaterTileScreenFrame {
  readonly centerX: number;
  readonly centerY: number;
  readonly halfWidth: number;
  readonly halfHeight: number;
}

/**
 * Builds the screen frame for one grid tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function buildingWorldPlazaWaterTileScreenFrame(
  tileX: number,
  tileY: number
): DrawingWorldPlazaWaterTileScreenFrame {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });

  return {
    centerX: center.x,
    centerY: center.y,
    halfWidth: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
    halfHeight: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  };
}

/** One diamond edge endpoint pair keyed by the land-facing neighbor delta. */
interface DrawingWorldPlazaWaterShoreEdge {
  readonly deltaX: number;
  readonly deltaY: number;
  readonly fromVertex: 'top' | 'right' | 'bottom' | 'left';
  readonly toVertex: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Maps each cardinal land neighbor to the shared diamond edge facing it.
 *
 * In 2:1 iso (screenX = (x - y) * hw, screenY = (x + y) * hh) the +x/+y grid
 * axes point down-right and down-left, so each cardinal neighbor shares exactly
 * one of the four diamond edges with this tile.
 */
const DRAWING_WORLD_PLAZA_WATER_SHORE_EDGES: readonly DrawingWorldPlazaWaterShoreEdge[] =
  [
    { deltaX: 0, deltaY: -1, fromVertex: 'top', toVertex: 'right' },
    { deltaX: 1, deltaY: 0, fromVertex: 'right', toVertex: 'bottom' },
    { deltaX: 0, deltaY: 1, fromVertex: 'bottom', toVertex: 'left' },
    { deltaX: -1, deltaY: 0, fromVertex: 'left', toVertex: 'top' },
  ];

/** Diamond corner order for walking a closed shore outline clockwise. */
const DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER = [
  'top',
  'right',
  'bottom',
  'left',
] as const;

/** Screen point for one diamond corner. */
interface DrawingWorldPlazaWaterDiamondPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Resolves a diamond vertex to its screen point.
 *
 * @param frame - Tile screen frame.
 * @param vertex - Which diamond corner to resolve.
 */
function resolvingWorldPlazaWaterDiamondVertex(
  frame: DrawingWorldPlazaWaterTileScreenFrame,
  vertex: DefiningWorldPlazaWaterShoreDiamondVertex
): DrawingWorldPlazaWaterDiamondPoint {
  switch (vertex) {
    case 'top':
      return { x: frame.centerX, y: frame.centerY - frame.halfHeight };
    case 'right':
      return { x: frame.centerX + frame.halfWidth, y: frame.centerY };
    case 'bottom':
      return { x: frame.centerX, y: frame.centerY + frame.halfHeight };
    case 'left':
      return { x: frame.centerX - frame.halfWidth, y: frame.centerY };
  }
}

/**
 * Lerps from the tip vertex toward a wing vertex for the tip cover triangle.
 */
function resolvingWorldPlazaWaterShoreOuterCornerTipWingPoint(
  tipPoint: DrawingWorldPlazaWaterDiamondPoint,
  wingPoint: DrawingWorldPlazaWaterDiamondPoint,
  edgeFraction: number
): DrawingWorldPlazaWaterDiamondPoint {
  return {
    x: tipPoint.x + (wingPoint.x - tipPoint.x) * edgeFraction,
    y: tipPoint.y + (wingPoint.y - tipPoint.y) * edgeFraction,
  };
}

/**
 * Returns true when the diamond edge between two consecutive vertices borders dry land.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param fromVertex - Edge start vertex.
 * @param toVertex - Edge end vertex.
 */
function checkingWorldPlazaWaterDiamondEdgeBordersLand(
  tileX: number,
  tileY: number,
  fromVertex: (typeof DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER)[number],
  toVertex: (typeof DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER)[number]
): boolean {
  for (const shoreEdge of DRAWING_WORLD_PLAZA_WATER_SHORE_EDGES) {
    if (
      shoreEdge.fromVertex === fromVertex &&
      shoreEdge.toVertex === toVertex &&
      !resolvingWorldPlazaWaterAtTileIndex(
        tileX + shoreEdge.deltaX,
        tileY + shoreEdge.deltaY
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Lists diamond edge indices (0..3) that border dry land for one water tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function listingWorldPlazaWaterLandBorderingEdgeIndices(
  tileX: number,
  tileY: number
): number[] {
  const landEdgeIndices: number[] = [];
  const vertexCount = DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER.length;

  for (let edgeIndex = 0; edgeIndex < vertexCount; edgeIndex += 1) {
    const fromVertex =
      DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER[edgeIndex];
    const toVertex =
      DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER[
        (edgeIndex + 1) % vertexCount
      ];

    if (
      checkingWorldPlazaWaterDiamondEdgeBordersLand(
        tileX,
        tileY,
        fromVertex,
        toVertex
      )
    ) {
      landEdgeIndices.push(edgeIndex);
    }
  }

  return landEdgeIndices;
}

/**
 * Splits land-bordering edge indices into contiguous runs around the diamond.
 *
 * @param landEdgeIndices - Edge indices returned by
 *   {@link listingWorldPlazaWaterLandBorderingEdgeIndices}.
 */
function groupingWorldPlazaWaterLandBorderingEdgeRuns(
  landEdgeIndices: readonly number[]
): Array<{ readonly startEdge: number; readonly endEdge: number }> {
  if (landEdgeIndices.length === 0) {
    return [];
  }

  if (landEdgeIndices.length === 1) {
    return [{ startEdge: landEdgeIndices[0], endEdge: landEdgeIndices[0] }];
  }

  const breaksAfterIndex: number[] = [];

  for (let index = 0; index < landEdgeIndices.length; index += 1) {
    const currentEdge = landEdgeIndices[index];
    const nextEdge = landEdgeIndices[(index + 1) % landEdgeIndices.length];

    if ((currentEdge + 1) % 4 !== nextEdge) {
      breaksAfterIndex.push(index);
    }
  }

  if (breaksAfterIndex.length === 0) {
    return [
      {
        startEdge: landEdgeIndices[0],
        endEdge: landEdgeIndices[landEdgeIndices.length - 1],
      },
    ];
  }

  const runs: Array<{ readonly startEdge: number; readonly endEdge: number }> =
    [];
  let runStartListIndex = 0;

  for (const breakAfterIndex of breaksAfterIndex) {
    const runEndListIndex =
      breakAfterIndex === landEdgeIndices.length - 1 ? 0 : breakAfterIndex + 1;

    if (runStartListIndex <= breakAfterIndex) {
      runs.push({
        startEdge: landEdgeIndices[runStartListIndex],
        endEdge: landEdgeIndices[breakAfterIndex],
      });
    }

    runStartListIndex = runEndListIndex;
  }

  if (runStartListIndex !== 0 && runStartListIndex < landEdgeIndices.length) {
    runs.push({
      startEdge: landEdgeIndices[runStartListIndex],
      endEdge: landEdgeIndices[landEdgeIndices.length - 1],
    });
  }

  return runs;
}

/**
 * Strokes one contiguous brown shore foam run along consecutive land-facing edges.
 *
 * @param graphics - Pixi graphics instance.
 * @param frame - Tile screen frame.
 * @param startEdge - First land-facing edge index in the run.
 * @param endEdge - Last land-facing edge index in the run.
 */
function strokingWorldPlazaWaterShoreFoamRunOnGraphics(
  graphics: Graphics,
  frame: DrawingWorldPlazaWaterTileScreenFrame,
  startEdge: number,
  endEdge: number,
  foamColor: number,
  foamAlpha: number,
  foamLineWidthPx: number
): void {
  const vertexCount = DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER.length;
  const startVertex = DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER[startEdge];
  const startPoint = resolvingWorldPlazaWaterDiamondVertex(frame, startVertex);

  graphics.moveTo(startPoint.x, startPoint.y);

  let edgeIndex = startEdge;

  while (true) {
    const nextVertex =
      DRAWING_WORLD_PLAZA_WATER_DIAMOND_VERTEX_ORDER[
        (edgeIndex + 1) % vertexCount
      ];
    const nextPoint = resolvingWorldPlazaWaterDiamondVertex(frame, nextVertex);
    graphics.lineTo(nextPoint.x, nextPoint.y);

    if (edgeIndex === endEdge) {
      break;
    }

    edgeIndex = (edgeIndex + 1) % vertexCount;
  }

  graphics.stroke({
    width: foamLineWidthPx,
    color: foamColor,
    alpha: foamAlpha,
    alignment: 0.5,
    cap: 'round',
    join: 'round',
  });
}

/**
 * Fills grass diamond tips that poke north into water at staircase outer corners.
 *
 * Foam alone frames those tips and they read as holes; covering them with the
 * neighboring water surface tint seals the bank before foam strokes.
 *
 * @param graphics - Pixi graphics instance.
 * @param bounds - Visible tile index range.
 * @param resolvingSurfaceAppearance - Surface tint for a water neighbor tile.
 */
export function drawingWorldPlazaWaterShoreOuterCornerTipCoversOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  resolvingSurfaceAppearance: (
    tileX: number,
    tileY: number
  ) => { color: number; alpha: number } | null
): void {
  const edgeFraction =
    DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_COVER_EDGE_FRACTION;
  const minAlpha =
    DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_COVER_MIN_ALPHA;

  // Expand one tile so land tips just outside the water bounds still seal.
  const minTileX = bounds.minTileX - 1;
  const maxTileX = bounds.maxTileX + 1;
  const minTileY = bounds.minTileY - 1;
  const maxTileY = bounds.maxTileY + 1;

  for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
      const tips = resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex(
        tileX,
        tileY
      );

      for (const cornerTip of tips) {
        const surfaceAppearance = resolvingSurfaceAppearance(
          cornerTip.waterTileX,
          cornerTip.waterTileY
        );

        if (!surfaceAppearance) {
          continue;
        }

        const frame = buildingWorldPlazaWaterTileScreenFrame(
          cornerTip.landTileX,
          cornerTip.landTileY
        );
        const tipPoint = resolvingWorldPlazaWaterDiamondVertex(
          frame,
          cornerTip.tip.tipVertex
        );
        const wingPointA = resolvingWorldPlazaWaterShoreOuterCornerTipWingPoint(
          tipPoint,
          resolvingWorldPlazaWaterDiamondVertex(
            frame,
            cornerTip.tip.wingVertexA
          ),
          edgeFraction
        );
        const wingPointB = resolvingWorldPlazaWaterShoreOuterCornerTipWingPoint(
          tipPoint,
          resolvingWorldPlazaWaterDiamondVertex(
            frame,
            cornerTip.tip.wingVertexB
          ),
          edgeFraction
        );

        graphics.poly([
          tipPoint.x,
          tipPoint.y,
          wingPointA.x,
          wingPointA.y,
          wingPointB.x,
          wingPointB.y,
        ]);
        graphics.fill({
          color: surfaceAppearance.color,
          alpha: Math.max(surfaceAppearance.alpha, minAlpha),
        });
      }
    }
  }
}

/**
 * Draws shore foam as one connected path per contiguous land-facing run.
 *
 * Separate per-edge strokes with round caps leave V-shaped gaps at stream
 * corners; a single path with round joins closes those corners cleanly.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function drawingWorldPlazaWaterShoreDetailsOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number
): void {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);
  const isLakeWaterTile =
    waterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE;
  const foamColor = isLakeWaterTile
    ? DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_COLOR
    : DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_COLOR;
  const foamAlpha = isLakeWaterTile
    ? DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_ALPHA
    : DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_ALPHA;
  const foamLineWidthPx = isLakeWaterTile
    ? DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_LINE_WIDTH_PX
    : DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_LINE_WIDTH_PX;
  const frame = buildingWorldPlazaWaterTileScreenFrame(tileX, tileY);
  const landEdgeRuns = groupingWorldPlazaWaterLandBorderingEdgeRuns(
    listingWorldPlazaWaterLandBorderingEdgeIndices(tileX, tileY)
  );

  for (const landEdgeRun of landEdgeRuns) {
    strokingWorldPlazaWaterShoreFoamRunOnGraphics(
      graphics,
      frame,
      landEdgeRun.startEdge,
      landEdgeRun.endEdge,
      foamColor,
      foamAlpha,
      foamLineWidthPx
    );
  }
}
