/**
 * Camera offset applied to the world container (screen space).
 *
 * @module components/world/domains/definingWorldPlazaCameraOffset
 */

/** Screen-space translation for the world layer (centers the player). */
export interface DefiningWorldPlazaCameraOffset {
  x: number;
  y: number;
}

/** Default camera offset before the first tick. */
export const DEFINING_WORLD_PLAZA_CAMERA_OFFSET_INITIAL: DefiningWorldPlazaCameraOffset =
  {
    x: 0,
    y: 0,
  };
