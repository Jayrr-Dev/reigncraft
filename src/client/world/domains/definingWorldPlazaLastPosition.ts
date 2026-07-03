/**
 * Last known plaza avatar position for resume-on-login.
 *
 * @module components/world/domains/definingWorldPlazaLastPosition
 */

/** Last known avatar position in plaza grid space. */
export interface DefiningWorldPlazaLastPosition {
  readonly x: number;
  readonly y: number;
  readonly layer: number;
  /** Unix epoch ms when the position was last persisted. */
  readonly updatedAtMs: number;
}

/**
 * Creates a last-position value object.
 *
 * @param x - Grid X in tile units.
 * @param y - Grid Y in tile units.
 * @param layer - One-based standing layer.
 * @param updatedAtMs - Persist timestamp from {@link Date.now}.
 */
export function creatingWorldPlazaLastPosition(
  x: number,
  y: number,
  layer: number,
  updatedAtMs: number,
): DefiningWorldPlazaLastPosition {
  return { x, y, layer, updatedAtMs };
}
