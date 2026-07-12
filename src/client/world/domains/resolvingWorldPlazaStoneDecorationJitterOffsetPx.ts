import {
  DEFINING_WORLD_PLAZA_STONE_JITTER_EDGE_PADDING_PX,
  DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX,
  DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX,
} from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import { mappingWorldPlazaGrassSeededUnitToFloatRange } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Size-aware on-tile stone jitter so pebbles stay inside the iso diamond.
 *
 * @module components/world/domains/resolvingWorldPlazaStoneDecorationJitterOffsetPx
 */

/** Resolved screen-space offset from the tile center. */
export type ResolvingWorldPlazaStoneDecorationJitterOffsetPx = {
  readonly offsetX: number;
  readonly offsetY: number;
};

/**
 * Returns the max |offset| on one axis after reserving body size and padding.
 *
 * @param baseJitterHalfExtentPx - Declared jitter half-range before size inset.
 * @param reservedHalfExtentPx - Pixels reserved so the body clears the edge.
 */
function resolvingWorldPlazaStoneJitterHalfExtentPx(
  baseJitterHalfExtentPx: number,
  reservedHalfExtentPx: number
): number {
  return Math.max(
    0,
    baseJitterHalfExtentPx -
      reservedHalfExtentPx -
      DEFINING_WORLD_PLAZA_STONE_JITTER_EDGE_PADDING_PX
  );
}

/**
 * Maps seeded units to an on-tile offset that leaves room for the stone body
 * so the ellipse does not clip past the tile diamond.
 *
 * @param jitterUnitX - Seeded unit in [0, 1) for horizontal offset.
 * @param jitterUnitY - Seeded unit in [0, 1) for vertical offset.
 * @param bodyHalfWidthPx - Stone body ellipse half-width.
 * @param bodyHalfHeightPx - Stone body ellipse half-height.
 */
export function resolvingWorldPlazaStoneDecorationJitterOffsetPx(
  jitterUnitX: number,
  jitterUnitY: number,
  bodyHalfWidthPx: number,
  bodyHalfHeightPx: number
): ResolvingWorldPlazaStoneDecorationJitterOffsetPx {
  const halfExtentXPx = resolvingWorldPlazaStoneJitterHalfExtentPx(
    DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX,
    bodyHalfWidthPx
  );
  const halfExtentYPx = resolvingWorldPlazaStoneJitterHalfExtentPx(
    DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX,
    bodyHalfHeightPx
  );

  return {
    offsetX: mappingWorldPlazaGrassSeededUnitToFloatRange(
      jitterUnitX,
      -halfExtentXPx,
      halfExtentXPx
    ),
    offsetY: mappingWorldPlazaGrassSeededUnitToFloatRange(
      jitterUnitY,
      -halfExtentYPx,
      halfExtentYPx
    ),
  };
}
