import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { CheckingWorldPlazaTerrainElevationExposedCliffVerticalEdgeKind } from '@/components/world/domains/checkingWorldPlazaTerrainElevationCardinalNeighborSurfaceConnectsAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import type { Graphics } from 'pixi.js';

/**
 * Draws exposed top-cap rim outlines on isometric tile columns.
 *
 * @module components/world/domains/drawingWorldPlazaExposedIsometricCapTopEdgesOnGraphics
 */

/** Cliff drops required at one cap vertex before a vertical corner line is drawn. */
const DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_TOP_EDGE_CORNER_VERTEX_MIN_CLIFF_DIRECTION_COUNT =
  2 as const;

/** Screen frame for one isometric cap at an arbitrary world layer. */
interface DrawingWorldPlazaExposedIsometricCapScreenFrame {
  readonly centerX: number;
  readonly centerY: number;
  readonly halfWidth: number;
  readonly halfHeight: number;
}

/** One diamond edge keyed by the lower neighbor delta across that edge. */
interface DrawingWorldPlazaExposedIsometricCapCardinalEdge {
  readonly deltaX: number;
  readonly deltaY: number;
  readonly fromVertex: 'top' | 'right' | 'bottom' | 'left';
  readonly toVertex: 'top' | 'right' | 'bottom' | 'left';
  readonly isFrontFacing: boolean;
}

/** Maps each cardinal neighbor to the shared top-cap diamond edge. */
const DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_CARDINAL_EDGES: readonly DrawingWorldPlazaExposedIsometricCapCardinalEdge[] =
  [
    {
      deltaX: 0,
      deltaY: -1,
      fromVertex: 'top',
      toVertex: 'right',
      isFrontFacing: false,
    },
    {
      deltaX: 1,
      deltaY: 0,
      fromVertex: 'right',
      toVertex: 'bottom',
      isFrontFacing: true,
    },
    {
      deltaX: 0,
      deltaY: 1,
      fromVertex: 'bottom',
      toVertex: 'left',
      isFrontFacing: true,
    },
    {
      deltaX: -1,
      deltaY: 0,
      fromVertex: 'left',
      toVertex: 'top',
      isFrontFacing: false,
    },
  ];

/** Diamond corner order for walking cap edges clockwise. */
const DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER = [
  'top',
  'right',
  'bottom',
  'left',
] as const;

/** Front-facing vertical cliff strokes at SW, SE, and south cap corners. */
const DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_VERTICAL_EDGE_KINDS: readonly CheckingWorldPlazaTerrainElevationExposedCliffVerticalEdgeKind[] =
  ['east', 'west', 'south'];

/** Neighbor surface connect check used to detect exposed cap edges. */
export type DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex =
  (
    tileX: number,
    tileY: number,
    deltaX: number,
    deltaY: number,
    surfaceLayer: number
  ) => boolean;

/** Input for exposed top-cap edge drawing. */
export interface DrawingWorldPlazaExposedIsometricCapTopEdgesParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly centerX: number;
  readonly groundCenterY: number;
  readonly surfaceLayer: number;
  readonly checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex;
  readonly strokeColor?: number;
  readonly strokeWidthPx?: number;
  readonly strokeAlpha?: number;
  readonly drawsVerticalCornerEdges?: boolean;
  /** When set, overrides default front-facing exposed edge listing. */
  readonly checkingCapDiamondEdgeShouldStroke?: (
    edgeIndex: number,
    fromVertex: (typeof DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER)[number],
    toVertex: (typeof DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER)[number]
  ) => boolean;
}

/**
 * Resolves one diamond vertex on an elevated cap.
 *
 * @param frame - Cap screen frame.
 * @param vertex - Diamond corner id.
 */
