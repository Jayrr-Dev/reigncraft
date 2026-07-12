/**
 * Declarative outer land-corner tips that poke into water along staircase banks.
 *
 * Each entry is one land diamond tip that appears when two consecutive cardinal
 * neighbors are water. Foam along those water edges frames the tip and reads
 * as a hole unless the tip is covered with water surface tint.
 *
 * @module components/world/domains/definingWorldPlazaWaterShoreOuterCornerTipRegistry
 */

/** Diamond vertex labels shared with shore foam drawing. */
export type DefiningWorldPlazaWaterShoreDiamondVertex =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

/** One outer land-corner tip keyed by the two water neighbor deltas. */
export type DefiningWorldPlazaWaterShoreOuterCornerTipDefinition = {
  /** First cardinal water neighbor relative to the land tile. */
  readonly waterDeltaA: { readonly deltaX: number; readonly deltaY: number };
  /** Second cardinal water neighbor; consecutive around the diamond with A. */
  readonly waterDeltaB: { readonly deltaX: number; readonly deltaY: number };
  /** Land diamond vertex that points into the water body. */
  readonly tipVertex: DefiningWorldPlazaWaterShoreDiamondVertex;
  /** Land vertex along the edge shared with waterDeltaA, adjacent to the tip. */
  readonly wingVertexA: DefiningWorldPlazaWaterShoreDiamondVertex;
  /** Land vertex along the edge shared with waterDeltaB, adjacent to the tip. */
  readonly wingVertexB: DefiningWorldPlazaWaterShoreDiamondVertex;
};

/**
 * Clockwise outer land corners into water.
 *
 * Order matches diamond walk: bottom tip (east+south water), left, top, right.
 */
export const DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_REGISTRY: readonly DefiningWorldPlazaWaterShoreOuterCornerTipDefinition[] =
  [
    {
      waterDeltaA: { deltaX: 1, deltaY: 0 },
      waterDeltaB: { deltaX: 0, deltaY: 1 },
      tipVertex: 'bottom',
      wingVertexA: 'right',
      wingVertexB: 'left',
    },
    {
      waterDeltaA: { deltaX: 0, deltaY: 1 },
      waterDeltaB: { deltaX: -1, deltaY: 0 },
      tipVertex: 'left',
      wingVertexA: 'bottom',
      wingVertexB: 'top',
    },
    {
      waterDeltaA: { deltaX: -1, deltaY: 0 },
      waterDeltaB: { deltaX: 0, deltaY: -1 },
      tipVertex: 'top',
      wingVertexA: 'left',
      wingVertexB: 'right',
    },
    {
      waterDeltaA: { deltaX: 0, deltaY: -1 },
      waterDeltaB: { deltaX: 1, deltaY: 0 },
      tipVertex: 'right',
      wingVertexA: 'top',
      wingVertexB: 'bottom',
    },
  ];
