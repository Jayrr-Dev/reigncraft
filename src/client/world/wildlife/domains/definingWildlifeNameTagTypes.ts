/**
 * Wildlife name-tag overlay entries for DOM rendering.
 *
 * @module components/world/wildlife/domains/definingWildlifeNameTagTypes
 */

/** One wildlife name tag anchored to a live grid position. */
export type DefiningWildlifeNameTagOverlay = {
  instanceId: string;
  displayLabel: string;
  textColor: string;
  gridX: number;
  gridY: number;
  layer: number;
  sizeScale: number;
  /** Sheet frame height used for head-lift math (matches ground shadow). */
  frameHeightPx: number;
  jumpArcOffsetPx: number;
  /** Whether the local player should currently see this label. */
  isRevealed: boolean;
};
