/**
 * Wildlife combat float overlay entries for DOM rendering.
 *
 * @module components/world/wildlife/domains/definingWildlifeFloatingCombatTextTypes
 */

import type { DefiningWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';

/** One wildlife combat float anchored to a live grid position. */
export type DefiningWildlifeFloatingCombatText = {
  instanceId: string;
  floatText: DefiningWorldPlazaEntityHealthFloatText;
  gridX: number;
  gridY: number;
  layer: number;
  sizeScale: number;
};
