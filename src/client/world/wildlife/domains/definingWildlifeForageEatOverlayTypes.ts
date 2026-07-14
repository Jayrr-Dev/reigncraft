/**
 * Wildlife forage / graze eat overlay entry for DOM rendering.
 *
 * @module components/world/wildlife/domains/definingWildlifeForageEatOverlayTypes
 */

export type DefiningWildlifeForageEatOverlay = {
  readonly instanceId: string;
  readonly gridX: number;
  readonly gridY: number;
  readonly layer: number;
  readonly sizeScale: number;
  readonly frameHeightPx: number;
  readonly jumpArcOffsetPx: number;
  /** 0..1 chew progress; graze uses a soft constant fill. */
  readonly progressRatio: number;
  readonly progressIcon: string;
};
