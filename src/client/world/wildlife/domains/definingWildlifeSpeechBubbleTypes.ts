/**
 * Wildlife speech bubble overlay entries for DOM rendering.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes
 */

import type { DefiningWildlifeSpeechPresentation } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/** One wildlife speech bubble anchored to a live grid position. */
export type DefiningWildlifeSpeechBubbleOverlay = {
  instanceId: string;
  message: string;
  presentation: DefiningWildlifeSpeechPresentation;
  gridX: number;
  gridY: number;
  layer: number;
  sizeScale: number;
  jumpArcOffsetPx: number;
};