function resolvingWorldPlazaExposedIsometricCapDiamondVertex(
  frame: DrawingWorldPlazaExposedIsometricCapScreenFrame,
  vertex: (typeof DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER)[number]
): { readonly x: number; readonly y: number } {
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
 * Returns true when this tile exposes a cliff drop in a cardinal direction.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param cliffDeltaX - Cardinal offset toward the lower neighbor.
 * @param cliffDeltaY - Cardinal offset toward the lower neighbor.
 * @param surfaceLayer - This tile's surface world layer.
 * @param checkingCardinalNeighborSurfaceConnectsAtTileIndex - Neighbor connect check.
 */
function checkingWorldPlazaExposedIsometricCapCliffInDirectionAtTileIndex(
  tileX: number,
  tileY: number,
  cliffDeltaX: number,
  cliffDeltaY: number,
  surfaceLayer: number,
  checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex
): boolean {
  return !checkingCardinalNeighborSurfaceConnectsAtTileIndex(
    tileX,
    tileY,
    cliffDeltaX,
    cliffDeltaY,
    surfaceLayer
  );
}

/**
 * Counts exposed cliff directions that meet on one isometric cap vertex.
 *
 * Each diamond vertex sits between the two cardinal faces that share it, so a
 * vertical corner line belongs there only when both of those faces drop away:
 * `bottom` between the east and south faces, `left` between the south and west
 * faces, and `right` between the east and north faces. Keying each vertical to
 * its own vertex keeps the east (right) edge symmetric with the west (left)
 * edge so a stepped ridge draws one line at the corner where the edges meet
 * instead of an extra line on the inner block.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - This tile's surface world layer.
 * @param vertex - Cap vertex id.
 * @param checkingCardinalNeighborSurfaceConnectsAtTileIndex - Neighbor connect check.
 */
function countingWorldPlazaExposedIsometricCapCliffDirectionsAtVertex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  vertex: 'bottom' | 'left' | 'right',
  checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex
): number {
  const hasEastCliff =
    checkingWorldPlazaExposedIsometricCapCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      1,
      0,
      surfaceLayer,
      checkingCardinalNeighborSurfaceConnectsAtTileIndex
    );
  const hasSouthCliff =
    checkingWorldPlazaExposedIsometricCapCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      0,
      1,
      surfaceLayer,
      checkingCardinalNeighborSurfaceConnectsAtTileIndex
    );
  const hasWestCliff =
    checkingWorldPlazaExposedIsometricCapCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      -1,
      0,
      surfaceLayer,
      checkingCardinalNeighborSurfaceConnectsAtTileIndex
    );
  const hasNorthCliff =
    checkingWorldPlazaExposedIsometricCapCliffInDirectionAtTileIndex(
      tileX,
      tileY,
      0,
      -1,
      surfaceLayer,
      checkingCardinalNeighborSurfaceConnectsAtTileIndex
    );

  if (vertex === 'bottom') {
    return (hasEastCliff ? 1 : 0) + (hasSouthCliff ? 1 : 0);
  }

  if (vertex === 'right') {
    return (hasEastCliff ? 1 : 0) + (hasNorthCliff ? 1 : 0);
  }

  return (hasSouthCliff ? 1 : 0) + (hasWestCliff ? 1 : 0);
}

/**
 * Returns true when a vertical cliff stroke should render on this tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param edgeKind - Screen-side vertical edge to evaluate.
 * @param surfaceLayer - This tile's surface world layer.
 * @param checkingCardinalNeighborSurfaceConnectsAtTileIndex - Neighbor connect check.
 */
function checkingWorldPlazaExposedIsometricCapVerticalEdgeShouldDrawAtTileIndex(
  tileX: number,
  tileY: number,
  edgeKind: CheckingWorldPlazaTerrainElevationExposedCliffVerticalEdgeKind,
  surfaceLayer: number,
  checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex
): boolean {
  const minimumCornerCliffDirectionCount =
    DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_TOP_EDGE_CORNER_VERTEX_MIN_CLIFF_DIRECTION_COUNT;
  const vertexByEdgeKind = {
    east: 'right',
    south: 'bottom',
    west: 'left',
  } as const;

  return (
    countingWorldPlazaExposedIsometricCapCliffDirectionsAtVertex(
      tileX,
      tileY,
      surfaceLayer,
      vertexByEdgeKind[edgeKind],
      checkingCardinalNeighborSurfaceConnectsAtTileIndex
    ) >= minimumCornerCliffDirectionCount
  );
}

/**
 * Returns true when a top-cap diamond edge borders a lower neighbor.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - This tile's surface world layer.
 * @param fromVertex - Edge start vertex.
 * @param toVertex - Edge end vertex.
 * @param checkingCardinalNeighborSurfaceConnectsAtTileIndex - Neighbor connect check.
 */
