/**
 * Wildlife speech bubble overlay entries for DOM rendering.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes
 */

/** One wildlife speech bubble anchored to a live grid position. */
export type DefiningWildlifeSpeechBubbleOverlay = {
  instanceId: string;
  message: string;
  gridX: number;
  gridY: number;
  layer: number;
  sizeScale: number;
  jumpArcOffsetPx: number;
};
