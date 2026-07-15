/**
 * Wildlife world-anchored status HUD overlay entries (DOM).
 *
 * @module components/world/wildlife/domains/definingWildlifeStatusHudOverlayTypes
 */

/** One compact icon above an engaged wildlife instance. */
export type DefiningWildlifeStatusHudOverlayIcon = {
  readonly id: string;
  /** Iconify `prefix:name`. */
  readonly icon: string;
  readonly borderClassName: string;
  readonly label: string;
  readonly expiresAtMs: number | null;
  /** Optional numeric badge (damage left, stacks, etc.). */
  readonly numericLabel: string | null;
};

/** Live overlay for one wildlife instance with active statuses. */
export type DefiningWildlifeStatusHudOverlay = {
  instanceId: string;
  gridX: number;
  gridY: number;
  layer: number;
  sizeScale: number;
  frameHeightPx: number;
  jumpArcOffsetPx: number;
  icons: DefiningWildlifeStatusHudOverlayIcon[];
};