function checkingWorldPlazaExposedIsometricCapDiamondEdgeIsExposed(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  fromVertex: (typeof DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER)[number],
  toVertex: (typeof DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER)[number],
  checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex
): boolean {
  for (const cliffEdge of DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_CARDINAL_EDGES) {
    if (
      cliffEdge.fromVertex === fromVertex &&
      cliffEdge.toVertex === toVertex &&
      !checkingCardinalNeighborSurfaceConnectsAtTileIndex(
        tileX,
        tileY,
        cliffEdge.deltaX,
        cliffEdge.deltaY,
        surfaceLayer
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Lists cap edge indices that border a lower neighbor.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - This tile's surface world layer.
 * @param checkingCardinalNeighborSurfaceConnectsAtTileIndex - Neighbor connect check.
 */
function listingWorldPlazaExposedIsometricCapEdgeIndices(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  checkingCardinalNeighborSurfaceConnectsAtTileIndex: DrawingWorldPlazaExposedIsometricCapCheckingCardinalNeighborSurfaceConnectsAtTileIndex,
  checkingCapDiamondEdgeShouldStroke?: DrawingWorldPlazaExposedIsometricCapTopEdgesParams['checkingCapDiamondEdgeShouldStroke']
): number[] {
  const exposedEdgeIndices: number[] = [];
  const vertexCount =
    DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER.length;

  for (let edgeIndex = 0; edgeIndex < vertexCount; edgeIndex += 1) {
    const fromVertex =
      DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER[edgeIndex];
    const toVertex =
      DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER[
        (edgeIndex + 1) % vertexCount
      ];

    const shouldStroke = checkingCapDiamondEdgeShouldStroke
      ? checkingCapDiamondEdgeShouldStroke(edgeIndex, fromVertex, toVertex)
      : checkingWorldPlazaExposedIsometricCapDiamondEdgeIsExposed(
          tileX,
          tileY,
          surfaceLayer,
          fromVertex,
          toVertex,
          checkingCardinalNeighborSurfaceConnectsAtTileIndex
        );

    if (shouldStroke) {
      exposedEdgeIndices.push(edgeIndex);
    }
  }

  return exposedEdgeIndices;
}

/**
 * Groups exposed cap edge indices into contiguous runs around the diamond.
 *
 * @param exposedEdgeIndices - Edge indices from {@link listingWorldPlazaExposedIsometricCapEdgeIndices}.
 */
function groupingWorldPlazaExposedIsometricCapEdgeRuns(
  exposedEdgeIndices: readonly number[]
): Array<{ readonly startEdge: number; readonly endEdge: number }> {
  if (exposedEdgeIndices.length === 0) {
    return [];
  }

  if (exposedEdgeIndices.length === 1) {
    return [
      { startEdge: exposedEdgeIndices[0], endEdge: exposedEdgeIndices[0] },
    ];
  }

  const breaksAfterIndex: number[] = [];

  for (let index = 0; index < exposedEdgeIndices.length; index += 1) {
    const currentEdge = exposedEdgeIndices[index];
    const nextEdge =
      exposedEdgeIndices[(index + 1) % exposedEdgeIndices.length];

    if ((currentEdge + 1) % 4 !== nextEdge) {
      breaksAfterIndex.push(index);
    }
  }

  if (breaksAfterIndex.length === 0) {
    return [
      {
        startEdge: exposedEdgeIndices[0],
        endEdge: exposedEdgeIndices[exposedEdgeIndices.length - 1],
      },
    ];
  }

  const runs: Array<{ readonly startEdge: number; readonly endEdge: number }> =
    [];
  let runStartListIndex = 0;

  for (const breakAfterIndex of breaksAfterIndex) {
    const runEndListIndex =
      breakAfterIndex === exposedEdgeIndices.length - 1
        ? 0
        : breakAfterIndex + 1;

    if (runStartListIndex <= breakAfterIndex) {
      runs.push({
        startEdge: exposedEdgeIndices[runStartListIndex],
        endEdge: exposedEdgeIndices[breakAfterIndex],
      });
    }

    runStartListIndex = runEndListIndex;
  }

  if (
    runStartListIndex !== 0 &&
    runStartListIndex < exposedEdgeIndices.length
  ) {
    runs.push({
      startEdge: exposedEdgeIndices[runStartListIndex],
      endEdge: exposedEdgeIndices[exposedEdgeIndices.length - 1],
    });
  }

  return runs;
}

/**
 * Strokes one contiguous exposed cap edge run.
 *
 * @param graphics - Pixi graphics instance.
 * @param frame - Cap screen frame.
 * @param startEdge - First exposed edge index in the run.
 * @param endEdge - Last exposed edge index in the run.
 * @param strokeColor - Outline color.
 * @param strokeWidthPx - Outline width.
 * @param strokeAlpha - Outline opacity.
 */
function strokingWorldPlazaExposedIsometricCapEdgeRunOnGraphics(
  graphics: Graphics,
  frame: DrawingWorldPlazaExposedIsometricCapScreenFrame,
  startEdge: number,
  endEdge: number,
  strokeColor: number,
  strokeWidthPx: number,
  strokeAlpha: number
): void {
  const vertexCount =
    DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER.length;
  const startVertex =
    DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER[startEdge];
  const startPoint = resolvingWorldPlazaExposedIsometricCapDiamondVertex(
    frame,
    startVertex
  );

  graphics.moveTo(startPoint.x, startPoint.y);

  let edgeIndex = startEdge;

  while (true) {
    const nextVertex =
      DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_DIAMOND_VERTEX_ORDER[
        (edgeIndex + 1) % vertexCount
      ];
    const nextPoint = resolvingWorldPlazaExposedIsometricCapDiamondVertex(
      frame,
      nextVertex
    );
    graphics.lineTo(nextPoint.x, nextPoint.y);

    if (edgeIndex === endEdge) {
      break;
    }

    edgeIndex = (edgeIndex + 1) % vertexCount;
  }

  graphics.stroke({
    width: strokeWidthPx,
    color: strokeColor,
    alpha: strokeAlpha,
    alignment: 0.5,
    cap: 'round',
    join: 'round',
  });
}

/**
 * Draws exposed top-cap rim outlines and optional corner verticals.
 *
 * @param params - Tile indices, cap center, surface layer, and stroke options.
 */
export function drawingWorldPlazaExposedIsometricCapTopEdgesOnGraphics(
  params: DrawingWorldPlazaExposedIsometricCapTopEdgesParams
): void {
  const strokeColor =
    params.strokeColor ??
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_COLOR;
  const strokeWidthPx =
    params.strokeWidthPx ??
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_WIDTH_PX;
  const strokeAlpha =
    params.strokeAlpha ??
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_ALPHA;

  if (strokeAlpha <= 0 || strokeWidthPx <= 0) {
    return;
  }

  const surfaceCenterY =
    params.groundCenterY +
    computingWorldBuildingWorldLayerScreenOffsetPx(params.surfaceLayer);
  const frame: DrawingWorldPlazaExposedIsometricCapScreenFrame = {
    centerX: params.centerX,
    centerY: surfaceCenterY,
    halfWidth: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
    halfHeight: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  };

  if (params.drawsVerticalCornerEdges !== false) {
    const bottomCenterY = params.groundCenterY;

    if (surfaceCenterY !== bottomCenterY) {
      const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
      const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
      const westX = params.centerX - halfWidth;
      const eastX = params.centerX + halfWidth;
      const southTopY = surfaceCenterY + halfHeight;
      const southBottomY = bottomCenterY + halfHeight;
      let drewVerticalEdge = false;

      for (const edgeKind of DRAWING_WORLD_PLAZA_EXPOSED_ISOMETRIC_CAP_VERTICAL_EDGE_KINDS) {
        if (
          !checkingWorldPlazaExposedIsometricCapVerticalEdgeShouldDrawAtTileIndex(
            params.tileX,
            params.tileY,
            edgeKind,
            params.surfaceLayer,
            params.checkingCardinalNeighborSurfaceConnectsAtTileIndex
          )
        ) {
          continue;
        }

        if (edgeKind === 'east') {
          params.graphics.moveTo(eastX, surfaceCenterY);
          params.graphics.lineTo(eastX, bottomCenterY);
          drewVerticalEdge = true;
          continue;
        }

        if (edgeKind === 'west') {
          params.graphics.moveTo(westX, surfaceCenterY);
          params.graphics.lineTo(westX, bottomCenterY);
          drewVerticalEdge = true;
          continue;
        }

        params.graphics.moveTo(params.centerX, southTopY);
        params.graphics.lineTo(params.centerX, southBottomY);
        drewVerticalEdge = true;
      }

      if (drewVerticalEdge) {
        params.graphics.stroke({
          width: strokeWidthPx,
          color: strokeColor,
          alpha: strokeAlpha,
          alignment: 0.5,
          cap: 'round',
          join: 'round',
        });
      }
    }
  }

  const exposedCapEdgeRuns = groupingWorldPlazaExposedIsometricCapEdgeRuns(
    listingWorldPlazaExposedIsometricCapEdgeIndices(
      params.tileX,
      params.tileY,
      params.surfaceLayer,
      params.checkingCardinalNeighborSurfaceConnectsAtTileIndex,
      params.checkingCapDiamondEdgeShouldStroke
    )
  );

  for (const exposedCapEdgeRun of exposedCapEdgeRuns) {
    strokingWorldPlazaExposedIsometricCapEdgeRunOnGraphics(
      params.graphics,
      frame,
      exposedCapEdgeRun.startEdge,
      exposedCapEdgeRun.endEdge,
      strokeColor,
      strokeWidthPx,
      strokeAlpha
    );
  }
}
