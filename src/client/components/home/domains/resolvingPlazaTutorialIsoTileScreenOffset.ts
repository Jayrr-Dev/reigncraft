/** Tutorial mini-scene tile width in screen pixels (2:1 isometric). */
export const DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX = 44;

/** Tutorial mini-scene tile height in screen pixels. */
export const DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX = 22;

const DEFINING_PLAZA_TUTORIAL_ISO_HALF_TILE_WIDTH_PX =
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX / 2;

const DEFINING_PLAZA_TUTORIAL_ISO_HALF_TILE_HEIGHT_PX =
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX / 2;

/**
 * Maps a grid coordinate to absolute screen offset inside a tutorial iso scene.
 *
 * @param gridX - Tile X in the mini grid.
 * @param gridY - Tile Y in the mini grid.
 * @param originGridX - Grid X treated as the scene center anchor.
 * @param originGridY - Grid Y treated as the scene center anchor.
 */
export function resolvingPlazaTutorialIsoTileScreenOffset(
  gridX: number,
  gridY: number,
  originGridX: number,
  originGridY: number
): { left: number; top: number } {
  const relativeGridX = gridX - originGridX;
  const relativeGridY = gridY - originGridY;

  return {
    left:
      (relativeGridX - relativeGridY) *
      DEFINING_PLAZA_TUTORIAL_ISO_HALF_TILE_WIDTH_PX,
    top:
      (relativeGridX + relativeGridY) *
      DEFINING_PLAZA_TUTORIAL_ISO_HALF_TILE_HEIGHT_PX,
  };
}
